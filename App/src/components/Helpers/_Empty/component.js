import React, { PropTypes } from 'react';
import injectLocale from 'utils/injectLocale';

import { s } from './';

function Empty() {
  return (
    <div />
  );
}

Empty.propTypes = {
};

export default injectLocale(Empty, ['Helper', 'Empty']);
