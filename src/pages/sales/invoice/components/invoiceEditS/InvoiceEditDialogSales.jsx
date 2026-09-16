import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import InvoiceEditFormS from "./component/invoiceEditForamS/InvoiceEditFormS";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export default function InvoiceEditDialogSales({
  invoiceDetails,
  allItems,
  allHsn,
  signatoryDetails,
  allPaymentType,
  fetchAllInvoice,
}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  console.log(invoiceDetails);

  return (
    <React.Fragment>
      <Tooltip title="Edit" placement="top" onClick={handleClickOpen}>
        <EditIcon color="warning" />
      </Tooltip>
      <Dialog
        open={open}
        fullWidth
        maxWidth="lg"
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#4D795B",
            color: "white",
          }}
        >
          <EditIcon sx={{ mr: 1 }} />
          Edit Invoice
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "white",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <InvoiceEditFormS
            invoiceDetails={invoiceDetails}
            signatoryDetails={signatoryDetails}
            allItems={allItems}
            allHsn={allHsn}
            allPaymentType={allPaymentType}
            fetchAllInvoice={fetchAllInvoice}
            handleClose={handleClose}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="text"
            // color="success"
            onClick={handleClose}
            autoFocus
            color="success"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
