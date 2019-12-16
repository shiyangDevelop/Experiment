import React from 'react'
import backImg from 'assets/images/back.png'
export class Header extends React.Component {
  constructor (props) {
    super(props)
    console.log()
  }
  render () {
    return (
      <header className="HeaderComponent">
        <span className="back" onClick={this.props.back}><img src={backImg} alt='' /></span>
        <span className="title">{this.props.title}</span>
      </header>
    )
  }
}