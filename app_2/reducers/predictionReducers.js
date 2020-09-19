const predictionReducers = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_PREDICTION': {
      return {
        ...state,
        ...action.prediction
      }
    }
    default: {
      return state;
    }
  }
};

export default predictionReducers;
