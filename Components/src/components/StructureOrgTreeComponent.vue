<template>
  <div class="StructureOrgTreeComponent" ref="firstLevel" :style="{width: maxWidth ? maxWidth * 160 + 'px' : data.childCount * 160 + 'px'}">
    <div class="main" v-for="(childData, key) in childIsShow" :key="key">
      <div class="container" :data-id="childData.id">
        <header v-text="childData.title"></header>
        <section>
          <div v-text="childData.name"></div>
          <div v-text="childData.describe"></div>
          <div v-text="childData.date"></div>
        </section>
        <button @click="show(key)" v-if="childData.children" v-text="!childIsShow[key].isHidden ? '收起' : '展开'"></button>
      </div>
      <StructureOrgTreeComponent v-show="!childIsShow[key].isHidden" v-if="childData.children" :data="childData.children"/>
    </div>
  </div>
</template>
<script>
export default {
  name: 'StructureOrgTreeComponent',
  props: {
    data: {
      type: Array,
      default () {
        return [{
          title: '王海洋区',
          name: '王海洋',
          describe: '资深总监',
          date: '2012-08-23',
          children: [
            {
              title: '营业部经理',
              name: '王健林',
              describe: '一代',
              date: '2012-08-23',
              children: [
                {
                  title: '业务员',
                  name: '李涛',
                  describe: '二代',
                  date: '2019-03-08'
                }, {
                  title: '业务员',
                  name: '张帅',
                  describe: '二代',
                  date: '2019-06-03'
                }
              ]
            }, {
              title: '营业部经理',
              name: '赵建国',
              describe: '一代',
              date: '2012-08-23',
              children: [
                {
                  title: '业务主任',
                  name: '王佳灵',
                  describe: '二代',
                  date: '2013-08-26'
                }, {
                  title: '业务主任',
                  name: '单华伟',
                  describe: '二代',
                  date: '2013-08-26'
                }
              ]
            }, {
              title: '营业部经理',
              name: '赵建国',
              describe: '一代',
              date: '2012-08-23',
              children: [
                {
                  title: '业务主任',
                  name: '李小婉',
                  describe: '二代',
                  date: '2015-03-15'
                }, {
                  title: '业务主任',
                  name: '李小婉',
                  describe: '二代',
                  date: '2015-03-15',
                  children: [
                    {
                      title: '业务员',
                      name: '李天一',
                      describe: '三代',
                      date: '2015-03-15'
                    }
                  ]
                }
              ]
            }
          ]
        }]
      }
    }
  },
  data () {
    return {
      maxWidth: 0,
      childIsShow: []
    }
  },
  created () {
    if (!document.isFirstLevel) {
      this.init(this.data, '')
      document.isFirstLevel = true
    }
  },
  beforeMount () {
    this.childIsShow = [...this.data]
    setTimeout(() => {
      this.drawPath()
    }, 0)
  },
  beforeDestroy () {
    document.isFirstLevel = null
  },
  methods: {
    init (data, parentId) {
      if (this.$parent.init) {
        return this.$parent.init(this.$parent.childIsShow, '')
      }
      // 遍历初始数据，每个节点增加子节点个数数据，用于计算容器宽度，数据分组
      data && data.forEach((item, i) => {
        item.id = parentId ? parentId + '_' + i : '' + i
        if (!document.isFirstLevel) {
          item.isHidden = 'isHidden' in item ? item.isHidden : true
        }
        if (item.children && item.children.length > 0) {
          let len = item.children.filter(child => !child.isHidden).length
          if (data.childCount) {
            data.childCount += len
          } else {
            data.childCount = len
          }
          if (this.maxWidth <= data.childCount) {
            this.maxWidth = data.childCount
          }
          this.init(item.children, item.id)
        } else {
          if (data.childCount) {
            data.childCount++
          } else {
            data.childCount = 1
          }
          if (this.maxWidth <= data.childCount) {
            this.maxWidth = data.childCount
          }
        }
      })
      this.childIsShow = [...this.childIsShow]
    },
    drawPath () {
      if (this.maxWidth) {
        let containers = document.querySelectorAll('.container')
        let posArr = Array.from(containers).map(container => {
          return {
            top: container.offsetTop,
            bottom: container.offsetTop + container.clientHeight,
            left: container.offsetLeft + container.clientWidth / 2,
            width: container.clientWidth,
            height: container.clientHeight,
            id: container.getAttribute('data-id'),
            isHidden: container.parentNode.parentNode.style.display === 'none'
          }
        })
        // 从分支按层排序
        posArr.sort(function (prev, next) {
          return prev.top - next.top
        }).reverse()
        posArr = posArr.filter(item => (item.top || item.left))
        let cvs = document.querySelector('.cvs')
        !cvs && (cvs = document.createElement('canvas'))
        cvs.width = this.$refs.firstLevel.clientWidth
        cvs.height = this.$refs.firstLevel.clientHeight
        cvs.className = 'cvs'
        let cxt = cvs.getContext('2d')
        cxt.clearRect(0, 0, this.$refs.firstLevel.clientWidth, this.$refs.firstLevel.clientHeight)
        this.$refs.firstLevel.style.position = 'relative'
        cxt.strokeStyle = '#aaa'
        posArr.forEach((elInfo, i) => {
          // 绘制当前节点路径
          if (i < posArr.length - 1) {
            cxt.moveTo(elInfo.left, elInfo.top)
            cxt.lineTo(elInfo.left, elInfo.top - 25)
            let branchId = elInfo.id.split('_')
            if (Number(branchId[branchId.length - 1]) !== 0) {
              // 绘制当前节点与前一节点连接路径
              cxt.lineTo(posArr[i + 1].left, posArr[i + 1].top - 25)
            }
            cxt.stroke()
          }
          // 绘制向下子节点路径
          for (let j = i + 1; j < posArr.length; j++) {
            if (elInfo.id !== posArr[j].id && elInfo.id.indexOf(posArr[j].id) === 0) {
              cxt.moveTo(posArr[j].left, posArr[j].bottom)
              cxt.lineTo(posArr[j].left, posArr[j].bottom + 25)
              cxt.stroke()
              break
            }
          }
        })
        // 将canvas绘制好的Path背景添加到根节点容器中
        this.$refs.firstLevel.insertBefore(cvs, this.$refs.firstLevel.firstChild)
      } else if (this.$parent.drawPath) {
        // 重绘路径需调用插件根节点组件的drawPath方法
        this.$parent.drawPath()
      }
    },
    show (key) {
      // 展开收起切换实现
      this.childIsShow[key] = {
        ...this.childIsShow[key],
        isHidden: !this.childIsShow[key].isHidden
      }
      this.childIsShow = [...this.childIsShow]
      // this.init(this.childIsShow, '')
      
      setTimeout(() => {
        this.drawPath()
      }, 0)
    }
  }
}
</script>
<style scoped>
.StructureOrgTreeComponent {
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  font-size: 0;
}
.StructureOrgTreeComponent::before {
  content: '';
  display: block;
  visibility: hidden;
}
.StructureOrgTreeComponent .main {
  text-align: center;
  min-width: 160px;
}
.StructureOrgTreeComponent .container {
  display: inline-block;
  margin: 0 20px;
  margin-top: 50px;
  border-radius: 4px;
  overflow: hidden;
  font-size: 14px;
}
.StructureOrgTreeComponent .container header {
  padding: 0 20px;
  background-color: #ADB0C8;
  color: #fff;
  line-height: 30px;
}
.StructureOrgTreeComponent .container section {
  padding: 10px 10px 15px;
  background-color: #EFEFF5;
  text-align: center;
  line-height: 22px;
  font-size: 12px;
}
</style>
<style>
.StructureOrgTreeComponent .cvs {
  position: absolute;
  /* width: 100%;
  height: 100%; */
  pointer-events: none;
}
</style>
