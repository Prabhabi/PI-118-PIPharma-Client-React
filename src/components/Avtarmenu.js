import * as React from "react";
import {
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
} from "@mui/material";
import { Settings, Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import UserProfile from "./UserProfile";
import ProductMasterUpdate from "./MasterTableUpdate/ProductMasterUPdate/ProductMasterUpdate";
import {
  ArrowRight as ArrowRightIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from "@mui/icons-material";
import HsnMasterUpdate from "./MasterTableUpdate/HsnMasterUpdate/HsnMasterUpdate";
import ColorMaster from "./MasterTableUpdate/ColorMasterUpdate/ColorMaster";
import AddressMasterUpdate from "./MasterTableUpdate/AddressMasterUpdate/AddressMasterUpdate";
import CreateAccount from "./createAccount/CreateAccount";
import SensorOccupiedIcon from "@mui/icons-material/SensorOccupied";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { logout } from "../Redux/authSlice";
import SettingsDamageReturn from "./MasterTableUpdate/Property Master/SettingsPropertyMaster";
import {
  queryClient,
  localStoragePersister,
} from "./../providers/QueryProvider";

export default function Avtar({ handleLogout, img }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openProfile, setOpenProfile] = React.useState(false);
  const [openDamage, setOpenDamage] = React.useState(false);

  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [productUpdateOpen, setProductUpdateOpen] = React.useState(false);
  const [hsnMasterUpdateOpen, setHsnMasterUpdateOpen] = React.useState(false);
  const [colorMasterOpen, setColorMasterOpen] = React.useState(false);
  const [addressMasterUpdateOpen, setAddressMasterUpdateOpen] =
    React.useState(false);
  const [createAccountOpen, setCreateAccountOpen] = React.useState(false);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setSettingsOpen(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSettingsOpen(false);
  };

  const logoutHandler = async () => {
    navigate("/");

    handleLogout();
    sessionStorage.clear(); // Clear session storage
    Cookies.remove("user"); // Clear cookies
    dispatch(logout()); // Redux logout

    // Clear React Query cache
    // await queryClient.clear();
    // await localStoragePersister.removeClient();
    localStorage.removeItem("REACT_QUERY_OFFLINE_CACHE");
    window.location.reload(); // Reload the page to reflect changes

    handleClose();
  };

  const handleOpenProfile = () => {
    setOpenProfile(true);
    handleClose();
  };
  const handleOpenReturn = () => {
    setOpenDamage(true);
    handleClose();
  };

  const handleCloseProfile = () => setOpenProfile(false);
  const handleCloseDamang = () => setOpenDamage(false);

  const handleSettingsClick = () => setSettingsOpen(!settingsOpen);
  const handleManageClick = () => {
    navigate("/manage");
    handleClose();
  };

  const handleProductUpdateClose = () => setProductUpdateOpen(false);

  const handleHsnMasterUpdateClose = () => setHsnMasterUpdateOpen(false);

  const handleColorMasterClose = () => setColorMasterOpen(false);

  const handleAddressMasterUpdateClose = () =>
    setAddressMasterUpdateOpen(false);

  const handleCreateAccountOpen = () => {
    setCreateAccountOpen(true);
    handleClose();
  };

  const handleCreateAccountClose = () => setCreateAccountOpen(false);

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              sx={{ width: 32, height: 32 }}
              src={img || "img/avtar.jpg"}
            />
          </IconButton>
        </Tooltip>
      </Box>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
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
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleSettingsClick}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>

        {settingsOpen && (
          <>
            <MenuItem onClick={handleOpenProfile}>
              <ArrowRightIcon /> Profile
            </MenuItem>
            <MenuItem onClick={handleManageClick}>
              <ArrowRightIcon /> Manage
            </MenuItem>
            <MenuItem onClick={handleOpenReturn}>
              <ArrowRightIcon /> Properties
            </MenuItem>
            <Divider />
          </>
        )}

        <MenuItem onClick={handleCreateAccountOpen}>
          <ListItemIcon>
            <SensorOccupiedIcon fontSize="small" />
          </ListItemIcon>
          Create An account
        </MenuItem>
        <MenuItem onClick={logoutHandler}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      <UserProfile open={openProfile} handleClose={handleCloseProfile} />
      <SettingsDamageReturn open={openDamage} handleClose={handleCloseDamang} />

      <Dialog
        open={productUpdateOpen}
        onClose={handleProductUpdateClose}
        fullWidth
        maxWidth="md"
      >
        <ProductMasterUpdate />
      </Dialog>

      <Dialog
        open={hsnMasterUpdateOpen}
        onClose={handleHsnMasterUpdateClose}
        fullWidth
        maxWidth="md"
      >
        <HsnMasterUpdate />
      </Dialog>

      <Dialog
        open={colorMasterOpen}
        onClose={handleColorMasterClose}
        fullWidth
        maxWidth="md"
      >
        <ColorMaster />
      </Dialog>

      <Dialog
        open={addressMasterUpdateOpen}
        onClose={handleAddressMasterUpdateClose}
        fullWidth
        maxWidth="md"
      >
        <AddressMasterUpdate />
      </Dialog>

      <CreateAccount
        open={createAccountOpen}
        handleClose={handleCreateAccountClose}
      />
    </React.Fragment>
  );
}
