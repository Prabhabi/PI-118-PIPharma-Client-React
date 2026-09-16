import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Typography } from "@mui/material";

export default function EmailSendDialog({ status, openDias, onClose }) {
  return (
    <Dialog
      open={openDias}
      // onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          sx={{
            minHeight: "20rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {status === 1 ? (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box sx={{ width: "70%" }}>
                <img
                  src="/img/loading/emailLoad.gif"
                  alt="Loading"
                  style={{ marginRight: "10px", width: "100%" }}
                />
                <Typography sx={{ textAlign: "center", mt: 3 }} variant="h5">
                  Please wait..........
                </Typography>
              </Box>
            </Box>
          ) : status === 2 ? ( // Handle status 2 for success
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box sx={{ width: "70%" }}>
                <img
                  src="/img/loading/loadingGif.gif"
                  alt="Success"
                  style={{
                    marginRight: "10px",
                    width: "100%",
                    marginTop: "-4rem",
                  }}
                />
                <Typography sx={{ textAlign: "center", mt: -3 }} variant="h5">
                  Email Sent Successfully
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ mt: 3, display: "block", mx: "auto" }}
                  onClick={onClose}
                >
                  Close
                </Button>
              </Box>
              <EmailSendDialog
              // status={status} // Ensure status is passed correctly
              // openDias={openDia}
              // onClose={() => {
              //   setOpenDia(false); // Close the dialog
              //   setStatus(null); // Reset status when dialog is closed
              //   handleCloseEmail();
              // }}
              />
            </Box>
          ) : null}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
