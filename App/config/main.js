const __PRODUCTION__ = __PRODUCTION__ || process.env.NODE_ENV === 'production'; // eslint-disable-line
const __TEST__ = __TEST__ || process.env.NODE_ENV === 'test'; // eslint-disable-line

export default {
  API_URL: '/api/v1/',
  API_CONNECTION_STRING: process.env.NODE_API_CONNECTION_STRING ? process.env.NODE_API_CONNECTION_STRING : '',
  UPLOADCARE: {
    PUBLIC_KEY: '737e97f64c1930ddf4fc',
  },
  YOUTUBE: {
    API_KEY: 'AIzaSyBM5bM4XKaqSyBFVnNwMSbBASPM9GjWdmc',
  },
  MEDIUM: {
    ID: '901823a98734',
    SECRET: 'b29bbb61ef364c95404170587d54356b1494fc44',
  },
  LANGUAGES: ['en', 'ru'],
};
