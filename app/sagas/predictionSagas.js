import { put, takeLatest } from 'redux-saga/effects';
import { addPrediction } from '../actions/predictionActions';
import { compressJpeg, encodeJpeg } from '../utils/tensorUtils';
import * as tf from "@tensorflow/tfjs"
import preprocessing from '../models/preprocessing';
import encoder from '../models/encoder';
import kernel from '../models/kernel';

const predict = (tensor, supportSet) => {
  const embedding = encoder.predict(preprocessing.predict(tensor))
  let confidence = 0
  let label = "NO_LABEL"
  let index = 0
  const supportEmbeddings = supportSet.map((x) => x.embedding)
  const supportLabels = supportSet.map((x) => x.label)
  if (supportEmbeddings.length > 0) {
    const scores = kernel.predict([
      embedding.tile([supportEmbeddings.length, 1]),
      tf.concat(supportEmbeddings),
    ])
    confidence = scores.max().dataSync()[0]
    index = scores.argMax().dataSync()[0]
    label = supportLabels[index]
  }
  return {embedding, label, confidence, index}
}

function* requestPrediction(action) {
  let insureJpeg = () => action.photo ? action.photo : encodeJpeg(action.tensor)
  const prediction = yield Promise.all([
    insureJpeg(),
    compressJpeg(action.tensor, 10).then((t) => predict(t, action.supportSet)),
  ]).then((arr) => arr.reduce((x, y) => ({...x, ...y}), {}))
  tf.dispose([action.tensor]);
  yield put(addPrediction(prediction))
}

export function* watchRequestPrediction() {
  yield takeLatest('REQUEST_PREDICTION', requestPrediction);
}
