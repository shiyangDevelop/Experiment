/**
 * 对象的深拷贝方法
 * @param {*被拷贝对象} current
 * @param {*目标对象} target
 * @param {*目标对象是否添加数据类型标记} isAddType
 */
export function depClone (current, target, isAddType) {
  if (['Array', 'Object'].indexOf(current.constructor.name) !== -1) {
    if (!(target instanceof Object)) {
      target = new current.constructor()
    }
    for (var property in current) {
      if (current[property] instanceof Object && current[property].constructor.name !== 'RegExp') {
        isAddType ? target[property] = {
          type: current[property].constructor.name,
          value: new current[property].constructor()
        } : target[property] = new current[property].constructor()
        depClone(current[property], target[property].value, true)
      } else if (current[property].constructor.name === 'RegExp') {
        isAddType ? target[property] = {
          type: current[property].constructor.name,
          value: current[property].toString()
        } : target[property] = current[property]
      } else {
        isAddType ? target[property] = {
          type: current[property].constructor.name,
          value: current[property]
        } : target[property] = current[property]
      }
    }
  } else {
    target = current
  }
  return target
}

export function deconstruct (current) {
  var target = new current.constructor()
  if (typeof (current) === 'string') {
    current = JSON.parse(current)
  }
  for (var property in current) {
    switch (current[property].type) {
      case 'String':
      case 'Boolean':
      case 'Number':
      case 'undefined':
      case 'null':
        target[property] = current[property].value
        break
      case 'Date':
        target[property] = new Date(current[property].value)
        break
      case 'Object':
      case 'Array':
        target[property] = deconstruct(current[property].value)
        break
      case 'RegExp':
        // eslint-disable-next-line
        target[property] = eval(current[property].value)
    }
  }
  return target
}
export default {
  depClone,
  deconstruct
}
