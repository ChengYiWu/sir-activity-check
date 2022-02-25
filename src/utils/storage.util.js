import SecureLS from "secure-ls";

/**
 * Storage Keys.
 */
const storgeKeys = {
  // 使用者記住帳密
  userRemember: "hylActivityCheck.userRemember",
  // 使用者登入憑證
  userCredential: "hylActivityCheck.userCredential",
  // 使用者資料
  userAuth: "hylActivityCheck.userAuth"
};

/**
 * Secure LocalStorage.
 * @description https://varunmalhotra.xyz/secure-ls/
 */
const secureStroge = new SecureLS({
  encodingType: "des",
  isCompression: false,
  encryptionSecret: "i-love-hyl-activity-check"
});

const storeQueryCondition = data => {
  localStorage.setItem("query-member-condition", JSON.stringify(data));
};

const getQueryCondition = () => {
  const condition = localStorage.getItem("query-member-condition");
  return condition ? JSON.parse(condition) : null;
};

const removeQueryCondition = () => {
  localStorage.removeItem("query-member-condition");
};

const queryConditionCache = {
  set: storeQueryCondition,
  get: getQueryCondition,
  clear: removeQueryCondition
};

export { secureStroge, storgeKeys, queryConditionCache };
