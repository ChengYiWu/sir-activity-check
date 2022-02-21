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
  IconButton
} from "@mui/material";
import { useForm } from "react-hook-form";
import { debounce, groupBy } from "lodash";
import { activityMemberService } from "../services";
import { modalActions, maskActions } from "../actions";
import { useDispatch } from "react-redux";
import { useMutation } from "react-query";
import CustomerListItem from "../components/CustomerListItem";
import CheckModal from "../components/CheckModal";
import CheckForModal from "../components/CheckForModal";
import ConfirmDialog from "../components/ConfirmDialog";
import { grey, red } from "@mui/material/colors";
import { Close, Info } from "@mui/icons-material";

const useCancelCheck = ({
  service,
  onSuccess,
  customers = [],
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
    const currentCustomer = customers.find(customer => customer.id === id);

    dispatch(
      modalActions.show("CONFIRM", {
        title: confirmTitle ? confirmTitle(currentCustomer) : undefined,
        content: confirmContent ? confirmContent(currentCustomer) : undefined,
        onOk: () => {
          dispatch(maskActions.toggleMask(true));
          mutation.mutate(currentCustomer.id);
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

const Home = () => {
  const dispatch = useDispatch();
  const { getValues, register, errors, reset } = useForm({
    defaultValues: {
      keyword: ""
    }
  });

  const [customers, setCustomers] = useState([]);

  const {
    mutate: getStatistics,
    isLoading: getStatisticsLoading,
    data: statistics
  } = useMutation(() => activityMemberService.statistics());

  useEffect(() => {
    getStatistics();
  }, []);

  const {
    mutate: search,
    isLoading,
    data,
    isError,
    error
  } = useMutation(keyword => activityMemberService.search(keyword), {
    onSuccess(data) {
      setCustomers(data.customers);
    }
  });

  const customersByCompany = useMemo(() => groupBy(customers, "number"), [customers]);

  let handleKeywordChange = e => {
    const keyword = getValues("keyword");

    if (keyword?.length >= 3) {
      search(keyword);
      setCustomers([]);
      getStatistics();
    }
  };
  handleKeywordChange = debounce(handleKeywordChange, 500);

  const updateCustomers = newCustomers => {
    getStatistics();
    const newCustomersMap = groupBy(newCustomers, "id");
    setCustomers(customers => {
      return customers.map(customer => {
        const newCustomer = newCustomersMap[customer.id] || [];
        return {
          ...customer,
          ...(newCustomer.length > 0 ? newCustomer[0] : {})
        };
      });
    });
  };

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
    handleCloseModal();
    // handleKeywordChange();
    updateCustomers(response.newCustomers);
    setTimeout(() => {
      dispatch(
        modalActions.show("SUCCESS", {
          content: (
            <Box>
              {response.message}
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

  const handleSuccessCheckForModal = response => {
    handleCloseCheckForModal();
    // handleKeywordChange();
    updateCustomers(response.newCustomers);
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
    customers: customers,
    onSuccess: response => {
      // handleKeywordChange();
      updateCustomers(response.newCustomers);
    },
    confirmTitle: () => "取消代理出席",
    confirmContent: selectedCustomer => {
      const { checkFor, checkForName, checkForCompany, checkForTicketNumber } = selectedCustomer;
      return (
        <Stack spacing={2}>
          <Box component="span" sx={{ fontWeight: 600, fontSize: "large" }}>
            {checkForCompany} / {checkForName}
          </Box>
          的委託出席確定要取消嗎?
          {checkFor && (
            <Box sx={{ fontSize: "small", color: red[600] }}>
              (請務必確認已回收號碼牌
              <Box
                component="span"
                sx={{ color: grey[800], fontSize: "large", fontWeight: 600, mx: "3px" }}
              >
                {checkForTicketNumber}
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
    customers: customers,
    onSuccess: response => {
      // handleKeywordChange();
      updateCustomers(response.newCustomers);
    },
    confirmTitle: () => "取消報到",
    confirmContent: selectedCustomer => {
      const { name, company, checkFor, checkForName, checkForTicketNumber } = selectedCustomer;
      return (
        <Stack spacing={2}>
          <Box component="span" sx={{ fontWeight: 600, fontSize: "large" }}>
            {company} / {name}
          </Box>
          的報到紀錄確定要取消嗎?
          {checkFor && (
            <Box sx={{ fontSize: "small", color: red[600] }}>
              (
              <Box component="span" sx={{ color: grey[800], fontWeight: 600, mx: "3px" }}>
                {checkForName}
              </Box>
              的委託出席將會被一併取消，請回收
              <Box
                component="span"
                sx={{ color: grey[800], fontSize: "large", fontWeight: 600, mx: "3px" }}
              >
                {checkForTicketNumber}
              </Box>{" "}
              號號碼牌)
            </Box>
          )}
        </Stack>
      );
    }
  });

  const totalCheckCount = statistics?.totalCheckCount || 0;
  const totalCustomerCount = totalCheckCount + (statistics?.totalUncheckCount || 0);
  const totalCheckForCount = statistics?.totalCheckForCount || 0;
  const totalSkipCheckForCount = statistics?.totalSkipCheckForCount || 0;
  const checkForLimit = Math.floor(totalCheckCount / 2);
  const avaliableCheckForTicketNumber =
    Math.min(totalCheckForCount, checkForLimit) + totalSkipCheckForCount;

  const handleOpenAvaliableInfo = () => {
    dispatch(
      modalActions.show("INFO", {
        title: "說明",
        content: (
          <div>
            有效委託投票數不得超過本人投票數的
            <Box component="span" sx={{ fontSize: 26, color: red[600], mx: "6px" }}>
              1/2
            </Box>
            。
          </div>
        )
      })
    );
  };

  return (
    <>
      <Box sx={{ mt: 1 }}>
        <Box sx={{ mb: 2 }}>
          會員數 {totalCustomerCount} 位 / 報到 {totalCheckCount} 位 / 委託出席 {totalCheckForCount}{" "}
          人
          <Typography
            variant="caption"
            component="div"
            sx={{ color: grey[600] }}
            onClick={handleOpenAvaliableInfo}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
              <Info sx={{ fontSize: 14, mr: "3px" }} />
              <Box component="span">
                有效委託投票數
                <Box component="span" sx={{ color: grey[800], fontSize: "large", mx: "3px" }}>
                  {checkForLimit}
                </Box>
                位
                {checkForLimit > 0 && (
                  <span>
                    ，領取號碼為
                    <Box component="span" sx={{ color: grey[800], fontSize: "large", mx: "3px" }}>
                      {avaliableCheckForTicketNumber}
                    </Box>
                    號（含）以前。
                  </span>
                )}
              </Box>
            </Box>
          </Typography>
        </Box>
        <TextField
          fullWidth
          focused
          inputRef={register}
          name="keyword"
          label="證號"
          inputProps={{
            type: "number"
          }}
          error={!!errors.keyword}
          helperText={errors.keyword?.message || "請至少輸入 3 碼數字"}
          size="small"
          onKeyPress={e => {
            if (isNaN(Number(e.key))) {
              e.preventDefault();
            }
          }}
          onChange={handleKeywordChange}
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
        <Divider sx={{ my: 1 }}>搜尋結果</Divider>
        {customers?.length > 0 && (
          <List
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              position: "relative",
              // overflow: "auto",
              // maxHeight: "calc(100vh - 200px - 90px)",
              "& ul": { padding: 0 }
            }}
            subheader={<li />}
          >
            {Object.keys(customersByCompany).map(companyNumber => {
              const customers = customersByCompany[companyNumber];
              const { number, company } = customers[0];
              return (
                <li key={`section-${number}`}>
                  <ul>
                    <ListSubheader sx={{ top: "56px" }}>
                      {number} - {company}
                    </ListSubheader>
                    {customers.map(customer => (
                      <ListItem key={`${customer.id}`}>
                        <CustomerListItem
                          customer={customer}
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
        {isLoading && (
          <Box sx={{ mt: 3 }}>
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
          </Box>
        )}
        {!isLoading && customers?.length <= 0 && (
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
