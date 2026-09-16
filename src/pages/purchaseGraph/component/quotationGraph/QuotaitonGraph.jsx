import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import QuotationGraphDetails from "./component/QuotationGraphDetailsSubd";
import Cookies from "js-cookie"; // Import Cookies
import Stack from "@mui/material/Stack";
import DescriptionIcon from "@mui/icons-material/Description";
import { financialYearConfig } from "../../../../functionforAll";
import { quotationGraphApiFn } from "../../../../api/purchaseApi";
import { useQuery } from "@tanstack/react-query";

export default function QuotationGraph() {
  const [gstGraphFullData, setGstGraphFullData] = useState([]);
  const [open, setOpen] = useState(false);
  const [endingYear, setEndingYear] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["quotationGraphApi"],
    queryFn: quotationGraphApiFn,
  });
  const invoicreGraphData = data;

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
          background: "linear-gradient(45deg, #1565c0 30%, #42a5f5 90%)",
          padding: "1rem",
          cursor: "pointer",
          minWidth: "15rem",
          borderRadius: "20px",
          position: "relative",
          overflow: "hidden",
        }}
        onClick={handleClickOpen}
      >
        <DescriptionIcon
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
            {invoicreGraphData?.[0]?.GrandTotalAmount}
          </Typography>
          <Stack direction="column" alignItems="flex-end">
            <Typography variant="h6" sx={{ color: "#fff" }}>
              Quotation
            </Typography>
            <Typography variant="body1" sx={{ color: "#fff" }}>
              {financialYearConfig.currentYear()} -{" "}
              {financialYearConfig.currentYear() + 1}
            </Typography>
          </Stack>
        </Stack>

        <Typography variant="body1" sx={{ color: "#fff" }}>
          Total GST: {invoicreGraphData?.[0]?.TotalGST}
        </Typography>
        <Typography variant="body1" sx={{ color: "#fff" }}>
          Net Total Amount: {invoicreGraphData?.[0]?.NetTotalAmount}
        </Typography>
        <Typography variant="body1" sx={{ color: "#fff" }}>
          Grand Total Amount: {invoicreGraphData?.[0]?.GrandTotalAmount}
        </Typography>
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth
        sx={{
          "& .MuiStepIcon-root.Mui-active": {
            color: "#1b5e20",
          },
          "& .MuiStepIcon-root.Mui-completed": {
            color: "#1b5e20",
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <DescriptionIcon />
          {"Quotation details"}
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
          <QuotationGraphDetails
            startingYear={data?.[0]?.StartingYear}
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
