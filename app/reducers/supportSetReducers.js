const initialState = [];

const supportSetReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'SAVE_PREDICTION': {
      return [
        ...state,
        ...action.prediction.predictions,
      ];
    }
    default: {
      return state;
    }
  }
};

export default supportSetReducers;
