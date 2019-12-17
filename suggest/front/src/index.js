import React from 'react';
import ReactDOM from 'react-dom';
import { Route, HashRouter } from 'react-router-dom';
import utils from './utils'
import './assets/css/icon.css';
import './assets/css/common.css';
import Loading from './components/Loading'
// function Login () {
//   return new Promise((resolve, reject) => {
//     import('./pages/user/login').then((res) => {
//       setTimeout(() => {
//         resolve(res)
//       }, 5000)
//     })
//   })
// }
React.Component.prototype.utils = utils
class BaseRouter extends React.Component {
  componentDidUpdate () {
    console.log(124)
  }
  render () {
    return (
      <React.Suspense fallback={<Loading/>}>
        <HashRouter>
          <Route path='/' exact component={React.lazy(() => import('./pages/user/login'))} />
          <Route path='/forgetPwd' exact component={React.lazy(() => import('./pages/user/forgetPassword'))}/>
          <Route path='/home' exact component={React.lazy(() => import('./pages/home'))} />
          <Route path='/search' exact component={React.lazy(() => import('./pages/search'))} />
          <Route path='/loading' exact component={Loading} />
        </HashRouter>
      </React.Suspense>
    )
  }
}
ReactDOM.render(
  <BaseRouter/>
  ,
  document.getElementById('root')
);
