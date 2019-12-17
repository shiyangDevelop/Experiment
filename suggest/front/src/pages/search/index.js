import React from 'react'
import CSS from './index.module.less'
class Search extends React.Component {
  render () {
    return (
      <div className={CSS.search}>
        <header>
          <input type="search" />
        </header>
      </div>
    )
  }
}
export default Search