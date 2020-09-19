import { put, takeLatest } from 'redux-saga/effects';
import { requestPredictionReceived } from '../actions/predictionActions';
import { base64WebSafe, resize } from '../utils/imageUtils';
import getEnvVars from '../environment';

const {apiUrl} = getEnvVars();

function* requestPrediction(action) {
  console.log('enter prediction saga')
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
  yield put(requestPredictionReceived({label, confidence}));
}

export function* watchRequestPrediction() {
  yield takeLatest('REQUEST_PREDICTION', requestPrediction);
}
