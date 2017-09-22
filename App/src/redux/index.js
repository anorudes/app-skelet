import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { wrapReducerWithSetGlobalState } from 'reduceless-connect';

import user from './modules/user';

const rootReducer = wrapReducerWithSetGlobalState(
  combineReducers({
    form: formReducer,
    user,
  })
);

export default rootReducer;
