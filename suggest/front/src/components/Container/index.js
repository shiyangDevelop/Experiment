import React from 'react'
import CSS from './index.module.less'
import { TitileHeader, SearchHeader } from '../../components/Header'
import Footer from '../../components/Footer'
class Container extends React.Component {
  render () {
    return (
      <main className={CSS.main}>
        {this.props.type === 'search' ? <SearchHeader {...this.props}/> : <TitileHeader back={this.props.back} title={this.props.title} {...this.props}/>}
        <div className={CSS.content}>
          {this.props.children}
        </div>
        <Footer {...this.props}/>
      </main>
    )
  }
}
class ContainerNoFooter extends React.Component {
  render () {
    return (
      <main className={CSS.main}>
        {this.props.type === 'search' ? <SearchHeader {...this.props}/> : <TitileHeader back={this.props.back} title={this.props.title} {...this.props}/>}
        <div className={CSS.contentNoFooter}>
          {this.props.children}
        </div>
      </main>
    )
  }
}
export { Container, ContainerNoFooter }