import React from 'react'
import Swiper from '../../components/Swiper'
import CSS from './index.module.less'
class Home extends React.Component {
  render () {
    return (
      <div className={CSS.home}>
        <header className={`${CSS.search} flex-center`}>
          <input onFocus={() => this.props.history.push('/search')} placeholder="搜索" type="text" />
          <i className="iconfont icon-search"></i>
        </header>
        <Swiper/>
      </div>
    )
  }
}
export default Home