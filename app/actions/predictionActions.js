export const updatePrediction = (prediction) => ({type: 'UPDATE_PREDICTION', prediction})

export const savePrediction = (prediction) => ({
  type: 'SAVE_PREDICTION',
  prediction,
})

export const addPrediction = (prediction) => ({
  type: 'ADD_PREDICTION',
  prediction,
})

export const clearPrediction = () => ({
  type: 'CLEAR_PREDICTION',
})

export const requestPrediction = (tensor, supportSet) => ({
  type: 'REQUEST_PREDICTION',
  tensor,
  supportSet,
})
