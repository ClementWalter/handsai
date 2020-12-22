import { all, fork } from "redux-saga/effects";

import { watchRequestPrediction, watchRequestMediaPrediction } from "./predictionSagas";

export default function* rootSaga() {
  yield all([fork(watchRequestPrediction), fork(watchRequestMediaPrediction)]);
}
