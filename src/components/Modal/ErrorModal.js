import React from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  DialogTitle,
  DialogContentText
} from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";

const ErrorModal = props => {
  const {
    open,
    okText = "確定",
    onOk,
    okButtonProps = {},
    title = "操作失敗",
    content,
    onCloseModal,
    ...others
  } = props;

  const handleOk = e => {
    if (onOk && typeof onOk === "function") {
      onOk(e);
    }

    if (!e.defaultPrevented) {
      onCloseModal();
    }
  };

  return (
    <Dialog open={open} fullWidth maxWidth={"xs"} {...others}>
      <DialogTitle>
        <Box display="flex">
          <Box display="flex">
            <ErrorOutline />
          </Box>
          <span>{title}</span>
        </Box>
      </DialogTitle>
      {content && (
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={handleOk} variant="contained" color="primary" fullWidth {...okButtonProps}>
          {okText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorModal;
