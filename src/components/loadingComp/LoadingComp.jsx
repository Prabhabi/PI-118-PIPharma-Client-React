import { Box, LinearProgress, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useState } from "react";
import image from "./1.gif";

export default function LoadingComp({ loading, onClose }) {
  const [isLoading, setIsLoading] = useState(loading);
  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);
  return (
    <>
      {isLoading && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column", // Align items vertically
            justifyContent: "center",
            alignItems: "center",
            position: "fixed", // Fixed to cover the whole viewport
            top: "0",
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(255, 255, 255, .2)", // Semi-transparent background
            zIndex: 9999, // Ensure it appears on top of everything
          }}
        >
          {/* Close Button */}
          <IconButton
            aria-label="close"
            onClick={() => setIsLoading(false)}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              color: "blue", // changed from "#333" to "blue"
              backgroundColor: "rgba(255,255,255,0.7)",
              "&:hover": { backgroundColor: "rgba(255,255,255,1)" },
              zIndex: 10000,
            }}
            size="large"
          >
            <CloseIcon />
          </IconButton>
          {/* Loading GIF */}
          <Box
            sx={{
              backgroundColor: "rgba(255, 255, 255, .9)",
              width: { xs: "50%", sm: "40%", md: "20%" },
              // height: {xs: "15%", sm: "20%"},

              // bgcolor: "green",
              padding: "5rem",
              borderRadius: "50px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box sx={{ width: "12rem", position: "relative" }}>
              <img
                src={image} // Path to your GIF
                alt="Loading"
                style={{
                  width: "100%",
                  height: "100%",
                  maxWidth: "20rem",
                  maxHeight: "100%",
                }}
              />
              {/* <Box
                sx={{
                  width: "3rem",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <img
                  src="./img/logo/millan.png" // Path to your GIF
                  alt="Loading"
                  style={{
                    width: "100%",
                    height: "100%",
                    maxWidth: "20rem",
                    maxHeight: "100%",
                  }}
                />
              </Box> */}
            </Box>
            <Typography
              variant="h5"
              sx={{ color: "#000", mt: 2, textAlign: "center", color: "green" }}
            >
              Please wait ...
            </Typography>

            {/* Linear Progress */}
            <Box sx={{ width: "100%", mt: 2 }}>
              <LinearProgress color="success" />
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}
