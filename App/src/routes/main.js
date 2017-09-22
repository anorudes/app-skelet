// polyfill webpack require.ensure
if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

export default {
  childRoutes: [{
    path: '/main',
    component: require('components/Pages/MainPage').default,
  }],
};
