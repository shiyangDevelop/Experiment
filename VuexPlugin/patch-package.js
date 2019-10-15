const fs = require('fs')
const path = require('path');
const {execSync}  = require('child_process');
const compressing = require('compressing');
const readline = require('readline');
const pump = require('pump');
const crypto = require('crypto');
const moment = require('moment');

// 打包版本 该处如果为空 则当前打包版本为上一次的最新版+1 如果初次打包则由用户输入
// 如果该处声明了版本号 则会根据此处声明的版本号进行打包
const CURRENT_VERSION = '';
// webpackage打好的全量包路径
const FULL_PACKAGE_PATH = path.resolve(__dirname, './dist/www.zip');
// 增量包保存路径 文件名会动态生成
let PATCH_PACKAGE_PATH = path.resolve(__dirname, './patch/');
// 临时目录
const TEMP_PATH = path.resolve(__dirname, './tmp/');
// 当前打包环境
const PACKAGE_ENV = process.env.SERVER_ENV ? process.env.SERVER_ENV.toLowerCase() : 'sit';
// changelist目录
const CHAGNE_LIST_PATH = path.resolve(__dirname, './changelist');
// 当前环境的changelist目录
const CHANGE_LIST_DIR = path.join(CHAGNE_LIST_PATH, PACKAGE_ENV);
// 如果目录不存在则创建
if (!fs.existsSync(CHANGE_LIST_DIR)) fs.mkdirSync(CHANGE_LIST_DIR, {recursive: true});

console.log(`生成增量包环境${PACKAGE_ENV}, ${CHANGE_LIST_DIR}`);

// 获取之前的最新版本
const latestVersionNumber = getLatestVersionNum();

if (CURRENT_VERSION) {
    genPatch(latestVersionNumber, version2Num(CURRENT_VERSION));
} else if (!latestVersionNumber) {
  // 如果之前的版本信息为空 则需要输入当前版本信息 并生成保存版本信息
  let rl = readline.createInterface(process.stdin, process.stdout);
  rl.question('请输入版本号(如:1.5.14):', line => {
    const currVersionNum = version2Num(line);
    console.log(line);
    rl.close();
    genPatch(latestVersionNumber, currVersionNum);
  });
} else {
  const currVersionNum = latestVersionNumber + 1;
  genPatch(latestVersionNumber, currVersionNum);
}

/**
 * 生成新版本和旧版本的增量包
 * @param oldVersion
 * @param newVersion
 * @param type
 */
async function genPatch (oldVersion, newVersion) {
  const tempUnzipPath = path.join(TEMP_PATH, newVersion + '');
  try {
    // 1. 尝试获取新版本数据 如果新版本信息不存在 则解压zip包生成并保存新版本信息
    let newVersionInfo = getVersionInfo(newVersion);
    if (newVersionInfo === null) {
      await unzip(FULL_PACKAGE_PATH, tempUnzipPath);
      newVersionInfo = buildAndSaveVersionInfo(newVersion, tempUnzipPath);
      newVersionInfo.fullSHA1 = calcSHA1(FULL_PACKAGE_PATH);
      newVersionInfo.timestamp = moment().format('YYYY-MM-DD hh:mm:ss:SSS');
    }

    // 2. 如果有旧版本的版本号 则说明需要根据旧版本信息生成增量包 如果没有旧版本号说明本次为初始化包则只需要保存版本信息即可
    if (oldVersion) {
      console.log(`准备开始生成增量包${num2Version(oldVersion)} --> ${num2Version(newVersion)}`);
      PATCH_PACKAGE_PATH = path.join(PATCH_PACKAGE_PATH, `${num2Version(oldVersion)}-${num2Version(newVersion)}-patch.zip`);
      let oldVersionInfo = getVersionInfo(oldVersion);
      // 通过文件名对比修改列表
      let diff = diffrent(oldVersionInfo.files, newVersionInfo.files);
      // 上述对比只是根据webpack生成的版本号进行文件比对，但是对于static以及resources目录中的文件webpack只是复制不会生成版本号这就需要根据git提交记录进行比对
      let gitDiff = genGitChange(oldVersionInfo.gitVersion, newVersionInfo.gitVersion);

      let result = {
        addList: [...diff.addList, ...gitDiff.addList],
        deleteList: [...diff.deleteList, ...gitDiff.deleteList]
      };
      await zipPatch(result, newVersion);
      // 更新 版本json中的信息
      newVersionInfo.changes = result;
      newVersionInfo.fromVersion = oldVersionInfo.version;
      newVersionInfo.patchSHA1 = calcSHA1(PATCH_PACKAGE_PATH);
      console.log(`打包完成,增量包路径:${PATCH_PACKAGE_PATH}`);
    }
    // 更新版本json文件
    fs.writeFileSync(path.join(CHANGE_LIST_DIR, newVersion + '.json'), JSON.stringify({
      version: newVersionInfo.version,
      versionNumber: newVersionInfo.versionNumber,
      gitVersion: newVersionInfo.gitVersion,
      fromVersion: newVersionInfo.fromVersion,
      patchSHA1: newVersionInfo.patchSHA1,
      fullSHA1: newVersionInfo.fullSHA1,
      timestamp: newVersionInfo.timestamp,
      changes: newVersionInfo.changes,
      files: newVersionInfo.files
    }, null, 2));
    // 重命名文件
    fs.renameSync(FULL_PACKAGE_PATH, path.join(path.dirname(FULL_PACKAGE_PATH),`web-${num2Version(newVersion)}.zip`))
    // 删除临时目录
    delDir(tempUnzipPath);
    process.exit(0);
  } catch (e) {
    console.error(e)
  }
}

