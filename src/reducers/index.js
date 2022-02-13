import { combineReducers } from "redux";
import { auth } from "./auth.reducer";
import { mask } from "./mask.reducer";
import { modal } from "./modal.reducer";

const rootReducer = combineReducers({
  auth,
  mask,
  modal
  // todo ...
});

export default rootReducer;
