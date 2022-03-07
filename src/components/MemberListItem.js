import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Box,
  Button,
  Chip
} from "@mui/material";
import { grey, deepOrange, green } from "@mui/material/colors";
import MemberListItemStatus from "./MemberListItemStatus";
import { MemberDelegateForChip, MemberDelegatedByChip } from "./MemberDelegateChip";
import MemberCardPaperLocation from "./MemberCardPaperLocation";

const MemberListItem = ({ member, onCheck, onCancelCheck, onCancelCheckFor, onCheckFor }) => {
  const {
    attendance_book_location,
    checkin_status,
    company_name,
    title,
    delegate_for_attendance_book_location,
    delegate_for_company_name,
    delegate_for_license_number,
    delegate_for_member_id,
    delegate_for_name,
    delegate_for_seq_number,
    delegate_for_telephone,
    delegate_for_title,
    delegated_by_company_name,
    delegated_by_license_number,
    delegated_by_member_id,
    delegated_by_name,
    delegated_by_title,
    delegated_by_seq_number,
    delegated_by_telephone,
    delegated_for_attendance_book_location,
    id,
    license_number,
    name,
    telephone
  } = member;

  const chipStyle = { height: "auto", width: "100%", justifyContent: "flex-start" };

  const renderButtons = () => {
    if (delegated_by_member_id) {
      return (
        <Button size="large" color="primary" variant="contained" fullWidth disabled>
          已由他人代為報到
        </Button>
      );
    }

    const btns = [
      checkin_status === "invalid" ? (
        <Button
          key="checkin"
          size="large"
          color="primary"
          variant="contained"
          fullWidth
          onClick={() => onCheck(id)}
        >
          報到
        </Button>
      ) : (
        <Button
          key="uncheckin"
          size="large"
          color="error"
          variant="contained"
          fullWidth
          onClick={() => onCancelCheck(id)}
        >
          取消報到
        </Button>
      ),
      delegate_for_member_id ? (
        <Button
          key="cancel-delegate"
          size="large"
          color="error"
          variant="contained"
          fullWidth
          onClick={() => onCancelCheckFor(id)}
        >
          取消代理出席
        </Button>
      ) : (
        <Button
          key="delegate"
          size="large"
          color="primary"
          variant="contained"
          fullWidth
          onClick={() => onCheckFor(id)}
        >
          加入代理出席
        </Button>
      )
    ];

    return btns;
  };

  const borderColor =
    !!delegate_for_member_id || checkin_status === "valid"
      ? green[700]
      : delegated_by_member_id
      ? deepOrange[600]
      : "primary.main";

  return (
    <Card
      sx={{
        width: "100%",
        borderColor: borderColor,
        borderWidth: "2px"
      }}
      variant="outlined"
    >
      <CardHeader
        sx={{
          width: "100%",
          "& .MuiCardHeader-action": {
            mt: 0
          }
        }}
        title={
          <Box component="div" sx={{ display: "flex", alignItems: "baseline" }}>
            <Typography variant="h6">{name}</Typography>
            <Typography variant="subtitle2" sx={{ ml: "6px", color: grey[500] }}>
              {title}
            </Typography>
          </Box>
        }
        subheader={
          <Box component="span" sx={{ display: "flex", alignItems: "center" }}>
            <MemberCardPaperLocation paperLocation={attendance_book_location} />
            {/* <Typography variant="subtitle2" component="span" sx={{ color: grey[500], ml: "3px" }}>
              {telephone}
            </Typography> */}
          </Box>
        }
        action={<MemberListItemStatus member={member} />}
      />
      <CardContent sx={{ py: 0, px: 1 }}>
        {delegated_by_member_id && <MemberDelegatedByChip member={member} />}
        {delegate_for_member_id && <MemberDelegateForChip member={member} />}
      </CardContent>
      <CardActions
        sx={{ display: "flex", pt: delegated_by_member_id || delegate_for_member_id ? 2 : 0 }}
      >
        {renderButtons()}
      </CardActions>
    </Card>
  );
};

export default MemberListItem;
