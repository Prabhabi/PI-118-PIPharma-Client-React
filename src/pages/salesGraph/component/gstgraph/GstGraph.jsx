import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from "@mui/material";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import axios from "axios";
import GstGraphDetails from "./component/GstGraphDetails";
import CloseIcon from "@mui/icons-material/Close";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import IconButton from "@mui/material/IconButton";
import Cookies from "js-cookie"; // Import Cookies
import { financialYearConfig } from "../../../../functionforAll";
import { useQuery } from "@tanstack/react-query";
import { gstSalesGraphApiFn } from "../../../../api/salesApi";

export default function GstGraph() {
  // const [gstGraphFullData, setGstGraphFullData] = useState([]);
  const [open, setOpen] = useState(false);
  const [startingYear, setStartingYear] = useState(null);
  const [endingYear, setEndingYear] = useState(null);

  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

  // const fetchGst = async () => {
  //   const res = await axios.get(
  //     `${process.env.REACT_APP_URL}/api/gstTotalAmount?BillCode=INVS`,
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
    queryKey: ["gstSalesGraphApi"],
    queryFn: gstSalesGraphApiFn,
    staleTime: Infinity,
  });
  const gstGraphFullData = data?.data;
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(45deg, #01579b 30%, #363795 80%)",
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
            <Typography
              variant="h6"
              sx={{
                color: "#fff",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                padding: "0.2rem 0.5rem",
                borderRadius: "4px",
              }}
            >
              GST
            </Typography>
            <Typography variant="body1" sx={{ color: "#fff" }}>
              {financialYearConfig.currentYear()} -{" "}
              {financialYearConfig.currentYear() + 1}
            </Typography>
          </Stack>
        </Stack>

        <Typography variant="body1" sx={{ color: "#fff" }}>
          C. Gst {gstGraphFullData?.[0]?.TotalCGSTAmount}
        </Typography>
        <Typography variant="body1" sx={{ color: "#fff" }}>
          S. Gst {gstGraphFullData?.[0]?.TotalSGSTAmount}
        </Typography>
        <Typography variant="body1" sx={{ color: "#fff" }}>
          Total Gst {gstGraphFullData?.[0]?.TotalGST}
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
          <AccountBalanceIcon />
          {"GST Details"}
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
          <GstGraphDetails
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
    </Box>
  );
}
