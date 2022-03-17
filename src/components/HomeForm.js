import React, { useMemo } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Button
} from "@mui/material";
import { Controller } from "react-hook-form";
import { Close } from "@mui/icons-material";
import { modalActions } from "../actions";
import { useDispatch } from "react-redux";

const FieldExtraInfo = {
  license: "請輸入至少 3 碼數字",
  name: "請輸入至少 2 個字",
  company: "請輸入至少 2 個字"
};

const HomeForm = ({ form, onSearch, onClear }) => {
  const dispatch = useDispatch();
  const { control, register, reset, watch, handleSubmit, setValue } = form;

  const field = watch("field");
  const helperText = useMemo(() => FieldExtraInfo[field], [field]);

  const handleKeywordClear = () => {
    setValue("keyword", "");
  };

  const handleClear = () => {
    reset();
    onClear && onClear();
  };

  const onSubmit = data => {
    const { keyword, field } = data;

    let err;
    if (field === "license" && keyword.length < 3) {
      err = "「公司編號」的關鍵字至少需 3 碼數字";
    } else if ((field === "name" || field === "company") && keyword.length < 2) {
      const fieldName = field === "name" ? "姓名" : "公司名稱";
      err = `「${fieldName}」的關鍵字至少需 2 個字`;
    }

    if (err) {
      dispatch(
        modalActions.show("ERROR", {
          title: "錯誤",
          content: err,
          okText: "我知道了"
        })
      );
    } else {
      onSearch(data);
    }
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={5}>
        <FormControl size="small" sx={{ mb: 1 }} fullWidth>
          <InputLabel>搜尋欄位</InputLabel>
          <Controller
            name="field"
            control={control}
            as={
              <Select label="搜尋欄位">
                <MenuItem value="license">公司編號</MenuItem>
                <MenuItem value="name">姓名</MenuItem>
                <MenuItem value="company">公司名稱</MenuItem>
              </Select>
            }
          />
        </FormControl>
      </Grid>
      <Grid item xs={7}>
        <TextField
          fullWidth
          focused
          inputRef={register}
          name="keyword"
          label="關鍵字"
          sx={{ mb: 1 }}
          size="small"
          InputProps={{
            ...(field === "license" ? { type: "number" } : {}),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleKeywordClear} edge="end">
                  <Close />
                </IconButton>
              </InputAdornment>
            )
          }}
          helperText={helperText}
        />
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Button fullWidth variant="contained" color="error" onClick={handleClear}>
            重設
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button fullWidth variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>
            搜尋
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default HomeForm;
