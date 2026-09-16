import React, { useState, useEffect } from "react";
import GstGraph from "./component/gstgraph/GstGraph";
import {
  Box,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import QuotationGraph from "./component/quotationGraph/QuotaitonGraph";
import InvoiceGraph from "./component/invoiceGraph/InvoiceGraph";
import InvoiceGraphYearWise from "./component/invoiceGraphYearWise/InvoiceGraphYearWise";
import QuotationGraphYearWise from "./component/quotationGraphYearWise/QuotationGraphYearWise";
import MoneyReciptGraphS from "./component/MoneyReciptGraphS/MoneyReciptGraphS";
import MoneyReciptGraphYearWiseS from "./component/MoneyReciptGraphYearWiseS/MoneyReciptGraphYearWiseS";

export default function SalesGraph() {
  const [selectedOption, setSelectedOption] = useState("gst");
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [isExtraLargeScreen, setIsExtraLargeScreen] = useState(false);

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
      <Stack
        direction="row"
        spacing={2}
        sx={{
          mt: 2,
          flexWrap: "wrap",
          gap: 2,
          mb: 2,
          justifyContent: "center",
          // backgroundColor: "red",
        }}
      >
        {/* <GstGraph /> */}
        {/* <MoneyReciptGraphS />
        <QuotationGraph />
        <InvoiceGraph /> */}
      </Stack>
      <Grid
        container
        spacing={3}
        sx={{
          p: 3,
          width: "100%",
          "& .MuiGrid-item": {
            width: { xs: "100%", sm: "calc(50% - 12px)" },
            minHeight: "400px",
            mb: 3,
          },
        }}
      >
        <Grid
          item
          xs={12}
          sm={8}
          sx={{
            background: "white",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            height: "100%",
            "& > *": {
              width: "100%",
              height: "100%",
            },
          }}
        >
          <InvoiceGraphYearWise />
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
          sx={{
            padding: "2rem",
            borderRadius: "12px",
            width: "100%",
            "& > *": {
              width: "100%",
              height: "400px",
            },
          }}
        >
          <Stack
            // direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mb: 2, mt: 4 }}
          >
            <GstGraph />
            <MoneyReciptGraphS />{" "}
          </Stack>
        </Grid>
        <Grid
          item
          xs={12}
          sm={4.5}
          sx={{
            padding: "2rem",
            borderRadius: "12px",
            height: "100%",
            "& > *": {
              width: "100%",
              height: "100%",
            },
          }}
        >
          <Stack
            // direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mb: 2, mt: 4 }}
          >
            <Typography variant="h4" sx={{ textAlign: "center" }}>
              Advance Order
            </Typography>
            <QuotationGraph />
          </Stack>
        </Grid>
        <Grid
          item
          xs={12}
          sm={7}
          sx={{
            background: "white",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            ml: 2,
            height: "100%",
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
          xs={12}
          sm={8}
          sx={{
            background: "white",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            height: "100%",
            "& > *": {
              width: "100%",
              height: "100%",
            },
          }}
        >
          <MoneyReciptGraphYearWiseS />
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
          sx={{
            padding: "2rem",
            borderRadius: "12px",
            height: "100%",
            "& > *": {
              width: "100%",
              height: "100%",
            },
          }}
        >
          <Stack
            // direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mb: 2, mt: 4 }}
          >
            <Typography variant="h4" sx={{ textAlign: "center" }}>
              Invoice Graph
            </Typography>
            <InvoiceGraph />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
