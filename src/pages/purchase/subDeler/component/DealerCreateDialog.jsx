import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DelerEditDetailsDialog from "./DelerEditDetailsDialog";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";

export default function DoctorCreateDialog({
  fetchDealers,
  fetchallSubDealer,
  type,
}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        sx={{
          borderRadius: "15px",
          width: "13rem",
          height: "50px",
          fontWeight: "bold",
          textTransform: "none",
        }}
      >
        Add Doctor
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PersonAddIcon />
            Create New Doctor
          </Box>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              color: "white",
              "&:hover": {},
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DelerEditDetailsDialog
            fetchDealers={fetchDealers}
            handleClose={handleClose}
            fetchallSubDealer={fetchallSubDealer}
            type={type}
            isDoctor
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="text">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
