import { MLModel } from './index';

import getEnvVars from '../environment';

const { apiUrl } = getEnvVars()

class Kernel extends MLModel {
  url = `${apiUrl}/models/kernel/graph/model.json`
}

export default new Kernel()
