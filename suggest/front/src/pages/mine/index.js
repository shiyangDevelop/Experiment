import React from 'react'
import { Container } from '../../components/Container'
// import CSS from './index.module.less'
class Mine extends React.Component {
  render () {
    return (
      <Container title={'我的'} {...this.props}>
        <div>我的模块</div>
      </Container>
    )
  }
}
export default Mine