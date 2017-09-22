import { getProjectConfig } from 'config';

export const projectRoutes = (callback, defaultChildRoutes) => {
  const projectName = getProjectConfig().projectName;
  switch (projectName) {
    case 'project':
      callback(null, [
        ...require('./project').ProjectRoutes,
        ...defaultChildRoutes,
      ]);
      break;
  }
};
