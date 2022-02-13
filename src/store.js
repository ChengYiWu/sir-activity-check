import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/index";
import { secureStroge, storgeKeys } from "./utils";
import { composeWithDevTools } from "redux-devtools-extension";

const loadState = () => {
  try {
    const serializedUserAuth = secureStroge.get(storgeKeys.userAuth);
    if (serializedUserAuth === null) {
      return undefined;
    }
    return { auth: JSON.parse(serializedUserAuth) };
  } catch (err) {
    return undefined;
  }
};

// 使用 reducer 函數，建立 Store 實例，Store 會將改變狀態邏輯委託給 reducer 實作
const store = createStore(
  rootReducer,
  loadState(),
  // Debug 工具，方便除錯與掌握 store 資料狀況
  composeWithDevTools(
    // 將 middleware 依序傳遞進 applyMiddleware, ex: applyMiddleware(middleware1, middleware2, ...)
    // 將回傳的 enhancer 函數傳遞給 createStore
    applyMiddleware(thunk)
  )
);

let preUserAuth;
store.subscribe(() => {
  const { auth } = store.getState();
  if (preUserAuth !== auth) {
    secureStroge.set(storgeKeys.userAuth, JSON.stringify(auth));
    preUserAuth = auth;
  }
});

export default store;