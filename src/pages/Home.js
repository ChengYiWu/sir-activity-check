import React, { useState, useMemo, useEffect } from "react";
import {
  Divider,
  List,
  ListItem,
  ListSubheader,
  TextField,
  Box,
  Skeleton,
  Stack,
  Typography,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Button
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { debounce, groupBy } from "lodash";
import { activityMemberService } from "../services";
import { modalActions, maskActions } from "../actions";
import { useDispatch } from "react-redux";
import { useMutation, useQuery } from "react-query";
import MemberListItem from "../components/MemberListItem";
import MemberListItemSkeleton from "../components/MemberListItemSkeleton";
import CheckModal from "../components/CheckModal";
import CheckForModal from "../components/CheckForModal";
import ConfirmDialog from "../components/ConfirmDialog";
import StatisticsArea from "../components/StatisticsArea";
import { grey, red } from "@mui/material/colors";
import { Close, Info } from "@mui/icons-material";
import HomeForm from "../components/HomeForm";

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

const useGetStatistics = () => {
  return useMutation(params => activityMemberService.statistics());
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

const Home = () => {
  const dispatch = useDispatch();

  const form = useForm({
    defaultValues: {
      field: "license",
      keyword: ""
    }
  });

  const { getValues, register, errors, reset, watch, control } = form;

  const [members, setMembers] = useState([]);

  const {
    data: statistics,
    mutate: getStatistics,
    isLoading: getStatisticsLoading
  } = useGetStatistics();

  useEffect(() => {
    getStatistics();
  }, [getStatistics]);

  const filter = watch();
  console.log("filter", filter);

  const { mutate: search, isLoading: searchLoading } = useSearchActivityMembers(setMembers);

  const refetchTest = () => {
    search();
  };

  const reloadTest = () => {
    setMembers([]);
    search({ ...getValues() });
  };

  const reloadBackground = () => {
    search({ ...getValues() });
  };

  const membersByCompany = useMemo(() => groupBy(members, "license_number"), [members]);

  const [modal, setModal] = useState({ id: null, open: false });
  const handleCloseModal = () => {
    setModal({
      id: null,
      open: false
    });
  };

  const [checkForModal, setCheckForModal] = useState({ id: null, open: false });
  const handleCloseCheckForModal = () => {
    setCheckForModal({
      id: null,
      open: false
    });
  };

  const handleSuccessModal = response => {
    const { delegate_seq_number, message } = response;
    handleCloseModal();
    reloadBackground();
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
  };

  const handleSuccessCheckForModal = response => {
    handleCloseCheckForModal();
    reloadBackground();
    setTimeout(() => {
      dispatch(
        modalActions.show("SUCCESS", {
          content: (
            <Box>
              委託成功
              {response.ticketNumber && (
                <Box>
                  （委託票領取號碼：
                  <Typography variant="h6" sx={{ display: "inline-block" }}>
                    {response.ticketNumber}
                  </Typography>
                  ）
                </Box>
              )}
            </Box>
          )
        })
      );
    }, 100);
  };

  const handleCheck = id => {
    setModal({
      id,
      open: true
    });
  };

  const handleCheckFor = id => {
    setCheckForModal({
      id,
      open: true
    });
  };

  const { onOpen: onCancelCheckForOpen } = useCancelCheck({
    service: id => activityMemberService.cancelCheckFor(id),
    members: members,
    onSuccess: () => {
      reloadBackground();
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

  const { onOpen: onCancelCheckOpen } = useCancelCheck({
    service: id => activityMemberService.cancelCheck(id),
    members: members,
    onSuccess: () => {
      reloadBackground();
    },
    confirmTitle: () => "取消報到",
    confirmContent: selectedMember => {
      const {
        name,
        company_name,
        delagate_for_member_id,
        delegate_for_name,
        delegate_for_seq_number
      } = selectedMember;
      return (
        <Stack spacing={2}>
          <Box component="span" sx={{ fontWeight: 600, fontSize: "large" }}>
            {company_name} / {name}
          </Box>
          的報到紀錄確定要取消嗎?
          {delagate_for_member_id && (
            <Box sx={{ fontSize: "small", color: red[600] }}>
              (
              <Box component="span" sx={{ color: grey[800], fontWeight: 600, mx: "3px" }}>
                {delegate_for_name}
              </Box>
              的委託出席將會被一併取消，請回收
              <Box
                component="span"
                sx={{ color: grey[800], fontSize: "large", fontWeight: 600, mx: "3px" }}
              >
                {delegate_for_seq_number}
              </Box>{" "}
              號號碼牌)
            </Box>
          )}
        </Stack>
      );
    }
  });

  return (
    <>
      <Box sx={{ mt: 1 }}>
        <StatisticsArea statistics={statistics} loading={getStatisticsLoading} />
        {/* <HomeForm form={form} onSearch={reloadTest} /> */}
        <FormControl size="small" sx={{ mb: 1 }} fullWidth>
          <InputLabel id="field-select-label">搜尋欄位</InputLabel>
          <Controller
            name="field"
            control={control}
            as={
              <Select id="field-select" labelId="field-select-label" label="搜尋欄位">
                <MenuItem value="license">公司編號</MenuItem>
                <MenuItem value="name">姓名</MenuItem>
                <MenuItem value="company">公司名稱</MenuItem>
              </Select>
            }
          />
        </FormControl>
        <TextField
          fullWidth
          focused
          inputRef={register}
          name="keyword"
          label="關鍵字"
          error={!!errors.keyword}
          sx={{ mb: 1 }}
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => reset()} edge="end">
                  <Close />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button fullWidth variant="contained" color="error" onClick={refetchTest}>
              清除
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button fullWidth variant="contained" color="primary" onClick={reloadTest}>
              送出
            </Button>
          </Grid>
        </Grid>
        <Divider sx={{ my: 1 }}>搜尋結果</Divider>
        {members?.length > 0 && (
          <List
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              position: "relative",
              "& ul": { padding: 0 }
            }}
            subheader={<li />}
          >
            {Object.keys(membersByCompany).map(companyNumber => {
              const members = membersByCompany[companyNumber];
              const { license_number, company_name } = members[0];
              return (
                <li key={`section-${license_number}`}>
                  <ul>
                    <ListSubheader sx={{ top: "56px" }}>
                      {license_number} - {company_name}
                    </ListSubheader>
                    {members.map(member => (
                      <ListItem key={`${member.id}`}>
                        <MemberListItem
                          member={member}
                          onCheck={handleCheck}
                          onCancelCheckFor={onCancelCheckForOpen}
                          onCancelCheck={onCancelCheckOpen}
                          onCheckFor={handleCheckFor}
                        />
                      </ListItem>
                    ))}
                  </ul>
                </li>
              );
            })}
          </List>
        )}
        {searchLoading && (
          <Box sx={{ mt: 3 }}>
            {Array.from({ length: 5 }).map((_, index) => (
              <MemberListItemSkeleton key={index} sx={{ mb: 1 }} />
            ))}
          </Box>
        )}
        {!searchLoading && members?.length <= 0 && (
          <Box
            sx={{ display: "block", textAlign: "center", color: grey[600], fontStyle: "italic" }}
          >
            無任何資料
          </Box>
        )}
      </Box>
      <CheckModal
        open={modal.open}
        id={modal.id}
        onClose={handleCloseModal}
        onSuccess={handleSuccessModal}
      />
      <CheckForModal
        open={checkForModal.open}
        id={checkForModal.id}
        onClose={handleCloseCheckForModal}
        onSuccess={handleSuccessCheckForModal}
      />
    </>
  );
};

export default Home;
