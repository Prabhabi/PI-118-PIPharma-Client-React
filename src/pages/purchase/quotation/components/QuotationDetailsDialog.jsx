import React from "react";
import {
  Box,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  styled,
  useTheme,
  useMediaQuery,
  IconButton,
  Stack,
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
  AccountBalanceWallet,
  Numbers,
  LocationOn,
  Home,
  Payment,
  LocationCity,
  PinDrop,
  Map,
  Description,
  Close,
  Assignment,
} from "@mui/icons-material";
import QuotationEditDialog from "./QuotationEditDialog";
import { formatDateTime } from "../../../../functionforAll";

// Custom styled components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: "8px",
    border: "1px solid #1a472a",
    margin: theme.spacing(1),
    width: "100%",
    maxHeight: "90vh",
  },
}));

const StyledDialogTitle = styled(DialogTitle)({
  padding: "16px",
});

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
  // backgroundColor: "#f5f5f5",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1),
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  marginBottom: "8px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  "& strong": {
    color: "#1a472a",
    minWidth: "130px",
    display: "inline-block",
    [theme.breakpoints.down("sm")]: {
      minWidth: "100px",
      fontSize: "0.9rem",
    },
  },
  "& .MuiSvgIcon-root": {
    color: "#1a472a",
    fontSize: "20px",
    [theme.breakpoints.down("sm")]: {
      fontSize: "16px",
    },
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.9rem",
    marginBottom: "4px",
    flexWrap: "wrap",
  },
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
  "& .MuiTableCell-body": {
    fontFamily: "Georgia, serif",
  },
  "& .MuiTableRow-root": {
    "&:nth-of-type(even)": {
      backgroundColor: "#e8f5e9",
    },
  },
  [theme.breakpoints.down("sm")]: {
    "& .MuiTableCell-root": {
      padding: theme.spacing(1),
      fontSize: "0.8rem",
    },
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: "#1a472a",
  borderBottom: "2px solid #1a472a",
  padding: "8px 0",
  marginBottom: "16px",
  fontFamily: "Georgia, serif",
  fontWeight: "bold",
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.1rem",
    marginBottom: theme.spacing(1),
  },
}));

