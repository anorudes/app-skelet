// polyfill webpack require.ensure
if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

export const ProjectRoutes = [
  {
    path: '/',
    onEnter: (nextState, replace) => {
      replace('/main');
    },
  },
];

export default {};
