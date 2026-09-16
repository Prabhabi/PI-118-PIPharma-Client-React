// Add Color Dependences
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Select,
  MenuItem,
  Pagination,
  Snackbar,
  Alert,
  Typography,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import {
  Edit,
  Delete,
  Refresh as RefreshIcon,
  Close as CloseIcon,
  ColorLens,
} from "@mui/icons-material";
import LoadingComp from "./../../loadingComp/LoadingComp";
import ErrorComp from "./../../error/ErrorComp";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import { colorMasterApiFn } from "../../../api/commonApi";

const ColorMaster = ({ handleColorMasterClose }) => {
  const [colorCode, setColorCode] = useState("");
  const [colors, setColors] = useState([]);
  const [isValid, setIsValid] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [editingColorId, setEditingColorId] = useState(null);

  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

  // const fetchColors = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_URL}/api/colormaster`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: sanctumToken,
  //         },
  //       }
  //     );
  //     setColors(Array.isArray(response.data.data) ? response.data.data : []);
  //   } catch (error) {
  //     setError(true);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchColors();
  // }, []);
  // =======================================================================
  const { data, isLoading, refetch, isError } = useQuery({
    queryKey: ["colorMasterApi"],
    queryFn: colorMasterApiFn,
    refetchOnWindowFocus: false, // disable refetch on window focus
    refetchOnReconnect: false, // disable refetch on network reconnect
    refetchInterval: false, // disable background polling
    staleTime: Infinity,
  });
  useEffect(() => {
    const fetchHSNData = async () => {
      setColors(Array.isArray(data?.data?.data) ? data?.data?.data : []);
    };
    fetchHSNData();
  }, [data]);

  // ===================================================================

  const handleValidateColor = () => {
    if (colorCode.trim()) {
      const colorExists = colors.find(
        (color) => color.Color.toLowerCase() === colorCode.toLowerCase()
      );
      if (colorExists) {
        setSnackbarMessage("Color already exists in the database.");
        setSnackbarOpen(true);
      } else {
        setIsValid(true);
      }
    }
  };

  const handleAddColor = async () => {
    setLoading(true);
    if (colorCode.trim()) {
      try {
        await axios.post(
          `${process.env.REACT_APP_URL}/api/postColorMaster`,
          {
            ColorList: colorCode,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: sanctumToken,
            },
          }
        );
        setColors([...colors, { ID: Date.now(), Color: colorCode }]);
        setColorCode("");
        setIsValid(false);
        refetch(); // Refetch the colors after adding a new one
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditColor = (color) => {
    setColorCode(color.Color); // Populate the color name in the text field
    setIsValid(true); // Directly show the submit button for update
    setEditingColorId(color.ID); // Store the ID of the color being edited
  };

  const handleUpdateColor = async () => {
    setLoading(true);
    try {
      await axios.put(
        `${process.env.REACT_APP_URL}/api/Updatecolor/${editingColorId}`,
        {
          Color: colorCode,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: sanctumToken,
          },
        }
      );
      setSnackbarMessage("Color updated successfully");
      setSnackbarOpen(true);
      setColorCode("");
      setIsValid(false);
      setEditingColorId(null);
      refetch(); // Refetch the colors after updating`
    } catch (error) {
      setSnackbarMessage("Failed to update color");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteColor = async (id) => {
    try {
      await axios.put(`${process.env.REACT_APP_URL}/api/colorDelete/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: sanctumToken,
        },
      });
      setSnackbarMessage("Color deleted successfully");
      setSnackbarOpen(true);
      refetch(); // Refetch the colors after deletion
    } catch (error) {
      setSnackbarMessage("Failed to delete color");
      setSnackbarOpen(true);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  return (
    <Box>
      <DialogTitle
        sx={{
          backgroundColor: "#0078cf",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ColorLens />
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "white" }}>
            Add Color Dependences
          </Typography>
        </Box>
        <IconButton
          sx={{ color: "white" }}
          onClick={() => {
            // Add your close handler here
            handleColorMasterClose();
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ padding: 4 }}>
          <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
            <TextField
              label="Color Name"
              variant="outlined"
              value={colorCode}
              onChange={(e) => setColorCode(e.target.value)}
              fullWidth
              InputLabelProps={{
                style: { color: "green" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "green",
                  },
                  "&:hover fieldset": {
                    borderColor: "green",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "green",
                  },
                },
              }}
            />
            {isValid ? (
              <Button
                variant="contained"
                sx={{ backgroundColor: "#2d4a37", color: "#fff" }}
                onClick={editingColorId ? handleUpdateColor : handleAddColor}
              >
                {editingColorId ? "Update" : "Add"}
              </Button>
            ) : (
              <Button
                variant="contained"
                sx={{ backgroundColor: "#4d795b", color: "#fff" }}
                onClick={handleValidateColor}
              >
                Validate
              </Button>
            )}
          </Box>
          <Typography
            variant="h6"
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: 2,
              color: "#395c45",
            }}
          >
            Available color list
            <IconButton onClick={refetch} sx={{ marginLeft: 1 }}>
              <RefreshIcon />
            </IconButton>
          </Typography>
          {loading ? (
            <Typography>Loading... 😊</Typography>
          ) : (
            <>
              <TableContainer
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: 2,
                  backgroundColor: "white",
                }}
              >
                <Table>
                  <TableHead sx={{ backgroundColor: "#51765d" }}>
                    <TableRow>
                      <TableCell sx={{ color: "white", textAlign: "center" }}>
                        SL-No.
                      </TableCell>
                      <TableCell sx={{ color: "white", textAlign: "center" }}>
                        Color List
                      </TableCell>
                      <TableCell sx={{ color: "white", textAlign: "center" }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody sx={{ backgroundColor: "white" }}>
                    {colors
                      .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                      .map((color, index) => (
                        <TableRow key={color.ID}>
                          <TableCell sx={{ textAlign: "center" }}>
                            {(page - 1) * rowsPerPage + index + 1}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {color.Color}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            <IconButton
                              color="success" // Changed to green
                              onClick={() => handleEditColor(color)}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteColor(color.ID)}
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 2,
                }}
              >
                <Select
                  value={rowsPerPage}
                  onChange={handleChangeRowsPerPage}
                  size="small"
                >
                  {[5, 10, 15].map((value) => (
                    <MenuItem
                      key={value}
                      value={value}
                    >{`Rows per page: ${value}`}</MenuItem>
                  ))}
                </Select>
                <Pagination
                  count={Math.ceil(colors.length / rowsPerPage)}
                  page={page}
                  onChange={handleChangePage}
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "#0078cf",
                      borderColor: "#0078cf",
                    },
                    "& .Mui-selected": {
                      backgroundColor: "#0078cf !important",
                      color: "#fff !important",
                    },
                  }}
                />
              </Box>
            </>
          )}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
          >
            <Alert onClose={() => setSnackbarOpen(false)} severity="warning">
              {snackbarMessage}
            </Alert>
          </Snackbar>
          <LoadingComp loading={loading} />
          <ErrorComp error={error} />
        </Box>
      </DialogContent>
    </Box>
  );
};

export default ColorMaster;
