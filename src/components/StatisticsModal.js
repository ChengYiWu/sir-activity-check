import React from "react";
import { Box, Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import { Info, Assessment } from "@mui/icons-material";
import { grey } from "@mui/material/colors";

const StatisticsModal = ({ open, onClose, statistics }) => {
  const {
    lastest_valid_delegate_seq_number,
    total_check_for_count,
    total_member_count,
    total_own_check_count,
    total_uncheck_count,
    valid_delegate_count
  } = statistics?.statistics || {};

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={"xs"}>
      <DialogTitle sx={{ px: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ display: "flex" }}>
            <Assessment sx={{ color: "primary.main" }} />
          </Box>
          <Box component="span" sx={{ fontWeight: 600, ml: 1 }}>
            統計資訊
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ px: 2 }}>
        <Box sx={{ mb: 2 }}>
          會員數 {total_member_count} 位 / 報到 {total_own_check_count} 位 / 委託出席{" "}
          {total_check_for_count} 人
          <Typography variant="caption" component="div" sx={{ color: grey[600] }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
              <Info sx={{ fontSize: 14, mr: "3px" }} />
              <Box component="span">
                有效委託投票數
                <Box component="span" sx={{ color: grey[800], fontSize: "large", mx: "3px" }}>
                  {valid_delegate_count}
                </Box>
                位
                {valid_delegate_count > 0 && (
                  <span>
                    ，領取號碼為
                    <Box component="span" sx={{ color: grey[800], fontSize: "large", mx: "3px" }}>
                      {lastest_valid_delegate_seq_number}
                    </Box>
                    號（含）以前。
                  </span>
                )}
              </Box>
            </Box>
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default StatisticsModal;
