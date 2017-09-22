import loadCssModuleStyles from 'utils/loadCssModuleStyles';
import Component from './component';

/* component styles */
const s = global.require
  ? require('./styles.mscss')
  : loadCssModuleStyles(require.context('./', false, /.+\.mscss/));

export default Component;

export { s };
