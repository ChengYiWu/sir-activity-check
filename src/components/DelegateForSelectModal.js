import React, { useEffect } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  Skeleton,
  DialogTitle,
  Divider,
  List,
  ListItem,
  Card,
  CardContent
} from "@mui/material";
import { useForm } from "react-hook-form";
import { activityMemberService } from "../services";
import { useMutation } from "react-query";
import { grey } from "@mui/material/colors";
import MemberCardHeader from "./MemberCardHeader";
import HomeForm from "./HomeForm";

const DelegateForSelectModal = ({ open, onClose, onDelegateForSelected, fromMemberId }) => {
  const form = useForm({
    defaultValues: {
      field: "license",
      keyword: null
    }
  });
  const { reset } = form;

  const {
    mutate: getMembers,
    reset: resetGetMembers,
    isLoading: membersIsLoading,
    data: membersData,
    isError: membersIsError,
    error: membersError
  } = useMutation(param => activityMemberService.search({ ...param, from_member: fromMemberId }));

  useEffect(() => {
    if (open) {
      resetGetMembers();
      reset();
    }
  }, [open, reset, resetGetMembers]);

  const handleSearch = data => {
    getMembers(data);
  };

  return (
    <Dialog onClose={onClose} open={open} fullWidth>
      <DialogTitle>選擇代理出席人員</DialogTitle>
      <DialogContent sx={{ px: 2, pt: "8px !important" }}>
        <HomeForm form={form} onSearch={handleSearch} />
        <Divider sx={{ my: 1 }}>搜尋結果</Divider>
        {membersIsLoading && (
          <Box sx={{ mt: 3 }}>
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
          </Box>
        )}
        {!membersIsLoading && membersData?.items.length <= 0 && (
          <Box
            sx={{ display: "block", textAlign: "center", color: grey[600], fontStyle: "italic" }}
          >
            無任何資料
          </Box>
        )}
        <List sx={{ "& ul": { padding: 0 } }} subheader={<li />}>
          {membersData?.items.map(member => {
            const {
              name,
              license_number,
              company_name,
              checkin_status,
              id: memberId,
              delegated_by_member_id,
              delegate_for_member_id
            } = member;
            const isDisabled =
              checkin_status === "valid" || !!delegated_by_member_id || !!delegate_for_member_id;
            return (
              <li key={memberId}>
                <ul>
                  <ListItem
                    key={`${memberId}`}
                    button
                    sx={{ p: 0, mt: 1 }}
                    disabled={isDisabled}
                    onClick={isDisabled ? null : e => onDelegateForSelected(member)}
                  >
                    <Card sx={{ width: "100%" }} variant="outlined">
                      <MemberCardHeader member={member} />
                      <CardContent sx={{ "&:last-child": { pt: 0, pb: 1 } }}>
                        {license_number}-{company_name}
                      </CardContent>
                    </Card>
                  </ListItem>
                </ul>
              </li>
            );
          })}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default DelegateForSelectModal;
