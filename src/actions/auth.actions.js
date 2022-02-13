import { authConstants } from "../constants";
import { authService } from "../services";
import { history } from "../utils";

export const authActions = {
  /**
   * 登入成功
   *
   * @param {object} userInfo
   */
  login(userInfo) {
    return {
      type: authConstants.LOGIN_SUCCESS,
      userInfo
    };
  },
  /**
   * 登出成功
   */
  logout() {
    return {
      type: authConstants.LOGOUT_SUCCESS
    };
  }
  /**
   * 更新登入資訊
   */
  // refresh() {
  //   return async (dispatch, getState) => {
  //     const {
  //       auth: { userInfo, selectedConstruction }
  //     } = getState();

  //     if (userInfo) {
  //       try {
  //         dispatch(maskActions.toggleMask(true));
  //         const newestUserInfo = await authService.check(userInfo.uuid);

  //         // 檢查是否已不再負責先前所選取的建案
  //         let newSelectedConstruction = null;
  //         if (
  //           newestUserInfo.constructions_sales_roles.some(
  //             c => c.construction_uuid === selectedConstruction
  //           )
  //         ) {
  //           newSelectedConstruction = selectedConstruction;
  //         }
  //         dispatch({
  //           type: authConstants.LOGIN_SUCCESS,
  //           userInfo: newestUserInfo,
  //           selectedConstruction: newSelectedConstruction
  //         });

  //         // 若已不再負責先前所選擇的建案，則須重新回登入頁選擇建案
  //         if (!newSelectedConstruction) {
  //           history.push(router.getPath("Admin.Login"));
  //         }
  //       } catch (error) {
  //         dispatch({
  //           type: authConstants.LOGING_FAILURE
  //         });
  //         dispatch(
  //           modalActions.show("ERROR", {
  //             content: error.message,
  //             onOk: () => {
  //               dispatch(authActions.logout());
  //             }
  //           })
  //         );
  //       } finally {
  //         dispatch(maskActions.toggleMask(false));
  //       }
  //     } else {
  //       dispatch({
  //         type: authConstants.LOGING_FAILURE
  //       });
  //     }
  //   };
  // }
};
