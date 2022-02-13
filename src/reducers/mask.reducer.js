import { maskConstants } from "../constants";

export const mask = (state = { spinning: false, spinningCount: 0 }, action) => {
  switch (action.type) {
    case maskConstants.TOGGLE:
      const spinningCount = action.spinning
        ? ++state.spinningCount
        : --state.spinningCount;
      return {
        spinning: !action.spinning && spinningCount === 0 ? false : true,
        spinningCount
      };
    default:
      return state;
  }
};
