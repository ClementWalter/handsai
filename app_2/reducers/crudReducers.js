const initialState = {};

const crudReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE': {
      return {
        ...state,
        [action.key]: action,
      };
    }
    case 'READ': {
      return state[action.key]
    }
    case 'UPDATE': {
      return {
        ...state,
        [action.key]: {
          ...state[action.key],
          ...action
        }
      }
    }
    case 'DELETE': {
      const newState = { ...state}
      delete newState[action.key]
      return newState;
    }
    default: {
      return state;
    }
  }
};

export default crudReducers;
