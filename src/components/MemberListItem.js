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
import { grey, deepOrange } from "@mui/material/colors";
import MemberListItemStatus from "./MemberListItemStatus";

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
    delegated_by_company_name,
    delegated_by_license_number,
    delegated_by_member_id,
    delegated_by_name,
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

  return (
    <Card sx={{ width: "100%" }} variant="outlined">
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
      <CardContent sx={{ py: 0 }}>
        {delegated_by_member_id && (
          <Chip
            sx={chipStyle}
            size="small"
            variant="outlined"
            avatar={<Avatar>委</Avatar>}
            label={
              <>
                <Box>
                  {delegated_by_license_number}-{delegated_by_company_name} / {delegated_by_name}
                </Box>
                <Box>委託票領取號碼：{delegated_by_seq_number}</Box>
              </>
            }
          />
        )}
        {delegate_for_member_id && (
          <Chip
            sx={chipStyle}
            size="small"
            variant="outlined"
            avatar={
              <Avatar sx={{ bgcolor: deepOrange[600], "&.MuiChip-avatar": { color: "white" } }}>
                代
              </Avatar>
            }
            label={
              <>
                <Box>
                  {delegate_for_license_number}-{delegate_for_company_name} / {delegate_for_name}
                </Box>
                <Box>委託票領取號碼：{delegate_for_seq_number}</Box>
              </>
            }
          />
        )}
      </CardContent>
      <CardActions sx={{ display: "flex" }}>{renderButtons()}</CardActions>
    </Card>
  );
};

export default MemberListItem;
