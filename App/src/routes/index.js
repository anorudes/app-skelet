import { projectRoutes } from './projects';

const defaultChildRoutes = [
  {
    path: '/',
  },
  require('./main').default,
];

const RootRoute = {
  component: require('components/Root').default,
};

RootRoute.getChildRoutes = (partialNextState, callback) => {
  projectRoutes(callback, defaultChildRoutes);
};

export default RootRoute;

