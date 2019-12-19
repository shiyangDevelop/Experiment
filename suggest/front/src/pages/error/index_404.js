import React from 'react'
import { ContainerNoFooter } from '../../components/Container'
// import CSS from './index.module.less'
class Page404 extends React.Component {
  render () {
    return (
      <ContainerNoFooter title={'页面不存在'} back={true} {...this.props}>
        <div>404</div>
      </ContainerNoFooter>
    )
  }
}
export default Page404