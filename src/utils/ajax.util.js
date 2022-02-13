import axios from "axios";
import { pickBy } from "lodash";
import { auth, secureStroge, storgeKeys, history, router } from ".";

/**
 * axios 預設如下：
 * content-type: application/json;
 * charset=UTF-8；
 */
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.put["Content-Type"] = "application/json";
axios.defaults.headers.patch["Content-Type"] = "application/json";
axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.timeout = 5000;

/**
 * Request Token 處理
 */
axios.interceptors.request.use(function (config) {
  return config;
});

const loginInvalid = () => {
  secureStroge.remove(storgeKeys.userAuth);
  history.push("/Login");
};

/**
 * 攔截器處理錯誤與回傳資料格式
 */
axios.interceptors.response.use(
  response => {
    const { data: serverResponse } = response;
    const { data, status, message } = serverResponse;
    // 2xx 的都算是成功，其他則是 server 執行過程的預期錯誤
    const isSuccess = /^2[\d]*$/.test(status);
    if (!isSuccess) {
      if (status === 401) {
        loginInvalid();
        return Promise.reject({
          data,
          status,
          message: "登入逾期或失效，請重新進行登入",
          serverMessage: message
        });
      }

      return Promise.reject({
        data,
        status,
        message: "無法順利執行操作，請聯絡客服人員回報！",
        serverMessage: message
      });
    }

    return serverResponse;
  },
  error => {
    try {
      if (error.response) {
        const {
          response: {
            data: { message },
            status
          }
        } = error;
        let errorMessage;
        switch (status) {
          case 401:
            // 無權限清除 token
            loginInvalid();
            errorMessage = "登入逾期或失效，請重新進行登入";
            break;
          case 403:
            loginInvalid();
            errorMessage = message;
            break;
          case 412:
            errorMessage = message;
            break;
          case 422:
            errorMessage = "參數資料或格式錯誤，請重新確認！";
            break;
          default:
            errorMessage = "無法順利執行操作，請聯絡客服人員回報！";
        }
        return Promise.reject({
          status,
          message: errorMessage,
          serverMessage: message || errorMessage
        });
      } else if (error.message === "Network Error") {
        return Promise.reject({
          state: 0,
          message: "請確認裝置的網路連線狀況，如有問題請回報予管理者。",
          serverMessage: "請確認裝置的網路連線狀況，如有問題請回報予管理者。"
        });
      } else {
        throw error;
      }
    } catch (innerError) {
      return Promise.reject({
        state: 0,
        message: "請確認裝置的網路連線狀況，如有問題請回報予管理者。",
        serverMessage: "請確認裝置的網路連線狀況，如有問題請回報予管理者。"
      });
    }
  }
);

export const ajax = {
  /**
   * Send Get's Ajax Request.
   * @param {string} url - The request url.
   * @param {object} optionsConfig - The optional request config. ex: { params, data, headers, timeout, isWithToken ... }
   */
  get(url, optionsConfig = {}) {
    return axios.get(url, this.__mergeAuthHeaderOption(optionsConfig));
  },
  /**
   * Send Post's Ajax Request.
   * @param {string} url - The request url.
   * @param {object} data - The request data.
   * @param {object} optionsConfig - The optional request config. ex: { params, data, headers, timeout, isWithToken ... }
   */
  post(url, data, optionsConfig = {}) {
    return axios.post(url, data, this.__mergeAuthHeaderOption(optionsConfig));
  },
  /**
   * Send Put's Ajax Request.
   * @param {string} url - The request url.
   * @param {object} data - The request data.
   * @param {object} optionsConfig - The optional request config. ex: { params, data, headers, timeout, isWithToken ... }
   */
  put(url, data, optionsConfig = {}) {
    return axios.put(url, data, this.__mergeAuthHeaderOption(optionsConfig));
  },
  /**
   * Send Patch's Ajax Request.
   * @param {string} url - The request url.
   * @param {object} data - The request data.
   * @param {object} optionsConfig - The optional request config. ex: { params, data, headers, timeout, isWithToken ... }
   */
  patch(url, data, optionsConfig = {}) {
    return axios.patch(url, data, this.__mergeAuthHeaderOption(optionsConfig));
  },
  /**
   * Send Delete's Ajax Request.
   * @param {string} url - The request url.
   * @param {object} optionsConfig - The optional request config. ex: { params, data, headers, timeout, isWithToken ... }
   */
  delete(url, optionsConfig = {}) {
    return axios.delete(url, this.__mergeAuthHeaderOption(optionsConfig));
  },
  /**
   * Merge Auth Header To Ajax Request Options.
   * @param {object}} optionsConfig - The optional request config. ex: { params, data, headers, timeout ... }
   */
  __mergeAuthHeaderOption(optionsConfig) {
    const { headers, isWithToken, ...rest } = optionsConfig;
    if (isWithToken) {
      return {
        ...rest,
        headers: {
          ...auth.getAuthHeader(),
          ...headers
        }
      };
    }
    return optionsConfig;
  },
  /**
   * Convert Params To FormData
   * @param {object} params - The params of form.
   */
  convertToFormData(params) {
    const formData = new FormData();
    const paramKeys = Object.keys(
      pickBy(params, prop => {
        return prop != null && typeof prop !== "undefined";
      })
    );
    paramKeys.forEach(key => {
      let param = params[key];
      if (Array.isArray(param)) {
        param.forEach(item => {
          formData.append(`${key}[]`, item);
        });
      } else {
        formData.append(`${key}`, param);
      }
    });
    return formData;
  }
};
