import React from 'react'
import { Container } from '../../components/Container'
import Swiper from '../../components/Swiper'
import CSS from './index.module.less'
class Home extends React.Component {
  render () {
    return (
      <Container type={'search'} focusTo={'/search'} {...this.props}>
        <div className={CSS.home}>
          <Swiper/>
        </div>
      </Container>
    )
  }
}
export default Home