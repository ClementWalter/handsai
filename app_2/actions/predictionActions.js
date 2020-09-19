export const requestPrediction = (photo) => ({ type: 'REQUEST_PREDICTION', photo })
export const requestPredictionReceived = (prediction) => ({ type: 'REQUEST_PREDICTION_RECEIVED', prediction })

export const updatePrediction = (prediction) => ({ type: 'UPDATE_PREDICTION', prediction})
