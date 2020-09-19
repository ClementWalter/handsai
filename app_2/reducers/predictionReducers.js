const predictionReducers = (state = {}, action) => {
  switch (action.type) {
    case 'REQUEST_PREDICTION_RECEIVED': {
      return {
        ...state,
        ...action.prediction,
      };
    }
    default: {
      return state;
    }
  }
};

export default predictionReducers;
