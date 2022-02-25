import React, { useState, useMemo, useEffect } from "react";
import { Divider, Box, Stack, Typography, Alert, AlertTitle } from "@mui/material";
import { useForm } from "react-hook-form";
import { activityMemberService } from "../services";
import { modalActions, maskActions } from "../actions";
import { useDispatch } from "react-redux";
import { useMutation } from "react-query";
import CheckModal, { CheckModalType } from "../components/CheckModal";
import { grey, red, green } from "@mui/material/colors";
import HomeForm from "../components/HomeForm";
import HomeSearchResult from "../components/HomeSearchResult";
import UncheckConfirmModal from "../components/UncheckConfirmModal";
import { queryConditionCache } from "../utils";
import { MemberDelegateForChip } from "../components/MemberDelegateChip";

const useCancelCheck = ({
  service,
  onSuccess,
  members = [],
  confirmTitle,
  confirmContent,
  successTitle,
  successContent
}) => {
  const dispatch = useDispatch();
  const mutation = useMutation(service, {
    onSuccess(data) {
      onSuccess && onSuccess(data);
      dispatch(
        modalActions.show("SUCCESS", {
          title: successTitle ? successTitle(data) : "操作成功",
          content: successContent ? successContent(data) : data.message
        })
      );
    },
    onError(error) {
      dispatch(
        modalActions.show("ERROR", {
          content: error.message
        })
      );
    },
    onSettled() {
      dispatch(maskActions.toggleMask(false));
    }
  });

  const hideModal = () => {
    dispatch(modalActions.hide());
  };

  const handleOpen = id => {
    const currentMember = members.find(member => member.id === id);

    dispatch(
      modalActions.show("CONFIRM", {
        title: confirmTitle ? confirmTitle(currentMember) : undefined,
        content: confirmContent ? confirmContent(currentMember) : undefined,
        onOk: () => {
          dispatch(maskActions.toggleMask(true));
          mutation.mutate(currentMember.id);
          hideModal();
        },
        onCancel: hideModal,
        onClose: hideModal
      })
    );
  };

  return {
    onOpen: handleOpen
  };
};

const useSearchActivityMembers = setMembers => {
  const mutate = useMutation(params => activityMemberService.search(params), {
    onSuccess(data, params) {
      setMembers(data.items);
    }
  });

  const data = useMemo(() => {
    return mutate.data?.items;
  }, [mutate.data]);

  return {
    ...mutate,
    data: data
  };
};

const useCheckModal = onSuccess => {
  const [modal, setModal] = useState({ id: null, open: false, type: CheckModalType.CHECKIN });

  const openCheckinModal = id => {
    setModal({ id: id, open: true, type: CheckModalType.CHECKIN });
  };

  const openDelegateForModal = id => {
    setModal({ id: id, open: true, type: CheckModalType.DELEGATE });
  };

  const handleClose = () => {
    setModal({ id: null, open: false, type: CheckModalType.CHECKIN });
  };

  const handleSuccess = function () {
    handleClose();
    onSuccess && onSuccess.apply(this, arguments);
  };

  return {
    modalProps: {
      ...modal,
      onClose: handleClose,
      onSuccess: handleSuccess
    },
    handleClose,
    handleSuccess,
    openCheckinModal,
    openDelegateForModal
  };
};

