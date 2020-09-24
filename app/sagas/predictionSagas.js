import { put, takeLatest } from 'redux-saga/effects';
import { clearPrediction, savePrediction, updatePrediction } from '../actions/predictionActions';
import { resize } from '../utils/imageUtils';
import preprocessing from '../models/preprocessing';
import encoder from '../models/encoder';
import kernel from '../models/kernel';
import { loadBase64, padToSquare } from '../utils/tensorUtils';
import isEmpty from 'react-native-web/dist/vendor/react-native/isEmpty';
import * as tf from "@tensorflow/tfjs"
import "@tensorflow/tfjs-react-native"

function* requestEmbedding(action) {
  const photoLow = yield resize(224, 224)(action.prediction.photo)
  const embedding = encoder.predict(preprocessing.predict(loadBase64(photoLow.base64)))
  yield put(updatePrediction({embedding}));
  return embedding
}

function* requestPrediction(action) {
  const embedding = yield requestEmbedding(action)
  let label = "NO_LABEL"
  let confidence = 0
  if (!isEmpty(action.supportSet)) {
    const supportSet = Object.values(action.supportSet)
    const supportSetEmbeddings = tf.concat(supportSet.map((x) => x.embedding))
    let scores = kernel.predict([embedding.tile([supportSet.length, 1]), supportSetEmbeddings]).squeeze()
    scores = scores.arraySync()
    confidence = Array.isArray(scores) ? Math.max(...scores) : scores;
    const index = Array.isArray(scores) ? scores.indexOf(confidence) : 0
    label = supportSet[index].label
  }
  yield put(updatePrediction({label, confidence}));
}

export function* watchRequestPrediction() {
  yield takeLatest('REQUEST_PREDICTION', requestPrediction);
}

function* validatePrediction(action) {
  yield put(savePrediction(action.prediction))
  yield put(clearPrediction())
}

export function* watchValidatePrediction() {
  yield takeLatest('VALIDATE_PREDICTION', validatePrediction);
}
