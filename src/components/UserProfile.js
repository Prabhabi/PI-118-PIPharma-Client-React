// src/pages/User.js
import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Grid,
  LinearProgress,
  Link,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector } from "react-redux";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";
import PasswordResetDialog from "./PasswordResetDialog";

// Sample user data
const user = {
  name: "ant",
  email: "ant@ant.com",
  created_at: "2025-02-21 12:15:08.000",
};

const UserProfile = ({ open, handleClose }) => {
  const navigate = useNavigate();
  const user = useSelector((i) => i.auth.user);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  const handlePasswordDialogOpen = () => {
    setPasswordDialogOpen(true);
  };

  const handlePasswordDialogClose = () => {
    setPasswordDialogOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      {/* Dialog Title */}
      <DialogTitle
        sx={{
          color: "white",
          fontWeight: "bold",
          p: 2,
          // borderRadius: "15px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box display="flex" alignItems="center">
          <AccountCircleIcon sx={{ mr: 1 }} />
          User Profile
        </Box>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            color: "white",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Dialog Content */}
      <DialogContent
        sx={{
          padding: 3,
          minHeight: "20rem",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          width="100%"
        >
          <Avatar
            alt="User Photo"
            src="img/avtar.jpg"
            sx={{
              width: 120,
              height: 120,
              border: "5px solid #00b0ff",
              mb: 2,
            }}
          />
          <Typography variant="h6" fontWeight="bold">
            {user.name}
          </Typography>
          <Typography color="textSecondary">{user.email}</Typography>
          <Typography color="textSecondary">
            Created At: {new Date(user.created_at).toLocaleDateString("en-GB")}
          </Typography>
          <Box mt={2} display="flex" gap={1}></Box>
        </Box>

        <Box>
          <Button
            sx={{ mt: 2 }}
            variant="outlined"
            color="primary"
            onClick={handlePasswordDialogOpen}
          >
            <EditIcon sx={{ mr: 1 }} />
            Reset Password
          </Button>
        </Box>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions>
        <Button onClick={handleClose} variant="text" color="success">
          Close
        </Button>
      </DialogActions>
      <PasswordResetDialog
        open={passwordDialogOpen}
        handleClose={handlePasswordDialogClose}
      />
    </Dialog>
  );
};

export default UserProfile;
