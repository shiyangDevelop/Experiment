import React from 'react'
import CSS from './index.module.less'
export class TitileHeader extends React.Component {
  back () {
    if (this.props.back && this.props.back.constructor === 'Function') {
      return this.props.back()
    } else {
      return this.props.history.goBack()
    }
  }
  render () {
    return (
      <header className={CSS.HeaderComponent}>
        {this.props.back ? <span className={CSS.back} onClick={this.back.bind(this)}><i className="iconfont icon-return"></i></span> : ''}
        <span className={CSS.title}>{this.props.title}</span>
      </header>
    )
  }
}
export class SearchHeader extends React.Component {
  goBack (e) {
    if (this.props.back && this.props.back.constructor === 'Function') {
      this.props.back(e)
    } else {
      this.props.history.goBack()
    }
  }
  focusFn (e) {
    if (this.props.focusTo) {
      this.props.history.push(this.props.focusTo)
    } else {
      this.props.focusFn(e)
    }
  }
  render () {
    return (
      <header className={`${CSS.search} flex-x-space-around flex-center`}>
        <button onClick={(e) => this.goBack(e)} className={CSS.leftMenu}><i className="iconfont icon-return"></i></button>
        <input onFocus={this.focusFn.bind(this)} placeholder="搜索" type="text" />
        <i className="iconfont icon-search"></i>
        <button className={CSS.rightMenu}><i className="iconfont icon-more"></i></button>
      </header>
    )
  }
}