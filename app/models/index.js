import * as tf from "@tensorflow/tfjs"
import "@tensorflow/tfjs-react-native"
import { logger } from 'react-native-logs';

const log = logger.createLogger();

export class MLModel {

  url = null;
  model = null;

  getModel = () => (this.model);

  async loadModel() {
    log.info(`loading model ${this.url}`)
    this.model = await tf.loadGraphModel(this.url);
    log.info(`loaded model ${this.url}`)
  }

  preprocess = (tensor) => (tensor)

  predict = (tensor) => (this.getModel().predict(this.preprocess(tensor)))
}
