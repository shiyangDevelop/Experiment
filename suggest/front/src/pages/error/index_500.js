import React from 'react'
import { ContainerNoFooter } from '../../components/Container'
import CSS from './index.module.less'
class Page500 extends React.Component {
  render () {
    return (
      <ContainerNoFooter title={'系统出错'} back={true} {...this.props}>
        <div>500</div>
      </ContainerNoFooter>
    )
  }
}
export default Page500