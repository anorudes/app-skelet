import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from 'redux/modules';

import injectLocale from 'decorators/injectLocale';

@injectLocale(['Module', 'Empty'])
export class Empty extends Component {
  static propTypes = {

  };

  render() {
    return (
      <div />
    );
  }
}

export default connect(
  state => ({ ...state.app, ...state.user }),
  dispatch => bindActionCreators({
    ...actionCreators.app, ...actionCreators.user,
  }, dispatch),
)(Empty);
