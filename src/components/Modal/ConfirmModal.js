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
import LoadingButton from "@mui/lab/LoadingButton";

const ConfirmModal = props => {
  const {
    open,
    okText = "確定",
    onOk,
    okButtonProps = {},
    title = "警告",
    content,
    onCloseModal,
    cancelText = "取消",
    onCancel,
    cancelButtonProps = {},
    ...others
  } = props;

  const handleClick = (e, callback) => {
    if (callback && typeof callback === "function") {
      callback(e);
    }

    if (!e.defaultPrevented) {
      onCloseModal();
    }
  };

  return (
    <Dialog open={open} fullWidth maxWidth={"xs"} {...others}>
      <DialogTitle sx={{ px: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ display: "flex" }}>
            <ErrorOutline sx={{ color: "warning.main" }} />
          </Box>
          <Box component="span" sx={{ fontWeight: 600, ml: 1 }}>
            {title}
          </Box>
        </Box>
      </DialogTitle>
      {content && (
        <DialogContent sx={{ px: 2 }}>
          <DialogContentText sx={{ ml: 4 }}>{content}</DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button
          onClick={e => handleClick(e, onCancel)}
          variant="outlined"
          fullWidth
          {...cancelButtonProps}
        >
          {cancelText}
        </Button>
        <LoadingButton
          onClick={e => handleClick(e, onOk)}
          variant="contained"
          fullWidth
          {...okButtonProps}
        >
          {okText}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmModal;
