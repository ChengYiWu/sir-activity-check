import { ajax } from "../utils";

const customers = [
  {
    id: 1,
    number: "000004",
    company: "光*建設股份有限公司",
    name: "柯*吉",
    title: "董事長",
    telephone: "(07)5563122",
    address: "高雄市三民區1號",
    status: "uncheck",
    checkBy: 4,
    checkByNumber: "000005",
    checkByCompany: "BBB股份有限公司",
    checkByName: "陳添財",
    checkByTelephone: "(07)5570112",
    checkByTicketNumber: 1,
    checkFor: null,
    checkForNumber: null,
    checkForCompany: null,
    checkForName: null,
    checkForTelephone: null
  },
  {
    id: 2,
    number: "000004",
    company: "光*建設股份有限公司",
    name: "陳*華",
    title: "經理",
    telephone: "(07)5563122",
    address: "高雄市三民區1號",
    status: "uncheck",
    checkBy: null,
    checkFor: null
  },
  {
    id: 3,
    number: "000004",
    company: "光*建設股份有限公司",
    name: "陳*明",
    title: "經理",
    telephone: "(07)5563122",
    address: "高雄市三民區1號",
    status: "uncheck",
    checkBy: null,
    checkFor: null
  },
  {
    id: 4,
    number: "000005",
    company: "國*建設股份有限公司",
    name: "陳X財",
    title: "董事長",
    telephone: "(07)5570112",
    address: "高雄市三民區10號",
    status: "checked",
    checkBy: null,
    checkByCompany: null,
    checkByName: null,
    checkByTelephone: null,
    checkFor: 1,
    checkForNumber: "000004",
    checkForCompany: "AA建設股份有限公司",
    checkForName: "柯俊吉",
    checkForTelephone: "(07)5563122",
    checkForTicketNumber: 1
  },
  {
    id: 5,
    number: "000005",
    company: "國*建設股份有限公司",
    name: "陳*天",
    title: "經理",
    telephone: "(07)5570112",
    address: "高雄市三民區10號",
    status: "checked"
  },
  {
    id: 6,
    number: "000005",
    company: "國*建設股份有限公司",
    name: "劉*滑",
    title: "總裁",
    telephone: "(07)5570112",
    address: "高雄市三民區10號",
    status: "uncheck"
  },
  {
    id: 7,
    number: "000006",
    company: "華*聯開發股份有限公司",
    name: "陸*廷",
    title: "董事長",
    telephone: "(07)5570112",
    address: "高雄市三民區10號",
    status: "uncheck"
  },
  {
    id: 8,
    number: "000006",
    company: "華*聯開發股份有限公司",
    name: "吳*德",
    title: "總經理",
    telephone: "(07)5570112",
    address: "高雄市三民區10號",
    status: "uncheck"
  },
  {
    id: 9,
    number: "000006",
    company: "華*聯開發股份有限公司",
    name: "吳*辰",
    title: "經理",
    telephone: "(07)5570112",
    address: "高雄市三民區10號",
    status: "uncheck"
  },
  {
    id: 10,
    number: "000006",
    company: "華*聯開發股份有限公司",
    name: "鄭*華",
    title: "經理",
    telephone: "(07)5570112",
    address: "高雄市三民區10號",
    status: "uncheck"
  },
  {
    id: 11,
    number: "000006",
    company: "華*聯開發股份有限公司",
    name: "游*宏",
    title: "經理",
    telephone: "(07)5570112",
    address: "高雄市三民區10號",
    status: "uncheck"
  },
  {
    id: 12,
    number: "000006",
    company: "華*聯開發股份有限公司",
    name: "蔡*貞",
    title: "經理",
    telephone: "(07)5570112",
    address: "高雄市三民區10號",
    status: "uncheck"
  },
  {
    id: 13,
    number: "000007",
    company: "飛*建築股份有限公司",
    name: "陳*華",
    title: "經理",
    telephone: "(07)5570112",
    address: "高雄市三民區10號",
    status: "uncheck"
  },
  {
    id: 14,
    number: "000007",
    company: "飛*建築股份有限公司",
    name: "鄭*華",
    title: "特助",
    telephone: "(07)5570112",
    address: "高雄市三民區10號",
    status: "uncheck"
  }
];

const cancelCheckForHistory = [];

let ticketNumber = customers.reduce((acc, customer) => (acc += customer.checkFor ? 1 : 0), 0);

const mappingCustomersRelation = customerArray => {
  return customerArray
    .filter(c => !!c)
    .map(customer => {
      return mappingCustomer(customer);
    });
};

const mappingCustomer = customer => {
  let checkBy = {};
  if (customer.checkBy) {
    const checkByCustomer = customers.find(c => c.id === customer.checkBy);
    checkBy = {
      checkBy: checkByCustomer.id,
      checkByNumber: checkByCustomer.number,
      checkByCompany: checkByCustomer.company,
      checkByName: checkByCustomer.name,
      checkByTelephone: checkByCustomer.telephone
    };
  }

  let checkFor = {};
  if (customer.checkFor) {
    const checkForCustomer = customers.find(c => c.id === customer.checkFor);
    checkFor = {
      checkFor: checkForCustomer.id,
      checkForNumber: checkForCustomer.number,
      checkForCompany: checkForCustomer.company,
      checkForName: checkForCustomer.name,
      checkForTelephone: checkForCustomer.telephone
    };
  }

  return {
    ...customer,
    ...checkBy,
    ...checkFor
  };
};

export const activityMemberService = {
  statistics: async () => {
    try {
      const { data } = await ajax.get("/activity-members/statistic", { isWithToken: true });

      return data;

      // const totalCheckCount = customers.reduce(
      //   (acc, customer) => (acc += customer.status === "checked" ? 1 : 0),
      //   0
      // );

      // const totalUncheckCount = customers.reduce(
      //   (acc, customer) => (acc += customer.status === "uncheck" ? 1 : 0),
      //   0
      // );

      // const totalCheckForCount = customers.reduce(
      //   (acc, customer) => (acc += customer.checkFor ? 1 : 0),
      //   0
      // );

      // const totalSkipCheckForCount = cancelCheckForHistory.length;

      // // console.log(mappedCustomers);
      // return new Promise((resolve, reject) => {
      //   setTimeout(() => {
      //     resolve({
      //       totalCheckCount: totalCheckCount,
      //       totalUncheckCount: totalUncheckCount,
      //       totalCheckForCount: totalCheckForCount,
      //       totalSkipCheckForCount: totalSkipCheckForCount,
      //     });
      //   }, 500);
      // });
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
        delegate_seq_number: data.delegate_seq_number,
      };
    } catch (error) {
      return Promise.reject({ ...error, message: error.serverMessage });
    }
  },
  cancelCheck: async id => {
    try {
      const { message, data } = await ajax.put(
        `/activity-members/${id}/uncheck`,
        { cancel_delegate_for: true },
        { isWithToken: true }
      );

      return {
        message,
        currentMember: data.currentMember,
        newMembers: data.newMembers
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
        newMembers: data.newMembers
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
        newMembers: data.newMembers
      };

    } catch (error) {
      return Promise.reject({ ...error, message: error.serverMessage });
    }
  }
};
