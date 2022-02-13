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
import { CheckCircleOutline } from "@mui/icons-material";

const SuccessModal = props => {
  const {
    open,
    okText = "確定",
    onOk,
    okButtonProps = {},
    cancelText = "",
    onCancel,
    cancelButtonProps = {},
    title = "通知",
    content,
    onCloseModal,
    ...others
  } = props;

  const { className: okBtnClassName, ...okButtonOtherProps } = okButtonProps;
  const { className: cancelBtnClassName, ...cancelButtonOtherProps } = cancelButtonProps;

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
            <CheckCircleOutline sx={{ color: "success.main" }} />
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
        {cancelText && (
          <Button
            onClick={e => handleClick(e, onCancel)}
            variant="contained"
            fullWidth
            {...cancelButtonOtherProps}
          >
            {cancelText}
          </Button>
        )}
        <Button
          onClick={e => handleClick(e, onOk)}
          variant="contained"
          fullWidth
          {...okButtonOtherProps}
        >
          {okText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuccessModal;
