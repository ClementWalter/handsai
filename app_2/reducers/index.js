import { combineReducers } from 'redux';

import predictionReducers from './predictionReducers';
import supportSetReducers from './supportSetReducers';

export default combineReducers({
  prediction: predictionReducers,
  supportSet: supportSetReducers,
});
