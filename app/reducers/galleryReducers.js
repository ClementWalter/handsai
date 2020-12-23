const galleryReducers = (state = { isLoading: false }, action) => {
  switch (action.type) {
    case "TOGGLE_LOADER": {
      return {
        ...state,
        isLoading: !state.isLoading,
      };
    }
    default: {
      return state;
    }
  }
};

export default galleryReducers;
