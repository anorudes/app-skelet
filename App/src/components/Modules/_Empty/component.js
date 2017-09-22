import React, { PropTypes, Component } from 'react';
import injectLocale from 'decorators/injectLocale';

import { s } from './';

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

export default Empty;
