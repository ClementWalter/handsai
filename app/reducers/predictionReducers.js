const predictionReducers = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_PREDICTION': {
      return {
        ...state,
        predictions: state.predictions.map((prediction) => ({...prediction, label: action.label})),
      }
    }
    case 'CLEAR_PREDICTION': {
      return {}
    }
    case 'ADD_PREDICTION': {
      return {
        ...state,
        predictions: [...(state.predictions || []), action.prediction],
      }
    }
    default: {
      return state;
    }
  }
};

export default predictionReducers;
