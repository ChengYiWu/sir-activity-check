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

      // const response = await ajax.post("auth/login", {
      //   telephone,
      //   password
      // });

      // return response.data;

      return {
        telephone: "0912345678",
        token: "XXX",
        username: "華小聯",
        uuid: "1bfc6a30-857c-11e8-bf4f-8fffb96a95c6"
      };
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
