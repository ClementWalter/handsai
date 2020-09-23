import { all, fork } from 'redux-saga/effects';

import { watchRequestPrediction, watchValidatePrediction } from './predictionSagas';

export default function* rootSaga () {
  yield all([
    fork(watchRequestPrediction),
    fork(watchValidatePrediction),
  ]);
}
