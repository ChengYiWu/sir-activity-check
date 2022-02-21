import React, { useState, useEffect } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Slide,
  Alert,
  AlertTitle,
  Skeleton,
  TextField,
  FormControlLabel,
  Switch,
  Grid,
  DialogTitle,
  Divider,
  List,
  ListItem,
  Card,
  CardContent
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Close } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { customerService } from "../services";
import { useMutation } from "react-query";
import { debounce } from "lodash";
import { grey } from "@mui/material/colors";
import CustomerCardHeader from "./CustomerCardHeader";

const Label = ({ children }) => {
  return (
    <Box
      component="span"
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        height: "100%",
        alignItems: "center",
        fontSize: "14px",
        color: grey[600]
      }}
    >
      {children}
    </Box>
  );
};

const Text = ({ children }) => {
  return <Typography variant="h6">{children}</Typography>;
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CheckForModal = ({ open, id, onClose, onSuccess }) => {
  const {
    mutate: getCustomer,
    isLoading: customerIsLoading,
    data: customerData,
    isError: customerIsError,
    error: customerError
  } = useMutation(id => customerService.get(id));

  const {
    mutate: getCustomers,
    reset: resetGetCustomers,
    isLoading: customersIsLoading,
    data: customersData,
    isError: customersIsError,
    error: customersError
  } = useMutation(keyword => customerService.search(keyword));

  const {
    mutate: check,
    isLoading: checkIsLoading,
    data: checkData,
    isError: checkIsError,
    error: checkError
  } = useMutation(
    ({ id, checkForId }) => {
      return customerService.check(id, checkForId);
    },
    {
      onSuccess(response) {
        onSuccess(response);
      }
    }
  );

  const { handleSubmit, getValues, register, errors, control, watch, setValue, reset } = useForm({
    defaultValues: {
      keyword: null,
      checkForCustomer: null,
      checkFor: true
    }
  });

  const isCheckFor = watch("checkFor");

  useEffect(() => {
    if (open && id) {
      getCustomer(id);
    }
  }, [id, open, getCustomer]);

  let handleKeywordChange = e => {
    const keyword = getValues("keyword");
    if (keyword?.length >= 3) {
      getCustomers(keyword);
    }
  };
  handleKeywordChange = debounce(handleKeywordChange, 500);

  const handleCheck = data => {
    console.log(data);
    check({
      id,
      checkForId: data.checkFor ? data.checkForCustomer.id : null
    });
  };

  register("checkForCustomer", null);
  const checkForCustomer = watch("checkForCustomer");

  const handleSelectCheckFor = checkForCustomer => {
    setValue("checkForCustomer", checkForCustomer, { shouldValidate: true });
    handleCloseCheckForModal();
  };
  const [checkForModal, setCheckForModal] = useState(false);
  const handleCloseCheckForModal = () => {
    setCheckForModal(false);
  };
  const handleCheckForClick = () => {
    setCheckForModal(true);
  };

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset, resetGetCustomers]);

  useEffect(() => {
    if (checkForModal) {
      resetGetCustomers();
    }
  }, [checkForModal, resetGetCustomers]);

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      scroll={"paper"}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
            <Close />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            委託出席操作
          </Typography>
        </Toolbar>
      </AppBar>
      <DialogContent>
        {customerIsError && (
          <Alert variant="outlined" severity="error">
            <AlertTitle>Error</AlertTitle>
            {customerError.message}
          </Alert>
        )}
        {customerIsLoading && (
          <Box sx={{ mt: 3 }}>
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
          </Box>
        )}
        {!customerIsLoading && customerData && (
          <Box>
            <Grid container spacing={2} sx={{ mb: 1 }}>
              <Grid item xs={2} md={1}>
                <Label>證號</Label>
              </Grid>
              <Grid item xs={10} md={5}>
                <Text>{customerData.number}</Text>
              </Grid>
              <Grid item xs={2} md={1}>
                <Label>公司</Label>
              </Grid>
              <Grid item xs={10} md={5}>
                <Text>{customerData.company}</Text>
              </Grid>
              <Grid item xs={2} md={1}>
                <Label>姓名</Label>
              </Grid>
              <Grid item xs={10} md={5}>
                <Text>
                  {customerData.name}
                  <Typography variant="subtitle1" component="span">
                    （{customerData.title}）
                  </Typography>
                </Text>
              </Grid>
              <Grid item xs={2} md={1}>
                <Label>電話</Label>
              </Grid>
              <Grid item xs={10} md={5}>
                <Text>{customerData.telephone}</Text>
              </Grid>
              <Grid item xs={2} md={1}>
                <Label>狀態</Label>
              </Grid>
              <Grid item xs={10} md={5}>
                {customerData.status === "checked" && <Text>完成報到</Text>}
                {customerData.status === "uncheck" && <Text>尚未報到</Text>}
              </Grid>
            </Grid>
            <FormControlLabel
              sx={{ mb: 2, ml: 0 }}
              control={
                <Controller
                  name="checkFor"
                  control={control}
                  render={props => <Switch checked={true} color="primary" disabled={true} />}
                />
              }
              label="代理他人出席"
              labelPlacement="end"
            />

            <Button
              fullWidth
              variant="outlined"
              color={checkForCustomer ? "primary" : "warning"}
              onClick={handleCheckForClick}
              sx={{
                borderStyle: checkForCustomer ? "solid" : "dashed"
              }}
            >
              {checkForCustomer ? (
                <span>
                  {checkForCustomer.number}-{checkForCustomer.company} / {checkForCustomer.name}
                </span>
              ) : (
                <span>請選擇代理出席人員</span>
              )}
            </Button>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <LoadingButton
          size="large"
          fullWidth
          variant="contained"
          disabled={
            !customerData ||
            customerIsLoading ||
            checkIsLoading ||
            (isCheckFor && !checkForCustomer)
          }
          loading={customerIsLoading || checkIsLoading}
          onClick={handleSubmit(handleCheck)}
        >
          {isCheckFor && !checkForCustomer ? "請選擇代理出席人員" : "確定委託出席"}
        </LoadingButton>
      </DialogActions>
      <Dialog onClose={handleCloseCheckForModal} open={checkForModal} fullWidth>
        <DialogTitle>選擇代理出席人員</DialogTitle>
        <DialogContent sx={{ px: 2 }}>
          <TextField
            fullWidth
            focused
            inputRef={register}
            name="keyword"
            label="證號"
            inputProps={{ type: "number" }}
            error={!!errors.keyword}
            helperText={errors.keyword?.message || "請至少輸入 3 碼數字"}
            size="small"
            onKeyPress={e => {
              if (isNaN(Number(e.key))) {
                e.preventDefault();
              }
            }}
            onChange={handleKeywordChange}
            sx={{ mt: 1 }}
          />
          <Divider sx={{ my: 1 }}>搜尋結果</Divider>
          {customersIsLoading && (
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
          {!customersIsLoading && customersData?.customers.length <= 0 && (
            <Box
              sx={{ display: "block", textAlign: "center", color: grey[600], fontStyle: "italic" }}
            >
              無任何資料
            </Box>
          )}
          <List sx={{ "& ul": { padding: 0 } }} subheader={<li />}>
            {customersData?.customers.map(customer => {
              const { number, company, status, id: customerId, name, checkBy } = customer;
              const isDisabled = status === "checked" || !!checkBy || customerId === id;
              return (
                <li key={customerId}>
                  <ul>
                    <ListItem
                      key={`${customerId}`}
                      button
                      sx={{ p: 0, mt: 1 }}
                      disabled={isDisabled}
                      onClick={isDisabled ? null : e => handleSelectCheckFor(customer)}
                    >
                      {/* <Box sx={{ color: isDisabled ? grey[600] : null }}>
                        {number}-{company} / {name}
                      </Box> */}
                      <Card sx={{ width: "100%" }} variant="outlined">
                        <CustomerCardHeader customer={customer} />
                        <CardContent sx={{ "&:last-child": { pt: 0, pb: 1 } }}>
                          {number}-{company}
                        </CardContent>
                      </Card>
                    </ListItem>
                  </ul>
                </li>
              );
            })}
          </List>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default CheckForModal;