import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import SupplierEditDetailsDialog from "../supplierDetailsDialog/component/supplierEditDetailsDialog/SupplierEditDetailsDialog";
import PeopleIcon from "@mui/icons-material/People";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

export default function SupplierCreateDialog({
  fetchSuppliers,
  fetchAllSupplier,
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
          // borderRadius: "15px",
          width: "13rem",
          height: "50px",
          textTransform: "none",
          borderRadius: "15px",
        }}
      >
        {" "}
        Add Supplier
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
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <PeopleIcon />
            Add New Supplier
          </div>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              color: "white",
              "&:hover": {
                color: "#c8e6c9",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <SupplierEditDetailsDialog
            fetchAllSupplier={fetchAllSupplier}
            fetchSuppliers={fetchSuppliers}
            handleClose={handleClose}
            initialValues={{
              stateMasterID: "",
              cityMasterID: "",
              // ...add other initial fields as needed...
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="text" color="success" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
