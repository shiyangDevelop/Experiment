import React from 'react'
import ReactDOM from 'react-dom'
import { ContainerNoFooter } from '../../components/Container'
import CSS from './index.module.less'
class Search extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      searchHistory: [
        {
          keyword: '灵剑山',
          code: '0001'
        }, {
          keyword: '心灵法医',
          code: '0002'
        }
      ]
    }
  }
  componentDidMount () {
    let dom = ReactDOM.findDOMNode(this)
    console.log(dom)
  }
  search () {
    // 调用搜索接口
  }
  tapFn (startEvent, index) {
    // 利用touchstart触发长按事件
    this.utils.longPress(startEvent, () => {
      this.state.searchHistory[index].isShow = true
      this.setState({searchHistory: this.state.searchHistory})
    })
  }
  deleteHistory (history, index) {
    console.log(history)
    this.state.searchHistory.splice(index, 1)
    this.setState({searchHistory: this.state.searchHistory})
  }
  render () {
    return (
      <ContainerNoFooter type={'search'} focusFn={this.search.bind(this)} {...this.props}>
        <div className={CSS.searchPage}>
          <h5>搜索历史</h5>
          <section className={CSS.container}>
            {
              this.state.searchHistory.map((history, index) => (
                <span onTouchStart={(e) => this.tapFn(e, index)} key={history.keyword}>
                  {history.keyword}
                  {
                    history.isShow ? <i onClick={() => this.deleteHistory(history, index)} className="iconfont icon-delete_fill"></i> : ''
                  }
                </span>
              ))
            }
          </section>
        </div>
      </ContainerNoFooter>
      
    )
  }
}
export default Search