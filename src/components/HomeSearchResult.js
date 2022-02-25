import React, { useMemo } from "react";
import { List, ListItem, ListSubheader, Box, Divider } from "@mui/material";
import { grey } from "@mui/material/colors";
import { groupBy } from "lodash";
import MemberListItemSkeleton from "./MemberListItemSkeleton";
import MemberListItem from "./MemberListItem";

const HomeSearchResult = ({
  members,
  loading,
  onCheck,
  onCancelCheckFor,
  onCancelCheck,
  onCheckFor
}) => {
  const membersByCompany = useMemo(() => groupBy(members, "license_number"), [members]);

  if (loading && members?.length <= 0) {
    return (
      <Box sx={{ mt: 3 }}>
        {Array.from({ length: 5 }).map((_, index) => (
          <MemberListItemSkeleton key={index} sx={{ mb: 1 }} />
        ))}
      </Box>
    );
  }

  if (!loading && members?.length <= 0) {
    return (
      <Box sx={{ display: "block", textAlign: "center", color: grey[600], fontStyle: "italic" }}>
        無任何資料
      </Box>
    );
  }

  return (
    <>
      <List
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          position: "relative",
          "& ul": { padding: 0 }
        }}
        subheader={<li />}
      >
        {Object.keys(membersByCompany).map((companyNumber, index) => {
          const members = membersByCompany[companyNumber];
          const { license_number, company_name } = members[0];
          return (
            <li key={`section-${license_number}`}>
              <ul>
                {index !== 0 && <Divider sx={{ mt: 2 }} />}
                <ListSubheader sx={{ top: "56px", fontSize: "large" }}>
                  {license_number} - {company_name}
                </ListSubheader>
                <Divider sx={{ mb: 2 }} />
                {members.map(member => (
                  <ListItem key={`${member.id}`} sx={{ px : 1}}>
                    <MemberListItem
                      member={member}
                      onCheck={onCheck}
                      onCancelCheckFor={onCancelCheckFor}
                      onCancelCheck={onCancelCheck}
                      onCheckFor={onCheckFor}
                    />
                  </ListItem>
                ))}
              </ul>
            </li>
          );
        })}
      </List>
    </>
  );
};

export default HomeSearchResult;
