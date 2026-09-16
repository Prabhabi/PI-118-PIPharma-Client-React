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
import { deaseseApiFn } from "../../../api/commonApi";

const DiseaseMaster = ({ handleColorMasterClose = () => {} }) => {
  const [diseaseName, setDiseaseName] = useState("");
  const [diseaseCode, setDiseaseCode] = useState("");
  const [diseaseCategory, setDiseaseCategory] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [description, setDescription] = useState("");
  const [remarks, setRemarks] = useState("");
  const [diseases, setDiseases] = useState([]);
  const [isValid, setIsValid] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [editingDiseaseId, setEditingDiseaseId] = useState(null);

  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

  const { data, isLoading, refetch, isError } = useQuery({
    queryKey: ["colorMasterApi"],
    queryFn: deaseseApiFn,
    refetchOnWindowFocus: false, // disable refetch on window focus
    refetchOnReconnect: false, // disable refetch on network reconnect
    refetchInterval: false, // disable background polling
    staleTime: Infinity,
  });
  useEffect(() => {
    const fetchHSNData = async () => {
      setDiseases(Array.isArray(data?.data?.data) ? data?.data?.data : []);
    };
    fetchHSNData();
  }, [data]);

  const handleValidateDisease = () => {
    if (diseaseName.trim()) {
      const diseaseExists = diseases.find(
        (d) =>
          d.DiseaseName &&
          d.DiseaseName.toLowerCase() === diseaseName.toLowerCase()
      );
      if (diseaseExists) {
        setSnackbarMessage("Disease already exists in the database.");
        setSnackbarOpen(true);
      } else {
        setIsValid(true);
      }
    }
  };

  const handleAddDisease = async () => {
    setLoading(true);
    if (diseaseName.trim()) {
      try {
        const postData = {
          DiseaseName: diseaseName,
          DiseaseCode: diseaseCode,
          DiseaseCategory: diseaseCategory,
          Symptoms: symptoms,
          Description: description,
          Remarks: remarks,
        };
        await axios.post(
          `${process.env.REACT_APP_URL}/api/PostDisease`,
          postData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: sanctumToken,
            },
          }
        );
        console.log("Posted JSON:", postData);
        setDiseases([
          ...diseases,
          {
            ID: Date.now(),
            DiseaseName: diseaseName,
            DiseaseCode: diseaseCode,
            DiseaseCategory: diseaseCategory,
            Symptoms: symptoms,
            Description: description,
            Remarks: remarks,
          },
        ]);
        setDiseaseName("");
        setDiseaseCode("");
        setDiseaseCategory("");
        setSymptoms("");
        setDescription("");
        setRemarks("");
        setIsValid(false);
        refetch();
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditDisease = (disease) => {
    setDiseaseName(disease.DiseaseName);
    setDiseaseCode(disease.DiseaseCode);
    setDiseaseCategory(disease.DiseaseCategory);
    setSymptoms(disease.Symptoms);
    setDescription(disease.Description);
    setRemarks(disease.Remarks);
    setIsValid(true);
    setEditingDiseaseId(disease.ID);
  };

  const handleUpdateDisease = async () => {
    setLoading(true);
    try {
      await axios.put(
        `${process.env.REACT_APP_URL}/api/UpdateDisease/${editingDiseaseId}`,
        {
          DiseaseName: diseaseName,
          DiseaseCode: diseaseCode,
          DiseaseCategory: diseaseCategory,
          Symptoms: symptoms,
          Description: description,
          Remarks: remarks,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: sanctumToken,
          },
        }
      );
      console.log("Disease updated successfully");
      setSnackbarMessage("Disease updated successfully");
      setSnackbarOpen(true);
      setDiseaseName("");
      setDiseaseCode("");
      setDiseaseCategory("");
      setSymptoms("");
      setDescription("");
      setRemarks("");
      setIsValid(false);
      setEditingDiseaseId(null);
      refetch();
    } catch (error) {
      setSnackbarMessage("Failed to update disease");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDisease = async (id) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: sanctumToken,
      };
      console.log("DeleteDisease headers:", headers);
      await axios.put(
        `${process.env.REACT_APP_URL}/api/DeleteDisease/${id}`,
        {}, // empty body
        { headers }
      );
      console.log("Disease deleted successfully");
      setSnackbarMessage("Disease deleted successfully");
      setSnackbarOpen(true);
      refetch();
    } catch (error) {
      console.error("DeleteDisease error:", error);
      setSnackbarMessage("Failed to delete disease");
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
            Add Disease Master
          </Typography>
        </Box>
        <IconButton
          sx={{ color: "white" }}
          onClick={() => {
            handleColorMasterClose();
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ padding: 4 }}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              marginBottom: 2,
              flexWrap: "wrap",
            }}
          >
            <TextField
              label="Disease Name"
              variant="outlined"
              value={diseaseName}
              onChange={(e) => setDiseaseName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Disease Code"
              variant="outlined"
              value={diseaseCode}
              onChange={(e) => setDiseaseCode(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Disease Category"
              variant="outlined"
              value={diseaseCategory}
              onChange={(e) => setDiseaseCategory(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Symptoms"
              variant="outlined"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Description"
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidt
              sx={{ mb: 2 }}
            />
            <TextField
              label="Remarks"
              variant="outlined"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              sx={{ mb: 2 }}
            />
            {isValid ? (
              <Button
                variant="contained"
                sx={{ backgroundColor: "#2d4a37", color: "#fff", mb: 2 }}
                onClick={
                  editingDiseaseId ? handleUpdateDisease : handleAddDisease
                }
              >
                {editingDiseaseId ? "Update" : "Add"}
              </Button>
            ) : (
              <Button
                variant="contained"
                sx={{ backgroundColor: "#4d795b", color: "#fff", mb: 2 }}
                onClick={handleValidateDisease}
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
            Available disease list
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
                        Disease Name
                      </TableCell>
                      <TableCell sx={{ color: "white", textAlign: "center" }}>
                        Disease Code
                      </TableCell>
                      <TableCell sx={{ color: "white", textAlign: "center" }}>
                        Disease Category
                      </TableCell>
                      <TableCell sx={{ color: "white", textAlign: "center" }}>
                        Symptoms
                      </TableCell>
                      <TableCell sx={{ color: "white", textAlign: "center" }}>
                        Description
                      </TableCell>
                      <TableCell sx={{ color: "white", textAlign: "center" }}>
                        Remarks
                      </TableCell>
                      <TableCell sx={{ color: "white", textAlign: "center" }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody sx={{ backgroundColor: "white" }}>
                    {diseases
                      .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                      .map((disease, index) => (
                        <TableRow key={disease.ID}>
                          <TableCell sx={{ textAlign: "center" }}>
                            {(page - 1) * rowsPerPage + index + 1}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {disease.DiseaseName}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {disease.DiseaseCode}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {disease.DiseaseCategory}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {disease.Symptoms}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {disease.Description}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {disease.Remarks}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            <IconButton
                              color="success"
                              onClick={() => handleEditDisease(disease)}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteDisease(disease.ID)}
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
                  count={Math.ceil(diseases.length / rowsPerPage)}
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

export default DiseaseMaster;
