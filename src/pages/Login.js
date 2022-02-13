import React, { useRef, useState } from "react";
import {
  Alert,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Box,
} from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import { LockOutlined, PhoneOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { secureStroge, storgeKeys } from "../utils";
import { authService } from "../services";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { authActions } from "../actions";
import { useHistory } from "react-router-dom";

const loginFormSchema = yup.object().shape({
  telephone: yup
    .string()
    .required("請輸入手機號碼")
    .matches(new RegExp("^[09]{2}[0-9]{8}$"), "請輸入正確的手機格式")
    .trim(),
  password: yup.string().required("請填寫密碼")
});

const Login = () => {
  const rootRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const userRemember = secureStroge.get(storgeKeys.userRemember);
  const { handleSubmit, register, errors, control } = useForm({
    defaultValues: {
      telephone: userRemember ? userRemember.telephone : "",
      password: "",
      remember: userRemember ? true : false
    },
    resolver: yupResolver(loginFormSchema)
  });
  let history = useHistory();
  const disptach = useDispatch();
  const mutation = useMutation(
    loginInfo => {
      return authService.login(loginInfo);
    },
    {
      onSuccess: (data) => {
        disptach(authActions.login(data));
        history.push("/")
      }
    }
  );

  const handleLogin = async data => {
    // 記住手機號碼
    if (data.remember) {
      secureStroge.set(storgeKeys.userRemember, {
        telephone: data.telephone
      });
    } else {
      secureStroge.remove(storgeKeys.userRemember);
    }

    mutation.mutate(data);
  };

  return (
    <Box ref={rootRef} component="div">
      <Dialog
        open
        style={{ position: "absolute" }}
        BackdropProps={{ style: { position: "absolute" } }}
        container={() => rootRef.current}
        disablePortal
        fullWidth
        maxWidth="xs"
      >
        <DialogContent>
          {mutation.isError && (
            <Alert severity="error" style={{ marginBottom: "32px" }}>
              {mutation.error.message}
            </Alert>
          )}
          <form>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <TextField
                  fullWidth
                  inputRef={register}
                  name="telephone"
                  label={
                    <>
                      <span>手機號碼</span>
                      <span>*</span>
                    </>
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneOutlined />
                      </InputAdornment>
                    )
                  }}
                  error={!!errors.telephone}
                  helperText={errors.telephone?.message}
                  size="small"
                />
              </Grid>
              <Grid item>
                <FormControl error={!!errors.password} size="small" fullWidth>
                  <InputLabel style={{ backgroundColor: "white", padding: "0px 3px" }}>
                    <span>密碼</span>
                    <span>*</span>
                  </InputLabel>
                  <OutlinedInput
                    name="password"
                    inputRef={register}
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    startAdornment={
                      <InputAdornment position="start">
                        <LockOutlined />
                      </InputAdornment>
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => {
                            setShowPassword(preState => !preState);
                          }}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText>{errors.password?.message}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item sx={{ py: 0, marginTop: "-8px" }}>
                <FormControlLabel
                  control={
                    <Controller
                      name="remember"
                      defaultValue={false}
                      control={control}
                      render={({ onChange, value }) => {
                        return (
                          <Checkbox
                            onChange={e => onChange(e.target.checked)}
                            checked={value}
                            color="primary"
                          />
                        );
                      }}
                    />
                  }
                  label={"記住手機號碼"}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            type="submit"
            color="primary"
            variant="contained"
            fullWidth
            onClick={handleSubmit(handleLogin)}
            loading={mutation.isLoading}
          >
            <span>登入</span>
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login;
