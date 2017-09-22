import request from 'superagent-bluebird-promise';
import R from 'ramda';

// Fetch data from api server
export const apiFetch = (action, projectName, cookies = {}, referer = '', acceptLanguage = '') => {
  const nodeApiHost = process.env.NODE_API_HOST || 'localhost';
  const nodeApiPort = process.env.NODE_API_PORT || 3030;
  const apiUrl = `http://${nodeApiHost}:${nodeApiPort}/api/`;

  let promise = request.get(apiUrl + action.url)
    .query({
      ...action.data,
    })
    .set('X_Maintenance_Through', 'yes_please')
    .set('x-project', projectName);

  let userId = '';
  let subscribedProjects = [];
  if (cookies.user) {
    try {
      const parsedUser = JSON.parse(cookies.user);
      userId = parsedUser.id;
      subscribedProjects = parsedUser.subscribedProjects;
    } catch (e) { }
  }

  if (!R.isEmpty(cookies)) {
    const token = cookies.token || '';
    let stringifyCookies = '';

    try {
      stringifyCookies = JSON.stringify({
        appLanguages: cookies.appLanguages,
      });
    } catch (e) { }

    promise = promise.set('cookie', stringifyCookies || '');
    promise = promise.set('userId', userId || '');
    promise = promise.set('token', token || '');
  }

  if (acceptLanguage) {
    promise = promise.set('accept-language', acceptLanguage);
  }

  return promise
    .promise()
    .then(res => res.body, error => console.log(error));
};
