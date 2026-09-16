import React from "react";
import {
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  styled,
} from "@mui/material";
import {
  CalendarMonth,
  Badge,
  Business,
  Person,
  Phone,
  Email,
  Receipt,
  AccountBalance,
  LocationCity,
  PinDrop,
  Home,
  Description,
} from "@mui/icons-material";

const StyledTypography = styled(Typography)(({ theme }) => ({
  marginBottom: "8px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  "& strong": {
    color: "#1a472a",
    minWidth: "130px",
    display: "inline-block",
  },
  "& .MuiSvgIcon-root": {
    color: "#1a472a",
    fontSize: "20px",
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: "#1a472a",
  borderBottom: "2px solid #1a472a",
  padding: "8px 0",
  marginBottom: "16px",
  fontFamily: "Georgia, serif",
  fontWeight: "bold",
}));

const StyledTable = styled(Table)(({ theme }) => ({
  "& .MuiTableHead-root": {
    backgroundColor: "#1a472a",
  },
  "& .MuiTableCell-head": {
    color: "white",
    fontFamily: "Georgia, serif",
    fontWeight: "bold",
  },
}));

export default function AdvanceOrderDetails({ selectedData }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <SectionTitle variant="h6">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Description />
            Quotation Details
          </Box>
        </SectionTitle>
        {selectedData.QuotationDate && (
          <StyledTypography>
            <CalendarMonth />
            <strong>Quotation Date:</strong> {selectedData.QuotationDate}
          </StyledTypography>
        )}
        {selectedData.QuotationNo && (
          <StyledTypography>
            <Badge />
            <strong>Quotation No:</strong> {selectedData.QuotationNo}
          </StyledTypography>
        )}
        {selectedData.CompanyName && (
          <StyledTypography>
            <Business />
            <strong>Company Name:</strong> {selectedData.CompanyName}
          </StyledTypography>
        )}
        {selectedData.Name && (
          <StyledTypography>
            <Person />
            <strong>Name:</strong> {selectedData.Name}
          </StyledTypography>
        )}
        {selectedData.PhoneNumber1 && (
          <StyledTypography>
            <Phone />
            <strong>Phone Number 1:</strong> {selectedData.PhoneNumber1}
          </StyledTypography>
        )}
        {selectedData.PhoneNumber2 && (
          <StyledTypography>
            <Phone />
            <strong>Phone Number 2:</strong> {selectedData.PhoneNumber2}
          </StyledTypography>
        )}
        {selectedData.Email && (
          <StyledTypography>
            <Email />
            <strong>Email:</strong> {selectedData.Email}
          </StyledTypography>
        )}
        {selectedData.GSTNumber && (
          <StyledTypography>
            <Receipt />
            <strong>GST Number:</strong> {selectedData.GSTNumber}
          </StyledTypography>
        )}
        {selectedData.State && (
          <StyledTypography>
            <LocationCity />
            <strong>State:</strong> {selectedData.State}
          </StyledTypography>
        )}
        {selectedData.District && (
          <StyledTypography>
            <LocationCity />
            <strong>District:</strong> {selectedData.District}
          </StyledTypography>
        )}
        {selectedData.City && (
          <StyledTypography>
            <LocationCity />
            <strong>City:</strong> {selectedData.City}
          </StyledTypography>
        )}
        {selectedData.PinCode && (
          <StyledTypography>
            <PinDrop />
            <strong>Pin Code:</strong> {selectedData.PinCode}
          </StyledTypography>
        )}
        {selectedData.AddressLine1 && (
          <StyledTypography>
            <Home />
            <strong>Address Line 1:</strong> {selectedData.AddressLine1}
          </StyledTypography>
        )}
        {selectedData.AddressLine2 && (
          <StyledTypography>
            <Home />
            <strong>Address Line 2:</strong> {selectedData.AddressLine2}
          </StyledTypography>
        )}
      </Grid>

      <Grid item xs={12} md={6}>
        <SectionTitle variant="h6">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Person />
            Billing Details
          </Box>
        </SectionTitle>
        {selectedData.AuthorizedSignatoryByName && (
          <StyledTypography>
            <Person />
            <strong>Authorized Name:</strong>
            {selectedData.AuthorizedSignatoryByName}
          </StyledTypography>
        )}
        {selectedData.AuthorizedSignatoryByMobileNo && (
          <StyledTypography>
            <Phone />
            <strong>Authorized Mobile:</strong>{" "}
            {selectedData.AuthorizedSignatoryByMobileNo}
          </StyledTypography>
        )}
        {selectedData.AuthorizedSignatoryByEmail && (
          <StyledTypography>
            <Email />
            <strong>Authorized Email:</strong>{" "}
            {selectedData.AuthorizedSignatoryByEmail}
          </StyledTypography>
        )}
      </Grid>

      {selectedData.ModelMappingData?.length > 0 && (
        <Grid item xs={12}>
          <SectionTitle variant="h6">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Description />
              Model Mapping Data
            </Box>
          </SectionTitle>
          <TableContainer
            component={Paper}
            elevation={3}
            sx={{
              maxWidth: "100%",
              overflowX: "auto",
              "&::-webkit-scrollbar": {
                height: 8,
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f1f1f1",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#1a472a",
                borderRadius: 4,
              },
            }}
          >
            <StyledTable>
              <TableHead>
                <TableRow>
                  <TableCell>Product Model Name</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Unit Quantity</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedData.ModelMappingData.map((model) => (
                  <TableRow key={model.QuotationBookingModelMappingID}>
                    <TableCell>{model.ProductModelName}</TableCell>
                    <TableCell>{model.Quantity}</TableCell>
                    <TableCell>{model.UnitQuantity}</TableCell>
                    <TableCell>{model.Price}</TableCell>
                    <TableCell>{model.Amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </StyledTable>
          </TableContainer>
        </Grid>
      )}

      <Grid item xs={12}>
        <Box
          sx={{
            // backgroundColor: "#e8f5e9",
            padding: 2,
            borderRadius: 2,
            marginTop: 2,
          }}
        >
          <SectionTitle variant="h6">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Receipt />
              Total Amounts and Tax Details
            </Box>
          </SectionTitle>
          {selectedData.TotalAmountBD && (
            <StyledTypography>
              <AccountBalance />
              <strong>Total Amount Before Discount:</strong>
              {selectedData.TotalAmountBD}
            </StyledTypography>
          )}
          {selectedData.Discount && (
            <StyledTypography>
              <AccountBalance />
              <strong>Discount:</strong> {selectedData.Discount}
            </StyledTypography>
          )}
          {selectedData.DiscountAmount && (
            <StyledTypography>
              <AccountBalance />
              <strong>Discount Amount:</strong>
              {selectedData.DiscountAmount}
            </StyledTypography>
          )}
          {selectedData.TotalAmountAD && (
            <StyledTypography>
              <AccountBalance />
              <strong>Total Amount After Discount:</strong>
              {selectedData.TotalAmountAD}
            </StyledTypography>
          )}
          {selectedData.CGSTP && (
            <StyledTypography>
              <AccountBalance />
              <strong>CGST Percentage:</strong> {selectedData.CGSTP}
            </StyledTypography>
          )}
          {selectedData.CGSTAmount && (
            <StyledTypography>
              <AccountBalance />
              <strong>CGST Amount:</strong> {selectedData.CGSTAmount}
            </StyledTypography>
          )}
          {selectedData.SGSTP && (
            <StyledTypography>
              <AccountBalance />
              <strong>SGST Percentage:</strong> {selectedData.SGSTP}
            </StyledTypography>
          )}
          {selectedData.SGSTAmount && (
            <StyledTypography>
              <AccountBalance />
              <strong>SGST Amount:</strong> {selectedData.SGSTAmount}
            </StyledTypography>
          )}
          {selectedData.GrandTotalAmount && (
            <StyledTypography>
              <AccountBalance />
              <strong>Grand Total Amount:</strong>
              {selectedData.GrandTotalAmount}
            </StyledTypography>
          )}
          {selectedData.RoundedOffAmount && (
            <StyledTypography>
              <AccountBalance />
              <strong>Rounded Off Amount:</strong>
              {selectedData.RoundedOffAmount}
            </StyledTypography>
          )}
          {selectedData.NetTotalAmount && (
            <StyledTypography>
              <AccountBalance />
              <strong>Net Total Amount:</strong>
              {selectedData.NetTotalAmount}
            </StyledTypography>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}
