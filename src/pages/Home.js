import React, { useState, useMemo, useEffect } from "react";
import { Divider, Box, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { activityMemberService } from "../services";
import { modalActions, maskActions } from "../actions";
import { useDispatch } from "react-redux";
import { useMutation } from "react-query";
import CheckModal, { CheckModalType } from "../components/CheckModal";
import { grey, red } from "@mui/material/colors";
import HomeForm from "../components/HomeForm";
import HomeSearchResult from "../components/HomeSearchResult";
import UncheckConfirmModal from "../components/UncheckConfirmModal";

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
        modalActions.show("Error", {
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

  const handleSuccess = response => {
    handleClose();
    onSuccess && onSuccess(response);
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

  const { mutate: search, isLoading: searchLoading } = useSearchActivityMembers(setMembers);

  useEffect(() => {
    // 重整時可載入上一次查詢結果
    if (localStorage.getItem("query-member-condition")) {
      let condition = localStorage.getItem("query-member-condition");
      if (condition) {
        condition = JSON.parse(condition);
        Object.keys(condition).forEach(key => form.setValue(key, condition[key]));
        setSearchCondition(condition);
        search(condition);
      }
    }
  }, []);

  const handleSearch = data => {
    setMembers([]);
    search(data);
    setSearchCondition(data);
    // 暫存上次查詢結果
    localStorage.setItem("query-member-condition", JSON.stringify(data));
  };

  const handleClearConditionForm = () => {
    localStorage.removeItem("query-member-condition");
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
  } = useCheckModal(({ message, delegate_seq_number }) => {
    searchReload();
    setTimeout(() => {
      dispatch(
        modalActions.show("SUCCESS", {
          content: (
            <Box>
              {message}
              {delegate_seq_number && (
                <Box>
                  （委託票領取號碼：
                  <Typography variant="h6" sx={{ display: "inline-block" }}>
                    {delegate_seq_number}
                  </Typography>
                  ）
                </Box>
              )}
            </Box>
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
      const {
        delegate_for_member_id,
        delegate_for_name,
        delegate_for_company_name,
        delegate_for_seq_number
      } = selectedMember;
      return (
        <Stack spacing={2}>
          <Box component="span" sx={{ fontWeight: 600, fontSize: "large" }}>
            {delegate_for_company_name} / {delegate_for_name}
          </Box>
          的委託出席確定要取消嗎?
          {delegate_for_member_id && (
            <Box sx={{ fontSize: "small", color: red[600] }}>
              (請務必確認已回收號碼牌
              <Box
                component="span"
                sx={{ color: grey[800], fontSize: "large", fontWeight: 600, mx: "3px" }}
              >
                {delegate_for_seq_number}
              </Box>
              號)
            </Box>
          )}
        </Stack>
      );
    }
  });

  const { mutate: uncheck } = useMutation(
    params => activityMemberService.cancelCheck(params.id, params.cancelDelegateFor),
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
          modalActions.show("Error", {
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
