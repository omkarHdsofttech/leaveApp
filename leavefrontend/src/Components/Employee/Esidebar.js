import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import hdlogo from "../Images/hdlogo.png";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import HistoryIcon from "@mui/icons-material/History";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import Applyforleave from "../commonforms.js/Applyforleave";
import LeaveHistory from "../commonforms.js/LeaveHistory";
import LeaveBalance from "../commonforms.js/LeaveBalance";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Button from "@mui/material/Button";
import DraftsIcon from "@mui/icons-material/Drafts";
import Drafts from "../commonforms.js/Drafts";
import Logo from "../Images/Logo.png";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Avatar, Menu, MenuItem, Tooltip } from "@mui/material";
import { useState,useEffect } from "react";
import LeavePolicy from "../commonforms.js/LeavePolicy";
import PolicyIcon from "@mui/icons-material/Policy";
const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open,backgroundColor }) => ({

  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: '#1a237e!important',
  color: "#fff!important",
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));



export default function MiniDrawer({
  U_id,
  DOJ,
  U_name,
  U_desig,
  gender,
  email,
  designame,
  backgroundColor
}) {
  const theme = useTheme();

  const [open, setOpen] = React.useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuData, setMenuData] = React.useState("Leave Balance");
  const [headerText, setHeadertext] = useState("Leave Management System");
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenuItemClick = (text) => {
    setMenuData(text);
    switch (text) {
      case "Leave Request":
        setHeadertext("Leave Request");
        break;
      case "Apply For Leave":
        setHeadertext("Application Form");
        break;
      case "Leave History":
        setHeadertext("Leave History");
        break;
      case "Leave Balance":
        setHeadertext("Leave Balance");
        break;
      case "Leave Instructions":
        setHeadertext("Leave Instructions");
        break;
      case "Drafts":
        setHeadertext("Draft Application");
        break;
      default:
        setHeadertext("Leave Management System");
    }
  };
  const navigate = useNavigate();
  const handleAccountCircleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAnchorEl(null);
  };
  const [profilePicture, setProfilePicture] = useState("");
   const [token, setToken] = useState('');
    useEffect(() => {
       const userToken = localStorage.getItem("userToken");
       setToken(userToken);
     }, []);
   
    useEffect(() => {
        const fetchpicture = async () => {
          
          try {
            const response = await fetch(
              `${process.env.REACT_APP_APIURL}picture`,
              {
                headers: {
                  Authorization: `${token}`, // Pass token in the headers
                },
              }
            );
            if (!response.ok) {
              throw new Error("Failed to fetch profile picture");
            }
      
            const data = await response.json();
            console.log("Profile Pictureii:", data.profilePicture);
            setProfilePicture(data.profilePicture);
          } catch (error) {
            // setError(error.message);
          } finally {
            // setIsLoading(false);
          }
        };
    
        fetchpicture();
      }, [token]);

  const handleLogout = async () => {
    setAnchorEl(null);
    await localStorage.removeItem("userToken");
    await localStorage.removeItem("userDetails");
    await localStorage.removeItem("navigateState");
    await localStorage.removeItem("isLoggedIn");

    navigate("/");
  };
console.log("BB",backgroundColor)
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} backgroundColor={backgroundColor}>
        <Toolbar>
          <img
            src={hdlogo}
            alt="Drawer Open"
            height="30px"
            onClick={handleDrawerOpen}
            style={{
              cursor: "pointer",
              marginRight: "5px",
              height: "64px",
              marginLeft: "-24px",
            }} // Add cursor style for better UX
          />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight:
                headerText === "Leave Management System" ? "bold" : "",
              marginLeft:
                headerText === "Leave Management System" ? "520px" : "",
            }}
          >
            {headerText}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />{" "}
          <IconButton
            color="inherit"
            onClick={handleAccountCircleClick}
            aria-label="Account Options"
          >
            {profilePicture ? (
              <Avatar
                src={profilePicture} // Use fetched profile picture
                alt="Profile"
                style={{ height: "45px", width: "45px" }}
              />
            ) : (
              <AccountCircleIcon
                style={{ height: "45px", width: "50px", marginRight: "7px" }}
              />
            )}
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleAccountMenuClose}
          >
            <MenuItem style={{ fontWeight: "bold", color: "black" ,
                pointerEvents: "none"}}>
              {U_name}
            </MenuItem>
            <MenuItem style={{ color: "blue", pointerEvents: "none" }}>{email}</MenuItem>
            <MenuItem
              style={{ color: "blue", marginTop: "9px", fontSize: "14px", pointerEvents: "none" }}
            >
              {designame}
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} style={{ fontWeight: "bold" }}>
              Sign Out
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {[
            {
              text: "Apply For Leave",
              icon: (
                <Tooltip title="Apply For Leave" placement="right">
                  <EditCalendarIcon />{" "}
                </Tooltip>
              ),
            },
            {
              text: "Leave History",
              icon: (
                <Tooltip title="Leave History" placement="right">
                  {" "}
                  <HistoryIcon />{" "}
                </Tooltip>
              ),
            },
            {
              text: "Leave Balance",
              icon: (
                <Tooltip title="Leave Balance" placement="right">
                  <AccountBalanceWalletIcon />{" "}
                </Tooltip>
              ),
            },
            {
              text: "Drafts",
              icon: (
                <Tooltip title="Drafts" placement="right">
                  <DraftsIcon />
                </Tooltip>
              ),
            },
            {
              text: "Leave Instructions",
              icon: (
                <Tooltip title="Leave Instructions" placement="right">
                  {" "}
                  <PolicyIcon />{" "}
                </Tooltip>
              ),
            },
          ].map(({ text, icon }) => (
            <ListItem
              key={text}
              disablePadding
              sx={{ display: "block" }}
              onClick={() => handleMenuItemClick(text)}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {menuData === "Apply For Leave" && (
          <Applyforleave
            U_id={U_id}
            DOJ={DOJ}
            email={email}
            U_name={U_name}
            U_desig={U_desig}
            gender={gender}
          />
        )}
        {menuData === "Leave History" && <LeaveHistory U_id={U_id} />}
        {menuData === "Leave Balance" && <LeaveBalance U_id={U_id} DOJ={DOJ} />}
        {menuData === "Drafts" && <Drafts U_id={U_id} />}
        {menuData === "Leave Instructions" && <LeavePolicy />}
      </Box>
    </Box>
  );
}
