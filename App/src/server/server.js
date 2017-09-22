import Express from 'express';
import http from 'http';
import { renderFullPage } from './utils/render';
const webpack = require('webpack');
const webpackConfig = require('../../webpack/common.config');
const compiler = webpack(webpackConfig);
const app = new Express();
const server = new http.Server(app);
const proxy = require('http-proxy').createProxyServer({});
import Config from 'config';
const { getProjectConfig } = Config;

// Port for web-dev-server and server app (bundle.js, bundle.css, dist, static)
const port = 3000;

app.use(require('morgan')('short'));

app.use((req, res, next) => {
  const projectConfigs = Config.allProjectConfigs;

  if (!projectConfigs) {
    Config.fetchAllProjectConfigs(next);
  } else {
    next();
  }
});

app.use((req, res, next) => {
  const projectConfigs = Config.allProjectConfigs;

  Object.keys(projectConfigs)
    .map(key => {
      if (req.headers['x-project'] === key) {
        // Set project config
        Config.setProject(projectConfigs[key].projectName, projectConfigs[key]);
      }
    });

  const projectConfig = Config.getProjectConfig();
  req.projectConfig = projectConfig;
  req.projectId = projectConfig.projectId;
  req.projectName = projectConfig.projectName;
  req.projectDomain = projectConfig.projectDomain;

  next();
});

if (process.env.NODE_ENV === 'development') {
  app.use(require('webpack-dev-middleware')(compiler, {
    quiet: true,
    noInfo: true,
    cache: true,
    stats: {
      colors: true,
      timings: true,
      chunks: true,
      errors: true,
      errorDetails: true,
      warnings: true,
    },
    timeout: 10,
    publicPath: webpackConfig.output.publicPath,
  }));

  app.use(require('webpack-hot-middleware')(compiler, {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 2000,
    noInfo: true,
    quiet: true,
  }));
}

proxy.on('error', (err, req) => {
  console.error(err, req.url);
});


app.get(/.*/, (req, res) => {
  const domain = req.projectDomain;
  res.end(renderFullPage('', domain, getProjectConfig().projectName, null, null, { app: { projectConfig: req.projectConfig } }, null));
});

server.listen(port, () => {
  const host = server.address().address;
  console.log('Server is listening on http://%s:%s', host, port);
});
