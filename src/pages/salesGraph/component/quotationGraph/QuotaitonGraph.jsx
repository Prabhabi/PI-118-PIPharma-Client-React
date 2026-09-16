import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import QuotationGraphDetailsCust from "./component/QuotationGraphDetailsCust";
import QuotationGraphDetailsSubd from "./component/QuotationGraphDetailsSubd";
import Cookies from "js-cookie"; // Import Cookies
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { financialYearConfig } from "../../../../functionforAll";
import {
  advbSalesCustGraphApiFn,
  advbSalesGraphApiFn,
  advbSalesSubdGraphApiFn,
} from "../../../../api/salesApi";
import { useQueries, useQuery } from "@tanstack/react-query";

export default function QuotationGraph() {
  const [gstGraphFullData, setGstGraphFullData] = useState([]);
  const [open, setOpen] = useState(false);
  const [startingYear, setStartingYear] = useState(null);
  const [endingYear, setEndingYear] = useState(null);
  // const [advbGraphDataCust, setAdvbGraphDataCust] = useState([]); // Add
  // const [advbGraphDataSubd, setAdvbGraphDataSubd] = useState([]); // Add
  const [type, setType] = useState("");

  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

  // const fetchGst = async () => {
  //   const res = await axios.get(
  //     `${process.env.REACT_APP_URL}/api/booking/total?EntityType=SUPP&BillCode=QUO`,
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: sanctumToken,
  //       },
  //     }
  //   );
  //   setGstGraphFullData(res.data);
  //   setStartingYear(res.data?.[0]?.StartingYear);
  //   setEndingYear(res.data?.[0]?.CurrentYear);
  // };
  // const fetchAdvbsubd = async () => {
  //   const res = await axios.get(
  //     `${process.env.REACT_APP_URL}/api/booking/total?EntityType=SUBD&BillCode=ADVB`,
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: sanctumToken,
  //       },
  //     }
  //   );
  //   setAdvbGraphDataSubd(res.data);
  // };
  // const fetchAdvbCust = async () => {
  //   const res = await axios.get(
  //     `${process.env.REACT_APP_URL}/api/booking/total?EntityType=CUST&BillCode=ADVB`,
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: sanctumToken,
  //       },
  //     }
  //   );
  //   setAdvbGraphDataCust(res.data);
  // };
  // =======================================================================
  const results = useQueries({
    queries: [
      {
        queryKey: ["advbSalesCustGraphApi"],
        queryFn: advbSalesCustGraphApiFn,
      },
      {
        queryKey: ["advbSalesSubdGraphApi"],
        queryFn: advbSalesSubdGraphApiFn,
      },
    ],
  });

  const [custQuery, subdQuery] = results;
  const advbGraphDataSubd = subdQuery?.data?.data;
  const advbGraphDataCust = custQuery?.data?.data;

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
          background: "linear-gradient(45deg, #FF4500 30%, #FF8C00 80%)", // Darker orange gradient
          padding: "1rem",
          cursor: "pointer",
          minWidth: "15rem",
          borderRadius: "20px",
          position: "relative",
          overflow: "hidden",
        }}
        onClick={() => handleClickOpen("cust")}
      >
        <ShoppingCartIcon
          sx={{
            position: "absolute",
            right: "-30px",
            bottom: "-30px",
            fontSize: "200px",
            opacity: "0.3",
            color: "#ffffff",
            transform: "rotate(-15deg)",
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
            {advbGraphDataCust?.[0]?.NetTotalAmount}
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
          Grand Total: {advbGraphDataCust?.[0]?.GrandTotalAmount}
        </Typography>
        <Typography variant="body1" sx={{ color: "#fff" }}>
          Total GST: {advbGraphDataCust?.[0]?.TotalGST}
        </Typography>
        <Typography variant="body1" sx={{ color: "#fff" }}>
          Net Total: {advbGraphDataCust?.[0]?.NetTotalAmount}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(45deg, #C71585 30%, #FF1493 80%)", // Darker pink gradient
          padding: "1rem",
          cursor: "pointer",
          minWidth: "15rem",
          borderRadius: "20px",
          position: "relative",
          overflow: "hidden",
        }}
        onClick={() => handleClickOpen("subd")}
      >
        <StorefrontIcon
          sx={{
            position: "absolute",
            right: "-30px",
            bottom: "-30px",
            fontSize: "200px",
            opacity: "0.3",
            color: "#ffffff",
            transform: "rotate(-15deg)",
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
            {advbGraphDataSubd?.[0]?.NetTotalAmount}
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
          Grand Total: {advbGraphDataSubd?.[0]?.GrandTotalAmount}
        </Typography>
        <Typography variant="body1" sx={{ color: "#fff" }}>
          Total GST: {advbGraphDataSubd?.[0]?.TotalGST}
        </Typography>
        <Typography variant="body1" sx={{ color: "#fff" }}>
          Net Total: {advbGraphDataSubd?.[0]?.NetTotalAmount}
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {type == "cust" ? <ShoppingCartIcon /> : <StorefrontIcon />}
            {type == "cust" ? "Customer" : "SubDealer"} Advance Order
          </Box>
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
            <QuotationGraphDetailsCust
              startingYear={advbGraphDataCust?.[0]?.StartingYear}
              endingYear={financialYearConfig.currentYear()}
            />
          ) : (
            <QuotationGraphDetailsSubd
              startingYear={advbGraphDataCust?.[0]?.StartingYear}
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
