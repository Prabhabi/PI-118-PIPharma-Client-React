import React, { useState } from "react";
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
  TextField,
  Autocomplete,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TablePagination from "@mui/material/TablePagination";
import LoadingComp from "../../../components/loadingComp/LoadingComp";
import ErrorComp from "../../../components/error/ErrorComp";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@emotion/react";
import axios from "axios";
import Cookies from "js-cookie";
import { formatDateTime } from "../../../functionforAll";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";

const fetchInventoryExpiring = async ({ queryKey }) => {
  const [, days] = queryKey;

  const token = Cookies.get("token");
  const sanctumToken = token ? `Bearer ${token.replace(/"/g, "")}` : "";

  const { data } = await axios.get(
    `${process.env.REACT_APP_URL}/api/getInventoryExpiring`,
    {
      params: { days },
      headers: {
        Authorization: sanctumToken,
      },
    }
  );
  return data;
};

const computeDaysLeft = (expiryStr) => {
  if (!expiryStr) return "—";
  const expiry = new Date(expiryStr.replace(" ", "T"));
  if (isNaN(expiry.getTime())) return "—";
  const now = new Date();
  const diffMs =
    expiry.setHours(0, 0, 0, 0) - new Date(now.setHours(0, 0, 0, 0));
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

const EXpiry = () => {
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // default 60
  const [days, setDays] = useState("60");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["inventoryExpiring", days],
    queryFn: fetchInventoryExpiring,
    keepPreviousData: true,
    enabled: !!days,
  });

  const items = data?.data || [];

  const filteredItems = items.filter((item) => {
    const q = searchText.toLowerCase();
    return (
      item.ModelNumber?.toLowerCase().includes(q) ||
      item.ExpiryDate?.toLowerCase().includes(q)
    );
  });

  const paginatedItems = filteredItems.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const theme = useTheme();

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  return (
    <Box
      sx={{
        mt: { xs: 2, sm: 4 },
        p: { xs: 1, sm: 2.5 },
        boxShadow: 8,
        borderRadius: 3,
        overflow: "hidden",
        bgcolor: theme.palette.background.main,
      }}
    >
      {/* Title */}
      <Box display="flex" justifyContent="center" alignItems="center">
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
            color: "blue",
            mb: 6,
            fontSize: { xs: "1.8rem", sm: "2.125rem" },
          }}
        >
          <InsertInvitationIcon
            sx={{ mr: 1, fontSize: "2.2rem", color: "blue" }}
          />
          Expiry Management
        </Typography>
      </Box>

      {/* Search + Dropdown */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: { xs: 2, sm: 2 },
          mb: { xs: 2, sm: 0.8 },
        }}
      >
        <TextField
          placeholder="Search by ModelNumber or Expiry Date"
          variant="outlined"
          fullWidth
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setPage(0);
          }}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ color: "#006400", mr: 1, color: "blue" }} />
            ),
          }}
          sx={{
            width: { xs: "100%", md: "100%" },
            mr: { xs: 0, md: 2 },
            mb: 1,
            "& .MuiOutlinedInput-root": {
              borderRadius: "22px",
              backgroundColor: "white",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "blue !important", // 🔵 Force blue border
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "blue !important", // 🔵 Hover
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "blue !important", // 🔵 Focus
              },
            },
            "& .MuiInputAdornment-root .MuiSvgIcon-root": {
              color: "blue !important", // 🔵 Force blue icon (wrapper + svg)
            },
          }}
        />

        <Autocomplete
          freeSolo
          options={["180", "150", "120", "90", "60", "30", "15", "7"]}
          value={days}
          onChange={(e, newValue) => {
            if (newValue) {
              setDays(newValue);
              setPage(0);
            }
          }}
          onInputChange={(e, newValue) => {
            if (newValue) setDays(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Expiry Left (days)"
              sx={{
                minWidth: { xs: "100%", sm: 220 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "15px",
                  backgroundColor: "white",
                },
              }}
            />
          )}
        />
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#4D795B" }}>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Model Number
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Expiry Date
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Quantity
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Expiry Left (days)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedItems.map((item) => (
              <TableRow key={item.ID}>
                <TableCell>{item.ModelNumber}</TableCell>
                <TableCell>{formatDateTime(item.ExpiryDate)}</TableCell>
                <TableCell>{item.Quantity}</TableCell>
                <TableCell>{computeDaysLeft(item.ExpiryDate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredItems.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <LoadingComp loading={isLoading} />
      <ErrorComp error={isError} />
    </Box>
  );
};

export default EXpiry;
