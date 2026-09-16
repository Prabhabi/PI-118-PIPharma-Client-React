import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
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
} from "@mui/material";
import { formatDateTime } from "./../../../../functionforAll";
import { ReceiptLong, Close } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";

// Add new date formatting function at the top of the component
function formatDateOnly(dateString) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString();
}

export default function InvoiceDetailsDialog({
  openModal,
  handleCloseModal,
  row,
}) {
  // Parse itemsJSON and paymentsJSON from strings to JSON objects
  const itemsRaw = row.ReceiptProductModelList
    ? JSON.parse(`[${row.ReceiptProductModelList}]`)
    : [];
  // Flatten the nested array structure
  const items =
    Array.isArray(itemsRaw) && Array.isArray(itemsRaw[0])
      ? itemsRaw[0]
      : itemsRaw;

  // Correct payments parsing for nested array structure
  const paymentsRaw = row.PaymentDetails
    ? JSON.parse(`[${row.PaymentDetails}]`)
    : [];
  const payments =
    Array.isArray(paymentsRaw) && Array.isArray(paymentsRaw[0])
      ? paymentsRaw[0]
      : paymentsRaw;

  return (
    <React.Fragment>
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="md"
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
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <ReceiptLong />
            <Typography sx={{ color: "white" }} variant="h5" component="h2">
              Receipt Details for {row.ReceiptNumber}
            </Typography>
          </div>
          <IconButton onClick={handleCloseModal} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Container sx={{ py: 2 }}>
            <Grid container spacing={3}>
              {/* Basic information */}
              <Grid item xs={6}>
                <Typography variant="body1">
                  <strong>Receipt ID:</strong> {row.ReceiptID}
                </Typography>
                <Typography variant="body1">
                  <strong>Quotation No:</strong> {row.QuotationNo ?? "-"}
                </Typography>
                <Typography variant="body1">
                  <strong>Name:</strong> {row.Name || "-"}
                </Typography>
                <Typography variant="body1">
                  <strong>Discount:</strong> {row.Discount}%
                </Typography>
                <Typography variant="body1">
                  <strong>Total:</strong> ₹{row.NetTotalAmount}
                </Typography>{" "}
                <Typography variant="body1">
                  <strong>Paid Amount:</strong> ₹{row.NetPaidAmount}
                </Typography>
                <Typography variant="body1">
                  <strong>Total Due:</strong> ₹{row.PDueDueAmount}
                </Typography>
                <Typography variant="body1">
                  <strong>Invoice for:</strong>{" "}
                  {row.PDueEntityType == "CUST" && "Customer"}{" "}
                  {row.PDueEntityType == "SUPP" && "Supplier"}{" "}
                </Typography>
                <Typography variant="body1">
                  <strong>PhoneNumber 1:</strong>{" "}
                  {row.PhoneNumber1 || row.Bill_PhoneNumber1 || "-"}
                </Typography>
              </Grid>

              {/* Payment details */}
              <Grid item xs={6}>
                <Typography variant="body1">
                  <strong>Phone:</strong>{" "}
                  {row.PhoneNumber1 || row.Bill_PhoneNumber1 || "-"}
                </Typography>
                <Typography variant="body1">
                  <strong>Address:</strong>{" "}
                  {(row.AddressLine1 || row.Bill_AddressLine1 || "-") +
                    " " +
                    (row.AddressLine2 || row.Bill_AddressLine2 || "")}
                </Typography>
                <Typography variant="body1">
                  <strong>State:</strong> {row.State || row.Bill_State || "-"}
                </Typography>
                <Typography variant="body1">
                  <strong>District:</strong>{" "}
                  {row.District || row.Bill_District || "-"}
                </Typography>
                <Typography variant="body1">
                  <strong>City:</strong> {row.City || row.Bill_City || "-"}
                </Typography>
                <Typography variant="body1">
                  <strong>Payment Date:</strong>{" "}
                  {formatDateTime(row.ReceiptDate)}
                </Typography>
                <Typography variant="body1">
                  <strong>CompanyName:</strong>{" "}
                  {row.CompanyName || row.Bill_CompanyName || "-"}
                </Typography>
                <Typography variant="body1">
                  <strong>PhoneNumber 2:</strong>{" "}
                  {row.PhoneNumber2 || row.Bill_PhoneNumber2 || "-"}
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
                        <TableCell align="center">
                          <strong>Sl No</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Item Name</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Quantity</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Unit Price</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Total Price</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items?.map((item, index) => (
                        <TableRow key={item.ReceiptProductModelID}>
                          <TableCell align="center">{index + 1}</TableCell>
                          <TableCell align="center">
                            {item.ProductModelName}
                          </TableCell>
                          <TableCell align="center">{item.Quantity}</TableCell>
                          <TableCell align="center">₹{item.Rate}</TableCell>
                          <TableCell align="center">₹{item.Amount}</TableCell>
                        </TableRow>
                      ))}
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
                        color: "#000",
                        borderBottom: "2px solid #ddd",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "400", fontSize: "14px" }}
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
                        color: "#000",
                        borderBottom: "2px solid #ddd",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "400", fontSize: "14px" }}
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
                        color: "#000",
                        borderBottom: "2px solid #ddd",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "400", fontSize: "14px" }}
                      >
                        SGST {row.SGSTP}% + CGST {row.CGSTP}%
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        padding: "10px",
                        fontSize: "14px",
                        fontWeight: "400",
                        color: "#000",
                        borderBottom: "2px solid #ddd",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: "400", fontSize: "14px" }}
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
                        {row.TotalAmountBD}
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
                        {row.TotalAmountAD}
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
                        {row.SGSTAmount} + {row.CGSTAmount}
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
                        {row.NetTotalAmount}
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
                        <TableCell align="center">
                          <strong>Payment Mode</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Amount</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Payment Date</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {payments?.map((payment) => (
                        <TableRow key={payment.PaymentID}>
                          <TableCell align="center">
                            {payment.PaymentModeName}
                          </TableCell>
                          <TableCell align="center">
                            ₹{payment.Amount}
                          </TableCell>
                          <TableCell align="center">
                            {formatDateOnly(payment.PaymentDate)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
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
