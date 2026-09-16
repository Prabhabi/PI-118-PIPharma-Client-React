import React from "react";
import { Link } from "react-router-dom";
import { Button, Typography, Box } from "@mui/material";

const NotPage = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
      }}
    >
      <Typography
        variant="h1"
        component="div"
        sx={{ fontSize: "6em", marginBottom: 0 }}
      >
        404
      </Typography>
      <Typography
        variant="h2"
        component="div"
        sx={{ fontSize: "2em", marginTop: 0 }}
      >
        Page Not Found
      </Typography>
      <Typography variant="body1" component="p" sx={{ fontSize: "1.2em" }}>
        Sorry, the page you are looking for does not exist.
      </Typography>
      <Button
        component={Link}
        to="/"
        variant="contained"
        color="success"
        sx={{ marginTop: "20px", padding: "10px 20px", borderRadius: "5px" }}
      >
        Go to Home
      </Button>
    </Box>
  );
};

export default NotPage;
