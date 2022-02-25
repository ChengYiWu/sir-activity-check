import { ajax } from "../utils";

export const activityMemberService = {
  statistics: async () => {
    try {
      const { message, data } = await ajax.get("/activity-members/statistic", {
        isWithToken: true
      });
      return { message, ...data };
    } catch (error) {
      return Promise.reject({ ...error, message: error.serverMessage });
    }
  },
  /**
   * 搜尋客戶資料
   *
   * @param {string} keyword - The keyword of search.
   */
  search: async ({ field, keyword, from_member }) => {
    try {
      const { data } = await ajax.get("/activity-members", {
        params: {
          field,
          keyword,
          from_member
        },
        isWithToken: true
      });

      return data;
    } catch (error) {
      return Promise.reject({ ...error, message: error.serverMessage });
    }
  },
  get: async id => {
    try {
      const { data } = await ajax.get(`/activity-members/${id}`, {
        isWithToken: true
      });

      return data;
    } catch (error) {
      return Promise.reject({ ...error, message: error.serverMessage });
    }
  },
  check: async (id, delegateForId) => {
    try {
      const { message, data } = await ajax.put(
        `/activity-members/${id}/check`,
        {
          delegate_for: delegateForId
        },
        { isWithToken: true }
      );
      return {
        message,
        ...data
      };
    } catch (error) {
      return Promise.reject({ ...error, message: error.serverMessage });
    }
  },
  uncheck: async (id, cancelDelegateFor) => {
    try {
      const { message, data } = await ajax.put(
        `/activity-members/${id}/uncheck`,
        { cancel_delegate_for: cancelDelegateFor },
        { isWithToken: true }
      );

      return {
        message,
        ...data
      };
    } catch (error) {
      return Promise.reject({ ...error, message: error.serverMessage });
    }
  },
  delegateFor: async (id, delegateForId) => {
    try {
      const { message, data } = await ajax.put(
        `/activity-members/${id}/delegate-for/${delegateForId}`,
        {},
        { isWithToken: true }
      );

      return {
        message,
        ...data
      };
    } catch (error) {
      return Promise.reject({ ...error, message: error.serverMessage });
    }
  },
  cancelCheckFor: async id => {
    try {
      const { message, data } = await ajax.put(
        `/activity-members/${id}/cancel-delegate-for`,
        {},
        { isWithToken: true }
      );

      return {
        message,
        ...data
      };
    } catch (error) {
      return Promise.reject({ ...error, message: error.serverMessage });
    }
  }
};
