import { combineReducers } from 'redux';

import crudReducers from './crudReducers';

export default combineReducers({
  photos: crudReducers,
});
