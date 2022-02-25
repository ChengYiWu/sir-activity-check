import React from "react";
import { Chip, Stack } from "@mui/material";
import { CheckCircle, Cancel, DoneAll } from "@mui/icons-material";
import { deepOrange } from "@mui/material/colors";

const MemberListItemStatus = ({ member }) => {
  const { checkin_status, delegated_by_member_id, delegate_for_member_id } = member;

  if (checkin_status === "valid" || delegated_by_member_id || delegate_for_member_id) {
    return (
      <Stack spacing="3px">
        {checkin_status === "valid" && (
          <Chip icon={<CheckCircle />} label="本人報到" color={"success"} size="small" />
        )}
        {delegate_for_member_id && (
          <Chip icon={<DoneAll />} label="代理出席" color={"success"} size="small" />
        )}
        {delegated_by_member_id && (
          <Chip
            icon={<CheckCircle />}
            label="委託出席"
            sx={{ bgcolor: deepOrange[600], color: "white", "& .MuiChip-icon": { color: "white" } }}
            size="small"
          />
        )}
      </Stack>
    );
  }

  return <Chip icon={<Cancel />} label="尚未報到" size="small" />;
};

export default MemberListItemStatus;
