import React from 'react'
import CSS from './index.module.less'
class Footer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      menuData: [
        {
          icon: 'icon-homepage',
          text: '首页',
          path: '/home',
          active: true
        }, {
          icon: 'icon-brush',
          text: '参加笔试',
          path: '/testing'
        }, {
          icon: 'icon-task',
          text: '日程',
          path: '/schedule'
        }, {
          icon: 'icon-people',
          text: '我的',
          path: '/mine'
        }
      ]
    }
  }
  toPage (e, menu, index) {
    e.stopPropagation()
    this.state.menuData = this.state.menuData.map(item => {
      item.active = false
      return item
    })
    this.state.menuData[index].active = true
    this.props.history.replace(menu.path)
  }
  render () {
    return (
      <footer className={`${CSS.footer} flex-x-space-around flex-y-center`}>
        {
          this.state.menuData.map((menu, index) => (
            <div className={`${CSS.menubar} ${ menu.active ? CSS.active : ''}`} key={index} onClick={(e) => this.toPage(e, menu, index)}>
              <i className={`${menu.icon} iconfont`}></i>
              <span>{menu.text}</span>
            </div>
          ))
        }
      </footer>
    )
  }
}
export default Footer