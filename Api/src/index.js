import Express from 'express';
import http from 'http';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import socketIO from 'socket.io';
import helmet from 'helmet';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import requestIp from 'request-ip';
import winston from 'winston';
import { getProjectId } from './middleware/projectId';
import { socketEvents } from './sockets';
import getCookies from './middleware/cookies';

winston.configure({
  level: process.env.NODE_DEBUG === 'true'
    ? 'debug'
    : 'error',
  transports: [
    new (winston.transports.Console)({
      timestamp: true,
    }),
  ],
});

if (process.env.NODE_LOGSTASH) {
  require('winston-logstash');
  winston.add(winston.transports.Logstash, {
    port: 28777,
    node_name: `ApiSplash/${process.env.NODE_LOGSTASH}`,
    host: 'log.int.mulbabar.com',
  });
}

// API routes
import routes from './routes/';

const app = new Express();
const server = new http.Server(app);
const logPath = __dirname + `/../log/${new Date().toISOString().slice(0, 10)}.log`;
const accessLogStream = fs.createWriteStream(logPath, { flags: 'a' });

export const io = socketIO.listen(app.listen((+process.env.NODE_SOCKET_PORT + (+process.env.NODE_APP_INSTANCE || 0)) || 8099), {
  log: true,
});
io.on('connection', socketEvents);

app.set('trust proxy', 1);
app.use(cookieParser());
app.use(requestIp.mw());
app.use(session({
  secret: 'splash',
  resave: false,
  saveUninitialized: true,
  httpOnly: false,
  secure: false,
  cookie: {
    secure: false,
  },
}));
// Social auth with passport
app.use(getCookies);
app.use(morgan('combined', { stream: accessLogStream }));
app.use(bodyParser.urlencoded({
  extended: false,
  limit: '5mb',
}));
app.use(bodyParser.json({ limit: '5mb' }));
// app.use(cors({}));
app.use(helmet());
app.use(getProjectId);
app.use(routes);
app.use((err, req, res, next) => {
  if (err) {
    winston.info('error');
    winston.info(err);
  }
  next();
});

server.listen(process.env.NODE_PORT || 3030, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log('Api is listening on http://%s:%s', host, port);
});
