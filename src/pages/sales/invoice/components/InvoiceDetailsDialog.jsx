import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack,
} from "@mui/material";
import generatePdfMoneyRecipt from "./generatePdfMoneyRecipt";
import { formatDateTime } from "./../../../../functionforAll";
import CloseIcon from "@mui/icons-material/Close";
import ReceiptIcon from "@mui/icons-material/Receipt";
import IconButton from "@mui/material/IconButton";

export default function InvoiceDetailsDialog({
  openModal,
  handleCloseModal,
  row,
}) {
  const [open, setOpen] = React.useState(false);
  const [printType, setPrintType] = React.useState(1);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Parse itemsJSON and paymentsJSON from strings to JSON objects
  const items = row.ReceiptProductModelList
    ? JSON.parse(`[${row.ReceiptProductModelList}]`)[0] // Take first array since data is nested
    : [];
  const payments = row.PaymentDetails
    ? typeof row.PaymentDetails === "string"
      ? JSON.parse(row.PaymentDetails)
      : Array.isArray(row.PaymentDetails)
        ? row.PaymentDetails
        : [row.PaymentDetails]
    : [];

  return (
    <React.Fragment>
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="lg"
        // sx={{
        //   "& .MuiDialog-paper": {
        //     borderRadius: "40px",
        //   },
        // }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ReceiptIcon />
            <Typography sx={{ color: "white" }} variant="h5" component="h2">
              Receipt Details for {row.ReceiptNumber}
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              color: "white",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Container sx={{ py: 2 }}>
            <Grid container spacing={3}>
              {/* Basic information */}
              <Grid item xs={6}>
                {/* <Typography variant="body1">
                  <strong>Receipt ID:</strong> {row.ReceiptID}
                </Typography> */}
                <Typography variant="body1">
                  <strong>Invoice No:</strong> {row.ReceiptNumber}
                </Typography>
                <Typography variant="body1">
                  <strong>Quotation No:</strong> {row.QuotationNo}
                </Typography>
                <Typography variant="body1">
                  <strong>
                    {row.EntityType == "CUST" ? "Customer" : "SubDealer"} Name:
                  </strong>{" "}
                  {row.Name}
                </Typography>
                {/* <Typography variant="body1">
                  <strong>Total Amount:</strong> ₹{row.TotalAmountBD || ""}
                </Typography> */}
                {/* <Typography variant="body1">
                  <strong>Discount:</strong> {row.Discount || ""}%
                </Typography> */}
                {/* <Typography variant="body1">
                  <strong>Net Total:</strong> ₹{row.NetTotalAmount || ""}
                </Typography> */}
                {/* <Typography variant="body1">
                  <strong>Invoice for:</strong>{" "}
                  {row.PDueEntityType == "CUST" && "Customer"}{" "}
                  {row.PDueEntityType == "SUPP" && "Supplier"}{" "}
                </Typography> */}
                <Typography variant="body1">
                  <strong>
                    {row.EntityType == "CUST" ? "Customer" : "SubDealer"}
                    Phone NO.:
                  </strong>{" "}
                  {row.PhoneNumber1}
                </Typography>
                <Typography variant="body1">
                  <strong>Address:</strong> {row.AddressLine1}{" "}
                  {row.AddressLine2}
                </Typography>
                <Typography variant="body1">
                  <strong>State:</strong> {row.State}
                </Typography>
                <Typography variant="body1">
                  <strong>District:</strong> {row.District}
                </Typography>
                <Typography variant="body1">
                  <strong>City:</strong> {row.City}
                </Typography>
              </Grid>

              {/* Payment details */}
              <Grid item xs={6}>
                <Typography variant="body1">
                  <strong>Date:</strong> {formatDateTime(row.ReceiptDate)}
                </Typography>
                <Typography variant="body1">
                  <strong>CompanyName:</strong> {row.Bill_CompanyName}
                </Typography>
              </Grid>

              {/* Items table */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                  Items
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>Sl.No</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Product Name</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Quantity</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Rate</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Amount</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Array.isArray(items) && items.length > 0 ? (
                        items.map((item, index) => (
                          <TableRow key={item.ReceiptProductModelID}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{item.ProductModelName}</TableCell>
                            <TableCell align="right">{item.Quantity}</TableCell>
                            <TableCell align="right">₹{item.Rate}</TableCell>
                            <TableCell align="right">₹{item.Amount}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            No items found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Table
                sx={{
                  width: "100%",
                  borderCollapse: "collapse",
                  backgroundColor: "#fff",
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        padding: "10px",
                        fontSize: "18px",
                        fontWeight: "500",
                        color: "#fff", // changed to white
                        borderBottom: "2px solid #ddd",
                        backgroundColor: "#1976d2", // optional: add background for contrast
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "400",
                          fontSize: "14px",
                          color: "#fff",
                        }} // changed to white
                      >
                        Total Price
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        padding: "10px",
                        fontSize: "14px",
                        fontWeight: "400",
                        color: "#fff", // changed to white
                        borderBottom: "2px solid #ddd",
                        backgroundColor: "#1976d2", // optional
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "400",
                          fontSize: "14px",
                          color: "#fff",
                        }} // changed to white
                      >
                        Final Price after Discount
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        padding: "10px",
                        fontSize: "14px",
                        fontWeight: "400",
                        color: "#fff", // changed to white
                        borderBottom: "2px solid #ddd",
                        backgroundColor: "#1976d2", // optional
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "400",
                          fontSize: "14px",
                          color: "#fff",
                        }} // changed to white
                      >
                        SGST {row.SGSTP || ""}% + CGST {row.CGSTP || ""}%
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        padding: "10px",
                        fontSize: "14px",
                        fontWeight: "400",
                        color: "#fff", // changed to white
                        borderBottom: "2px solid #ddd",
                        backgroundColor: "#1976d2", // optional
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: "400",
                          fontSize: "14px",
                          color: "#fff",
                        }} // changed to white
                      >
                        Final Price after GST with Roundup
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        padding: "10px",
                        fontSize: "14px",
                        fontWeight: "400",
                        color: "#000",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      <Typography variant="body1">
                        {row.TotalAmountBD || ""}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        padding: "10px",
                        fontSize: "14px",
                        fontWeight: "400",
                        color: "#000",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      <Typography variant="body1">
                        {row.TotalAmountAD || ""}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        padding: "10px",
                        fontSize: "14px",
                        fontWeight: "400",
                        color: "#000",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      <Typography variant="body1">
                        {row.SGSTAmount || ""} + {row.CGSTAmount || ""}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        padding: "10px",
                        fontSize: "14px",
                        fontWeight: "400",
                        color: "#000",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      <Typography variant="body1">
                        {row.GrandTotalAmount || ""}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              {/* Payments table */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                  Payments
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>Sl.No</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Payment Mode</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Amount</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Payment Date</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {payments?.map((payment, index) => (
                        <TableRow key={payment.PaymentID}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{payment.PaymentModeName}</TableCell>
                          <TableCell>₹{payment.Amount || ""}</TableCell>
                          <TableCell>
                            {formatDateTime(payment.PaymentDate)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
            {/* <Stack
              direction="row"
              sx={{ gap: "1rem", WebkitJustifyContent: "center", mt: 2 }}
            >
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={printType}
                defaultValue={printType}
                onChange={(e) => setPrintType(e.target.value)}
              >
                <FormControlLabel
                  value={1}
                  control={<Radio />}
                  label="Original"
                />
                <FormControlLabel
                  value={2}
                  control={<Radio />}
                  label="Original + Office Copy"
                />
              </RadioGroup>
              <Button
                variant="outlined"
                onClick={() => generatePdfMoneyRecipt(row, printType)}
              >
                Print
              </Button>
            </Stack> */}
          </Container>
        </DialogContent>
        <DialogActions sx={{ padding: " 0 1.75rem .75rem 0" }}>
          <Button
            variant="text"
            color="success"
            onClick={handleCloseModal}
            autoFocus
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
