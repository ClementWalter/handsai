import { combineReducers } from 'redux';

import predictionReducers from './predictionReducers';

export default combineReducers({
  prediction: predictionReducers,
});
