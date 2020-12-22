export const updatePrediction = (label) => ({
  type: "UPDATE_PREDICTION",
  label,
});

export const savePrediction = (prediction) => ({
  type: "SAVE_PREDICTION",
  prediction,
});

export const addPrediction = (prediction) => ({
  type: "ADD_PREDICTION",
  prediction,
});

export const clearPrediction = () => ({
  type: "CLEAR_PREDICTION",
});

export const requestPrediction = (tensor, supportSet, photo) => ({
  type: "REQUEST_PREDICTION",
  tensor,
  supportSet,
  photo,
});

export const requestMediaPrediction = (media) => ({
  type: "REQUEST_MEDIA_PREDICTION",
  media,
});
