import { secureStroge, storgeKeys } from ".";

export const auth = {
  getAuthHeader() {
    const { userInfo } = JSON.parse(secureStroge.get(storgeKeys.userAuth));
    if (userInfo && userInfo.token) {
      return {
        Authorization: userInfo.token
      };
    } else {
      return {};
    }
  }
};
