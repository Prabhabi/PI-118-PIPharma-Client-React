import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack, // Add Stack import
} from "@mui/material";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import InvoiceGraphDetails from "./component/InvoiceGraphDetails";
import Cookies from "js-cookie"; // Import Cookies
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee"; // Replace RequestQuoteIcon import
import { financialYearConfig } from "../../../../functionforAll";
import TableChartIcon from "@mui/icons-material/TableChart";
import { invoicePurGraphApiFn } from "../../../../api/purchaseApi";
import { useQuery } from "@tanstack/react-query";

export default function InvoiceGraph() {
  const [open, setOpen] = useState(false);
  const [startingYear, setStartingYear] = useState(null);
  const [endingYear, setEndingYear] = useState(null);
  // const [invoicreGraphData, setInvoiceGraphData] = useState([]);

  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token?.replace(/"/g, "") || ""}`;

  // const fetchInvoice = async () => {
  //   try {
  //     const res = await axios.get(
  //       `${process.env.REACT_APP_URL}/api/invoice/total?EntityType=Supp&BillCode=INVP`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: sanctumToken,
  //         },
  //       }
  //     );
  //     setInvoiceGraphData(res.data || []);
  //     setStartingYear(res.data?.[0]?.StartingYear || null);
  //     setEndingYear(res.data?.[0]?.CurrentYear || null);
  //   } catch (error) {
  //     setInvoiceGraphData([]);
  //     setStartingYear(null);
  //     setEndingYear(null);
  //   }
  // };

  // useEffect(() => {
  //   // fetchGst();
  //   fetchInvoice();
  // }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["invoicePurGraphApi"],
    queryFn: invoicePurGraphApiFn,
    staleTime: Infinity,
  });
  const invoicreGraphData = data?.data;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(45deg, #ff5722 30%, #ff8a65 80%)",
          padding: "1rem",
          cursor: "pointer",
          minWidth: "15rem",
          borderRadius: "20px",
          position: "relative",
          overflow: "hidden",
        }}
        onClick={handleClickOpen}
      >
        <CurrencyRupeeIcon
          sx={{
            position: "absolute",
            right: "-20px",
            bottom: "-20px",
            fontSize: "160px",
            opacity: "0.2",
            color: "#ffffff",
            transform: "rotate(-10deg)",
          }}
        />
        <Stack
          direction="row"
          spacing={2}
          sx={{ mb: 2, justifyContent: "space-between", alignItems: "center" }}
        >
          <Typography variant="h3" sx={{ color: "#fff" }}>
            {invoicreGraphData?.[0]?.GrandTotalAmount ?? 0}
          </Typography>
          <Stack direction="column" alignItems="flex-end">
            <Typography variant="h6" sx={{ color: "#fff" }}>
              Invoice
            </Typography>
            <Typography variant="body1" sx={{ color: "#fff" }}>
              {financialYearConfig.currentYear()} -{" "}
              {financialYearConfig.currentYear() + 1}
            </Typography>
          </Stack>
        </Stack>
        <Typography variant="body1" sx={{ color: "#fff" }}>
          Total Amount Before Discount:{" "}
          {invoicreGraphData?.[0]?.TotalAmountBD ?? 0}
        </Typography>
        {/* <Typography variant="body1" sx={{ color: "#fff" }}>
          Discount Amount: {invoicreGraphData?.[0]?.DiscountAmount ?? 0}
        </Typography>
        <Typography variant="body1" sx={{ color: "#fff" }}>
          Total Amount After Discount:{" "}
          {invoicreGraphData?.[0]?.TotalAmountAD ?? 0}
        </Typography>
        <Typography variant="body1" sx={{ color: "#fff" }}>
          CGST Amount: {invoicreGraphData?.[0]?.CGSTAmount ?? 0}
        </Typography>
        <Typography variant="body1" sx={{ color: "#fff" }}>
          SGST Amount: {invoicreGraphData?.[0]?.SGSTAmount ?? 0}
        </Typography>
        <Typography variant="body1" sx={{ color: "#fff" }}>
          Total GST: {invoicreGraphData?.[0]?.TotalGST ?? 0}
        </Typography> */}
        <Typography variant="body1" sx={{ color: "#fff" }}>
          Grand Total Amount: {invoicreGraphData?.[0]?.GrandTotalAmount ?? 0}
        </Typography>
        <Typography variant="body1" sx={{ color: "#fff" }}>
          Net Total Amount: {invoicreGraphData?.[0]?.NetTotalAmount ?? 0}
        </Typography>
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <TableChartIcon />
          {"Invoice Details"}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "#ffffff",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <InvoiceGraphDetails
            startingYear={data?.data?.[0]?.StartingYear}
            endingYear={financialYearConfig.currentYear()}
          />
        </DialogContent>
        <DialogActions>
          <Button color="success" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
