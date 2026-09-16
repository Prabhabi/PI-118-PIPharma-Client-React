import React, { useState, useEffect } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import { IconButton, Tooltip } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import GstGraph from "./component/gstgraph/GstGraph";
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import QuotationGraph from "./component/quotationGraph/QuotaitonGraph";
import InvoiceGraph from "./component/invoiceGraph/InvoiceGraph";
import InvoiceGraphYearWise from "./component/invoiceGraphYearWise/InvoiceGraphYearWise";
import QuotationGraphYearWise from "./component/quotationGraphYearWise/QuotationGraphYearWise";
import DuePaidGraphSales from "./../salesGraph/component/duePaidGraphSales/DuePaidGraphSales";
import InventoryGraph from "./component/invenrotyGraph/InventoryGraph";
import LoadingComp from "../../components/loadingComp/LoadingComp";

export default function PurchaseGraph() {
  const [selectedOption, setSelectedOption] = useState("gst");
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [isExtraLargeScreen, setIsExtraLargeScreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const heavyQueryKeys = [
    ["inventoryGraphApi"],
    ["gstGraphApi"],
    ["invoicePurGraphApi"],
    ["incoicePurYearGraphApi"],
    ["dueGraphApi"],
  ];
  const handleRefresh = async () => {
    setLoading(true);
    await Promise.all(
      heavyQueryKeys.map((key) =>
        queryClient.invalidateQueries({
          queryKey: key,
          refetchType: "active",
        })
      )
    );
    setLoading(false);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1650px)");
    const handleMediaQueryChange = (event) => {
      setIsExtraLargeScreen(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);
    setIsExtraLargeScreen(mediaQuery.matches);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <Box
      sx={{ p: 3, bgcolor: theme.palette.background.main, minHeight: "100vh" }}
    >
      {/* <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ mb: 2, mt: 1 }}
      >
        <Typography variant="h5" sx={{ flexGrow: 1, ml: 2 }}>
          Purchase Graphs
        </Typography>
        <Tooltip title="Refresh Graphs">
          <span>
            <IconButton
              color="primary"
              onClick={handleRefresh}
              size="large"
              disabled={loading}
            >
              <RefreshIcon />
            </IconButton>
          </span>
        </Tooltip>
        {loading && <LoadingComp loading={loading} />}
      </Stack> */}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          mt: 2,
          ml: 3,
          flexWrap: "wrap",
          gap: 2,
          mb: 2,
          justifyContent: "center",
        }}
      >
        <InventoryGraph />
        <GstGraph />
        <QuotationGraph />
        <InvoiceGraph />
      </Stack>
      <Grid container spacing={1}>
        <Grid
          item
          sm={5.7}
          sx={{
            background: "white",
            padding: "2rem",
            borderRadius: "12px",
            m: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            "& > *": {
              width: "100%",
              height: "100%",
            },
          }}
        >
          <QuotationGraphYearWise />
        </Grid>
        <Grid
          item
          sm={5.7}
          sx={{
            background: "white",
            padding: "2rem",
            borderRadius: "12px",
            m: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            "& > *": {
              width: "100%",
              height: "100%",
            },
          }}
        >
          <DuePaidGraphSales />
        </Grid>
        <Grid
          item
          sm={11.6}
          sx={{
            background: "white",
            padding: "2rem",
            borderRadius: "12px",
            m: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            "& > *": {
              width: "100%",
              height: "100%",
            },
          }}
        >
          <InvoiceGraphYearWise />
          <LoadingComp loading={loading} />
        </Grid>
      </Grid>
    </Box>
  );
}
