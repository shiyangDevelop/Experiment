import React from 'react'
import { Container } from '../../components/Container'
// import CSS from './index.module.less'
class Testing extends React.Component {
  render () {
    return (
      <Container title={'笔试题'} activeIndex={1} {...this.props}>
        <div>笔试题模块</div>
      </Container>
    )
  }
}
export default Testing