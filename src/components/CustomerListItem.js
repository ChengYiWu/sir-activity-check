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
import CustomerListItemStatus from "./CustomerListItemStatus";

const CustomerListItem = ({ customer, onCheck, onCancelCheck, onCancelCheckFor, onCheckFor }) => {
  const {
    id,
    name,
    title,
    telephone,
    status,
    checkBy,
    checkFor,
    checkByNumber,
    checkForNumber,
    checkByCompany,
    checkByName,
    checkByTelephone,
    checkByTicketNumber,
    checkForCompany,
    checkForName,
    checkForTelephone,
    checkForTicketNumber
  } = customer;

  const chipStyle = { height: "auto", width: "100%", justifyContent: "flex-start" };

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
        action={<CustomerListItemStatus customer={customer} />}
      />
      <CardContent sx={{ py: 0 }}>
        {checkBy && (
          <Chip
            sx={chipStyle}
            size="small"
            variant="outlined"
            avatar={<Avatar>委</Avatar>}
            label={
              <>
                <Box>
                  {checkByNumber}-{checkByCompany} / {checkByName}
                </Box>
                <Box>委託票領取號碼：{checkByTicketNumber}</Box>
              </>
            }
          />
        )}
        {checkFor && (
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
                  {checkForNumber}-{checkForCompany} / {checkForName}
                </Box>
                <Box>委託票領取號碼：{checkForTicketNumber}</Box>
              </>
            }
          />
        )}
      </CardContent>
      <CardActions sx={{ display: "flex" }}>
        {status === "uncheck" && !checkBy && (
          <Button
            size="large"
            color="primary"
            variant="contained"
            fullWidth
            onClick={() => onCheck(id)}
          >
            報到
          </Button>
        )}
        {status === "uncheck" && checkBy && (
          <Button size="large" color="primary" variant="contained" fullWidth disabled>
            已由他人代為報到
          </Button>
        )}
        {status === "checked" && (
          <>
            <Button
              size="large"
              color="error"
              variant="contained"
              fullWidth
              onClick={() => onCancelCheck(id)}
            >
              取消報到
            </Button>
            {checkFor ? (
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
            )}
          </>
        )}
      </CardActions>
    </Card>
  );
};

export default CustomerListItem;
