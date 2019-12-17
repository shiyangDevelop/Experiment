import React from 'react'
import CSS from './index.module.less'
export class Header extends React.Component {
  back () {
    if (this.props.back) {
      return this.props.back()
    } else {
      return this.props.history.goBack()
    }
  }
  render () {
    return (
      <header className={CSS.HeaderComponent}>
        <span className={CSS.back} onClick={this.back.bind(this)}><i className="iconfont icon-return"></i></span>
        <span className={CSS.title}>{this.props.title}</span>
      </header>
    )
  }
}