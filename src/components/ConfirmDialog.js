import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

const ConfirmDialog = ({
  onClose,
  onOk,
  okText = "確定",
  cancelText = "取消",
  title = "確認",
  content = "",
  okLoading,
  ...others
}) => {
  return (
    <Dialog {...others} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button fullWidth variant="contained" onClick={onClose}>
          {cancelText}
        </Button>
        <LoadingButton
          fullWidth
          variant="contained"
          color="primary"
          onClick={onOk}
          loading={okLoading}
        >
          {okText}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