/**
 * 解压文件
 * @param sourceFile
 * @param targetDir
 * @returns {Promise<Promise<Promise<void>|Promise<never>|undefined>|Promise<void>>}
 */
async function unzip (sourceFile, targetDir) {
  try {
    let result = compressing.zip.uncompress(sourceFile, targetDir);
    return result;
  } catch (e) {
    return Promise.reject(e);
  }

}

/**
 * 生成当前版本文件信息
 */
function buildAndSaveVersionInfo (version, filePath) {
  // 解压后生成文件列表
  let versionInfo = {
    versionNumber: version,
    version: num2Version(version),
    gitVersion: execSync('git log -1 --pretty=format:"%H"').toString('utf-8'),
    files: genFileList(path.join(TEMP_PATH, version + ''), filePath)
  };
  // 将当前的版本信息 写入文件
  fs.writeFileSync(path.join(CHANGE_LIST_DIR, version + '.json'), JSON.stringify(versionInfo, null, 2));
  execSync(`git add ${path.join(CHANGE_LIST_DIR, version + '.json')}`);
  console.log(`${version}版本信息已经存储至${path.join(CHANGE_LIST_DIR, version + '.json')},请务必提交该文件`)
  return versionInfo;
 }

 /**
 * 获取文件列表
 * @param basePath
 * @param filePath
 * @param arr
 * @returns {Array}
 */
function genFileList (basePath, filePath, arr) {
  if (!arr) arr = [];
  if (!filePath) filePath = basePath;

  filePath = path.normalize(filePath);
  basePath = path.normalize(basePath);

  let fileName = path.basename(filePath);

  // 忽略.开头的隐藏文件
  if (fileName.startsWith('.')) return arr;

  const stat = fs.statSync(filePath);

  if (stat.isFile()) {
    // 生成文件列表时替换\\为/ 防止出现window打包和mac打包由于路径分割符不同导致的对比错误
    arr.push(filePath.replace(basePath, '').replace(/\\/g, '/'));
  } else {
    const files = fs.readdirSync(filePath);
    for (let file of files) {
      genFileList(basePath, path.join(filePath, file), arr)
    }
  }
  return arr;
}

/**
 * 从changelist中获取当前最新的版本的相关信息
 */
function getLatestVersionNum () {
  let files = fs.readdirSync(CHANGE_LIST_DIR);
  files = files.filter(file => !file.startsWith('.'))
  const versions = files.map(v => parseInt(v, 10));
  if (versions.length === 0) {
    return null;
  }

  let version = Math.max(...versions);
  return version;
}

function getVersionInfo (version) {
  let versionFile = path.join(CHANGE_LIST_DIR, version + '.json');
  if (!fs.existsSync(versionFile)) return null;
  else return require(versionFile);
}

function delDir(path){
  let files = [];
  if(fs.existsSync(path)){
    files = fs.readdirSync(path);
    files.forEach((file, index) => {
      let curPath = path + "/" + file;
      if(fs.statSync(curPath).isDirectory()){
        delDir(curPath); //递归删除文件夹
      } else {
        fs.unlinkSync(curPath); //删除文件
      }
    });
    fs.rmdirSync(path);
  }
}

