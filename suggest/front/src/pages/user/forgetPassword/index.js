import React from 'react'
import axios from '../../../http/index'
import { Container } from '../../../components/Container'
import CSS from './index.module.less'
class ForgetPassword extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      password: '',
      rePassword: ''
    }
  }
  inputPassword (e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  async changePwd () {
    try {
      let res = await axios.post('/setNewPassword', this.state)
      if (res.data.success) {
        
      }
    } catch (error) {

    }
  }
  render () {
    return (
      <Container title={'找回密码'} back={true} {...this.props}>
        <div className={CSS.ForgetPassword}>
          <form>
            <div className={CSS.formInput}>
              <i className="iconfont icon-lock_fill"></i>
              <input className="password" value={this.state.password} name="password" onChange={this.inputPassword.bind(this)} type="password" placeholder="新密码(8位到20位之间)"/>
            </div>
            <div className={CSS.formInput}>
              <i className="iconfont icon-lock_fill"></i>
              <input className="password" value={this.state.rePassword} name="rePassword" onChange={this.inputPassword.bind(this)} type="password" placeholder="新密码确认(不能与最近6次密码相同)"/>
            </div>
            <div className={CSS.formButton}><button type="button" onClick={this.changePwd.bind(this)}>提交</button></div>
          </form>
        </div>
      </Container>
      
    )
  }
}
export default ForgetPassword