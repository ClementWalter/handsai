import * as tf from "@tensorflow/tfjs"
import "@tensorflow/tfjs-react-native"
import { logger } from 'react-native-logs';

const log = logger.createLogger();

export class MLModel {

  url = null;
  model = null;
  token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.e30.D0bEXk5URSfyKHIWKKcfVTaQuP6P0dnjyqmqbS6FlYQ"

  getModel = () => (this.model);

  async loadModel() {
    log.info(`loading model ${this.url}`)
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${this.token}`);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };
    this.model = await tf.loadGraphModel(this.url, { requestInit: requestOptions});
    log.info(`loaded model ${this.url}`)
  }

  preprocess = (tensor) => (tensor)

  predict = (tensor) => (this.getModel().predict(this.preprocess(tensor)))
}
