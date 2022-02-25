import React from "react";
import { Avatar, Box, Chip, Typography } from "@mui/material";
import { grey, green, deepOrange } from "@mui/material/colors";

const getMemberField = (prefix, member) => field => {
  return member[`${prefix}_${field}`];
};

export const MemberDelegateForChip = ({ member }) => {
  return <MemberDelegateChip type="delegate_for" fieldPrefix="delegate_for" member={member} />;
};

export const MemberDelegatedByChip = ({ member }) => {
  return <MemberDelegateChip type="delegated_by" fieldPrefix="delegated_by" member={member} />;
};

const MemberDelegateChip = ({ member, fieldPrefix, type }) => {
  const getMemberInfo = getMemberField(fieldPrefix, member || {});

  const chipStyle = { height: "auto", width: "100%", justifyContent: "flex-start" };
  const color = type === "delegated_by" ? deepOrange : green;
  const borderStyle = type === "delegated_by" ? "dashed" : "solid";

  return (
    <Chip
      sx={{ ...chipStyle, borderColor: color[600], borderStyle: borderStyle }}
      size="medium"
      variant="outlined"
      avatar={
        <Avatar sx={{ bgcolor: color[600], color: "white", marginRight: "12px" }}>
          <span style={{ color: "white" }}>{getMemberInfo("seq_number")}</span>
        </Avatar>
      }
      label={
        <>
          <Typography variant="title" sx={{ color: grey[500] }}>
            {getMemberInfo("license_number")} - {getMemberInfo("company_name")}
          </Typography>
          <Box sx={{ fontSize: "16px" }}>
            {getMemberInfo("name")}
            <Box component="span" sx={{ fontSize: "12px", color: grey[500] }}>
              {" "}
              {getMemberInfo("title")}
            </Box>
          </Box>
        </>
      }
    />
  );
};
