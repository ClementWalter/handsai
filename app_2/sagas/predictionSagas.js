import { put, takeLatest } from 'redux-saga/effects';
import { clearPrediction, savePrediction, updatePrediction } from '../actions/predictionActions';
import { base64WebSafe, resize } from '../utils/imageUtils';
import getEnvVars from '../environment';

const {apiUrl} = getEnvVars();

function* requestPrediction(action) {
  const photoLow = yield resize(224, 224)(action.photo)
  const body = JSON.stringify({
    "signature_name": "decode_and_serve",
    "inputs": {"image_bytes": [base64WebSafe(photoLow.base64)]},
  });
  const response = yield fetch(`${apiUrl}/predict`, {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body,
  });
  const prediction = yield response.json()
  let label = "NO_LABEL"
  let confidence = 0
  if (response.ok) {
    const scores = prediction["outputs"]["scores"][0];
    const labels = prediction["outputs"]["classes"];
    confidence = Math.max(...scores);
    label = labels.length > 0 ? labels[scores.indexOf(confidence)] : label;
  }
  yield put(updatePrediction({label, confidence}));
}

export function* watchRequestPrediction() {
  yield takeLatest('REQUEST_PREDICTION', requestPrediction);
}

function* validatePrediction(action) {
  yield put(clearPrediction())
  const photoLow = yield resize(224, 224)(action.prediction.photo)
  const body = JSON.stringify({
    "signature_name": "set_support_set",
    "inputs": {
      "image_bytes": [base64WebSafe(photoLow.base64)],
      "crop_window": [[0, 0, photoLow.height, photoLow.width]],
      "label": [action.prediction.label.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim()],
      "overwrite": action.overwrite,
    },
  });
  const response = yield fetch(`${apiUrl}/predict`, {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body,
  });
  const res = yield response.json()
  if (response.ok) {
    yield put(savePrediction(action.prediction))
  }
}

export function* watchValidatePrediction() {
  yield takeLatest('VALIDATE_PREDICTION', validatePrediction);
}
