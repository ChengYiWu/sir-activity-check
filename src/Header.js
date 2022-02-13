import React, { useEffect, useState } from "react";
import {
  AppBar,
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Box,
  ListItem,
  ListItemText,
  Divider,
  ListItemIcon
} from "@mui/material";
import { ExitToApp, Person } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "./actions";

const Header = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { userInfo } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const handleOpenUserMenu = event => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logout = () => {
    dispatch(authActions.logout());
    setAnchorElUser(null);
  };

  return (
    <AppBar position="relative">
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          不動產工會報到
        </Typography>
        {!!userInfo && (
          <Box sx={{ ml: "auto" }}>
            <Button
              variant="outlined"
              onClick={handleOpenUserMenu}
              // startIcon={<Person sx={{ color: "white", marginRight: "0px" }} />}
              sx={{
                color: "white",
                "& .MuiButton-startIcon": {
                  marginRight: "0px"
                }
              }}
            >
              <Box>{userInfo.username}</Box>
              <Box sx={{ marginLeft: "2px" }}>({userInfo.telephone})</Box>
            </Button>
            {/* <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt="login-user">
                {userInfo.username.length >= 1 ? userInfo.username[0] : userInfo.username}
              </Avatar>
            </IconButton> */}
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {
                <MenuItem onClick={logout}>
                  <ListItemIcon sx={{ "& .MuiSvgIcon-root": { color: "error.main" } }}>
                    <ExitToApp />
                  </ListItemIcon>
                  <ListItemText sx={{ color: "error.main" }}>登出</ListItemText>
                </MenuItem>
              }
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
