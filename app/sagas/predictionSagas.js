import { put, takeLatest } from 'redux-saga/effects';
import { addPrediction } from '../actions/predictionActions';
import { compressJpeg, encodeJpeg, loadUri } from '../utils/tensorUtils';
import * as tf from "@tensorflow/tfjs"
import preprocessing from '../models/preprocessing';
import encoder from '../models/encoder';
import kernel from '../models/kernel';
import { loadSupportSet } from '../actions/supportSetActions';

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
                                       ]).then((arr) => arr.reduce((x, y) => (
    {...x, ...y}
  ), {}))
  tf.dispose([action.tensor]);
  yield put(addPrediction(prediction))
}

export function* watchRequestPrediction() {
  yield takeLatest('REQUEST_PREDICTION', requestPrediction);
}

function* requestMediaPrediction(action) {
  const tensors = yield Promise.all(action.media.map((asset) => loadUri(asset.localUri)))
  const compressed = yield Promise.all(tensors.map((tensor) => compressJpeg(tensor, 10)))
  const embeddings = yield encoder.predict(preprocessing.predict(tf.stack(compressed)))
  const supportSet = action.media.map((asset, index) => (
    {
      ...asset,
      embedding: embeddings.gather(tf.tensor1d([index], 'int32')),
    }
  ))
  yield put(loadSupportSet(supportSet))
}

export function* watchRequestMediaPrediction() {
  yield takeLatest('REQUEST_MEDIA_PREDICTION', requestMediaPrediction)
}
