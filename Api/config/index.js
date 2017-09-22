import { PG_DB_DATA } from './main.js';
import { Config } from '../src/sequelize/models';

let configs;

export function updateConfigs() {
  Config.findAll({
    where: {
      enabled: true,
    },
  }).then(res => {
    configs = res;
  });
}

export function getAllAppConfigs() {
  const allConfigs = {};

  configs.map(project => {
    if (project.enabled && project.type === 'app' && project.data.projectName) {
      if (!allConfigs[project.data.projectName]) allConfigs[project.data.projectName] = {};

      allConfigs[project.data.projectName] = {
        ...allConfigs[project.data.projectName],
        ...project.data,
      };
    }
  });

  return allConfigs;
}

export function getProjectConfig(req, merge = true) {
  const projectName = req.headers['x-project'] || 'splash';
  let config = {};

  configs.map(project => {
    if (project.enabled && (project.data.projectName === projectName || project.data.projectName === 'all')) {
      if (merge) {
        config = {
          ...config,
          ...project.data,
        };
      } else {
        config[project.type || 'default'] = { ...project.data };
      }
    }
  });

  return config;
}

export function getProjectConfigById(projectId) {
  let config = {};

  configs.map(project => {
    if (project.enabled && project.data.projectId === projectId) {
      config = { ...project.data };
    }
  });

  return config;
}

export {
  PG_DB_DATA,
};

process.nextTick(updateConfigs);
