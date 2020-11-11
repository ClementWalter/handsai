export const updatePrediction = (prediction) => ({type: 'UPDATE_PREDICTION', prediction})

export const savePrediction = (prediction) => ({
  type: 'SAVE_PREDICTION',
  prediction,
})

export const clearPrediction = () => ({
  type: 'CLEAR_PREDICTION',
})
