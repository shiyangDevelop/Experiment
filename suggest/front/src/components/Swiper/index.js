import React from 'react'
import Swiper from 'swiper'
import 'swiper/css/swiper.min.css'
import CSS from './index.module.less'
class EmSwiper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      callback: (e) => {
        console.log(this.swiperObject.el)
      },
      list: [
        {
          url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1576583133867&di=376a9e4f636a89e3f0d0cc0e18740e55&imgtype=0&src=http%3A%2F%2Ff.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F0e2442a7d933c8956c0e8eeadb1373f08202002a.jpg',
          href: 'http://www.baidu.com',
          bgColor: 'red'
        }, {
          url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1576583133867&di=4db54c42e333e5562eb90f5d8b42954d&imgtype=0&src=http%3A%2F%2Ff.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Fb151f8198618367aa7f3cc7424738bd4b31ce525.jpg',
          href: 'http://www.jd.com',
          bgColor: 'green'
        }, {
          url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1576583133865&di=e98ba5e6f43fc97dc52b4d0b360f39c7&imgtype=0&src=http%3A%2F%2Fa.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F9a504fc2d5628535bdaac29e9aef76c6a6ef63c2.jpg',
          href: 'http://www.mi.com',
          bgColor: 'blue'
        }
      ]
    }
    this.init = this.init.bind(this)
  }
  componentDidMount () {
    this.init()
  }
  init () {
    this.swiperObject = new Swiper(this.refs.swiper_root, {
      autoplay: true,
      on: {
        tap: this.state.callback
      }
    })
  }
  render () {
    return (
      <div className={`${CSS.em_swiper} swiper-container`} ref="swiper_root">
        <div className="swiper-wrapper">
          {
            this.state.list.map((item, index) => {
              return (
                <div className={`${CSS.slider_item} swiper-slide`} key={index} style={{background: item.bgColor}}>
                  <img src={item.url} />
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}
export default EmSwiper