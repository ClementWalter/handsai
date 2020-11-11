import { all, fork } from 'redux-saga/effects';

import { watchValidatePrediction } from './predictionSagas';

export default function* rootSaga () {
  yield all([
    fork(watchValidatePrediction),
  ]);
}
