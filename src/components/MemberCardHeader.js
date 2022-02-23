import React from "react";
import { CardHeader, Typography, Box } from "@mui/material";
import { grey } from "@mui/material/colors";
import MemberListItemStatus from "./MemberListItemStatus";

const MemberCardHeader = ({ member, ...others }) => {
  const { name, title, telephone } = member;
  return (
    <CardHeader
      {...others}
      title={
        <Box component="div" sx={{ display: "flex", alignItems: "baseline" }}>
          <Typography variant="h6">{name}</Typography>
          <Typography variant="subtitle2" sx={{ ml: "6px", color: grey[600] }}>
            {title}
          </Typography>
        </Box>
      }
      subheader={
        <Box component="span" sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="subtitle2" component="span" sx={{ color: grey[600], ml: "3px" }}>
            {telephone}
          </Typography>
        </Box>
      }
      action={<MemberListItemStatus member={member} />}
    />
  );
};

export default MemberCardHeader;
