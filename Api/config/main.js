import winston from 'winston';

export const REDIS_SERVER_SIDE_BASE = {
  development: 0,
  test: 1,
  production: 2,
};

export const REDIS_API_BASE = {
  development: 3,
  test: 4,
  production: 5,
};

let DB_CONNECTION_DATA = {
  db: 'mulbabar',
  user: 'mulbabar',
  password: '',
  options: {
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
    logging: false,
  },
};

if (process.env.NODE_DB_CONNECTION_DATA) {
  const envDbData = JSON.parse(process.env.NODE_DB_CONNECTION_DATA);

  if (envDbData && typeof envDbData === 'object' && envDbData.db) {
    DB_CONNECTION_DATA = envDbData;
    winston.info('ENV db connect data OK:', DB_CONNECTION_DATA);
  } else {
    winston.info('ENV db connection is empty or not correct object:', envDbData);
  }

} else if (process.env.NODE_ENV === 'test') {

  DB_CONNECTION_DATA.db = 'mulbabartest';
  DB_CONNECTION_DATA.user = 'mulbabartest';
  DB_CONNECTION_DATA.password = '';

  winston.info('Using TEST database connection:', DB_CONNECTION_DATA);

} else {
  winston.info('Using default database connection:', DB_CONNECTION_DATA);
}

export const PG_DB_DATA = DB_CONNECTION_DATA;

