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
import MoneyReciptGraphDetailsS from "./component/MoneyReciptGraphDetailsS";
import Cookies from "js-cookie"; // Import Cookies
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { financialYearConfig } from "../../../../functionforAll";
import { moneyReciptSalesGraphApiFn } from "../../../../api/salesApi";
import { useQuery } from "@tanstack/react-query";

export default function MoneyReciptGraphS() {
  // const [gstGraphFullData, setGstGraphFullData] = useState([]);
  const [open, setOpen] = useState(false);
  const [startingYear, setStartingYear] = useState(null);
  const [endingYear, setEndingYear] = useState(null);
  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;
  // const fetchGst = async () => {
  //   const res = await axios.get(
  //     `${process.env.REACT_APP_URL}/api/moneyReceiptTotal?bill_code=MRP`,
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

  // useEffect(() => {
  //   fetchGst();
  // }, []);
  const { data, isLoading, error } = useQuery({
    queryKey: ["moneyReciptSalesGraphApi"],
    queryFn: moneyReciptSalesGraphApiFn,
  });
  const gstGraphFullData = data?.data;

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
          background: "linear-gradient(45deg, #4299e1 30%, #63b3ed 90%)",
          padding: "1rem",
          cursor: "pointer",
          minWidth: "15rem",
          borderRadius: "20px",
          position: "relative",
          overflow: "hidden",
        }}
        onClick={handleClickOpen}
      >
        <ReceiptLongIcon
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
            {gstGraphFullData?.[0]?.TotalGST}
          </Typography>
          <Stack direction="column" alignItems="flex-end">
            <Typography variant="h6" sx={{ color: "#fff" }}>
              Money Receipt
            </Typography>
            <Typography variant="body1" sx={{ color: "#fff" }}>
              {gstGraphFullData?.[0]?.StartingYear} -
              {gstGraphFullData?.[0]?.CurrentYear}
            </Typography>
          </Stack>
        </Stack>

        <Typography variant="body1" sx={{ color: "#fff", mb: 0.5 }}>
          Grand Total: {gstGraphFullData?.[0]?.GrandTotalAmount}
        </Typography>
        <Typography variant="body1" sx={{ color: "#fff", mb: 0.5 }}>
          Total GST: {gstGraphFullData?.[0]?.TotalGST}
        </Typography>
        <Typography variant="body1" sx={{ color: "#fff" }}>
          Net Total: {gstGraphFullData?.[0]?.NetTotalAmount}
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
        <DialogTitle id="alert-dialog-title" sx={{ color: "#fff" }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <ReceiptLongIcon />
            {"Money Receipt Details"}
          </Stack>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "#fff",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <MoneyReciptGraphDetailsS
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
