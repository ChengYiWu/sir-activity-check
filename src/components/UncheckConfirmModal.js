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
import { grey, red, green } from "@mui/material/colors";
import { MemberDelegateForChip } from "./MemberDelegateChip";

const UncheckConfirmModal = ({ member, open, onOk, onCancel }) => {
  const {
    name,
    license_number,
    company_name,
    delegate_for_member_id,
    delegate_for_name,
    delegate_for_seq_number
  } = member || {};

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
            <Box component="span">
              確定取消【
              <Box component="span" sx={{ color: grey[400], mx: "3px", fontSize: "18px" }}>
                {license_number}
              </Box>
              <Box
                component="span"
                sx={{ color: green[700], fontSize: "20px", fontWeight: 600, mr: "3px" }}
              >
                {name}
              </Box>】
              的報到紀錄嗎？
            </Box>
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
                  label="一併取消代理出席"
                  labelPlacement="end"
                />
              </FormControl>
              {cancelDelegateFor && <MemberDelegateForChip member={member} />}
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
