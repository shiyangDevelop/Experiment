import React from 'react'
import { Container } from '../../components/Container'
// import CSS from './index.module.less'
class Schedule extends React.Component {
  render () {
    return (
      <Container title={'日程表'} {...this.props}>
        <div>日程表模块</div>
      </Container>
    )
  }
}
export default Schedule