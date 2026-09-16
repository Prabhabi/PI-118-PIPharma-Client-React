import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SupplierDetailsDialog from "./component/supplierDetailsDialog/SupplierDetailsDialog";
import SupplierCreateDialog from "./component/AddSupplierDailog/AddNewSupplierDailog";
import TablePagination from "@mui/material/TablePagination";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "@emotion/react";

const SupplierList = ({ suppliers, fetchSuppliers }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [supplierEditDetails, setSupplierEditDetails] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const theme = useTheme();

  const filteredSuppliers = suppliers.filter((supplier) =>
    Object.values(supplier).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <Box
      sx={{
        padding: { xs: "0.5rem", md: "0 1.2rem" },
        bgcolor: theme.palette.background.main,
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", md: "center" },
          gap: { xs: 2, md: 0 },
          marginBottom: 2,
          bgcolor: theme.palette.background.main,
        }}
      >
        <TextField
          placeholder="Search...Supplier"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            // 🔴 Force red icon
            startAdornment: (
              <SearchIcon sx={{ color: "blue !important", mr: 1 }} />
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

        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "center", md: "flex-end" },
          }}
        >
          <SupplierCreateDialog fetchSuppliers={fetchSuppliers} />
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "12px",
          width: "100%",
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#4D795B" }}>
            <TableRow>
              {/* Mobile columns */}
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                  display: { xs: "table-cell", md: "none" },
                }}
              >
                Supplier Name
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                  display: { xs: "table-cell", md: "none" },
                }}
              >
                Mobile No
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                  display: { xs: "table-cell", md: "none" },
                }}
              >
                Action
              </TableCell>

              {/* Desktop columns */}
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                  display: { xs: "none", md: "table-cell" },
                }}
              >
                Sl No
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                  display: { xs: "none", md: "table-cell" },
                }}
              >
                Supplier Name
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                  display: { xs: "none", md: "table-cell" },
                }}
              >
                Supply Type
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                  display: { xs: "none", md: "table-cell" },
                }}
              >
                Contact Name
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                  display: { xs: "none", md: "table-cell" },
                }}
              >
                Email
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                  display: { xs: "none", md: "table-cell" },
                }}
              >
                Mobile No 1
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                  display: { xs: "none", md: "table-cell" },
                }}
              >
                Mobile No 2
              </TableCell>
              {/* <TableCell
                sx={{ color: "white", fontWeight: "bold", textAlign: "center", display: { xs: 'none', md: 'table-cell' } }}
              >
                Action
              </TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSuppliers.length > 0 ? (
              filteredSuppliers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((supplier, index) => (
                  <TableRow
                    key={
                      supplier.ID ||
                      `${supplier.SupplierName}-${supplier.MobileNo1}-${index}`
                    }
                    onClick={() => {
                      setDialogOpen(true);
                      setSupplierEditDetails(supplier);
                    }}
                    sx={{
                      cursor: "pointer",
                      "& td": {
                        padding: { xs: "8px 4px", md: "16px" },
                        fontSize: { xs: "0.8rem", md: "1rem" },
                      },
                    }}
                  >
                    {/* Mobile view cells */}
                    <TableCell
                      sx={{
                        textAlign: "center",
                        display: { xs: "table-cell", md: "none" },
                        padding: "8px",
                      }}
                    >
                      {supplier.SupplierName}
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        display: { xs: "table-cell", md: "none" },
                        padding: "8px",
                      }}
                    >
                      {supplier.MobileNo1 || "____"}
                    </TableCell>
                    {/* <TableCell
                      sx={{
                        display: { xs: 'table-cell', md: 'none' },
                        padding: '8px',
                        textAlign: "center"
                      }}
                    >
                      <IconButton
                        color="success"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell> */}

                    {/* Desktop view cells */}
                    <TableCell
                      sx={{
                        textAlign: "center",
                        display: { xs: "none", md: "table-cell" },
                      }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        display: { xs: "none", md: "table-cell" },
                      }}
                    >
                      {supplier.SupplierName}
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        display: { xs: "none", md: "table-cell" },
                      }}
                    >
                      {supplier.SupplierType}
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        display: { xs: "none", md: "table-cell" },
                      }}
                    >
                      {supplier.ContactPerson || "____"}
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        display: { xs: "none", md: "table-cell" },
                      }}
                    >
                      {supplier.Email || "____"}
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        display: { xs: "none", md: "table-cell" },
                      }}
                    >
                      {supplier.MobileNo1 || "____"}
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        display: { xs: "none", md: "table-cell" },
                      }}
                    >
                      {supplier.MobileNo2 || "____"}
                    </TableCell>
                    {/* <TableCell
                      sx={{
                        display: "flex",
                        // gap: ".2rem",
                        justifyContent: "center",
                    
                      }}
                    >
                      <IconButton
                        color="success"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add delete functionality here
                        }}
                      >
                        {" "}
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add delete functionality here
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell> */}
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={{ xs: 3, md: 8 }}
                  sx={{ textAlign: "center" }}
                >
                  No suppliers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={suppliers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
              {
                fontSize: { xs: "0.8rem", md: "1rem" },
              },
          }}
        />
      </TableContainer>

      {dialogOpen && (
        <SupplierDetailsDialog
          dialogOpen={true}
          handleCloseDialog={() => setDialogOpen(false)}
          supplierData={supplierEditDetails}
          onUpdate={fetchSuppliers} // Pass fetchSuppliers as onUpdate
        />
      )}
    </Box>
  );
};

export default SupplierList;
