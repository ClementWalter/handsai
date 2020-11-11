import { put, takeLatest } from 'redux-saga/effects';
import { savePrediction } from '../actions/predictionActions';

function* validatePrediction(action) {
  yield put(savePrediction(action.prediction))
}

export function* watchValidatePrediction() {
  yield takeLatest('VALIDATE_PREDICTION', validatePrediction);
}
