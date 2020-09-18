import { all, fork } from 'redux-saga/effects';

import { watchIncreaseCounter, watchDecreaseCounter } from './photosSagas';

export default function* rootSaga () {
  yield all([
    fork(watchIncreaseCounter),
    fork(watchDecreaseCounter),
  ]);
}
