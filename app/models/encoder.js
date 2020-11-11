import { MLModel } from './index';

import getEnvVars from '../environment';

const {apiUrl} = getEnvVars()

class Encoder extends MLModel {
  url = `${apiUrl}/models/encoder/graph/model.json`

  preprocess = (tensor) => {
    if (tensor.shape.length === 3) {
      return tensor.expandDims(0)
    }
    return tensor
  }
}

export default new Encoder()
