import { all, fork } from 'redux-saga/effects';

import { watchRequestPrediction } from './predictionSagas';

export default function* rootSaga () {
  yield all([
    fork(watchRequestPrediction),
  ]);
}