const Home = ({ getStatistics }) => {
  const dispatch = useDispatch();

  const form = useForm({
    defaultValues: {
      field: "license",
      keyword: null
    }
  });

  const [searchCondition, setSearchCondition] = useState(null);
  const [members, setMembers] = useState([]);

  const {
    mutate: search,
    isLoading: searchLoading,
    isError: searchIsError,
    error: searchError
  } = useSearchActivityMembers(setMembers);

  useEffect(() => {
    // 重整時可載入上一次查詢結果
    let condition = queryConditionCache.get();
    if (condition) {
      Object.keys(condition).forEach(key => form.setValue(key, condition[key]));
      setSearchCondition(condition);
      search(condition);
    }
  }, []);

  const handleSearch = data => {
    setMembers([]);
    search(data);
    setSearchCondition(data);
    // 暫存上次查詢結果
    queryConditionCache.set(data);
  };

  const handleClearConditionForm = () => {
    queryConditionCache.clear();
    setMembers([]);
    setSearchCondition(null);
  };

  const searchReload = () => {
    getStatistics();
    search(searchCondition);
  };

  const {
    modalProps: checkModalProps,
    openCheckinModal,
    openDelegateForModal
  } = useCheckModal(({ member }, type, isUpdatedDelegateFor) => {
    searchReload();
    setTimeout(() => {
      const isCheckin = type === "checkin";
      const { license_number, name } = member;
      dispatch(
        modalActions.show("SUCCESS", {
          title: isCheckin
            ? `本人報到${isUpdatedDelegateFor ? "及代理出席" : ""}成功`
            : "代理出席成功",
          content: (
            <Stack spacing={2}>
              <Box>
                【
                <Box component="span" sx={{ color: grey[400], mx: "3px", fontSize: "18px" }}>
                  {license_number}
                </Box>
                <Box
                  component="span"
                  sx={{ color: green[700], fontSize: "20px", fontWeight: 600, mr: "3px" }}
                >
                  {name}
                </Box>
                】{isCheckin && "本人報到成功"}
              </Box>
              {isUpdatedDelegateFor && (
                <>
                  <Divider>代理出席</Divider>
                  <MemberDelegateForChip member={member} />
                </>
              )}
            </Stack>
          )
        })
      );
    }, 100);
  });

  const { onOpen: onCancelCheckForOpen } = useCancelCheck({
    service: id => activityMemberService.cancelCheckFor(id),
    members: members,
    onSuccess: () => {
      searchReload();
    },
    confirmTitle: () => "取消代理出席",
    confirmContent: selectedMember => {
      const { license_number, name } = selectedMember;
      return (
        <Stack spacing={2}>
          <Box component="span">
            確定取消【
            <Box component="span" sx={{ color: grey[400], mx: "3px", fontSize: "18px" }}>
              {license_number}
            </Box>
            <Box
              component="span"
              sx={{ color: green[700], fontSize: "20px", fontWeight: 600, mr: "3px" }}
            >
              {name}
            </Box>
            】 的代理出席嗎？
          </Box>
          <MemberDelegateForChip member={selectedMember} />
        </Stack>
      );
    }
  });

  const { mutate: uncheck } = useMutation(
    params => activityMemberService.uncheck(params.id, params.cancelDelegateFor),
    {
      onSuccess(data) {
        dispatch(
          modalActions.show("SUCCESS", {
            title: "操作成功",
            content: data.message
          })
        );
        searchReload();
      },
      onError(error) {
        dispatch(
          modalActions.show("ERROR", {
            content: error.message
          })
        );
      },
      onSettled() {
        dispatch(maskActions.toggleMask(false));
      }
    }
  );

  const [uncheckModal, setUncheckModal] = useState({ open: false, member: null });

  const handleCancelCheck = id => {
    const member = members.find(member => member.id === id);
    setUncheckModal({ open: true, member: member });
  };

  const handleCloseUncheckModal = () => {
    setUncheckModal({ open: false, member: null });
  };

  const handleUncheck = (member, isCancelDelegateFor) => {
    dispatch(maskActions.toggleMask(true));
    uncheck({ id: member.id, cancelDelegateFor: isCancelDelegateFor });
    handleCloseUncheckModal();
  };

  return (
    <>
      <Box sx={{ mt: 1 }}>
        {searchIsError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <AlertTitle>錯誤</AlertTitle>
            {searchError.message}
          </Alert>
        )}
        <HomeForm form={form} onSearch={handleSearch} onClear={handleClearConditionForm} />
        <Divider sx={{ my: 1 }}>
          搜尋結果
          {members?.length > 0 && (
            <Box component="span" sx={{ fontSize: "small", color: grey[600] }}>
              （共
              <Box component="span" sx={{ mx: "3px", fontSize: "16px" }}>
                {members.length}
              </Box>
              筆）
            </Box>
          )}
        </Divider>
        <HomeSearchResult
          members={members}
          loading={searchLoading}
          onCheck={openCheckinModal}
          onCancelCheck={handleCancelCheck}
          onCheckFor={openDelegateForModal}
          onCancelCheckFor={onCancelCheckForOpen}
        />
      </Box>
      <CheckModal {...checkModalProps} />
      <UncheckConfirmModal
        open={uncheckModal.open}
        member={uncheckModal.member}
        onOk={handleUncheck}
        onCancel={handleCloseUncheckModal}
      />
    </>
  );
};

export default Home;
