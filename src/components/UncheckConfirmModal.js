import React, { useState, useEffect } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  DialogTitle,
  DialogContentText,
  Stack,
  FormControl,
  FormControlLabel,
  Switch
} from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import { grey, red } from "@mui/material/colors";

const UncheckConfirmModal = ({ member, open, onOk, onCancel }) => {
  const { name, company_name, delegate_for_member_id, delegate_for_name, delegate_for_seq_number } =
    member || {};

  const [cancelDelegateFor, setCancelDelegateFor] = useState(false);

  useEffect(() => {
    if (open) {
      setCancelDelegateFor(false);
    }
  }, [open]);

  const handleClick = () => {
    onOk && onOk(member, cancelDelegateFor);
  };

  const handleCancel = () => {
    onCancel && onCancel();
  };

  return (
    <Dialog open={open} fullWidth maxWidth={"xs"}>
      <DialogTitle sx={{ px: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ display: "flex" }}>
            <ErrorOutline sx={{ color: "warning.main" }} />
          </Box>
          <Box component="span" sx={{ fontWeight: 600, ml: 1 }}>
            取消報到
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ px: 2 }}>
        <DialogContentText sx={{ ml: 4 }}>
          <Stack spacing={2}>
            <Box component="span" sx={{ fontWeight: 600, fontSize: "large" }}>
              {company_name} / {name}
            </Box>
            的報到紀錄確定要取消嗎?
          </Stack>
          {delegate_for_member_id && (
            <>
              <FormControl component="fieldset">
                <FormControlLabel
                  value="end"
                  control={
                    <Switch
                      color="primary"
                      checked={cancelDelegateFor}
                      onChange={e => setCancelDelegateFor(e.target.checked)}
                    />
                  }
                  label="一併取消代理他人出席"
                  labelPlacement="end"
                />
              </FormControl>
              {cancelDelegateFor && (
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
            </>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} variant="outlined" fullWidth>
          取消
        </Button>
        <LoadingButton onClick={handleClick} variant="contained" fullWidth>
          確定
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default UncheckConfirmModal;
