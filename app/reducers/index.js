import { combineReducers } from "redux";

import predictionReducers from "./predictionReducers";
import supportSetReducers from "./supportSetReducers";
import galleryReducers from "./galleryReducers";

export default combineReducers({
  prediction: predictionReducers,
  supportSet: supportSetReducers,
  gallery: galleryReducers,
});
