import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyRouterMiddleware, browserHistory, Router } from 'react-router';
import { useScroll } from 'react-router-scroll';

import store from 'redux/store';
import RootRoute from './routes';

if (__CLIENT__) {
  const injectTapEventPlugin = require('react-tap-event-plugin');
  injectTapEventPlugin();
}

if (__CLIENT__ && __DEVELOPMENT__) {
  window.Perf = require('react-addons-perf');
}

if (__CLIENT__) {
  ReactDOM.render(
    <Provider store={store}>
      <Router
        history={browserHistory}
        render={applyRouterMiddleware(useScroll())}
      >
        {RootRoute}
      </Router>
    </Provider>,
    document.getElementById('root')
  );
}
