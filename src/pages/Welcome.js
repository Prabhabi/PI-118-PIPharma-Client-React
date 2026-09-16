// src/pages/Home.js
import React, { useEffect } from "react";
import { Button, Box, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../img/homebgimg.png"; // Import your image here
import logoImage from "../img/stickerhome.png"; // Import your logo image here
import { useSelector } from "react-redux";

export default function Welcome() {
  const navigate = useNavigate();

  useEffect(() => {
    // Apply global styles to prevent scrolling
    document.body.style.margin = 0;
    document.body.style.padding = 0;
    document.body.style.overflow = "hidden";
    document.documentElement.style.margin = 0;
    document.documentElement.style.padding = 0;
    document.documentElement.style.overflow = "hidden";

    // Cleanup styles on component unmount
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);
  const user = useSelector((i) => i?.auth?.user?.id);

  return (
    <Box
      sx={{
        position: "relative",
        left: { xs: 0, md: "-240px" },
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden",
        "::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: { xs: 0, md: "-240px" },
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 120, 207, 0.5)", // 0078CF with 50% opacity
          opacity: 1,
          zIndex: 1,
        },
        zIndex: 0,
      }}
    >
      <img
        src={logoImage}
        alt="Logo"
        style={{
          width: "100%",
          maxWidth: "410px",
          marginBottom: "20px",
          zIndex: 2,
          padding: "0 20px",
        }}
      />
      <Typography
        variant="h3"
        sx={{
          mb: 3,
          zIndex: 2,
          color: "white",
          fontSize: { xs: "40px", sm: "50px", md: "70px" },
          px: 2,
        }}
      >
        Welcome to PI Pharma
      </Typography>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
          px: 2,
        }}
      >
        {user && (
          <Typography
            variant="body1"
            sx={{
              zIndex: 2,
              color: "white",
              textAlign: "center",
            }}
          >
            You are already Logged in go to -
          </Typography>
        )}
        <Button
          variant="contained"
          onClick={() => (user ? navigate("/purchase") : navigate("/login"))}
          sx={{
            mb: 3,
            mt: 3,
            zIndex: 2,
            borderRadius: "10px",
            height: "40px",
            fontWeight: "bold",
            backgroundColor: "#0078CF",
            color: "#fff",
            width: { xs: "220px", sm: "180px" },
            "&:hover": {
              backgroundColor: "#0078CF",
              color: "white",
              fontWeight: "bold",
            },
          }}
        >
          {user ? "DashBoard" : "Login"}
        </Button>
      </Stack>
    </Box>
  );
}
