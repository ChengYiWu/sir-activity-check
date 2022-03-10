import { ajax } from "../utils";

export const authService = {
  /**
   * 登入
   *
   * @param {string} loginInfo.telephone - The telephone of user.
   * @param {string} loginInfo.password - The password of user.
   */
  login: async loginInfo => {
    try {
      const { telephone, password } = loginInfo;

      const response = await ajax.post("auth/login", {
        telephone,
        password
      });
      const { data } = response;

      return data.roles.find(role => role.key === "HylEmployee")
        ? data
        : Promise.reject({ message: "無權限登入" });
    } catch (error) {
      return Promise.reject({ ...error, message: error.serverMessage });
    }
  },
  /**
   * 檢查登入
   *
   * @param {string} uuid - The uuid of user.
   */
  check: async uuid => {
    try {
      const { data } = await ajax.post(
        "auth/authenticate",
        {
          uuid
        },
        {
          isWithToken: true
        }
      );
      return data;
    } catch (error) {
      return Promise.reject({ message: error.serverMessage });
    }
  }
};
