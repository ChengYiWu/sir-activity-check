import { modalConstants } from "../constants";

const initState = {
  modalType: null,
  modalProps: {
    open: false
  }
};

export const modal = (state = initState, action) => {
  switch (action.type) {
    case modalConstants.SHOW:
      return {
        ...state,
        modalType: action.modalType,
        modalProps: {
          open: true,
          ...action.modalProps
        }
      };
    case modalConstants.HIDE:
      return initState;
    default:
      return state;
  }
};
