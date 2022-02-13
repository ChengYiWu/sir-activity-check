import { maskConstants } from "../constants";

export const maskActions = {
  /**
   * Toggle Loading Mask.
   * @param {bool} spinning - The spinning state.
   */
  toggleMask(spinning) {
    return {
      type: maskConstants.TOGGLE,
      spinning
    };
  }
};
