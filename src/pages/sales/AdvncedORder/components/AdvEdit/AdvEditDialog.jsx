import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import AdvEditForm from "./component/AdvEdit/AdvEditForm";

function AdvEditDialog({
  selectdQuo,
  supplierList,
  allItems,
  companyList,
  signatoryList,
  fetchQuotationsFn,
  fetchAdvaceOrder,
  onClose,
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
        color="success"
        onClick={handleClickOpen}
        startIcon={<EditIcon />}
      >
        Edit
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle
          id="alert-dialog-title"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <EditIcon />
            Edit Quotation
          </div>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            style={{ color: "gray" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <AdvEditForm
            selectdQuo={selectdQuo}
            supplierList={supplierList}
            allItems={allItems}
            companyList={companyList}
            signatoryList={signatoryList}
            fetchQuotationsFn={fetchQuotationsFn}
            handleClose={() => {
              handleClose(); // Ensure the dialog closes
              onClose && onClose(); // Invoke onClose if provided
            }}
            fetchAdvaceOrder={fetchAdvaceOrder}
          />
        </DialogContent>
        <DialogActions style={{ justifyContent: "flex-end", display: "flex" }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleClose}
            autoFocus
          >
            Close{" "}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default AdvEditDialog;

// supplierList,
// allItems,
// companyList,
// signatoryList,
