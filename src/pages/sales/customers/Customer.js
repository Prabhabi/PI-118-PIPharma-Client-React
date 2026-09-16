import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // Import Cookies
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CustomerViewDialog from "./components/CustomerViewDialog";
import AddCustomer from "./components/AddCustomer";
import TablePagination from "@mui/material/TablePagination";
import LoadingComp from "../../../components/loadingComp/LoadingComp";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ErrorComp from "../../../components/error/ErrorComp";
import useIsMobile from "../../../hooks/useIsMobile";
import { customerListApiFn } from "../../../api/salesApi";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@emotion/react";

const CustomerList = () => {
  // const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const isMobile = useIsMobile();

  // const fetchCustomer = async () => {
  //   setLoading(true);
  //   const token = Cookies.get("token"); // Get token from cookies
  //   console.log(token);
  //   const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;
  //   console.log(sanctumToken);

  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_URL}/api/getCustomers`,
  //       {
  //         headers: {
  //           Authorization: sanctumToken,
  //         },
  //       }
  //     );
  //     if (response.data.success) {
  //       const customersData = response.data.data;
  //       setCustomers(customersData);
  //     } else {
  //       console.error("API response indicates failure:", response.data);
  //     }
  //   } catch (err) {
  //     console.error("Error fetching customer data:", err);
  //     setError(true);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchCustomer();
  // }, []);
  // =======================================================================
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["customerListApi"],
    queryFn: customerListApiFn, // Same as in prefetch
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
  const customers = data?.data?.data || [];

  // ===========================================================================

  const handleOpenDialog = (customer) => {
    setSelectedCustomer(customer);
    setDialogOpen(true);
    setIsEditing(false);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    console.log("ok");
  };

  const handleOpenAddDialog = () => setAddDialogOpen(true);
  const handleCloseAddDialog = () => setAddDialogOpen(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredCustomers = customers.filter((customer) =>
    Object.values(customer).some((value) =>
      value
        ? value.toString().toLowerCase().includes(searchText.toLowerCase())
        : false
    )
  );

  const paginatedCustomers = filteredCustomers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        bgcolor: theme.palette.background.main,
        minHeight: "100vh",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
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
          <AccountCircleIcon
            sx={{
              mr: 1,
              fontSize: { xs: "2rem", sm: "2.5rem", color: "blue" },
            }}
          />{" "}
          Customer Management
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: { xs: 2, sm: 0 },
          mb: { xs: 2, sm: 0.8 },
        }}
      >
        <TextField
          placeholder="Search...Customers"
          variant="outlined"
          fullWidth
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ color: "#006400", mr: 1, color: "blue" }} />
            ),
          }}
          sx={{
            width: { xs: "100%", md: "100%" },
            mr: { xs: 0, md: 2 },
            "& .MuiOutlinedInput-root": {
              borderRadius: "22px",
              backgroundColor: "white",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "blue !important", // 🔵 Force default
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "blue !important", // 🔵 Force hover
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "blue !important", // 🔵 Force active/focused
              },
            },
          }}
        />

        <Button
          variant="contained"
          sx={{
            borderRadius: "15px",
            height: { xs: "40px", sm: "50px" },
            fontWeight: "bold",
            width: { xs: "100%", sm: "20rem" },
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
          onClick={handleOpenAddDialog}
        >
          <AccountCircleIcon /> Add Customer
        </Button>
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          maxWidth: "100%",
          overflowX: "hidden", // Changed from 'auto' to 'hidden'
        }}
      >
        <Table
          sx={{
            minWidth: { xs: "100%", sm: 650 }, // Changed minWidth for mobile
            "& .MuiTableCell-root": {
              px: { xs: 0.5, sm: 2 }, // Reduced padding for mobile
              py: { xs: 0.5, sm: 1.5 },
              fontSize: { xs: "0.75rem", sm: "1rem" },
              whiteSpace: "nowrap",
              "&:nth-of-type(1)": {
                // Name column
                maxWidth: { xs: "40%", sm: "none" },
                overflow: "hidden",
                textOverflow: "ellipsis",
              },
              "&:nth-of-type(2)": {
                // Mobile number column
                maxWidth: { xs: "35%", sm: "none" },
              },
              "&:nth-of-type(3)": {
                // Action column
                maxWidth: { xs: "25%", sm: "none" },
                px: { xs: 0, sm: 2 },
              },
            },
            // '& .MuiTableRow-root': {
            //   '&:hover': {
            //     backgroundColor: '#f5f5f5'
            //   }
            // }
          }}
        >
          <TableHead>
            <TableRow sx={{ backgroundColor: "#4D795B" }}>
              <TableCell
                sx={{
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: { xs: "0.75rem", sm: "1rem" },
                }}
              >
                Name
              </TableCell>
              <TableCell
                sx={{
                  color: "#fff",
                  fontWeight: "bold",
                  display: { xs: "none", sm: "table-cell" },
                  fontSize: { xs: "0.75rem", sm: "1rem" },
                }}
              >
                Email
              </TableCell>
              <TableCell
                sx={{
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: { xs: "0.75rem", sm: "1rem" },
                }}
              >
                Mobile
              </TableCell>
              <TableCell
                sx={{
                  color: "#fff",
                  fontWeight: "bold",
                  display: { xs: "none", sm: "table-cell" },
                  fontSize: { xs: "0.75rem", sm: "1rem" },
                }}
              >
                Company
              </TableCell>
              <TableCell
                sx={{
                  color: "#fff",
                  fontWeight: "bold",
                  display: { xs: "none", sm: "table-cell" },
                  fontSize: { xs: "0.75rem", sm: "1rem" },
                }}
              >
                City
              </TableCell>

              {/* <TableCell 
                sx={{ 
                  color: "#fff", 
                  fontWeight: "bold",
                  fontSize: { xs: '0.75rem', sm: '1rem' }
                }}
              >
                Action
              </TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCustomers.map((customer, index) => (
              <TableRow
                key={customer.ID}
                onClick={() => handleOpenDialog(customer)}
                sx={{
                  cursor: "pointer",
                  "&:hover": {},
                }}
              >
                <TableCell>
                  {`${customer.FirstName} ${customer.LastName}`}
                </TableCell>
                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                  {customer.Email || "____"}
                </TableCell>
                <TableCell>{customer.MobileNumber || "____"}</TableCell>
                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                  {customer.CompanyName || "____"}
                </TableCell>
                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                  {customer.City || "____"}
                </TableCell>

                {/* <TableCell sx={{ p: { xs: '4px', sm: '16px' } }}>
                  <Box sx={{ display: 'flex', gap: { xs: '4px', sm: '8px' } }}>
                    <EditIcon
                      sx={{ 
                        cursor: "pointer",
                        color: "#31607d",
                        fontSize: { xs: '1rem', sm: '1.5rem' }
                      }}
                    />
                    <DeleteIcon
                      sx={{ 
                        cursor: "pointer",
                        color: "#fa0202",
                        fontSize: { xs: '1rem', sm: '1.5rem' }
                      }}
                    />
                  </Box>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredCustomers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            ".MuiTablePagination-select": {
              fontSize: { xs: "0.8rem", sm: "1rem" },
            },
            ".MuiTablePagination-displayedRows": {
              fontSize: { xs: "0.8rem", sm: "1rem" },
            },
          }}
        />
      </TableContainer>
      <CustomerViewDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        customer={selectedCustomer}
        fetchCustomer={refetch} // Pass fetchCustomer as prop
      />
      <Dialog
        open={addDialogOpen}
        onClose={handleCloseAddDialog}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle
          sx={{
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PersonAddIcon /> Add New Customer
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseAddDialog}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <AddCustomer
            handleCloseDialog={handleCloseDialog}
            fetchCustomer={refetch}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} variant="text">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <LoadingComp loading={isLoading} />
      <ErrorComp error={error} />
    </Box>
  );
};

export default CustomerList;
