import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import ProductCreateForm from "./ProductCreateForm";

export default function ProductCreateDialog({ fetchProduct, data }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // console.log(data);

  // Functions to handle dialog open/close
  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);
  return (
    <div>
      <Button
        variant="contained"
        // startIcon={<AddCircleOutlineIcon />}
        onClick={handleDialogOpen}
        sx={{
          bgcolor: "#4D795B",
          borderRadius: "15px",

          mb: 1,
          "&:hover": {
            backgroundColor: "#3E624A",
          },
          width: isMobile ? "100%" : "12rem",
          height: "3rem",
        }}
      >
        Add Product
      </Button>{" "}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "white",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <AddCircleOutlineIcon />
            Add New Product
          </div>
          <IconButton onClick={handleDialogClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <ProductCreateForm
            handleDialogClose={handleDialogClose}
            fetchProduct={fetchProduct}
            data={data}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} variant="text" color="success">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
