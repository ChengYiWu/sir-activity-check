import { modalConstants } from "../constants";

export const modalActions = {
  show(modalType, modalProps) {
    return {
      type: modalConstants.SHOW,
      modalType,
      modalProps
    };
  },
  hide() {
    return {
      type: modalConstants.HIDE
    };
  }
};
