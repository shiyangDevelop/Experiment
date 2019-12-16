import React from 'react';
import ReactDOM from 'react-dom';
import { Route, HashRouter } from 'react-router-dom';
import 'assets/css/icon.css';
import 'assets/css/common.css';
function ReplaceContent () {
  return (
    <div>loading</div>
  )
}
ReactDOM.render(
  <React.Suspense fallback={<ReplaceContent/>}>
    <HashRouter>
      <Route path='/' exact component={React.lazy(() => import('pages/user/login'))} />
      <Route path='/forgetPwd' exact component={React.lazy(() => import('pages/user/forgetPassword'))}/>
    </HashRouter>
  </React.Suspense>
  ,
  document.getElementById('root')
);
