const initialState = [];

const supportSetReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'SAVE_PREDICTION': {
      return [
        ...state,
        ...action.prediction.predictions.map((prediction) => ({...prediction, label: action.prediction.label})),
      ];
    }
    default: {
      return state;
    }
  }
};

export default supportSetReducers;
