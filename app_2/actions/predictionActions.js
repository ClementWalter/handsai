export const requestPrediction = (photo) => ({type: 'REQUEST_PREDICTION', photo})

export const updatePrediction = (prediction) => ({type: 'UPDATE_PREDICTION', prediction})

export const validatePrediction = (prediction, overwrite) => ({
  type: 'VALIDATE_PREDICTION',
  prediction,
  overwrite,
})

export const savePrediction = (prediction) => ({
  type: 'SAVE_PREDICTION',
  prediction,
})

export const clearPrediction = () => ({
  type: 'CLEAR_PREDICTION',
})
