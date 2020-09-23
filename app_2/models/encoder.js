import { MLModel } from './index';

import getEnvVars from '../environment';

const { apiUrl } = getEnvVars()

class Encoder extends MLModel {
  url = `${apiUrl}/encoder/graph/model.json`
}

export default new Encoder()
