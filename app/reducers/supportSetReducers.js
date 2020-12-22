const initialState = [];

const supportSetReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'SAVE_PREDICTION': {
      return [
        ...state,
        ...action.prediction.predictions,
      ];
    }
    case 'LOAD_SUPPORT_SET': {
      return [
        ...state,
        ...action.supportSet
      ]
    }
    case 'CLEAR_SUPPORT_SET': {
      return [
        ...initialState
      ]
    }
    default: {
      return state;
    }
  }
};

export default supportSetReducers;
