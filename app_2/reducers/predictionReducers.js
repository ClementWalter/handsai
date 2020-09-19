const predictionReducers = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_PREDICTION': {
      return {
        ...state,
        ...action.prediction
      }
    }
    case 'CLEAR_PREDICTION': {
      return {}
    }
    default: {
      return state;
    }
  }
};

export default predictionReducers;
