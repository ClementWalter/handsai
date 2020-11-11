import { all, fork } from 'redux-saga/effects';

import { watchRequestPrediction, watchValidatePrediction, watchSaveTensorAsJpeg } from './predictionSagas';

export default function* rootSaga () {
  yield all([
    fork(watchRequestPrediction),
    fork(watchValidatePrediction),
    fork(watchSaveTensorAsJpeg),
  ]);
}
