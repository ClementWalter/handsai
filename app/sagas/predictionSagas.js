import { put, takeLatest } from 'redux-saga/effects';
import { clearPrediction, savePrediction, updatePrediction } from '../actions/predictionActions';
import preprocessing from '../models/preprocessing';
import encoder from '../models/encoder';
import kernel from '../models/kernel';
import isEmpty from 'react-native-web/dist/vendor/react-native/isEmpty';
import * as tf from "@tensorflow/tfjs"
import { encodeJpeg } from '../utils/tensorUtils';

function* requestEmbedding(action) {
  const preprocessedImages = preprocessing.predict(action.prediction.images)
  const embeddings = encoder.predict(preprocessedImages)
  yield put(updatePrediction({embeddings}));
  return embeddings
}

function* requestPrediction(action) {
  const embeddings = yield requestEmbedding(action)
  let label = "NO_LABEL"
  let confidence = 0
  if (!isEmpty(action.supportSet)) {
    const supportSet = action.supportSet
    const supportSetEmbeddings = tf.concat(supportSet.map((x) => x.embedding))
    let scores = kernel.predict([embeddings.slice([0], [1]).tile([supportSet.length, 1]), supportSetEmbeddings]).squeeze()
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
}

export function* watchValidatePrediction() {
  yield takeLatest('VALIDATE_PREDICTION', validatePrediction);
}

function* saveTensorAsJpeg(action) {
  const {uri} = yield encodeJpeg(action.tensor)
  yield put(updatePrediction({uri}))
}

export function* watchSaveTensorAsJpeg() {
  yield takeLatest('SAVE_TENSOR_AS_JPEG', saveTensorAsJpeg);
}
