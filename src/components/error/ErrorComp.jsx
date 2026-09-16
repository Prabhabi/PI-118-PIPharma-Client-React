import {
  Box,
  Typography,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";

export default function ErrorComp({ error }) {
  const [isVisible, setIsVisible] = useState(error);
  const [errorMessage, setErrorMessage] = useState(
    error?.message || "⚠We're Sorry -An Error Occurred!"
  );


  useEffect(() => {
    setIsVisible(error);
    setErrorMessage(error?.message || "⚠We're Sorry -An Error Occurred!");
  }, [error]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <>
      {isVisible && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column", // Align items vertically
            justifyContent: "center",
            alignItems: "center",
            position: "fixed", // Fixed to cover the whole viewport
            top: "-10%",
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(255, 255, 255, .2)", // Semi-transparent background
            zIndex: 9999, // Ensure it appears on top of everything
            backdropFilter: "blur(5px)", // Glass effect
          }}
        >
          {/* error GIF */}
          <Box
            sx={{
              backgroundColor: "#ff",
              width: { xs: "80%", sm: "60%", md: "40%" },
              maxWidth: "500px",
              borderRadius: "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "1rem",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <img
              src="/img/error/prabhabi.png" // Path to your GIF
              alt="error"
              style={{
                width: "29%",
                height: "auto",
                marginBottom: "1rem",
              }}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                mb: "0.6rem",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#000",
                  fontWeight: "bold",
                  mb: "0.5rem",
                }}
              >
                {errorMessage}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                We apologize for the inconvenience caused while using PIDMS System.
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Our team is here to assist you in resolving any technical issues promptly.
              </Typography>
              <Typography variant="body2">
                📧Email Support:{" "}
                <a
                  href="mailto:Prabhabi@gmail.com"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  info@prabhabi.com

                </a>
              </Typography>
              <Typography variant="body2">
               📱WhatsApp/Call Support:{" "}
                <a
                  href="https://wa.me/9436756222"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  9436756222
                </a>
                {" / "}
                <a
                  href="https://wa.me/9436757222"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  9436757222
                </a>
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
              }}
            >
              <Button
                variant="contained"
                color="success"
                onClick={handleClose}
              >
                Close
              </Button>
              <Button variant="contained" sx={{backgroundColor: "#FF8C00"}} onClick={handleRefresh}>
                Refresh
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}
