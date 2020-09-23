const initialState = {};

const supportSetReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'SAVE_PREDICTION': {
      return {
        ...state,
        [action.prediction.photo.uri]: action.prediction,
      };
    }
    default: {
      return state;
    }
  }
};

export default supportSetReducers;
