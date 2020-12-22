import * as tf from "@tensorflow/tfjs";
import MLModel from "./index";
import getEnvVars from "../environment";

tf.registerOp("Assert", (node) => node.inputs[0]);

const { apiUrl } = getEnvVars();

class Preprocessing extends MLModel {
  url = `${apiUrl}/models/preprocessing/graph/model.json`;

  predict = (tensor) => {
    if (tensor.shape.length === 4) {
      return tf.stack(
        [...Array(tensor.shape[0]).keys()].map((x) =>
          this.getModel().predict(tensor.slice([x], [1]).squeeze())
        )
      );
    }
    return this.getModel().predict(this.preprocess(tensor));
  };
}

export default new Preprocessing();
