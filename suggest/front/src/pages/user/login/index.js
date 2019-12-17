import React from 'react';
import axios from '../../../http/index'
import { Link } from 'react-router-dom'
import CSS from './index.module.less'
import logoImg from '../../../assets/images/logo.png';

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      verificationCode: ''
    }
  }
  componentDidMount() {
    this.utils.focusInputScrollScreen()
    this.utils.ready(this.listenBack)
  }
  listenBack() {
    let plus = window.plus
    let webview = plus.webview.currentWebview();
    plus.key.addEventListener('backbutton', function () {
      webview.canBack(function (e) {
        if (e.canBack) {
          webview.back();
        } else {
          //webview.close(); //hide,quit
          //plus.runtime.quit();
          //首页返回键处理
          //处理逻辑：1秒内，连续两次按返回键，则退出应用；
          var first = null;
          plus.key.addEventListener('backbutton', function () {
            //首次按键，提示‘再按一次退出应用’
            if (!first) {
              first = new Date().getTime();
              setTimeout(function () {
                first = null;
              }, 1000);
            } else {
              if (new Date().getTime() - first < 1500) {
                plus.runtime.quit();
              }
            }
          }, false);
        }
      })
    })
  }
  async loginFn(e) {
    e.preventDefault()
    this.props.history.push('/home')
    let isFull = Object.keys(this.state).every((key) => !!this.state[key])
    if (isFull) {
      try {
        let res = await axios.post('/api/login', this.state)
        if (res.data.success) {
          this.props.history.push('forgetPwd')
        }
      } catch (err) {
        console.error(err)
      }
    }
  }
  inputChangeFn(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  render() {
    return (
      <div className={CSS.login}>
        <div className={CSS.logo}>
          <img src={logoImg} alt='' />
          <h3>EM</h3>
        </div>
        <form onSubmit={this.loginFn.bind(this)}>
          <div className={CSS.formInput}>
            <i className="iconfont icon-people_fill"></i>
            <input type="text" value={this.state.username} name="username" onChange={this.inputChangeFn.bind(this)} placeholder="输入用户名" />
          </div>
          <div className={CSS.formInput}>
            <i className="iconfont icon-lock_fill"></i>
            <input type="password" value={this.state.password} name="password" onChange={this.inputChangeFn.bind(this)} placeholder="输入密码" autoComplete="new-password" />
          </div>
          <div className={CSS.formInput}>
            <i className="iconfont icon-integral_fill"></i>
            <input type="text" value={this.state.verificationCode} name="verificationCode" onChange={this.inputChangeFn.bind(this)} placeholder="输入验证码" />
            <span className={CSS.verificationCode}><img src={this.state.verificationCode} alt="" />换一个</span>
          </div>
          <div className={CSS.formButton}><button type="submit">登录</button></div>
        </form>
        <Link to={history => ({ ...history, pathname: "/forgetPwd" })}>忘记密码</Link>
      </div>
    )
  }
}
export default Login
