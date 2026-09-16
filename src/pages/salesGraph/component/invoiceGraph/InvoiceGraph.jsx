import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import InvoiceGraphDetailsCust from "./component/InvoiceGraphDetailsCust";
import InvoiceGraphDetailsSudb from "./component/InvoiceGraphDetailsSubd";
import Cookies from "js-cookie"; // Import Cookies
import { financialYearConfig } from "../../../../functionforAll";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AssignmentIcon from "@mui/icons-material/Assignment";
import {
  invoiceSalesCustGraphApiFn,
  invoiceSalesSubdGraphApiFn,
} from "../../../../api/salesApi";
import { useQueries } from "@tanstack/react-query";

export default function InvoiceGraph() {
  const [open, setOpen] = useState(false);
  const [startingYear, setStartingYear] = useState(null);
  const [endingYear, setEndingYear] = useState(null);
  // const [invoicreGraphDataCust, setInvoiceGraphDataCust] = useState([]); // Add
  // const [invoiceGraphDataSubd, setInvoiceGraphDataSubd] = useState([]); // Add

  // const [advbGraphDataCust, setAdvbGraphDataCust] = useState([]); // Add
  const [type, setType] = useState("");

  // const fetchGst = async () => {
  //   const res = await axios.get(
  //     `${process.env.REACT_APP_URL}/api/gstTotalAmount?BillCode=INVP`
  //   );
  //   setGstGraphFullData(res.data);
  //   setStartingYear(res.data?.[0]?.StartingYear);
  //   setEndingYear(res.data?.[0]?.CurrentYear);
  // };
  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;
  // const fetchInvoiceSubd = async () => {
  //   const res = await axios.get(
  //     `${process.env.REACT_APP_URL}/api/invoice/total?EntityType=SUBD&BillCode=INVS`,
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: sanctumToken,
  //       },
  //     }
  //   );
  //   setInvoiceGraphDataSubd(res.data);
  //   setStartingYear(res.data?.[0]?.StartingYear);
  //   setEndingYear(res.data?.[0]?.CurrentYear);
  //   setAdvbGraphDataCust(res.data); // Add
  // };
  // const fetchInvoiceCust = async () => {
  //   const res = await axios.get(
  //     `${process.env.REACT_APP_URL}/api/invoice/total?EntityType=CUST&BillCode=INVS`,
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: sanctumToken,
  //       },
  //     }
  //   );
  //   setInvoiceGraphDataCust(res.data);
  //   setStartingYear(res.data?.[0]?.StartingYear);
  //   setEndingYear(res.data?.[0]?.CurrentYear);
  //   setAdvbGraphDataCust(res.data); // Add
  // };

  // useEffect(() => {
  //   // fetchGst();
  //   fetchInvoiceSubd();
  //   fetchInvoiceCust();
  // }, []);
  // =======================================================================
  const results = useQueries({
    queries: [
      {
        queryKey: ["invoiceSalesCustGraphApi"],
        queryFn: invoiceSalesCustGraphApiFn,
        staleTime: Infinity,
      },
      {
        queryKey: ["invoiceSalesSubdGraphApi"],
        queryFn: invoiceSalesSubdGraphApiFn,
        staleTime: Infinity,
      },
    ],
  });

  const [custQuery, subdQuery] = results;
  const invoiceGraphDataSubd = subdQuery?.data?.data;
  const invoicreGraphDataCust = custQuery?.data?.data;

  // ============================================================================

  const handleClickOpen = (type) => {
    setOpen(true);
    setType(type);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(45deg, #3949ab 30%, #5c6bc0 90%)", // Changed to blue gradient
          padding: "1rem",
          cursor: "pointer",
          minWidth: "15rem",
          borderRadius: "20px",
          position: "relative",
          overflow: "hidden",
        }}
        onClick={() => handleClickOpen("cust")}
      >
        <AccountBalanceWalletIcon
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
          sx={{
            mb: 2,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h3" sx={{ color: "#fff" }}>
            {Math.floor(invoicreGraphDataCust?.[0]?.GrandTotalAmount)}
          </Typography>
          <Stack direction="column" alignItems="flex-end">
            <Typography variant="h6" sx={{ color: "#fff" }}>
              Customer
            </Typography>
            <Typography variant="body1" sx={{ color: "#fff" }}>
              {financialYearConfig.currentYear()} -{" "}
              {financialYearConfig.currentYear() + 1}
            </Typography>
          </Stack>
        </Stack>

        <Typography variant="body1" sx={{ color: "#fff" }}>
          Total GST: {invoicreGraphDataCust?.[0]?.TotalGST}
        </Typography>
        <Typography variant="body1" sx={{ color: "#fff" }}>
          Net Total: {invoicreGraphDataCust?.[0]?.NetTotalAmount}
        </Typography>
        <Typography variant="body1" sx={{ color: "#fff" }}>
          Grand Total: {invoicreGraphDataCust?.[0]?.GrandTotalAmount}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(45deg, #673ab7 30%, #9575cd 90%)", // Changed to violet gradient
          padding: "1rem",
          cursor: "pointer",
          minWidth: "15rem",
          borderRadius: "20px",
          position: "relative",
          overflow: "hidden",
        }}
        onClick={() => handleClickOpen("subd")}
      >
        <ShowChartIcon
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
          sx={{
            mb: 2,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h3" sx={{ color: "#fff" }}>
            {Math.floor(invoiceGraphDataSubd?.[0]?.GrandTotalAmount)}
          </Typography>
          <Stack direction="column" alignItems="flex-end">
            <Typography variant="h6" sx={{ color: "#fff" }}>
              Sub Dealer
            </Typography>
            <Typography variant="body1" sx={{ color: "#fff" }}>
              {financialYearConfig.currentYear()} -{" "}
              {financialYearConfig.currentYear() + 1}
            </Typography>
          </Stack>
        </Stack>

        <Typography variant="body1" sx={{ color: "#fff" }}>
          Total GST: {invoiceGraphDataSubd?.[0]?.TotalGST}
        </Typography>
        <Typography variant="body1" sx={{ color: "#fff" }}>
          Net Total: {invoiceGraphDataSubd?.[0]?.NetTotalAmount}
        </Typography>
        <Typography variant="body1" sx={{ color: "#fff" }}>
          Grand Total: {invoiceGraphDataSubd?.[0]?.GrandTotalAmount}
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
        <DialogTitle id="alert-dialog-title" sx={{ color: "white" }}>
          {type === "cust" ? (
            <>
              <ReceiptIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Customer
            </>
          ) : (
            <>
              <AssignmentIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              SubDealer
            </>
          )}{" "}
          Invoice details
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "white",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {type == "cust" ? (
            <InvoiceGraphDetailsCust
              startingYear={invoiceGraphDataSubd?.[0]?.StartingYear}
              endingYear={financialYearConfig.currentYear()}
            />
          ) : (
            <InvoiceGraphDetailsSudb
              startingYear={invoiceGraphDataSubd?.[0]?.StartingYear}
              endingYear={financialYearConfig.currentYear()}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button color="success" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
