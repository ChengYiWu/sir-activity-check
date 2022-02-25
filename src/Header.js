import React, { useState } from "react";
import {
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Box,
  ListItemText,
  ListItemIcon
} from "@mui/material";
import { ExitToApp, Person, Assessment } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "./actions";
import StatisticsModal from "./components/StatisticsModal";

const Header = ({ statistics }) => {
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

  const [statisticsModal, setStatisticsModal] = useState(false);
  const handleOpenStatisticsModal = () => {
    setStatisticsModal(true);
  };
  const handleCloseStatisticsModal = () => {
    handleCloseUserMenu();
    setStatisticsModal(false);
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth"
              });
            }}
          >
            高雄市不動產開發商業同業公會
          </Typography>
          {!!userInfo && (
            <Box sx={{ ml: "auto" }}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Person />
              </IconButton>
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
                <MenuItem onClick={handleOpenStatisticsModal}>
                  <ListItemIcon sx={{ "& .MuiSvgIcon-root": { color: "primary.main" } }}>
                    <Assessment />
                  </ListItemIcon>
                  <ListItemText sx={{ color: "primary.main" }}>統計資訊</ListItemText>
                </MenuItem>
                <MenuItem onClick={logout}>
                  <ListItemIcon sx={{ "& .MuiSvgIcon-root": { color: "error.main" } }}>
                    <ExitToApp />
                  </ListItemIcon>
                  <ListItemText sx={{ color: "error.main" }}>登出</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <StatisticsModal
        open={statisticsModal}
        statistics={statistics}
        onClose={handleCloseStatisticsModal}
      />
    </>
  );
};

export default Header;
