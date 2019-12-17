import React from 'react'
import CSS from './index.module.less'
class Loading extends React.Component {
  render () {
    return (
      <div className={`${CSS.Loading} flex-center`}>
        <section>
          <i className="iconfont icon-time"></i><br/>
          <span>加载中...</span>
        </section>
      </div>
    )
  }
}
export default Loading