import { MLModel } from './index';

import getEnvVars from '../environment';

const {apiUrl} = getEnvVars()

class Encoder extends MLModel {
  url = `${apiUrl}/models/encoder/graph/model.json`

  preprocess = (tensor) => (tensor.expandDims(0))
}

export default new Encoder()
