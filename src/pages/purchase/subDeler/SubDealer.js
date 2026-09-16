import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  TextField,
  TablePagination, // Add TablePagination import
} from "@mui/material";
import DoctorCreateDialog from "./component/DealerCreateDialog";
import DoctorViewDialog from "./component/DealerViewDialog";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";
import LoadingComp from "../../../components/loadingComp/LoadingComp";
import ErrorComp from "../../../components/error/ErrorComp";
import Cookies from "js-cookie"; // Import Cookies
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import { subDealerListApiFn } from "../../../api/salesApi";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@emotion/react";

const Doctor = () => {
  const [doctorList, setDoctorList] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDealer, setEditedDealer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [error, setError] = useState(false);

  // const fetchDealers = async () => {
  //   setLoading(true);
  //   const token = Cookies.get("token");
  //   const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

  //   try {
  //     const response = await fetch(
  //       `${process.env.REACT_APP_URL}/api/getSubDealers`,
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': sanctumToken,
  //         },
  //       }
  //     );
  //     const data = await response.json();
  //     if (data && data.data) {
  //       setDealerList(data.data);
  //       setFilteredDealers(data.data);
  //     }
  //   } catch (error) {
  //     // console.error("Error fetching dealer list:", error);
  //     setError(true);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   fetchDealers();
  // }, []);

  // =======================================================================
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["subDealerListApi"],
    queryFn: subDealerListApiFn, // Same as in prefetch
    staleTime: Infinity,
    cacheTime: Infinity,
    gcTime: Infinity, // For React Query v5+
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: "never", // <-- Use "never" for v5, not false
    refetchInterval: false,
    refetchIntervalInBackground: false,
    enabled: true,
  });
  const doctorLists = data?.data?.data || [];
  useEffect(() => {
    if (doctorLists.length > 0) {
      setDoctorList(doctorLists);
      setFilteredDoctors(doctorLists);
    }
  }, [doctorLists]);

  // ===========================================================================
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = doctorList.filter(
      (doctor) =>
        doctor.DoctorName?.toLowerCase().includes(value) ||
        "" ||
        doctor.Email?.toLowerCase().includes(value) ||
        "" ||
        doctor.PhoneNumber?.toLowerCase().includes(value) ||
        ""
    );
    setFilteredDoctors(filtered);
  };

  const handleOpenDialog = (doctor) => {
    setSelectedDoctor(doctor);
    setEditedDealer(doctor);
    setDialogOpen(true);
    setIsEditing(false);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedDoctor(null);
    setIsEditing(false);
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedDealer(selectedDoctor);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const theme = useTheme();

  return (
    <Box
      sx={{
        pt: { xs: 2, sm: 4 },
        bgcolor: theme.palette.background.main,
        minHeight: "100vh",
      }}
    >
      <Box sx={{ mt: 0 }}>
        <Box
          sx={{
            mb: "1rem",
            alignItems: "center",
            padding: "0 1.5rem",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                marginBottom: 4,
                color: "#4D795B",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
                mb: 6,
                fontSize: { xs: "1.8rem", sm: "2.125rem" },
                color: "blue",
              }}
            >
              <SupervisorAccountIcon
                sx={{
                  mr: 1,
                  fontSize: { xs: "2rem", sm: "2.5rem", color: "blue" },
                }}
              />
              Doctor Management
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
          }}
        >
          <TextField
            placeholder="Search...Doctors"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: "#1976d2", mr: 1 }} />, // changed from #006400
            }}
            sx={{
              mx: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "22px",
                backgroundColor: "white",
                "& fieldset": {
                  borderColor: "#1976d2", // changed from #006400
                },
                "&:hover fieldset": {
                  borderColor: "#1976d2", // changed from #006400
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#1976d2", // changed from #006400
                },
              },
              "& .MuiInputBase-input::placeholder": {
                color: "#1565c0", // changed from #004d00
                opacity: 0.8,
              },
            }}
          />
          <DoctorCreateDialog fetchDealers={refetch} type="main" />
        </Box>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: "#1976d2" }}>
              {" "}
              {/* changed from #4D795B */}
              <TableRow>
                {[
                  "SL No.",
                  "Doctor Name",
                  "Email",
                  "Gender",
                  "Phone Number",
                  "Specialization",
                ].map((header) => (
                  <TableCell
                    key={header}
                    sx={{ color: "#ffffff", fontWeight: "bold" }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={11} sx={{ textAlign: "center" }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredDoctors.length > 0 ? (
                filteredDoctors
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((doctor, index) => (
                    <TableRow key={doctor.ID}>
                      <TableCell
                        onClick={() => handleOpenDialog(doctor)}
                        sx={{ cursor: "pointer" }}
                      >
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell
                        onClick={() => handleOpenDialog(doctor)}
                        sx={{ cursor: "pointer" }}
                      >
                        {doctor.DoctorName || "--"}
                      </TableCell>
                      <TableCell
                        onClick={() => handleOpenDialog(doctor)}
                        sx={{ cursor: "pointer" }}
                      >
                        {doctor.Email || "--"}
                      </TableCell>
                      <TableCell
                        onClick={() => handleOpenDialog(doctor)}
                        sx={{ cursor: "pointer" }}
                      >
                        {doctor.Gender || "--"}
                      </TableCell>
                      <TableCell
                        onClick={() => handleOpenDialog(doctor)}
                        sx={{ cursor: "pointer" }}
                      >
                        {doctor.PhoneNumber || "--"}
                      </TableCell>
                      <TableCell>{doctor.Specialization || "--"}</TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} sx={{ textAlign: "center" }}>
                    No Doctors Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredDoctors.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Box>

      <DoctorViewDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        dealer={selectedDoctor}
        onUpdate={refetch}
      />
      <LoadingComp loading={isEditing} />
      <ErrorComp error={error} />
    </Box>
  );
};

export default Doctor;
