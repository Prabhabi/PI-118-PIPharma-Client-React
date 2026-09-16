import React, { useState, useEffect } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Grid,
  Button,
  DialogActions,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  ThemeProvider,
  createTheme,
  TablePagination,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie"; // Import Cookies
import RefreshIcon from "@mui/icons-material/Refresh"; // Import RefreshIcon
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BusinessIcon from "@mui/icons-material/Business";

// Custom theme with dark green colors
const theme = createTheme({
  palette: {
    primary: {
      main: "#1b5e20",
      light: "#4c8c4a",
      dark: "#003300",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& label": {
            color: "#1b5e20",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#1b5e20",
            },
            "&:hover fieldset": {
              borderColor: "#4c8c4a",
            },
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          "& label": {
            color: "#1b5e20",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#1b5e20",
            },
            "&:hover fieldset": {
              borderColor: "#4c8c4a",
            },
          },
        },
      },
    },
  },
});

const SettingsDamageReturn = ({ open, handleClose }) => {
  const [configName, setConfigName] = useState("");
  const [configMessage, setConfigMessage] = useState("");
  const [propertyNames, setPropertyNames] = useState([]);
  const [selectedPropertyMasterID, setSelectedPropertyMasterID] =
    useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");
  const [propertyDetails, setPropertyDetails] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // Track if editing mode is active
  const [editItemId, setEditItemId] = useState(null); // Store the ID of the item being edited
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [propertyItems, setPropertyItems] = useState([]); // <-- new state for flat array
  const [propertyItemsName, setPropertyItemsName] = useState([]); // <-- new state for flat array

  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

  const fetchPropertyMasterNames = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_URL}/api/getProperties/0`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: sanctumToken,
          },
        }
      );
      // Extract array from response.data.data
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setPropertyItemsName(data); // flat array
    } catch (error) {
      setPropertyItems([]); // fallback to empty array on error
    }
  };

  const fetchPropertyNames = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_URL}/api/getpropertyKeyValue?LargeContent=0`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: sanctumToken,
          },
        }
      );
      // Extract array from response.data.data
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setPropertyItems(data); // flat array
    } catch (error) {
      setPropertyItems([]); // fallback to empty array on error
    }
  };

  useEffect(() => {
    fetchPropertyNames();
    fetchPropertyMasterNames();
  }, []);

  const handleConfigNameChange = (event) => {
    setConfigName(event.target.value);
    const selected = propertyItems.find(
      (item) => item.PropertyName === event.target.value
    );
    setSelectedPropertyMasterID(selected ? selected.PropertyMasterID : null);
  };

  const handleConfigMessageChange = (event) => {
    setConfigMessage(event.target.value);
  };
  // ========================================================put ================================
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (isEditing) {
        // PUT request for updating an existing item
        const putData = {
          // PIAppPropertyID: editItemId, // Use the ID of the value (message)
          PropertyMasterID: selectedPropertyMasterID, // Use the ID of the configuration item name
          Value: configMessage, // Use the updated message value
          LargeContent: 0, // <-- hardcoded field added
        };
        await axios.put(
          `${process.env.REACT_APP_URL}/api/UpdatePIAppProperty/${editItemId}`,
          putData,
          {
            headers: {
              Authorization: sanctumToken,
            },
          }
        );
        setSnackbarMessage("Property updated successfully");
        setSnackbarSeverity("success");
        setIsEditing(false); // Exit editing mode
        setEditItemId(null); // Clear the edit item ID
        setConfigMessage("");
      } else {
        // =====================================================post ===========================
        // Check if the configMessage already exists under the selected configuration name
        const existingMessage = propertyItems.find(
          (item) =>
            item.PropertyName === configName && item.Value === configMessage
        );
        if (existingMessage) {
          setSnackbarMessage(
            "This message already exists under the selected configuration name. Please choose a different message."
          );
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          return;
        }

        const postData = {
          PropertyMasterIDs: configName, // <-- use plural key
          Value: configMessage,
          LargeContent: 0, // <-- hardcoded field added
        };
        const response = await axios.post(
          `${process.env.REACT_APP_URL}/api/propertyInsert`,
          postData,
          {
            headers: {
              Authorization: sanctumToken,
            },
          }
        );
        setSnackbarMessage("Form submitted successfully");
        setSnackbarSeverity("success");
      }
      setSnackbarOpen(true);
      fetchPropertyNames(); // Refresh the table
    } catch (error) {
      setSnackbarMessage(
        isEditing ? "Update failed" : "Form submission failed"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };
  // =========================================================================
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleRefresh = () => {
    fetchPropertyNames(); // Refresh the table when the refresh icon is clicked
  };

  const handleEdit = (item) => {
    setConfigName(item.PropertyName);
    setConfigMessage(item.Value);
    setIsEditing(true);
    setEditItemId(item.ID);
    setSelectedPropertyMasterID(item.PropertyMasterID);
  };

  const handleDelete = async (item) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_URL}/api/DeletePIAppProperty/${item.ID}`,
        {},
        {
          headers: {
            Authorization: sanctumToken,
          },
        }
      );
      setSnackbarMessage("Property deleted successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchPropertyNames();
    } catch (error) {
      setSnackbarMessage("Failed to delete property");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false); // Exit editing mode
    setEditItemId(null); // Clear the edit item ID
    setConfigName(""); // Clear the Configuration Item Name field
  };

  // Add these handler functions
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Pagination helpers for flat array
  const getPaginatedData = () => {
    return propertyItems.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  };

  const getTotalCount = () => {
    return propertyItems.length;
  };

  // Get unique property names for dropdown
  const uniquePropertyNames = Array.from(
    new Set(propertyItems.map((item) => item.PropertyName))
  ).map((name) => {
    const item = propertyItems.find((i) => i.PropertyName === name);
    return {
      PropertyName: name,
      PropertyMasterID: item ? item.PropertyMasterID : null,
    };
  });

  const handleHsnMasterUpdateClose = () => {
    handleClose();
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle
          sx={{
            backgroundColor: "#0078cf",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BusinessIcon sx={{ color: "white" }} />
            Properties Configuration
          </Box>
          <Box
            onClick={handleHsnMasterUpdateClose}
            sx={{
              cursor: "pointer",
              color: "white",
              "&:hover": { opacity: 0.8 },
            }}
          >
            ✕
          </Box>
        </DialogTitle>

        <DialogContent sx={{ padding: 4 }}>
          <Box
            sx={{
              p: 3,
              backgroundColor: "#f9f9f9",
              borderRadius: 2,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
            component="form"
            onSubmit={handleSubmit}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Configuration Name</InputLabel>
                  <Select
                    value={configName}
                    onChange={handleConfigNameChange}
                    label="Configuration Name"
                  >
                    <MenuItem value="">{/* <em>None</em> */}</MenuItem>
                    {propertyItemsName.map((item, index) => (
                      <MenuItem key={index} value={item.ID}>
                        {item.PropertyName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Config Item Message"
                  value={configMessage}
                  onChange={handleConfigMessageChange}
                  variant="outlined"
                />
              </Grid>
            </Grid>

            <DialogActions sx={{ mt: 3 }}>
              <Button
                variant="contained"
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#0078cf",
                  color: "#fff",
                }}
                type="submit"
                color="#0078cf"
              >
                Submit
              </Button>
            </DialogActions>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography
              variant="h6"
              color="primary"
              sx={{
                mb: 2,
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
              }}
            >
              Configuration List
              <RefreshIcon
                sx={{ ml: 1, cursor: "pointer" }}
                onClick={handleRefresh}
              />
            </Typography>
            <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#0078cf" }}>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: "#fff",
                        fontSize: "1rem",
                      }}
                    >
                      Sl No
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: "#fff",
                        fontSize: "1rem",
                      }}
                    >
                      Configuration Item Name
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: "#fff",
                        fontSize: "1rem",
                      }}
                    >
                      Message
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: "#fff",
                        fontSize: "1rem",
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getPaginatedData().map((row, index) => (
                    <TableRow
                      key={row.ID}
                      sx={{ "&:nth-of-type(odd)": { bgcolor: "#f5f5f5" } }}
                    >
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{row.PropertyName}</TableCell>
                      <TableCell>{row.Value}</TableCell>
                      <TableCell>
                        <EditIcon
                          sx={{ cursor: "pointer", color: "#1b5e20", mr: 1 }}
                          onClick={() => handleEdit(row, row)}
                        />
                        <DeleteIcon
                          sx={{ cursor: "pointer", color: "#d32f2f" }}
                          onClick={() => handleDelete(row, row)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={getTotalCount()}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
            {/* Add Cancel button when editing */}
            {isEditing && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCancelEdit}
                sx={{ mt: 2 }}
              >
                Cancel Edit
              </Button>
            )}
          </Box>
        </DialogContent>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Dialog>
    </ThemeProvider>
  );
};

export default SettingsDamageReturn;
