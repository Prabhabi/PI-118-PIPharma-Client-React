import React, { useState, useEffect } from "react";
import {
  TextField,
  Box,
  Button,
  MenuItem,
  Grid,
  Autocomplete,
  Dialog,
  DialogContent,
  DialogActions,
  Divider,
  DialogTitle,
} from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import ReturnInvoice from "./components/ReturnInvoice";
import Draggable from "react-draggable";
import Paper from "@mui/material/Paper";
import axios from "axios";

const ReturnOut = () => {
  const [suppliers, setSuppliers] = useState([]); // Replace hardcoded suppliers
  const invoices = ["Invoice 001", "Invoice 002", "Invoice 003", "Invoice 004"];
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const primaryStyles = {
    fontWeight: "bold",
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#1976D2" },
      "&:hover fieldset": { borderColor: "#1976D2" },
      "&.Mui-focused fieldset": { borderColor: "#1976D2" },
    },
    "& .MuiInputBase-input": { color: "#1976D2" },
    "& .MuiInputLabel-root": { color: "#1976D2" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#1976D2" },
  };

  const boxStyle = { bgcolor: "#f5f5f5", borderRadius: "10px" };

  function DraggablePaperComponent(props) {
    return (
      <Draggable
        handle="#draggable-dialog-title"
        cancel={'[class*="MuiDialogContent-root"]'}
      >
        <Paper {...props} />
      </Draggable>
    );
  }

  // Fetch suppliers from API
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_URL}/api/getSuppliers`);
        const supplierData = res.data.data.map((supplier) => ({
          label: supplier.SupplierName, // Use SupplierName for the dropdown label
        }));
        setSuppliers(supplierData);
      } catch (error) {
        // console.error("Error fetching suppliers:", error);
      }
    };
    fetchSuppliers();
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Supplier and Invoice Fields */}
      <Grid container spacing={4}>
        {[{ label: "Select Supplier", value: selectedSupplier, setValue: setSelectedSupplier, options: suppliers },
        { label: "Choose Invoice", value: selectedInvoice, setValue: setSelectedInvoice, options: invoices },
        ].map((item, index) => (
          <Grid item xs={10} sm={4} sx={{ ml: 1, mt: 2 }} key={index}>
            <Autocomplete
              value={item.value}
              onChange={(e, newValue) => item.setValue(newValue)}
              options={item.options}
              getOptionLabel={(option) => option.label || ""} // Ensure correct label is displayed
              renderInput={(params) => (
                <TextField {...params} label={item.label} variant="outlined" size="small" fullWidth sx={primaryStyles} />
              )}
            />
          </Grid>
        ))}
      </Grid>

      {/* Form Section */}
      <Box sx={{ flexGrow: 1 }}>
        {Array.from({ length: 12 }).map((_, index) => (
          <React.Fragment key={index}>
            <Grid container spacing={4} sx={{ p: 2 }}>
              <Grid item xs={6} sm={2}>
                <TextField label="Model Name" defaultValue="Model A" fullWidth size="small" sx={{ bgcolor: "#d6d6d6" }} />
              </Grid>
              <Grid item xs={5} sm={1}>
                <TextField label="Unit Type" select defaultValue="Box" fullWidth size="small">
                  <MenuItem value="Box">Box</MenuItem>
                  <MenuItem value="Pcs">Pcs</MenuItem>
                </TextField>
              </Grid>
              {[
                { label: "Pcs/Per Box", defaultValue: "10" },
                { label: "QTY", defaultValue: "100" },
                { label: "Return Qty", defaultValue: "2" },
                { label: "GST", defaultValue: "17.0" },
                { label: "HSN", defaultValue: "1234" },
                { label: "Rate", defaultValue: "500.0" },
                { label: "Discount", defaultValue: "5.0" },
                { label: "Amount", defaultValue: "450.0", bgcolor: "#fff" },
              ].map((field, i) => (
                <Grid item xs={5.5} sm={1.1} key={i}>
                  <TextField
                    label={field.label}
                    defaultValue={field.defaultValue}
                    fullWidth
                    size="small"
                    variant="outlined"
                    sx={{ ...boxStyle, ...(field.bgcolor && { bgcolor: field.bgcolor }) }}
                  />
                </Grid>
              ))}
            </Grid>
            <Divider sx={{ my: 1 }} />
          </React.Fragment>
        ))}
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button variant="contained" color="primary" sx={{ mr: 5 }} onClick={() => { handleOpenDialog(); }}>
          Submit <ExitToAppIcon />
        </Button>
        <Button variant="outlined" color="error" sx={{ mr: 2 }}>
          Clear <NotInterestedIcon />
        </Button>
      </Box>

      {/* Draggable Dialog Section */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
        PaperComponent={DraggablePaperComponent}
      >
        <DialogTitle id="draggable-dialog-title" sx={{ bgcolor: "#f5f5f5" }}>
          Return Out
        </DialogTitle>
        <DialogContent>
          <ReturnInvoice />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReturnOut;
