import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

// Style
import { Modal } from "antd";
import {
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

// REDUX
import { useAppSelector, useAppDispatch } from "../store/store";
import { signout } from "../store/slices/authSlice";
import { editUserInfo } from "../store/slices/userSlice";

// API
import { GET_USER_BY_ID } from "../service/api/users";
import { setUserToken } from "../utils/token";

const Navbar = () => {
  const { role, userId } = useAppSelector((state) => state.auth);
  const { firstName, lastName } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const { confirm } = Modal;
  const [menu, setMenu] = React.useState<null | HTMLElement>(null);
  const open = Boolean(menu);

  const history = useHistory();

  useEffect(() => {
    apiGetUserList();
  }, []);

  const apiGetUserList = async () => {
    if (userId) {
      const res = await GET_USER_BY_ID(userId);
      if (res.status === 200) {
        let payload = { firstName: "", lastName: "" };
        const resUser = res.results;
        payload = {
          ...payload,
          firstName: resUser.firstName,
          lastName: resUser.lastName,
        };
        dispatch(editUserInfo(payload));
      }
    }
  };

  // Sign Out
  const handleSignOut = () => {
    confirm({
      title: "คุณต้องการออกจากระบบหรือไม่?",
      content: "",
      onCancel: () => {},
      onOk: () => {
        localStorage.removeItem("token");
        setUserToken("");
        signOut();
      },
    });
  };
  const signOut = () => {
    localStorage.removeItem("token");
    setUserToken("");
    dispatch(signout());
  };

  // Menu
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenu(event.currentTarget);
  };
  const handleClose = () => {
    setMenu(null);
  };

  return (
    <div className="navbar-container">
      {userId ? (
        <React.Fragment>
          <Box
            sx={{ display: "flex", alignItems: "center", textAlign: "center" }}
          >
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                disableRipple
              >
                <Typography px={2}>
                  {firstName} {lastName}
                </Typography>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: "#CD5C5C",
                    color: "#fff",
                  }}
                >
                  {firstName.charAt(0).toUpperCase()}
                  {lastName.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
          {role === "superAdmin" ? (
            <Menu
              anchorEl={menu}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleSignOut}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                ออกจากระบบ
              </MenuItem>
            </Menu>
          ) : (
            <Menu
              anchorEl={menu}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={() => history.push("/setting/profile")}>
                <ListItemIcon>
                  <AccountCircleIcon fontSize="small" />
                </ListItemIcon>
                ตั้งค่าโปรไฟล์
              </MenuItem>
              <MenuItem onClick={() => history.push("/setting/dormitory")}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                ตั้งค่าหอพัก
              </MenuItem>
              <MenuItem onClick={handleSignOut}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                ออกจากระบบ
              </MenuItem>
            </Menu>
          )}
        </React.Fragment>
      ) : null}
    </div>
  );
};

export default Navbar;
