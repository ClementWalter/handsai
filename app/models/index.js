import * as tf from "@tensorflow/tfjs"
import "@tensorflow/tfjs-react-native"

export class MLModel {

  url = null;
  model = null;

  getModel = () => (this.model);

  async loadModel() {
    console.log("loading model", this.url)
    this.model = await tf.loadGraphModel(this.url);
    console.log("loaded model", this.url)
  }

  preprocess = (tensor) => (tensor)

  predict = (tensor) => (this.getModel().predict(this.preprocess(tensor)))
}
