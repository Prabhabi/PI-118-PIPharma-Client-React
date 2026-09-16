import React, { useState, useEffect } from "react";
import {
  TextField,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Snackbar,
  Alert,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import BusinessIcon from "@mui/icons-material/Business";
import axios from "axios";
import LoadingComp from "./../../loadingComp/LoadingComp";
import ErrorComp from "../../error/ErrorComp";
import Cookies from "js-cookie";
import { hsnMasterApiFn } from "../../../api/commonApi";
import { useQuery } from "@tanstack/react-query";

const HSNPage = ({ handleHsnMasterUpdateClose }) => {
  const [hsnCode, setHsnCode] = useState("");
  const [isValidated, setIsValidated] = useState(false);
  const [availableHSN, setAvailableHSN] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

  // const fetchHSNData = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_URL}/api/getHSN`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: sanctumToken,
  //         },
  //       }
  //     );
  //     if (
  //       response.data.status === "success" &&
  //       Array.isArray(response.data.data)
  //     ) {
  //       const hsnList = response.data.data.map((item) => ({
  //         ID: item.ID,
  //         HSNCode: item.HSNCode,
  //       }));
  //       setAvailableHSN(hsnList);
  //     } else {
  //       setError("Failed to fetch HSN data");
  //     }
  //   } catch (error) {
  //     setError("Failed to fetch HSN data");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchHSNData();
  // }, []);
  // =======================================================================
  const { data, isLoading, refetch, isError } = useQuery({
    queryKey: ["hsnMasterApi"],
    queryFn: hsnMasterApiFn,
    refetchOnWindowFocus: false, // disable refetch on window focus
    refetchOnReconnect: false, // disable refetch on network reconnect
    refetchInterval: false, // disable background polling
    staleTime: Infinity,
  });
  useEffect(() => {
    const fetchHSNData = async () => {
      const hsnList = data?.data?.data?.map((item) => ({
        ID: item.ID,
        HSNCode: item.HSNCode,
      }));
      setAvailableHSN(hsnList);
    };
    fetchHSNData();
  }, [data]);

  // ===================================================================

  const handleValidateClick = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_URL}/api/getHSN`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: sanctumToken,
          },
        }
      );
      if (
        response.data.status === "success" &&
        Array.isArray(response.data.data)
      ) {
        const hsnList = response.data.data.map((item) => item.HSNCode);
        if (hsnList.includes(hsnCode)) {
          setSnackbarMessage("HSN Code already exists");
          setSnackbarOpen(true);
        } else {
          setIsValidated(true);
          setSnackbarMessage("");
        }
      } else {
        setError("Failed to validate HSN Code");
      }
      setLoading(false);
    } catch (error) {
      setError("Failed to validate HSN Code");
      setLoading(false);
    }
  };

  const handleSubmitClick = async () => {
    setLoading(true);
    try {
      if (editMode) {
        await handleUpdate();
      } else {
        await handleCreate();
      }
      setSnackbarOpen(true);
      setIsValidated(false);
      setHsnCode("");
      setEditMode(false);
      setEditId(null);
      refetch();
    } catch (error) {
      setError("Failed to submit/update HSN Code");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    const createPayload = {
      HSNCodeList: hsnCode, // Ensure the format matches { "HSNCodeList": "00000000" }
    };
    await axios.post(
      `${process.env.REACT_APP_URL}/api/postHSNMaster`,
      createPayload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: sanctumToken,
        },
      }
    );
    setSnackbarMessage("HSN Code Submitted: " + hsnCode);
  };

  const handleUpdate = async () => {
    const updatePayload = {
      HSNCode: hsnCode,
    };
    await axios.put(
      `${process.env.REACT_APP_URL}/api/Updatehsn/${editId}`,
      updatePayload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: sanctumToken,
        },
      }
    );
    setSnackbarMessage("HSN Code Updated: " + hsnCode);
  };

  const handleHsnCodeChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setHsnCode(value);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClose = () => {
    setHsnCode("");
    setIsValidated(false);
    setError("");
  };

  const handleDeleteClick = async (id) => {
    try {
      await axios.put(`${process.env.REACT_APP_URL}/api/deletehsn/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: sanctumToken,
        },
      });
      setSnackbarMessage("HSN Code deleted successfully");
      setSnackbarOpen(true);
      refetch();
    } catch (error) {
      setSnackbarMessage("Failed to delete HSN Code");
      setSnackbarOpen(true);
    }
  };

  const handleEditClick = (code, id) => {
    setHsnCode(code);
    setEditMode(true);
    setEditId(id);
    setIsValidated(true);
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
          <BusinessIcon />
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "white" }} // force heading text color to white
          >
            Add Hsn Dependences
          </Typography>
        </Box>
        <IconButton
          sx={{ color: "white" }}
          onClick={() => {
            // Add your close handler here
            handleHsnMasterUpdateClose();
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box
          p={1}
          sx={{
            display: "flex",
            flexDirection: "column",
            postion: "relative",
            overflowX: "hidden",
          }}
        >
          {/* <Box
        sx={{
          backgroundColor: "#1b5e20",
          padding: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
        
        </Typography>
        // <IconButton onClick={handleClose} sx={{ color: "#fff" }}>
        //   <CloseIcon />
        // </IconButton>
      </Box> */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              p: 4,
            }}
          >
            <Box sx={{ width: "50%", display: "flex" }}>
              <TextField
                label="HSN CODE"
                variant="outlined"
                value={hsnCode}
                onChange={handleHsnCodeChange}
                error={!!error}
                helperText={error}
                InputProps={{
                  style: { color: "darkgreen", height: "56px" },
                }}
                InputLabelProps={{
                  style: { color: "DarkGreen" },
                }}
                sx={{
                  flex: 1,
                  mr: 2,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#779481",
                    },
                    "&:hover fieldset": {
                      borderColor: "#779481",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#779481",
                    },
                  },
                }}
              />
              <ToggleButtonGroup exclusive sx={{ height: "56px" }}>
                {!isValidated ? (
                  <ToggleButton
                    value="validate"
                    onClick={handleValidateClick}
                    sx={{
                      backgroundColor: "#0078cf", // changed from #67a67c
                      color: "#fff",
                      height: "100%",
                      "&:hover": {
                        backgroundColor: "#005fa3", // darker shade for hover
                      },
                    }}
                  >
                    Validate
                  </ToggleButton>
                ) : (
                  <ToggleButton
                    value="submit"
                    onClick={handleSubmitClick}
                    sx={{
                      backgroundColor: "#0078cf", // changed from #395c45
                      color: "#fff",
                      height: "100%",
                      "&:hover": {
                        backgroundColor: "#005fa3", // darker shade for hover
                      },
                    }}
                  >
                    Submit
                  </ToggleButton>
                )}
              </ToggleButtonGroup>
            </Box>
          </Box>

          <Box mt={3} sx={{ width: "100%", color: "#395c45" }}>
            <Typography variant="h6">
              Available HSN List
              <IconButton onClick={refetch} sx={{ color: "#395c45" }}>
                <RefreshIcon />
              </IconButton>
            </Typography>
            {loading ? (
              <Typography>Loading... 😊</Typography>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ backgroundColor: "#4d795a" }}>
                    <TableRow>
                      <TableCell sx={{ color: "#fff", textAlign: "center" }}>
                        SL-No.
                      </TableCell>
                      <TableCell sx={{ color: "#fff", textAlign: "center" }}>
                        Available HSN List
                      </TableCell>
                      <TableCell sx={{ color: "#fff", textAlign: "center" }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {availableHSN
                      ?.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((item, index) => (
                        <TableRow
                          key={item.ID}
                          sx={{ borderBottom: `1px solid #8ea293` }}
                        >
                          <TableCell sx={{ textAlign: "center" }}>
                            {page * rowsPerPage + index + 1}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {item.HSNCode}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            <IconButton
                              onClick={() =>
                                handleEditClick(item.HSNCode, item.ID)
                              }
                            >
                              <EditIcon sx={{ color: "green" }} />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDeleteClick(item.ID)}
                            >
                              <DeleteIcon sx={{ color: "red" }} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={availableHSN?.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableContainer>
            )}
          </Box>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity="success"
              sx={{ backgroundColor: "green", color: "white" }}
            >
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

export default HSNPage;
