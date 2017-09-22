import Config from 'config';
import request from 'superagent-bluebird-promise';
const cookies = __CLIENT__ && require('cookies-js');
import socket from 'utils/socket';
const { API_URL, API_CONNECTION_STRING } = Config.getMainConfig();

const ACTUAL_API_URL = __CLIENT__ ? API_URL : API_CONNECTION_STRING + API_URL;

export const apiMiddleware = store => next => action => {
  if (action && action.url) {
    let user = {};
    try {
      user = JSON.parse(cookies.get('user')) || {};
    } catch (e) { }

    const token = __CLIENT__ && cookies.get('token');

    // Generate promise
    const mode = action.mode;
    let requestPromise;
    if (mode === 'GET') {
      requestPromise = request.get(ACTUAL_API_URL + action.url)
        .query(action.data);
    }

    if (mode === 'POST' || mode === 'PUT' || mode === 'DELETE') {
      requestPromise = request[mode.toLowerCase()](ACTUAL_API_URL + action.url)
        .send(action.data);
    }

    next({
      type: action.type,
      payload: {
        promise: requestPromise
          .set('token', token)
          .set('userId', user.id)
          .set('socketId', socket ? socket.id : null)
          .promise()
          .then(res => {
            if (res.body && action.onSuccess) {
              setTimeout(() => action.onSuccess(res.body, store.dispatch), 10);
            }

            return res.body;
          })
          .catch(res => {
            const data = res.res || {};
            data.text && (data.text = data.text.split('\"').join(''));

            store.dispatch({
              type: 'CATCH_ERROR_FROM_SERVER',
              payload: data,
            });

            if (action.onFailure) {
              action.onFailure(data, store.dispatch);
            }

            throw res;
          }),
        data: { ...action.data },
      },
    });
  } else {
    action && next(action);
  }
};
