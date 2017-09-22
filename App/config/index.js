import request from 'superagent-bluebird-promise';
import main from './main';
import basic from './basic';

const Config = {
  projectName: (typeof __CLIENT__ !== 'undefined' && __CLIENT__)
    ? (typeof __PROJECT__ !== 'undefined' && __PROJECT__ ? __PROJECT__ : location.hostname) : '',

  projectConfig: null,
  allProjectConfigs: null,

  setProject: (projectName, projectConfig) => {
    Config.projectName = projectName;
    Config.projectConfig = projectConfig;
  },

  getMainConfig: () => {
    return main;
  },

  getProjectConfig: () => {
    const project = (typeof __CLIENT__ !== 'undefined' && __CLIENT__)
      ? window.__INITIAL_STATE__.app.projectConfig
      : Config.projectConfig;

    return {
      ...basic,
      ...project,
    };
  },

  fetchAllProjectConfigs: (callback) => {
    // Get projects configs from api
    const nodeApiHost = process.env.NODE_API_HOST || 'localhost';
    const nodeApiPort = process.env.NODE_API_PORT || 3030;
    const apiUrl = `http://${nodeApiHost}:${nodeApiPort}/api/`;

    request.get(`${apiUrl}configs/get`)
      .promise()
      .then(res => {
        Config.allProjectConfigs = res.body.data;
        callback();
      })
      .catch(console.log);
  },
};

export default Config;
