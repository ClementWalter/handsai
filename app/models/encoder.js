import { MLModel } from './index';

import getEnvVars from '../environment';
import { loadBase64, padToSquare } from '../utils/tensorUtils';

const {apiUrl} = getEnvVars()

class Encoder extends MLModel {
  url = `${apiUrl}/models/encoder/graph/model.json`

  preprocess = (tensor) => (tensor.expandDims(0))
}

//   preprocess = (tensor) => (
//     padToSquare(tensor)
//       .cast('float32')
//       .div(127.5)
//       .sub(1)
//       .expandDims(0)
//   )
// }

export default new Encoder()
