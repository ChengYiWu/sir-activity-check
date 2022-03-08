import React from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Card,
  CardContent,
  Grid,
  Stack
} from "@mui/material";
import { Assessment } from "@mui/icons-material";
import { deepOrange, grey, green, red } from "@mui/material/colors";
import NP from "number-precision";
import numeral from "numeral";

const format = number => {
  return numeral(number).format("0,0");
};

const StatistcsCardHeader = ({ title }) => {
  return (
    <Typography sx={{ fontSize: 14, fontWeight: 700 }} color={grey[500]} gutterBottom>
      {title}
    </Typography>
  );
};

const StatistcsCard = ({ title, children }) => {
  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent>
        <StatistcsCardHeader title={title} />
        <Box>{children}</Box>
      </CardContent>
    </Card>
  );
};

const StatistcsCardUnit = ({ label }) => {
  return (
    <Typography component="span" variant="subtitle2" sx={{ ml: "3px" }}>
      {label}
    </Typography>
  );
};

const StatistcsCardNumber = ({ number, sx, isFormat = true }) => {
  return (
    <Typography component="span" sx={{ fontWeight: 600, fontSize: "20px", ...sx }}>
      {isFormat ? format(number) : number}
    </Typography>
  );
};

const StatisticsModal = ({ open, onClose, statistics }) => {
  const {
    lastest_valid_delegate_seq_number,
    total_check_for_count,
    total_member_count,
    total_own_check_count,
    total_uncheck_count,
    valid_delegate_count
  } = statistics?.statistics || {};

  const checkinRate = statistics
    ? NP.round(
        NP.times(NP.divide(total_check_for_count + total_own_check_count, total_member_count), 100),
        1
      )
    : 0;

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
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <StatistcsCard title="總會員數">
              <StatistcsCardNumber number={total_member_count} sx={{ color: "primary.main" }} />
              <StatistcsCardUnit label="位" />
            </StatistcsCard>
          </Grid>
          <Grid item xs={6}>
            <StatistcsCard title="出席率">
              <StatistcsCardNumber
                number={checkinRate}
                sx={{ color: green[700] }}
                isFormat={false}
              />
              <StatistcsCardUnit label="%" />
            </StatistcsCard>
          </Grid>

          <Grid item xs={6}>
            <StatistcsCard title="本人報到">
              <StatistcsCardNumber number={total_own_check_count} sx={{ color: green[700] }} />
              <StatistcsCardUnit label="位" />
            </StatistcsCard>
          </Grid>
          <Grid item xs={6}>
            <StatistcsCard title="尚未出席">
              <StatistcsCardNumber number={total_uncheck_count} sx={{ color: red[700] }} />
              <StatistcsCardUnit label="位" />
            </StatistcsCard>
          </Grid>
          <Grid item xs={12}>
            <StatistcsCard title="委託出席">
              <Stack>
                <Box component="span">
                  <StatistcsCardNumber
                    number={total_check_for_count}
                    sx={{ color: deepOrange[700] }}
                  />
                  <StatistcsCardUnit label="位" />
                  <Typography
                    component="span"
                    sx={{ fontSize: "10px", ml: "6px", color: green[700] }}
                  >
                    （有效 {format(valid_delegate_count)} 位）
                  </Typography>
                </Box>
                {lastest_valid_delegate_seq_number && (
                  <Typography component="span" sx={{ fontSize: "12px" }}>
                    號碼牌
                    <Typography component="span" sx={{ mx: "3px" }}>
                      {lastest_valid_delegate_seq_number}
                    </Typography>
                    號 (含) 以前有效
                  </Typography>
                )}
              </Stack>
            </StatistcsCard>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default StatisticsModal;
