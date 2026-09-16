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
import {
  convertDatetoString,
  formatDateTime,
} from "../../../../../functionforAll";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  head: {
    backgroundColor: "#1b5e20",
    color: theme.palette.common.white,
  },
}));

export default function CurrentStockSection({ inventoryList }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  console.log("Inventory List:", inventoryList);

  const filteredInventory = inventoryList.filter((item) =>
    item.ModelNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <TextField
        label="Search by Model Number"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        fullWidth
        margin="normal"
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "green", color: "white" }}>
            <TableRow>
              <StyledTableCell sx={{ color: "white" }}>Sl No.</StyledTableCell>
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
            {filteredInventory.map((item, index) => (
              <TableRow key={item.ID}>
                <TableCell>{index + 1}</TableCell>

                <TableCell>
                  {item.ModelNumber} - {formatDateTime(item.ExpiryDate)} -{" "}
                  {item.BatchNo}
                </TableCell>
                <TableCell
                  sx={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <Typography sx={{ minWidth: "2rem" }}>
                    {" "}
                    {item.Quantity}
                  </Typography>
                  <Typography
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {" "}
                    {Number(item.MinStockLevel) >= Number(item.Quantity) && (
                      <WarningIcon style={{ color: "red" }} />
                    )}
                  </Typography>
                </TableCell>
                <TableCell>{item.MinStockLevel}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
