import React, { useState } from "react";
import {
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import WarningIcon from "@mui/icons-material/Warning";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  head: {
    backgroundColor: "#1b5e20",
    color: theme.palette.common.white,
    textAlign: "center",
  },
}));

export default function StockAlertSection({ inventoryList }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredInventory = inventoryList.filter((item) =>
    item.ModelNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // console.log("Filtered Inventory:", filteredInventory);
  return (
    <Box component="div" sx={{ textAlign: "center" }}>
      <TextField
        label="Search by Model Number"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        fullWidth
        margin="normal"
        sx={{
          "& .MuiInputBase-input": {
            textAlign: "center",
          },
        }}
      />
      <TableContainer
        component={Paper}
        sx={{
          margin: "0 auto",
          "& .MuiTableCell-root": {
            textAlign: "center",
          },
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "green", color: "white" }}>
            <TableRow>
              <StyledTableCell sx={{ color: "white" }}>Sl No</StyledTableCell>
              <StyledTableCell sx={{ color: "white" }}>
                Model Number
              </StyledTableCell>
              <StyledTableCell sx={{ color: "white" }}>
                Quantity
              </StyledTableCell>
              <StyledTableCell sx={{ color: "white" }}>
                Min Stock Level
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInventory.map(
              (item, index) =>
                (Number(item.MinStockLevel) || 25) >= Number(item.Quantity) && (
                  <TableRow key={index}>
                    <TableCell sx={{ textAlign: "center" }}>
                      {index + 1}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {item.ModelNumber}
                    </TableCell>
                    <TableCell
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "1rem",
                      }}
                    >
                      <Typography sx={{ minWidth: "2rem" }}>
                        {item.Quantity}
                      </Typography>
                      <Typography
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <WarningIcon style={{ color: "red" }} />
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {item.MinStockLevel || 25}
                    </TableCell>
                  </TableRow>
                )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
