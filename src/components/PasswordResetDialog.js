import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LockIcon from "@mui/icons-material/Lock";
import axios from "axios";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useForm, Controller } from "react-hook-form";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const passwordStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { label: "Weak", color: "#d32f2f" };
  if (score === 3) return { label: "Medium", color: "#fbc02d" };
  if (score === 4) return { label: "Strong", color: "#d47f17" };
  if (score === 5) return { label: "Great", color: "#388e3c" };
  return { label: "", color: "" };
};

const passwordFormatRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

// Helper for live password requirements
const getPasswordRequirements = (password) => {
  return [
    {
      label: "Min 8 chars",
      valid: password.length >= 8,
    },
    {
      label: "1 uppercase",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "1 lowercase",
      valid: /[a-z]/.test(password),
    },
    {
      label: "1 number",
      valid: /\d/.test(password),
    },
    {
      label: "1 special char",
      valid: /[^A-Za-z0-9]/.test(password),
    },
  ];
};

const PasswordResetDialog = ({ open, handleClose }) => {
  const user = useSelector((i) => i.auth.user);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");
  const strength = passwordStrength(newPassword);
  const passwordRequirements = getPasswordRequirements(newPassword);

  // Add show/hide state for each password field
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;
      const payload = {
        current_password: data.oldPassword,
        new_password: data.newPassword,
        new_password_confirmation: data.confirmPassword,
      };
      console.log("API Payload:", payload);
      await axios.put(
        `${process.env.REACT_APP_URL}/api/changePassword/${user.id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: sanctumToken,
          },
        }
      );
      setSnackbar({
        open: true,
        message: "Password changed successfully.",
        severity: "success",
      });
      reset();
      setTimeout(() => {
        handleClose();
      }, 1200);
    } catch (err) {
      const backendMsg =
        err.response?.data?.message ||
        "Failed to change password. Please try again.";
      setSnackbar({
        open: true,
        message: backendMsg,
        severity: "error",
      });
    }
    setLoading(false);
  };

  // Clear form and snackbar when dialog is closed or opened
  React.useEffect(() => {
    if (!open) {
      reset();
      setSnackbar({
        open: false,
        message: "",
        severity: "success",
      });
    }
  }, [open, reset]);

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box display="flex" alignItems="center">
            <LockIcon sx={{ mr: 1 }} />
            Reset Password
          </Box>
          <IconButton onClick={handleClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <Controller
              name="oldPassword"
              control={control}
              rules={{ required: "Old password is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  margin="dense"
                  label="Old Password"
                  type={showOldPassword ? "text" : "password"}
                  sx={{
                    mb: 2,
                    "& label": { color: "#388e3c" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#388e3c" },
                      "&:hover fieldset": { borderColor: "#388e3c" },
                      "&.Mui-focused fieldset": { borderColor: "#388e3c" },
                    },
                  }}
                  InputLabelProps={{ style: { color: "#388e3c" } }}
                  error={!!errors.oldPassword}
                  helperText={errors.oldPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowOldPassword((show) => !show)}
                        edge="end"
                        tabIndex={-1}
                        size="small"
                      >
                        {showOldPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                />
              )}
            />
            <Controller
              name="newPassword"
              control={control}
              rules={{
                required: "New password is required",
                validate: (value) => passwordFormatRegex.test(value) || "",
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  margin="dense"
                  label="New Password"
                  type={showNewPassword ? "text" : "password"}
                  sx={{
                    mb: 1,
                    "& label": { color: "#388e3c" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#388e3c" },
                      "&:hover fieldset": { borderColor: "#388e3c" },
                      "&.Mui-focused fieldset": { borderColor: "#388e3c" },
                    },
                  }}
                  InputLabelProps={{ style: { color: "#388e3c" } }}
                  error={!!errors.newPassword}
                  helperText={
                    errors.newPassword?.message ||
                    (newPassword &&
                    passwordRequirements.filter((req) => !req.valid).length > 0
                      ? ""
                      : "")
                  }
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowNewPassword((show) => !show)}
                        edge="end"
                        tabIndex={-1}
                        size="small"
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                />
              )}
            />
            {/* Live password requirements horizontally */}
            {newPassword && (
              <Box
                sx={{ mb: 1, ml: 1, display: "flex", flexWrap: "wrap", gap: 2 }}
              >
                {passwordRequirements
                  .filter((req) => !req.valid)
                  .map((req) => (
                    <Box
                      key={req.label}
                      component="span"
                      sx={{
                        color: "#d32f2f",
                        fontSize: "0.70rem",
                        // border: "1px solid #d32f2f",
                        borderRadius: "8px",
                        px: 1,
                        py: 0.2,
                        background: "#fff0f0",
                        display: "inline-block",
                      }}
                    >
                      {req.label}
                    </Box>
                  ))}
              </Box>
            )}
            {/* Password strength status */}
            {newPassword && (
              <Box sx={{ mb: 2 }}>
                <span
                  style={{
                    color: strength.color,
                    fontWeight: "bold",
                    fontSize: "1rem",
                  }}
                >
                  Password Strength: {strength.label}
                </span>
              </Box>
            )}
            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: "Confirm password is required",
                validate: (value) =>
                  value === newPassword || "Passwords do not match",
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  margin="dense"
                  label="Confirm New Password"
                  type={showConfirmPassword ? "text" : "password"}
                  sx={{
                    "& label": { color: "#388e3c" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#388e3c" },
                      "&:hover fieldset": { borderColor: "#388e3c" },
                      "&.Mui-focused fieldset": { borderColor: "#388e3c" },
                    },
                  }}
                  InputLabelProps={{ style: { color: "#388e3c" } }}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message || ""}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowConfirmPassword((show) => !show)}
                        edge="end"
                        tabIndex={-1}
                        size="small"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    ),
                  }}
                />
              )}
            />
            {/* Live confirm password match */}
            {confirmPassword && confirmPassword !== newPassword && (
              <Box sx={{ color: "#d32f2f", fontSize: "0.95rem", ml: 1, mb: 1 }}>
                Passwords do not match
              </Box>
            )}
            <DialogActions>
              <Button onClick={handleClose} color="success" disabled={loading}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="success"
                sx={{ mr: 1 }}
                disabled={loading}
              >
                {loading ? "Changing..." : "Change Password"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            backgroundColor:
              snackbar.severity === "success" ? "#388e3c" : "#d32f2f",
            color: "#fff",
            fontWeight: "bold",
          }}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default PasswordResetDialog;
