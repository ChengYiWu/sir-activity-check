import React from "react";
import { Chip } from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { deepOrange } from "@mui/material/colors";

const CustomerListItemStatus = ({ customer }) => {
  const { status, checkBy } = customer;

  if (status === "checked") {
    return <Chip icon={<CheckCircle />} label="本人報到" color={"success"} size="small" />;
  }

  if (checkBy) {
    return (
      <Chip
        icon={<CheckCircle />}
        label="委託出席"
        sx={{ bgcolor: deepOrange[600], color: "white", "& .MuiChip-icon": { color: "white" } }}
        size="small"
      />
    );
  }

  return <Chip icon={<Cancel />} label="尚未報到" size="small" />;
};

export default CustomerListItemStatus;
