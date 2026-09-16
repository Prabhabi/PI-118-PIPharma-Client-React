import {
  Box,
  TextField,
  Button,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography,
  IconButton,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // Import Cookies
import RefreshIcon from "@mui/icons-material/Refresh"; // Import RefreshIcon
import EditIcon from "@mui/icons-material/Edit"; // Import EditIcon
import DeleteIcon from "@mui/icons-material/Delete"; // Import DeleteIcon
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";

export const styles = {
  container: {
    padding: "2rem",
    backgroundColor: "#f5f9f5",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  header: {
    color: "#2e7d32",
    marginBottom: "2rem",
    fontWeight: 600,
    fontSize: "1.5rem",
  },
  formSection: {
    backgroundColor: "#ffffff",
    padding: "2rem",
    borderRadius: "8px",
    marginBottom: "2rem",
  },
  tableContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    "& .MuiTableCell-head": {
      backgroundColor: "#2e7d32",
      color: "#ffffff",
      fontWeight: 600,
    },
    "& .MuiTableRow-root:nth-of-type(even)": {
      backgroundColor: "#f5f9f5",
    },
  },
};

export default function PropertyMaster({ onClose }) {
  const [propertyName, setPropertyName] = useState("");
  const [largeContent, setLargeContent] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [propertyData, setPropertyData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isEditing, setIsEditing] = useState(false); // Track if editing mode is active
  const [editItemId, setEditItemId] = useState(null); // Store the ID of the item being edited
  const [loading, setLoading] = useState(false);

  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_URL}/api/getProperties/2`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: sanctumToken,
          },
        }
      );
      // Use response.data.data as the array
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      // Normalize and reverse so latest appears first
      const normalized = data
        .map((item) => ({
          ID: item.ID ?? "",
          PropertyName: item.PropertyName ?? "",
          LargeContent:
            typeof item.LargeContent === "string"
              ? item.LargeContent
              : String(item.LargeContent ?? "0"),
          Active: item.Active ?? "1",
        }))
        .reverse();
      setPropertyData(normalized);
      // Reset to first page if current page would be empty
      const maxPage = Math.ceil(normalized.length / rowsPerPage) - 1;
      if (page > maxPage) {
        setPage(0);
      }
    } catch (error) {
      // console.error("There was an error fetching the data!", error);
      setPropertyData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    // console.log("isEditing", isEditing);
    if (isEditing) {
      try {
        const putData = {
          PropertyName: propertyName,
          LargeContent: largeContent ? 1 : 0,
        };
        const updateId = Number(editItemId); // Use ID for API URL
        await axios.put(
          `${process.env.REACT_APP_URL}/api/UpdatePropertyMaster/${updateId}`,
          putData,
          {
            headers: {
              Authorization: sanctumToken,
            },
          }
        );
        setSnackbarMessage("Property updated successfully!");
        setSnackbarSeverity("success");
        setIsEditing(false);
        setEditItemId(null);
        fetchData();
        setPropertyName("");
      } catch (error) {
        setSnackbarMessage("There was an error updating the property.");
        setSnackbarSeverity("error");
        // console.error("There was an error!", error);
      }
    } else {
      // POST request for adding a new item
      try {
        const isDuplicate = propertyData.some(
          (item) => item.PropertyName === propertyName
        );
        if (isDuplicate) {
          setSnackbarMessage(
            "This configuration name already exists. Please choose a different name."
          );
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
          return;
        }
        await axios.post(
          `${process.env.REACT_APP_URL}/api/propertyMasterInsert`,
          {
            PropertyName: propertyName,
            LargeContent: largeContent ? 1 : 0,
          },
          {
            headers: {
              Authorization: sanctumToken,
            },
          }
        );
        setSnackbarMessage("Property added successfully!");
        setSnackbarSeverity("success");
        fetchData(); // Refresh the table
        setPropertyName("");
      } catch (error) {
        setSnackbarMessage("There was an error adding the property.");
        setSnackbarSeverity("error");
        // console.error("There was an error!", error);
      }
    }
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRefresh = () => {
    fetchData(); // Refresh the table when the refresh icon is clicked
  };

  const handleEdit = (item) => {
    setPropertyName(item.PropertyName);
    setLargeContent(item.LargeContent === "1");
    setIsEditing(true);
    setEditItemId(item.ID); // Use ID for API URL
  };

  const handleDelete = async (id) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_URL}/api/DeletePropertyMaster/${id}`,
        {},
        {
          headers: {
            Authorization: sanctumToken,
          },
        }
      );
      setSnackbarMessage("Property deleted successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      fetchData(); // Refresh the table after deletion
    } catch (error) {
      setSnackbarMessage("There was an error deleting the property.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      console.error("There was an error!", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false); // Exit editing mode
    setEditItemId(null); // Clear the edit item ID
    setPropertyName(""); // Clear the Configuration Item Name field
    setLargeContent(false); // Clear the Large Content checkbox
  };

  const StyledButton = styled(Button)({
    backgroundColor: "#2e7d32",
    padding: "10px 30px",
    "&:hover": {
      backgroundColor: "#1b5e20",
    },
  });

  return (
    <Box sx={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
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
          Configuration Management
        </Box>
        <Box
          onClick={onClose}
          sx={{
            cursor: "pointer",
            color: "white",
            "&:hover": { opacity: 0.8 },
          }}
        >
          ✕
        </Box>
      </DialogTitle>
      <DialogContent>
        {" "}
        <Box sx={styles.container}>
          <Box sx={styles.formSection}>
            <TextField
              label="Configuration Item Name"
              value={propertyName}
              onChange={(e) => setPropertyName(e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#2e7d32",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#2e7d32",
                },
              }}
            />
            <Box sx={{ my: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={largeContent}
                    onChange={(e) => setLargeContent(e.target.checked)}
                    sx={{
                      color: "#2e7d32",
                      "&.Mui-checked": {
                        color: "#2e7d32",
                      },
                    }}
                  />
                }
                label="Large-Content (Email)"
              />
            </Box>
            <StyledButton variant="contained" onClick={handleSubmit}>
              Submit
            </StyledButton>
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

          <Box display="flex" alignItems="center" sx={{ marginBottom: "1rem" }}>
            <Typography
              variant="h6"
              sx={styles.header}
              style={{
                marginRight: "0.5rem",
                display: "flex",
                alignItems: "center",
              }}
            >
              Config Items List
              <IconButton
                onClick={handleRefresh}
                sx={{ color: "#2e7d32", marginLeft: "0.5rem" }}
              >
                <RefreshIcon />
              </IconButton>
            </Typography>
          </Box>

          <TableContainer
            component={Paper}
            sx={{
              ...styles.tableContainer,
              maxHeight: "calc(100vh - 400px)", // Fix the container height
              overflowY: "auto",
            }}
          >
            <Table>
              <TableHead sx={{ backgroundColor: "#0078cf" }}>
                <TableRow>
                  <TableCell width="20%">Sl. No</TableCell>
                  <TableCell>Config Item Name</TableCell>
                  <TableCell>LargeContent</TableCell>
                  <TableCell>Actions</TableCell> {/* Add Actions column */}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ p: 3 }}>
                      <CircularProgress sx={{ color: "#2e7d32" }} />
                    </TableCell>
                  </TableRow>
                ) : (
                  // Reverse the data before slicing for pagination
                  propertyData
                    .slice() // create a shallow copy
                    .reverse()
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow key={row.ID} sx={{ height: "53px" }}>
                        <TableCell>
                          {propertyData.length - (page * rowsPerPage + index)}
                        </TableCell>
                        <TableCell>{row.PropertyName}</TableCell>
                        <TableCell>
                          {row.LargeContent === "1" ? (
                            <CheckCircleOutlineIcon sx={{ color: "#2e7d32" }} />
                          ) : (
                            <CancelIcon sx={{ color: "#d32f2f" }} />
                          )}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleEdit(row)}
                            sx={{ color: "#2e7d32" }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(row.ID)}
                            sx={{ color: "#d32f2f" }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                )}
                {!loading && propertyData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={propertyData ? propertyData.length : 0} // Add a check for propertyData
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                ".MuiTablePagination-select": {
                  color: "#2e7d32",
                },
              }}
            />
          </TableContainer>

          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbarSeverity}
              sx={{
                "&.MuiAlert-standardSuccess": {
                  backgroundColor: "#e8f5e9",
                  color: "#2e7d32",
                },
              }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      </DialogContent>
    </Box>
  );
}