export default function QuotationDetailsDialog({
  selectdQuo,
  open,
  onClose,
  supplierList,
  allItems,
  companyList,
  signatoryList,
  fetchQuotationsFn,
}) {
  console.log("selectdQuo", selectdQuo);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // console.log("selectdQuo", selectdQuo);
  // console.log(selectdQuo);
  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={isMobile}
    >
      <StyledDialogTitle>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Assignment />
            <Typography variant="h6" component="span" sx={{ color: "white" }}>
              Quotation Details
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </StyledDialogTitle>
      <StyledDialogContent>
        <Grid container spacing={isMobile ? 1 : 3}>
          <Grid item xs={12} md={6}>
            <SectionTitle variant="h6">Supplier Information</SectionTitle>
            {selectdQuo.QuotationDate && (
              <StyledTypography variant="body1">
                <CalendarMonth />
                <strong>QuotationDate:</strong>{" "}
                {formatDateTime(selectdQuo.QuotationDate)}
              </StyledTypography>
            )}

            {selectdQuo.Name && (
              <StyledTypography variant="body1">
                <Business />
                <strong>Supplier Name:</strong> {selectdQuo.Name}
              </StyledTypography>
            )}
            {selectdQuo.CompanyName && (
              <StyledTypography variant="body1">
                <Business />
                <strong>Company Name:</strong> {selectdQuo.CompanyName}
              </StyledTypography>
            )}
            {selectdQuo.Name && (
              <StyledTypography variant="body1">
                <Person />
                <strong>Contact Name:</strong> {selectdQuo.Name}
              </StyledTypography>
            )}
            {selectdQuo.PhoneNumber1 && (
              <StyledTypography variant="body1">
                <Phone />
                <strong>PhoneNumber1:</strong> {selectdQuo.PhoneNumber1}
              </StyledTypography>
            )}
            {selectdQuo.PhoneNumber2 && (
              <StyledTypography variant="body1">
                <Phone />
                <strong>PhoneNumber2:</strong> {selectdQuo.PhoneNumber2}
              </StyledTypography>
            )}
            {selectdQuo.Email && (
              <StyledTypography variant="body1">
                <Email />
                <strong>Email:</strong> {selectdQuo.Email}
              </StyledTypography>
            )}
            {selectdQuo.GSTNumber && (
              <StyledTypography variant="body1">
                <Receipt />
                <strong>GSTNumber:</strong> {selectdQuo.GSTNumber}
              </StyledTypography>
            )}
            {selectdQuo.BankName && (
              <StyledTypography variant="body1">
                <AccountBalance />
                <strong>BankName:</strong> {selectdQuo.BankName}
              </StyledTypography>
            )}
            {selectdQuo.AccountNumber && (
              <StyledTypography variant="body1">
                <AccountBalanceWallet />
                <strong>AccountNumber:</strong> {selectdQuo.AccountNumber}
              </StyledTypography>
            )}
            {selectdQuo.IFSCCode && (
              <StyledTypography variant="body1">
                <Numbers />
                <strong>IFSCCode:</strong> {selectdQuo.IFSCCode}
              </StyledTypography>
            )}
            {selectdQuo.BranchName && (
              <StyledTypography variant="body1">
                <LocationOn />
                <strong>BranchName:</strong> {selectdQuo.BranchName}
              </StyledTypography>
            )}
            {selectdQuo.UPIID && (
              <StyledTypography variant="body1">
                <Payment />
                <strong>UPIID:</strong> {selectdQuo.UPIID}
              </StyledTypography>
            )}
            {selectdQuo.State && (
              <StyledTypography variant="body1">
                <Map />
                <strong>State:</strong> {selectdQuo.State}
              </StyledTypography>
            )}
            {selectdQuo.District && (
              <StyledTypography variant="body1">
                <LocationCity />
                <strong>District:</strong> {selectdQuo.District}
              </StyledTypography>
            )}
            {selectdQuo.City && (
              <StyledTypography variant="body1">
                <LocationCity />
                <strong>City:</strong> {selectdQuo.City}
              </StyledTypography>
            )}
            {selectdQuo.PinCode && (
              <StyledTypography variant="body1">
                <PinDrop />
                <strong>PinCode:</strong> {selectdQuo.PinCode}
              </StyledTypography>
            )}
            {selectdQuo.AddressLine1 && (
              <StyledTypography variant="body1">
                <Home />
                <strong>AddressLine1:</strong> {selectdQuo.AddressLine1}
              </StyledTypography>
            )}
            {selectdQuo.AddressLine2 && (
              <StyledTypography variant="body1">
                <Home />
                <strong>AddressLine2:</strong> {selectdQuo.AddressLine2}
              </StyledTypography>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <SectionTitle variant="h6">Company Information</SectionTitle>
            {selectdQuo.Bill_CompanyName && (
              <StyledTypography variant="body1">
                <Business />
                <strong>CompanyName:</strong> {selectdQuo.Bill_CompanyName}
              </StyledTypography>
            )}
            {selectdQuo.Bill_PhoneNumber1 && (
              <StyledTypography variant="body1">
                <Phone />
                <strong>PhoneNumber1:</strong> {selectdQuo.Bill_PhoneNumber1}
              </StyledTypography>
            )}
            {selectdQuo.Bill_PhoneNumber2 && (
              <StyledTypography variant="body1">
                <Phone />
                <strong>PhoneNumber2:</strong> {selectdQuo.Bill_PhoneNumber2}
              </StyledTypography>
            )}
            {selectdQuo.Bill_Email && (
              <StyledTypography variant="body1">
                <Email />
                <strong>Email:</strong> {selectdQuo.Bill_Email}
              </StyledTypography>
            )}
            {selectdQuo.Bill_GSTNumber && (
              <StyledTypography variant="body1">
                <Receipt />
                <strong>GSTNumber:</strong> {selectdQuo.Bill_GSTNumber}
              </StyledTypography>
            )}
            {selectdQuo.Bill_BankName && (
              <StyledTypography variant="body1">
                <AccountBalance />
                <strong>BankName:</strong> {selectdQuo.Bill_BankName}
              </StyledTypography>
            )}
            {selectdQuo.Bill_AccountNumber && (
              <StyledTypography variant="body1">
                <AccountBalanceWallet />
                <strong>AccountNumber:</strong> {selectdQuo.Bill_AccountNumber}
              </StyledTypography>
            )}
            {selectdQuo.Bill_IFSCCode && (
              <StyledTypography variant="body1">
                <Numbers />
                <strong>IFSCCode:</strong> {selectdQuo.Bill_IFSCCode}
              </StyledTypography>
            )}
            {selectdQuo.Bill_BranchName && (
              <StyledTypography variant="body1">
                <LocationOn />
                <strong>BranchName:</strong> {selectdQuo.Bill_BranchName}
              </StyledTypography>
            )}
            {selectdQuo.Bill_UPIID && (
              <StyledTypography variant="body1">
                <Payment />
                <strong>UPIID:</strong> {selectdQuo.Bill_UPIID}
              </StyledTypography>
            )}
            {selectdQuo.Bill_State && (
              <StyledTypography variant="body1">
                <Map />
                <strong>State:</strong> {selectdQuo.Bill_State}
              </StyledTypography>
            )}
            {selectdQuo.Bill_District && (
              <StyledTypography variant="body1">
                <LocationCity />
                <strong>District:</strong> {selectdQuo.Bill_District}
              </StyledTypography>
            )}
            {selectdQuo.Bill_City && (
              <StyledTypography variant="body1">
                <LocationCity />
                <strong>City:</strong> {selectdQuo.Bill_City}
              </StyledTypography>
            )}
            {selectdQuo.Bill_PinCode && (
              <StyledTypography variant="body1">
                <PinDrop />
                <strong>PinCode:</strong> {selectdQuo.Bill_PinCode}
              </StyledTypography>
            )}
            {selectdQuo.Bill_AddressLine1 && (
              <StyledTypography variant="body1">
                <Home />
                <strong>AddressLine1:</strong> {selectdQuo.Bill_AddressLine1}
              </StyledTypography>
            )}
            {selectdQuo.Bill_AddressLine2 && (
              <StyledTypography variant="body1">
                <Home />
                <strong>AddressLine2:</strong> {selectdQuo.Bill_AddressLine2}
              </StyledTypography>
            )}
          </Grid>
          <Grid item xs={12}>
            <SectionTitle variant="h6">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Description />
                Item /Product Details
              </Box>
            </SectionTitle>
            <TableContainer
              component={Paper}
              elevation={3}
              sx={{
                maxWidth: "95%",
                overflowX: "auto",
                // mr: 20,
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
                "& .MuiTable-root": {
                  minWidth: 650, // Ensure minimum width for proper scrolling
                },
              }}
            >
              <StyledTable>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Sl.No</TableCell>
                    <TableCell align="center">Product Model Name</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="center">Stripe Qty</TableCell>

                    <TableCell align="center">Price</TableCell>
                    <TableCell align="center">DISP</TableCell>

                    <TableCell align="center">CGSTP+SGSTP</TableCell>
                    <TableCell align="center">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectdQuo.ModelMappingData?.map((model, index) => (
                    <TableRow key={model.QuotationBookingModelMappingID}>
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell align="center">
                        {model.ProductModelName}
                      </TableCell>
                      <TableCell align="center">{model.Quantity}</TableCell>
                      <TableCell align="center">{model.StripQty}</TableCell>

                      <TableCell align="center">{model.Price || 0}</TableCell>
                      <TableCell align="center">{model.DISP || 0}</TableCell>
                      <TableCell align="center">
                        {model.SGSTP || 0} + {model.CGSTP || 0}
                      </TableCell>

                      {/* <TableCell align="center">{model.UnitQuantity}</TableCell> */}
                      {/* <TableCell align="center">{model.QtyPerBox}</TableCell> */}
                      <TableCell align="center">
                        {model.Amount ||
                          Number(model.Price || 0) *
                            Number(model.Quantity || 0)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </StyledTable>
            </TableContainer>
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                padding: isMobile ? 1 : 2,
                borderRadius: 2,
              }}
            >
              <SectionTitle variant="h6">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Receipt />
                  Total Amounts and Tax Details
                </Box>
              </SectionTitle>
              {selectdQuo.TotalAmountBD > 0 && (
                <StyledTypography variant="body1">
                  <AccountBalance />
                  <strong>Total Amount Before Discount:</strong>{" "}
                  {selectdQuo.TotalAmountBD}
                </StyledTypography>
              )}
              {selectdQuo.Discount > 0 && (
                <StyledTypography variant="body1">
                  <AccountBalance />
                  <strong>Discount:</strong> {selectdQuo.Discount}
                </StyledTypography>
              )}
              {selectdQuo.DiscountAmount > 0 && (
                <StyledTypography variant="body1">
                  <AccountBalance />
                  <strong>Discount Amount:</strong> {selectdQuo.DiscountAmount}
                </StyledTypography>
              )}
              {selectdQuo.TotalAmountAD > 0 && (
                <StyledTypography variant="body1">
                  <AccountBalance />
                  <strong>Total Amount After Discount:</strong>{" "}
                  {selectdQuo.TotalAmountAD}
                </StyledTypography>
              )}
              {selectdQuo.CGSTP > 0 && (
                <StyledTypography variant="body1">
                  <AccountBalance />
                  <strong>CGST Percentage:</strong> {selectdQuo.CGSTP}
                </StyledTypography>
              )}
              {selectdQuo.CGSTAmount > 0 && (
                <StyledTypography variant="body1">
                  <AccountBalance />
                  <strong>CGST Amount:</strong> {selectdQuo.CGSTAmount}
                </StyledTypography>
              )}
              {selectdQuo.SGSTP > 0 && (
                <StyledTypography variant="body1">
                  <AccountBalance />
                  <strong>SGST Percentage:</strong> {selectdQuo.SGSTP}
                </StyledTypography>
              )}
              {selectdQuo.SGSTAmount > 0 && (
                <StyledTypography variant="body1">
                  <AccountBalance />
                  <strong>SGST Amount:</strong> {selectdQuo.SGSTAmount}
                </StyledTypography>
              )}

              {selectdQuo.NetTotalAmount > 0 && (
                <StyledTypography variant="body1">
                  <AccountBalance />
                  <strong>Net Total Amount:</strong> {selectdQuo.NetTotalAmount}
                </StyledTypography>
              )}
              {selectdQuo.RoundedOffAmount > 0 && (
                <StyledTypography variant="body1">
                  <AccountBalance />
                  <strong>Rounded Off Amount:</strong>{" "}
                  {selectdQuo.RoundedOffAmount}
                </StyledTypography>
              )}
              {selectdQuo.GrandTotalAmount > 0 && (
                <StyledTypography variant="body1">
                  <AccountBalance />
                  <strong>Grand Total Amount:</strong>{" "}
                  {selectdQuo.GrandTotalAmount}
                </StyledTypography>
              )}
            </Box>
          </Grid>
        </Grid>
      </StyledDialogContent>
      {!isMobile && (
        <DialogActions sx={{ padding: 2, backgroundColor: "#f5f5f5" }}>
          <Stack
            direction="row"
            spacing={2}
            sx={{ width: "100%", justifyContent: "space-between ", px: 2 }}
          >
            <QuotationEditDialog
              selectdQuo={selectdQuo}
              supplierList={supplierList}
              allItems={allItems}
              companyList={companyList}
              signatoryList={signatoryList}
              fetchQuotationsFn={fetchQuotationsFn}
              onClose={onClose}
            />
            <Button variant="text" color="success" onClick={onClose}>
              Close
            </Button>
          </Stack>
        </DialogActions>
      )}
    </StyledDialog>
  );
}
