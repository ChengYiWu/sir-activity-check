import React from "react";
import { Box, Skeleton, Typography } from "@mui/material";
import { Info } from "@mui/icons-material";
import { grey, red } from "@mui/material/colors";
import { useDispatch } from "react-redux";
import { modalActions } from "../actions";

const StatisticsArea = ({ statistics, loading }) => {
  const {
    lastest_valid_delegate_seq_number,
    total_check_for_count,
    total_member_count,
    total_own_check_count,
    total_uncheck_count,
    valid_delegate_count
  } = statistics?.statistics || {};

  const cancelledDelegateHistories = statistics?.cancelledDelegateHistories || [];

  const dispatch = useDispatch();

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
            <Box component="span">
              無效票：
              {cancelledDelegateHistories.map(history => (
                <Box component="span" sx={{ mr: "4px" }}>
                  {history.delegate_seq_number}
                </Box>
              ))}
            </Box>
          </div>
        )
      })
    );
  };

  if (loading || !statistics) {
    return (
      <Box sx={{ mb: "22px" }}>
        <Typography component="div" variant="body">
          <Skeleton animation="wave" />
        </Typography>
        <Typography component="div" variant="body">
          <Skeleton animation="wave" />
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 2 }}>
      會員數 {total_member_count} 位 / 報到 {total_own_check_count} 位 / 委託出席{" "}
      {total_check_for_count} 人
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
  );
};

export default StatisticsArea;