function num2Version (num) {
  let numStr = (num + '').padStart(6, '0');
  let bigVersion = parseInt(numStr.slice(0, 2), 10) + '';
  let midVersion = parseInt(numStr.slice(2, 4), 10) + '';
  let litVersion = parseInt(numStr.slice(4), 10) + '';
  return bigVersion + '.' + midVersion + '.' + litVersion;
}

function version2Num (version) {
  if (!version) return 0;
  let arr = version.split('.');
  if (arr.length !== 3) return 0;
  let result = '';
  for (let num of arr) {
    num = num.padStart(2, '0');
    result += num;
  }
  return parseInt(result, 10);
}

/**
 * 对比两个数组获取差异部分
 * @param oldArr
 * @param newArr
 * @returns {{add: *, delete: *}}
 */
function diffrent (oldArr, newArr) {
  const addFiles = newArr.filter((item) => {
    return !oldArr.includes(item);
  });
  const deleteFiels = oldArr.filter((item) => {
    return !newArr.includes(item);
  });

  return {
    addList: addFiles,
    deleteList: deleteFiels
  }
}

/**
 * 根据git 版本号生成差异数组
 * @param oldGitHash
 * @param newGitHash
 * @returns {{deleteList: Array, addList: Array}}
 */
function genGitChange (oldGitHash, newGitHash) {
  let gitChangeList = execSync(`git diff --name-status ${oldGitHash} ${newGitHash}`).toString('utf-8');
  gitChangeList = gitChangeList.split(/[\n\r]+/);

  let addList = [];
  let deleteList = [];
  // 解析git的修改记录
  for (let line of gitChangeList) {
    /**
     * A: 增加的文件
     * C: 文件的一个新拷贝
     * M: 文件内容或mode被修改了
     * R: 文件名被修改了
     * T: 文件类型被修改了
     * D: 文件被删除
     */
    let matchs = line.match(/^([DACMRT])\s*((static|resources)[\s\S]+)$/);
    if (matchs) {
      if (['A', 'C', 'M', 'R', 'T'].includes(matchs[1])) {
        addList.push('/' + matchs[2]);
      } else if ('D' === matchs[1]) {
        deleteList.push('/' + matchs[2]);
      } else {
        console.warn(`快来看啊，这个git记录我不知道是啥意思: ${line}`)
      }
    }
  }

  return {
    addList: addList,
    deleteList: deleteList
  }
}

function calcSHA1 (path) {
  //读取一个Buffer
  let buffer = fs.readFileSync(path);
  let fsHash = crypto.createHash('sha1');

  fsHash.update(buffer);
  return fsHash.digest('hex');
}

async function zipPatch (changeMap, version) {
  let addList = changeMap.addList;
  let deleteList = changeMap.deleteList;

  if ( (!addList || addList.length === 0) && (!deleteList || deleteList.length === 0)) {
    console.warn('没有文件变更，不需要生成增量包');
    return 0;
  }

  // 只要文件有修改 就要复制index.html文件

  addList.push(path.join('/index.html'));
  if(!fs.existsSync(path.join(TEMP_PATH, version + '_result'))) fs.mkdirSync(path.join(TEMP_PATH, version + '_result'));
  fs.writeFileSync(path.join(TEMP_PATH, version + '_result', 'patch.json'), JSON.stringify(changeMap, null, 2));

  // 根据文件修改列表复制文件准备打包
  for (let filePath of addList) {
    let source = path.join(TEMP_PATH, version + '', filePath);
    let target = path.join(TEMP_PATH, version + '_result', filePath);
    // 如果目录不存在则创建
    if (!fs.existsSync(path.dirname(target))) fs.mkdirSync(path.dirname(target), {recursive: true});
    fs.copyFileSync(source, target);
  }

  let files = fs.readdirSync(path.join(TEMP_PATH, version + '_result'));
  if (files.length > 0) {
    const zipStream = new compressing.zip.Stream();
    for (let file of files) {
      zipStream.addEntry(path.join(TEMP_PATH, version + '_result', file));
    }
    const destStream = fs.createWriteStream(PATCH_PACKAGE_PATH);

    return new Promise((resolve, reject) => {
      pump(zipStream, destStream, e => {
        // 复制完成后删除临时文件
        delDir(path.join(TEMP_PATH, version + '_result'));
        if (e) {
          reject(e)
        } else {
          resolve();
        }
      });
    })

  } else {
    console.warn('没有文件，无法生成增量包');
    return 0;
  }

}
