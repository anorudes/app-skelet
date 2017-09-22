import React, { Component, PropTypes } from 'react';
import R from 'ramda';
import cx from 'classnames';
import * as actionCreators from 'redux/modules';
import injectLocale from 'decorators/injectLocale';

/* global styles for app */
require('./styles/app.scss');

import s from './styles.mscss';

@injectLocale(['Page', 'Root'])
@connect(
  state => ({ ...state.user }),
  dispatch => bindActionCreators({
    ...actionCreators.user,
  }, dispatch),
)
class Root extends Component {
  static propTypes = {

  };

render() {
    return (
      <section className={s.root}>
        {
          this.props.children &&
           React.cloneElement(this.props.children, this.props)
        }
      </section>
    );
  }
}

export default Root;
