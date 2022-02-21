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
  },
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
      const totalCheckCount = customers.reduce(
        (acc, customer) => (acc += customer.status === "checked" ? 1 : 0),
        0
      );

      const totalUncheckCount = customers.reduce(
        (acc, customer) => (acc += customer.status === "uncheck" ? 1 : 0),
        0
      );

      const totalCheckForCount = customers.reduce(
        (acc, customer) => (acc += customer.checkFor ? 1 : 0),
        0
      );

      const totalSkipCheckForCount = cancelCheckForHistory.length;

      // console.log(mappedCustomers);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({
            totalCheckCount: totalCheckCount,
            totalUncheckCount: totalUncheckCount,
            totalCheckForCount: totalCheckForCount,
            totalSkipCheckForCount: totalSkipCheckForCount,
          });
        }, 500);
      });
    } catch (error) {
      return Promise.reject({ ...error, message: error.serverMessage });
    }
  },
  /**
   * 搜尋客戶資料
   *
   * @param {string} keyword - The keyword of search.
   */
  search: async keyword => {
    try {
      const mappedCustomers = customers
        .filter(customer => customer.number.includes(keyword))
        .map(customer => {
          return mappingCustomer(customer);
          // let checkBy = {};
          // if (customer.checkBy) {
          //   const checkByCustomer = customers.find(c => c.id === customer.checkBy);
          //   checkBy = {
          //     checkBy: checkByCustomer.id,
          //     checkByNumber: checkByCustomer.number,
          //     checkByCompany: checkByCustomer.company,
          //     checkByName: checkByCustomer.name,
          //     checkByTelephone: checkByCustomer.telephone
          //   };
          // }

          // let checkFor = {};
          // if (customer.checkFor) {
          //   const checkForCustomer = customers.find(c => c.id === customer.checkFor);
          //   checkFor = {
          //     checkFor: checkForCustomer.id,
          //     checkForNumber: checkForCustomer.number,
          //     checkForCompany: checkForCustomer.company,
          //     checkForName: checkForCustomer.name,
          //     checkForTelephone: checkForCustomer.telephone
          //   };
          // }

          // return {
          //   ...customer,
          //   ...checkBy,
          //   ...checkFor
          // };
        });

      const totalCheckCount = customers.reduce(
        (acc, customer) => (acc += customer.status === "checked" ? 1 : 0),
        0
      );

      const totalUncheckCount = customers.reduce(
        (acc, customer) => (acc += customer.status === "uncheck" ? 1 : 0),
        0
      );

      const totalCheckForCount = customers.reduce(
        (acc, customer) => (acc += customer.checkFor ? 1 : 0),
        0
      );

      const totalSkipCheckForCount = cancelCheckForHistory.length;

      // console.log(mappedCustomers);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({
            totalCheckCount: totalCheckCount,
            totalUncheckCount: totalUncheckCount,
            totalCheckForCount: totalCheckForCount,
            totalSkipCheckForCount: totalSkipCheckForCount,
            customers: mappedCustomers
          });
        }, 500);
      });

      // const response = await ajax.post("customers", {
      //   keyword
      // });

      // return response.data;
    } catch (error) {
      return Promise.reject({ ...error, message: error.serverMessage });
    }
  },
  get: async id => {
    try {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(customers.find(customer => customer.id === id));
        }, 500);
      });
      // return new Promise((resolve, reject) => {
      //   setTimeout(() => {
      //     reject({ message: "讀取失敗" });
      //   }, 500);
      // });

      // const response = await ajax.post("customers", {
      //   keyword
      // });

      // return response.data;
    } catch (error) {
      return Promise.reject({ ...error, message: error.serverMessage });
    }
  },
  check: async (id, checkForId) => {
    try {
      const customer = customers.find(customer => customer.id === id);
      customer.status = "checked";
      customer.checkFor = checkForId || null;

      let checkByCustomer = null;
      let ticket = null;
      if (checkForId) {
        ticket = ++ticketNumber;
        checkByCustomer = customers.find(customer => customer.id === checkForId);
        checkByCustomer.checkBy = id;
        checkByCustomer.checkByTicketNumber = ticket;
        customer.checkForTicketNumber = ticket;
      }

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({
            ticketNumber: ticket,
            customer,
            checkByCustomer,
            message: "報到成功",
            newCustomers: mappingCustomersRelation([customer, checkByCustomer])
          });
        }, 500);
      });

      // return new Promise((resolve, reject) => {
      //   setTimeout(() => {
      //     reject({ message: "讀取失敗" });
      //   }, 500);
      // });

      // const response = await ajax.post("customers", {
      //   keyword
      // });

      // return response.data;
    } catch (error) {
      return Promise.reject({ ...error, message: error.serverMessage });
    }
  },
  cancelCheck: async id => {
    try {
      const customer = customers.find(customer => customer.id === id);
      customer.status = "uncheck";
      customer.checkForTicketNumber = null;

      let checkForCustomer = null;
      if (customer.checkFor) {
        checkForCustomer = customers.find(c => c.id === customer.checkFor);
        checkForCustomer.checkBy = null;
        checkForCustomer.status = "uncheck";

        cancelCheckForHistory.push(checkForCustomer.checkByTicketNumber);
        checkForCustomer.checkByTicketNumber = null;
      }

      customer.checkFor = null;

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({
            customer,
            checkForCustomer,
            message: "取消出席成功",
            newCustomers: mappingCustomersRelation([customer, checkForCustomer])
          });
        }, 500);
      });

      // return new Promise((resolve, reject) => {
      //   setTimeout(() => {
      //     reject({ message: "讀取失敗" });
      //   }, 500);
      // });

      // const response = await ajax.post("customers", {
      //   keyword
      // });

      // return response.data;
    } catch (error) {
      return Promise.reject({ ...error, message: error.serverMessage });
    }
  },
  cancelCheckFor: async id => {
    try {
      const customer = customers.find(customer => customer.id === id);

      let checkForCustomer = null;
      if (customer.checkFor) {
        checkForCustomer = customers.find(c => c.id === customer.checkFor);
        checkForCustomer.checkBy = null;
        checkForCustomer.status = "uncheck";

        cancelCheckForHistory.push(checkForCustomer.checkByTicketNumber);
        checkForCustomer.checkByTicketNumber = null;
      }

      customer.checkForTicketNumber = null;
      customer.checkFor = null;

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({
            customer,
            checkForCustomer,
            message: "取消代理出席成功",
            newCustomers: mappingCustomersRelation([customer, checkForCustomer])
          });
        }, 500);
      });
    } catch (error) {
      return Promise.reject({ ...error, message: error.serverMessage });
    }
  }
};
