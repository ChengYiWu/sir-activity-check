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
  FormControlLabel,
  Switch,
  Grid
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Close } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { activityMemberService } from "../services";
import { useMutation } from "react-query";
import { grey } from "@mui/material/colors";
import DelegateForSelectModal from "./DelegateForSelectModal";

export const CheckModalType = Object.freeze({
  CHECKIN: "CHECKIN",
  DELEGATE: "DELEGATE"
});

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

const CheckModal = ({ open, id, onClose, onSuccess, type }) => {
  const isCheckin = type === CheckModalType.CHECKIN;

  const {
    mutate: getMember,
    isLoading: memberIsLoading,
    data: memberData,
    isError: memberIsError,
    error: memberError
  } = useMutation(id => activityMemberService.get(id), {
    onSuccess() {
      if (!isCheckin) {
        setDelegateForSelectModal(true);
      }
    }
  });

  const {
    mutate: checkin,
    isLoading: checkinIsLoading,
    data: checkinData,
    isError: checkinIsError,
    error: checkinError
  } = useMutation(({ id, checkForId }) => activityMemberService.check(id, checkForId), {
    onSuccess(response) {
      onSuccess(response);
    }
  });

  const {
    mutate: delegateFor,
    isLoading: delegateForIsLoading,
    data: delegateForData,
    isError: delegateForIsError,
    error: delegateForError
  } = useMutation(
    ({ id, delegateForId }) => {
      return activityMemberService.delegateFor(id, delegateForId);
    },
    {
      onSuccess(response) {
        onSuccess(response);
      }
    }
  );

  const { handleSubmit, register, control, watch, setValue, reset } = useForm({
    defaultValues: {
      delegateFor: false,
      keyword: null,
      delegateForMember: null
    }
  });

  register("delegateForMember", null);
  const isDelegateFor = watch("delegateFor");
  const delegateForMember = watch("delegateForMember");

  useEffect(() => {
    if (open && id) {
      getMember(id);
    }
  }, [id, open, getMember]);

  const handleCheck = data => {
    if (isCheckin) {
      checkin({
        id,
        checkForId: data.delegateFor ? data.delegateForMember.id : null
      });
    } else {
      delegateFor({
        id,
        delegateForId: data.delegateFor ? data.delegateForMember.id : null
      });
    }
  };

  const [delegateForSelectModal, setDelegateForSelectModal] = useState(false);
  const handleDelegateForSelected = delegateForMember => {
    setValue("delegateForMember", delegateForMember, { shouldValidate: true });
    handleCloseDelegateForSelectModal();
  };
  const handleCloseDelegateForSelectModal = () => {
    setDelegateForSelectModal(false);
  };
  const handleDelegateForClick = () => {
    setDelegateForSelectModal(true);
  };

  useEffect(() => {
    if (open) {
      reset({
        delegateFor: isCheckin ? false : true,
        keyword: null,
        delegateForMember: null
      });
    }
  }, [open, reset, isCheckin]);

  return (
    <>
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
              {isCheckin ? "報到操作" : "委託出席操作"}
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          {memberIsError && (
            <Alert variant="outlined" severity="error">
              <AlertTitle>Error</AlertTitle>
              {memberError.message}
            </Alert>
          )}
          {memberIsLoading && (
            <Box sx={{ mt: 3 }}>
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
            </Box>
          )}
          {!memberIsLoading && memberData && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 1 }}>
                <Grid item xs={3} md={1}>
                  <Label>證號</Label>
                </Grid>
                <Grid item xs={9} md={5}>
                  <Text>{memberData.license_number}</Text>
                </Grid>
                <Grid item xs={3} md={1}>
                  <Label>公司</Label>
                </Grid>
                <Grid item xs={9} md={5}>
                  <Text>{memberData.company_name}</Text>
                </Grid>
                <Grid item xs={3} md={1}>
                  <Label>姓名</Label>
                </Grid>
                <Grid item xs={9} md={5}>
                  <Text>
                    {memberData.name}
                    <Typography variant="subtitle1" component="span">
                      （{memberData.title}）
                    </Typography>
                  </Text>
                </Grid>
                <Grid item xs={3} md={1}>
                  <Label>電話</Label>
                </Grid>
                <Grid item xs={9} md={5}>
                  <Text>{memberData.telephone}</Text>
                </Grid>
                <Grid item xs={3} md={1}>
                  <Label>狀態</Label>
                </Grid>
                <Grid item xs={9} md={5}>
                  {memberData.checkin_status === "valid" && <Text>完成報到</Text>}
                  {memberData.checkin_status === "invalid" && <Text>尚未報到</Text>}
                </Grid>
                {memberData.delegate_for_member_id && (
                  <>
                    <Grid item xs={3} md={1}>
                      <Label>代理他人</Label>
                    </Grid>
                    <Grid item xs={9} md={5}>
                      {memberData.delegate_for_name}
                    </Grid>
                  </>
                )}
              </Grid>
              {!memberData.delegate_for_member_id && (
                <FormControlLabel
                  sx={{ mb: 2, ml: 0 }}
                  control={
                    <Controller
                      name="delegateFor"
                      control={control}
                      render={props => (
                        <Switch
                          onChange={e => props.onChange(e.target.checked)}
                          checked={props.value}
                          color="primary"
                          disabled={!isCheckin}
                        />
                      )}
                    />
                  }
                  label="代理他人出席"
                  labelPlacement="end"
                />
              )}
              {(isDelegateFor || !isCheckin) && (
                <Button
                  fullWidth
                  variant="outlined"
                  color={delegateForMember ? "primary" : "warning"}
                  onClick={handleDelegateForClick}
                  sx={{
                    borderStyle: delegateForMember ? "solid" : "dashed"
                  }}
                >
                  {delegateForMember ? (
                    <span>
                      {delegateForMember.license_number}-{delegateForMember.company_name} /{" "}
                      {delegateForMember.name}
                    </span>
                  ) : (
                    <span>請選擇代理出席人員</span>
                  )}
                </Button>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <LoadingButton
            size="large"
            fullWidth
            variant="contained"
            disabled={
              !memberData ||
              memberIsLoading ||
              checkinIsLoading ||
              (isDelegateFor && !delegateForMember)
            }
            loading={memberIsLoading || checkinIsLoading || delegateForIsLoading}
            onClick={handleSubmit(handleCheck)}
          >
            {isDelegateFor && !delegateForMember
              ? "請選擇代理出席人員"
              : isCheckin
              ? "確定報到"
              : "確定委託出席"}
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <DelegateForSelectModal
        open={delegateForSelectModal}
        fromMemberId={id}
        onClose={handleCloseDelegateForSelectModal}
        onDelegateForSelected={handleDelegateForSelected}
      />
    </>
  );
};

export default CheckModal;
