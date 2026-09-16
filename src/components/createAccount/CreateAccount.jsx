import React, { useState } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import SingupShowMz from "../showMsz/SingupShowMz";
import CloseIcon from "@mui/icons-material/Close";
import Cookies from "js-cookie"; // Import js-cookie

// // Define missing variables
// const backgroundImg = "path/to/backgroundImg.jpg";
// const millan = "path/to/millan.jpg";

// // Define missing functions
// const navige = (path) => {
//   // Implement navigation logic here
// };

// Define validation schema using yup
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  phoneNumber: yup
    .string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  address: yup.string().required("Address is required"),
});

export default function CreateAccount({ open, handleClose }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [SingupShowMzOpen, setSingupShowMzOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Define isAdmin state
  const [msz, setMsz] = useState("");

  // Reset form fields when dialog is closed
  React.useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = async (data) => {
    const newUser = {
      ...data,
      password_confirmation: data.password,
      isAdmin,
    };
    const token = Cookies.get("token"); // Get token from cookies
    const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_URL}/api/signup`,
        newUser,
        {
          headers: {
            Authorization: sanctumToken,
          },
        }
      );

      setSingupShowMzOpen(true);
     
      res.data.error ? setMsz(res.data.error) : setMsz(1);
    } catch (error) {
      setMsz("Sign Up Failed!!!!!!");
      setSingupShowMzOpen(true); // Ensure the message dialog is shown on error
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="md"
        PaperProps={{
          style: {
            background: "white",
            opacity: 1,
            borderRadius: "30px", // Added border radius
          },
        }}
      >
        {/* Animated Graphics at top right */}
        <Box
          sx={{
            position: "absolute",
            top: 32, // was 6, now moved down
            right: 40,
            zIndex: 10,
            display: "flex",
            gap: 3,
            alignItems: "center",
            pointerEvents: "none",
          }}
        >
          {/* Capsule SVG with continuous open/close animation */}
          <Box
            sx={{
              width: 68,
              height: 68,
              animation: "capsule-rotate 1.8s ease-in-out infinite alternate",
              "@keyframes capsule-rotate": {
                from: { transform: "rotate(0deg)" },
                to: { transform: "rotate(-30deg)" },
              },
            }}
          >
            <svg width="68" height="68" viewBox="0 0 68 68">
              {/* Capsule shadow */}
              {/* <ellipse cx="34" cy="54" rx="18" ry="6" fill="#b0bec5" opacity="0.3"/> */}
              {/* Capsule body */}
              <rect x="14" y="18" width="40" height="24" rx="12" fill="#e0e0e0" stroke="#0078CF" strokeWidth="2"/>
              {/* Capsule left half */}
              <rect x="14" y="18" width="20" height="24" rx="12" fill="#0078CF" opacity="0.85"/>
              {/* Capsule right half */}
              <rect x="34" y="18" width="20" height="24" rx="12" fill="#fff" opacity="0.95"/>
              {/* Capsule split line */}
              <line x1="34" y1="20" x2="34" y2="40" stroke="#0078CF" strokeWidth="2"/>
              {/* Highlight */}
              <ellipse cx="22" cy="26" rx="6" ry="2" fill="#fff" opacity="0.7"/>
              {/* 3D shine */}
              <ellipse cx="46" cy="34" rx="7" ry="2" fill="#b3e5fc" opacity="0.5"/>
            </svg>
          </Box>
          {/* Injection SVG with continuous up/down animation */}
          <Box
            sx={{
              width: 56,
              height: 80,
              animation: "inject-move 1.2s ease-in-out infinite alternate",
              "@keyframes inject-move": {
                from: { transform: "translateY(0)" },
                to: { transform: "translateY(-16px)" },
              },
            }}
          >
            <svg width="56" height="80" viewBox="0 0 56 80">
              {/* Shadow */}
              {/* <ellipse cx="28" cy="74" rx="12" ry="5" fill="#b0bec5" opacity="0.3"/> */}
              {/* Barrel */}
              <rect x="22" y="22" width="12" height="32" rx="5" fill="#fff" stroke="#0078CF" strokeWidth="2"/>
              {/* Measurement lines */}
              <line x1="24" y1="28" x2="32" y2="28" stroke="#90caf9" strokeWidth="1"/>
              <line x1="24" y1="34" x2="32" y2="34" stroke="#90caf9" strokeWidth="1"/>
              <line x1="24" y1="40" x2="32" y2="40" stroke="#90caf9" strokeWidth="1"/>
              <line x1="24" y1="46" x2="32" y2="46" stroke="#90caf9" strokeWidth="1"/>
              {/* Liquid */}
              <rect x="22" y="38" width="12" height="12" rx="5" fill="#81d4fa" opacity="0.7"/>
              {/* Plunger rod */}
              <rect x="26" y="8" width="4" height="22" rx="2" fill="#0078CF"/>
              {/* Plunger ring */}
              <ellipse cx="28" cy="8" rx="7" ry="3" fill="#b3e5fc" stroke="#0078CF" strokeWidth="1"/>
              {/* Plunger knob */}
              <circle cx="28" cy="8" r="3" fill="#0078CF"/>
              {/* Needle */}
              <rect x="27" y="54" width="2" height="16" fill="#90caf9"/>
              {/* Needle tip */}
              <polygon points="28,70 26,76 30,76" fill="#90caf9"/>
            </svg>
          </Box>
           </Box>
        {/* Close Icon at top right */}
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 6,
            cursor: "pointer",
          }}
          onClick={handleClose}
        >
          <CloseIcon />
        </Box>

        <Box
          sx={{
            zIndex: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "auto", // Changed from "hidden"
            maxHeight: "90vh", // Added max height
            overflowY: "auto", // Added vertical scroll
            opacity: 1,
          }}
        >
          {/* Content */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              zIndex: 3,
            }}
          >
            {/* Form Card */}
            <Box
              sx={{
                maxWidth: "50vh", // Reduced from 60vh
                border: "2px solid rgba(255, 255, 255, .2)", // Thinner border
                borderRadius: "20px", // Changed from 12px to 20px
                padding: "8px 20px 4px 20px", // Reduced padding
                m: "auto",
                zIndex: 999,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                background: "white",
              }}
            >
              {/* Logo */}
              <Box sx={{ textAlign: "center" }}>
                {/* <img
                  src="/img/signup/millan logo.png"
                  alt="Logo"
                  style={{ height: "60px" }} // Reduced from 80px
                /> */}
              </Box>
              <Typography
                variant="h5" // Changed from h4
                sx={{
                  color: "black",
                  fontWeight: "bold",
                  padding: "0.3rem", // Reduced padding
                  textAlign: "center",
                }}
              >
                Create New Account
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={1} sx={{ mt: -0.5 }}>
                  {" "}
                  {/* Reduced spacing */}
                  {[
                    "name",
                    "email",
                    "password",
                    "confirmPassword",
                    "phoneNumber",
                    "address",
                  ].map((field, index) => (
                    <Grid item xs={12} key={index}>
                      <Controller
                        name={field}
                        control={control}
                        defaultValue=""
                        render={({
                          field: { onChange, value },
                          fieldState,
                        }) => (
                          <>
                            <TextField
                              fullWidth
                              variant="outlined"
                              label={
                                field === "phoneNumber"
                                  ? "Phone"
                                  : field === "address"
                                    ? "Address"
                                    : field.charAt(0).toUpperCase() +
                                      field
                                        .slice(1)
                                        .replace(
                                          "confirmPassword",
                                          "Confirm Password"
                                        )
                              }
                              type={
                                field.includes("password")
                                  ? "password"
                                  : field === "phoneNumber"
                                    ? "tel"
                                    : "text"
                              }
                              value={value}
                              onChange={onChange}
                              error={!!errors[field]}
                              helperText={errors[field]?.message}
                              autoComplete={
                                field.includes("password")
                                  ? "new-password"
                                  : field === "email"
                                    ? "off"
                                    : "on"
                              }
                              InputProps={{
                                style: { color: "#0078CF", borderRadius: 10 },
                              }}
                              InputLabelProps={{
                                style: { color: "#0078CF", fontWeight: "bold" },
                              }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  backgroundColor: "#fff",
                                  "& fieldset": { borderColor: "#0078CF" },
                                  "&:hover fieldset": {
                                    borderColor: "#0078CF",
                                    boxShadow: "0 0 5px rgba(69, 143, 92, 0.5)",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#0078CF",
                                    borderWidth: 2,
                                  },
                                },
                                "& .MuiFormHelperText-root": {
                                  color: "#f44336",
                                  fontWeight: "bold",
                                },
                              }}
                              multiline={field === "address"}
                              minRows={field === "address" ? 1 : undefined}
                            />
                            {field === "confirmPassword" &&
                              value !== "" &&
                              value !== control._formValues.password && (
                                <Typography
                                  variant="caption"
                                  color="error"
                                  sx={{ fontWeight: "bold" }}
                                >
                                  Passwords do not match
                                </Typography>
                              )}
                          </>
                        )}
                      />
                    </Grid>
                  ))}
                </Grid>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  {" "}
                  {/* Reduced margin */}
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      mr: 1,
                      padding: "8px 20px", // Reduced padding
                      borderRadius: "12px",
                      backgroundColor: "#0078CF",
                      fontWeight: "bold",
                    }}
                    type="submit"
                  >
                    Sign Up
                  </Button>
                </Box>
              </form>

              {/* Footer */}
              <Box sx={{ textAlign: "center", mt: "1rem" }}>
                {" "}
                {/* Reduced margin */}
                <img
                  src="img/signup/probhabi.png"
                  alt="Tiny Logo"
                  style={{ height: "16px", marginRight: "6px" }} // Reduced size
                />
                <Typography variant="body2" fontSize="0.8rem">
                  Product by Prabhabi Infocom
                </Typography>
              </Box>
            </Box>
            {/* formcard */}
            <Box
              sx={{
                display: { xs: "none", md: "block" },
                ml: -8, // Reduced margin
                mt: 12, // Reduced margin
                zIndex: 99999,
                position: "relative",
                opacity: 1, // Increase visibility
              }}
            >
              <img
                src="img/signup/stikerSignup.png"
                alt="Side"
                style={{ maxHeight: "400px" }} // Reduced from 500px
              />
            </Box>
          </Box>
        </Box>
        <SingupShowMz
          open={SingupShowMzOpen}
          handleClickOpen={() => setSingupShowMzOpen(true)}
          handleClose={() => setSingupShowMzOpen(false)}
          message={msz}
        />
      </Dialog>
    </React.Fragment>
  );
}
