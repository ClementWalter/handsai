import * as tf from "@tensorflow/tfjs"
import { MLModel } from './index';
import getEnvVars from '../environment';

tf.registerOp('Assert', (node) => node.inputs[0]);

const {apiUrl} = getEnvVars()

class Preprocessing extends MLModel {
  url = `${apiUrl}/models/preprocessing/graph/model.json`
}

export default new Preprocessing()
