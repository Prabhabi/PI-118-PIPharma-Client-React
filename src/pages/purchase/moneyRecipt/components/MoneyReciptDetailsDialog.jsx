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
  Stack,
  IconButton,
} from "@mui/material";
import { ReceiptLong, Close as CloseIcon } from "@mui/icons-material";

// Helper to format date
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString() + " " + d.toLocaleTimeString();
};

export default function MoneyReciptDetailsDialog({
  openModal,
  handleCloseModal,
  row,
}) {
  // row is expected to be the object from data[0] in the provided JSON
  if (!row) return null;

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
            background: "#1976d2",
          }}
        >
          <ReceiptLong sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component="h2"
            sx={{ color: "inherit", flex: 1 }}
          >
            <strong>Request Order Details</strong>
          </Typography>
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
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Order ID:</strong> {row.RequestOrderMasterID}
                </Typography>
                <Typography variant="body1">
                  <strong>Order Date:</strong>{" "}
                  {formatDate(row.RequestOrderDate)}
                </Typography>
                <Typography variant="body1">
                  <strong>Customer Name:</strong> {row.CustomerName}
                </Typography>
                <Typography variant="body1">
                  <strong>Advance Amount:</strong> ₹{row.AdvanceAmount}
                </Typography>
                <Typography variant="body1">
                  <strong>Approx Bill Amount:</strong> ₹{row.ApproxBillAmount}
                </Typography>
                <Typography variant="body1">
                  <strong>Due Amount:</strong> ₹{row.DueAmount}
                </Typography>
                <Typography variant="body1">
                  <strong>Overall Delivery Date:</strong>{" "}
                  {formatDate(row.OverallDeliveryDateTime)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Prepared By:</strong> {row.PreparedByName}
                </Typography>
                <Typography variant="body1">
                  <strong>Checked By:</strong> {row.CheckedByName}
                </Typography>
                <Typography variant="body1">
                  <strong>Authorized Signatory:</strong>{" "}
                  {row.AuthorizedSignatoryName}
                </Typography>
                <Typography variant="body1">
                  <strong>Remarks:</strong> {row.Remarks}
                </Typography>
              </Grid>
            </Grid>

            {/* Product Model List Table */}
            {/* <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Product Models
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Model Number</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Price</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Brand ID</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Product Type ID</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Category ID</strong>
                      </TableCell>
                      <TableCell>
                        <strong>SubCategory ID</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.ProductModelList?.map((model) => (
                      <TableRow key={model.ProductModelID}>
                        <TableCell>{model.ModelNumber}</TableCell>
                        <TableCell>₹{model.Price}</TableCell>
                        <TableCell>{model.BrandMasterID}</TableCell>
                        <TableCell>{model.ProductTypeID}</TableCell>
                        <TableCell>{model.ProductCategoryID}</TableCell>
                        <TableCell>{model.ProductSubCategoryID}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box> */}

            {/* Order Mapping List Table */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Orderd Items
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Model Number</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Quantity</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Price</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Total</strong>
                      </TableCell>
                      <TableCell>
                        <strong>In Demand</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Expected Delivery</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.OrderMappingList?.map((order) => {
                      let demandLabel = "";
                      let demandColor = "";
                      switch (order.InDemand) {
                        case 1:
                          demandLabel = "High Demand";
                          demandColor = "green";
                          break;
                        case 2:
                          demandLabel = "Mid Demand";
                          demandColor = "orange";
                          break;
                        case 3:
                          demandLabel = "Low Demand";
                          demandColor = "red";
                          break;
                        case 4:
                          demandLabel = "Rare Demand";
                          demandColor = "blue";
                          break;
                        default:
                          demandLabel = order.InDemand;
                          demandColor = "inherit";
                      }
                      return (
                        <TableRow key={order.RequestOrderMappingID}>
                          <TableCell>{order.ModelNumber}</TableCell>
                          <TableCell>{order.Quantity}</TableCell>
                          <TableCell>₹{order.Price}</TableCell>
                          <TableCell>₹{order.Total}</TableCell>
                          <TableCell>
                            <span style={{ color: demandColor }}>
                              {demandLabel}
                            </span>
                          </TableCell>
                          <TableCell>
                            {formatDate(order.ExpectedDeliveryDateTime)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Container>
        </DialogContent>
        <DialogActions sx={{ padding: " 0 1.75rem .75rem 0" }}>
          <Button variant="text" onClick={handleCloseModal} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
