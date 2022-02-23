import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Skeleton
} from "@mui/material";

const MemberListItemSkeleton = props => {
  const { sx, ...others } = props;
  return (
    <Card
      sx={{
        ...sx,
        width: "100%",
        "& .MuiCardContent-root": {
          p: 1
        }
      }}
      variant="outlined"
      {...others}
    >
      <CardHeader
        sx={{
          width: "100%",
          p: 1,
          pr: 2,
          "& .MuiCardHeader-action": {
            mt: 0,
            width: "60px"
          }
        }}
        title={<Skeleton animation="wave" width="60%" />}
        action={<Skeleton animation="wave" width="100%" />}
      />
      <CardContent>
        <Skeleton animation="wave" />
      </CardContent>
      <CardActions>
        <Skeleton animation="wave" width="100%" />
      </CardActions>
    </Card>
  );
};

export default MemberListItemSkeleton;
