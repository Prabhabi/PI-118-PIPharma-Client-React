import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Box,  Typography } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";

export default function ShowMsz({ open, handleClose, message }) {
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "16px",
            padding: "1rem",
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            textAlign: "center",
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: message == 1 ? "green" : "red",
          }}
        >
          {message == 1 ? "Success!" : "Login Failed!!!"}
        </DialogTitle>
        <DialogContent
          sx={{
            minHeight: "6rem",
            minWidth: "25rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 2,
            }}
          >
            {message == 1 ? (
              <VerifiedIcon style={{ fontSize: "4rem", color: "green" }} />
            ) : (
              <ErrorIcon style={{ fontSize: "4rem", color: "red" }} />
            )}
          </Box>
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              fontSize: "1.1rem",
              color: "gray",
            }}
          >
            {message == 1 ? "You have successfully registered!" : message}
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Button
            onClick={handleClose}
            variant={message == 1 ? "contained" : "outlined"}
            color={message == 1 ? "success" : "error"}
            sx={{
              textTransform: "none",
            }}
            autoFocus
          >
            {message == 1 ? "Done" : "Try again"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
