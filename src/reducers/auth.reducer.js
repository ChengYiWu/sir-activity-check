import { authConstants } from "../constants";
import { secureStroge, storgeKeys, queryConditionCache } from "../utils";

const initState = {
  userInfo: null,
  userPermissions: null
};

export const auth = (state = initState, action) => {
  switch (action.type) {
    case authConstants.LOGIN_SUCCESS:
      return {
        ...state,
        userInfo: action.userInfo,
        userPermissions: action.userInfo.permissions
      };
    case authConstants.LOGOUT_SUCCESS:
      queryConditionCache.clear();
      secureStroge.remove(storgeKeys.userAuth);
      return {
        ...state,
        userInfo: null,
        userPermissions: null
      };
    default:
      return state;
  }
};
