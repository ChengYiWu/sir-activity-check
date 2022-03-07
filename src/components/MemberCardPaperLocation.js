import React from "react";
import { Box } from "@mui/material";
import { Description } from "@mui/icons-material";
import { grey } from "@mui/material/colors";

const MemberCardPaperLocation = ({ paperLocation, inline = false, sx }) => {
  return (
    <Box
      component="span"
      sx={{
        color: grey[600],
        display: inline ? "inline-flex" : "flex",
        alignItems: "center",
        background: "white"
      }}
    >
      {!inline && <Description sx={{ width: "14px" }} />}
      <Box component="span" sx={{ ml: "3px", fontSize: "14px", ...sx }}>
        {paperLocation}
      </Box>
    </Box>
  );
};

export default MemberCardPaperLocation;
