import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import loginbg from "../../img/Login.png";
import sideImage from "../../img/stikerLogin.png"; // Import the PNG file

import millan from "../../img/millan logo.png"; // Import the medium logo
import probhabi from "../../img/probhabi.png"; // Import the tiny logo
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../../Redux/authSlice";
import ShowMsz from "../../components/showMsz/ShowMsz";
import HomeIcon from "@mui/icons-material/Home";
import Cookies from "js-cookie";
import LoadingComp from "./../../components/loadingComp/LoadingComp";

function LoginPage({ handleLogin }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        onSubmit();
      }
    };
    window.addEventListener("keypress", handleKeyPress);
    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [formData]);

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rememberMe" ? checked : value,
    }));
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_URL}/api/login`,
        formData
      );
      if (res?.data?.user?.id) {
        dispatch(login(res.data.user));
        Cookies.set("user", JSON.stringify(res.data.user)); // Save user data in cookies
        Cookies.set("token", JSON.stringify(res.data.token)); // Save user data in cookies

        navigate("/purchase");
        setLoading(false);
      }
    } catch (error) {
      setOpen(true);
      setLoading(false);
      setMessage(error?.response?.data?.error);
      setOpen(true);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${loginbg})`,
        backgroundSize: "cover",
        height: "100vh",
        width: {
          xs: "100%", // Full width on mobile
          md: "100vw",
        },
        position: "relative",
        zIndex: 1,
        left: {
          xs: "0", // No left offset on mobile
          md: "-240px",
        },
      }}
    >
      {/* Background Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 120, 207, 0.4)", // Use rgba for semi-transparency
          zIndex: 2,
        }}
      />
      {/* Millan Logo at top left */}
      {/* <Box
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          backgroundColor: "#fff",
          borderRadius: "50%",
          padding: "8px",
          zIndex: 6,
          p:0.5,
        }}
      >
        <img src={probhabi} alt="Millan Logo" style={{ height: "80px" }} />
      </Box> */}
      {/* Background Color Filter */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          backgroundColor: "#fff",
          borderRadius: "50%",
          padding: "2px",
          zIndex: 6,
          cursor: "pointer",
        }}
        onClick={() => navigate("/")}
      >
        <HomeIcon />
      </Box>
      <Box
        sx={{
          position: "relative",
          backgroundColor: { xs: "", md: "rgba(0, 120, 207, 0.7)" }, // Use rgba for semi-transparency
          zIndex: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          pr: {
            xs: "3.2rem", // Reduced padding for mobile
            md: "15rem",
          },
          pl: {
            xs: "1rem", // Reduced padding for mobile
            md: "2rem",
          },
          width: {
            md: "auto",
          },
        }}
      >
        {/* Content */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            zIndex: 3,
            flexDirection: {
              xs: "column", // Stack vertically on mobile
              md: "row",
            },
            width: {
              xs: "100%", // Full width on mobile
              md: "auto",
            },
          }}
        >
          {/* Side Image */}
          <Box
            sx={{
              display: {
                xs: "none", // Hide on mobile
                md: "block",
              },
              mr: -25,
              mt: 1,
              // zIndex: 99999,
              position: "relative",
              opacity: 1, // Increase visibility
              ml: -8,
            }}
          >
            <img
              src={sideImage}
              alt="Side"
              style={{ maxHeight: "550px", borderRadius: "12px" }}
            />
          </Box>
          {/* Form Card */}
          <Box
            sx={{
              width: {
                xs: "100%", // Full width on mobile
                md: "50vh",
              },
              maxHeight: {
                xs: "90vh", // Taller on mobile
                md: "80vh",
              },
              backgroundColor: "rgba(255, 255, 255, 0.95)", // Increase visibility
              border: "3px solid rgba(255, 255, 255, .2)",
              boxShadow: "0 0 10px rgba(0, 0, 0, .2)",
              borderRadius: "12px",
              padding: {
                xs: "20px 15px", // Reduced padding on mobile
                md: "10px 30px 4px 30px",
              },
              m: "auto",
              zIndex: 999,
              position: "relative",
            }}
          >
            {/* Logo */}
            <Box
              sx={{
                textAlign: "center",
                mb: 2,
                "& img": {
                  height: {
                    xs: "60px", // Smaller logo on mobile
                    md: "80px",
                  },
                },
              }}
            >
              <img src="/img/logo/millan.png" alt="Milan Logo" />
            </Box>
            {/* Welcome Text */}
            <Typography
              variant="h4"
              component="h1"
              sx={{
                color: "#000",
                mb: 1,
                fontWeight: "bold",
                textAlign: "center",
                fontSize: {
                  xs: "1.5rem", // Smaller text on mobile
                  md: "2rem",
                },
              }}
            >
              Welcome To PI Pharma
            </Typography>
            {/* Email Input */}
            <TextField
              fullWidth
              variant="outlined"
              label="Enter your email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#0078CF", borderWidth: 2 },
                  "&:hover fieldset": {
                    borderColor: "#0078CF",
                    borderWidth: 2,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#0078CF",
                    borderWidth: 2,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#0078CF",
                  fontSize: {
                    xs: "1rem", // Smaller font on mobile
                    md: "1.2rem",
                  },
                  fontWeight: "bold",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#0078CF",
                  fontSize: {
                    xs: "1rem", // Smaller font on mobile
                    md: "1.2rem",
                  },
                  fontWeight: "bold",
                },
              }}
              InputProps={{
                style: {
                  borderRadius: 15,
                  color: "#000",
                  fontSize: window.innerWidth < 600 ? "1.2rem" : "1.5rem", // Conditional font size
                  backgroundColor: "#fff",
                  backdropFilter: "blur(10px)",
                },
              }}
            />
            {/* Password Input */}
            <TextField
              fullWidth
              variant="outlined"
              label="Enter your password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#0078CF", borderWidth: 2 },
                  "&:hover fieldset": {
                    borderColor: "#0078CF",
                    borderWidth: 2,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#0078CF",
                    borderWidth: 2,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#0078CF",
                  fontSize: {
                    xs: "1rem", // Smaller font on mobile
                    md: "1.2rem",
                  },
                  fontWeight: "bold",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#0078CF",
                  fontSize: {
                    xs: "1rem", // Smaller font on mobile
                    md: "1.2rem",
                  },
                  fontWeight: "bold",
                },
              }}
              InputProps={{
                style: {
                  borderRadius: 15,
                  color: "#000",
                  fontSize: window.innerWidth < 600 ? "1.2rem" : "1.5rem", // Conditional font size
                  backgroundColor: "#fff",
                  backdropFilter: "blur(10px)",
                },
                endAdornment: (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleTogglePassword}
                    edge="end"
                    sx={{ color: "#0078CF" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
            {/* Remember Me Checkbox */}
            {/* <FormControlLabel
              control={
                <Checkbox
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  name="rememberMe"
                />
              }
              label={
                <Typography sx={{ color: "#0078CF" }}>Remember me</Typography>
              }
              sx={{ color: "white", marginTop: "10px", mb: "20px" }}
            /> */}

            {/* Login Button */}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#0078CF",
                  height: {
                    xs: "45px", // Smaller height on mobile
                    md: "55px",
                  },
                  width: {
                    xs: "60%", // Wider on mobile
                    md: "40%",
                  },
                  mt: "10px",
                  fontSize: {
                    xs: "0.9rem", // Smaller font on mobile
                    md: "1rem",
                  },
                  fontWeight: "bold",
                  padding: "12px",
                  borderRadius: "12px",
                  "&:hover": { backgroundColor: "#3a754b" },
                }}
                onClick={onSubmit}
              >
                Log In
              </Button>
            </Box>
            {/* Sign Up Link */}
            {/* <Box sx={{ mt: 2.5, textAlign: "center" }}>
              <Typography variant="body1" align="center" fontSize="1.2rem">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  style={{ color: "#0078CF", fontWeight: "bold" }}
                >
                  Sign Up
                </Link>
              </Typography>
            </Box> */}
            {/* Footer */}
            <Box
              sx={{
                textAlign: "center",
                mt: {
                  xs: "2rem", // Less margin on mobile
                  md: "3rem",
                },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "& img": {
                  height: {
                    xs: "15px", // Smaller logo on mobile
                    md: "20px",
                  },
                },
              }}
            >
              <img
                src={probhabi}
                alt="Tiny Logo"
                style={{ marginRight: "8px" }}
              />
              <Typography
                variant="body2"
                fontSize={{
                  xs: "0.7rem", // Smaller text on mobile
                  md: "0.8rem",
                }}
              >
                Product by Prabhabi Infocom
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      {/* Message Component */}
      <ShowMsz
        open={open}
        handleClickOpen={() => setOpen(true)}
        handleClose={() => setOpen(false)}
        message={message}
      />
      <LoadingComp loading={loading} />
    </Box>
  );
}

export default LoginPage;
