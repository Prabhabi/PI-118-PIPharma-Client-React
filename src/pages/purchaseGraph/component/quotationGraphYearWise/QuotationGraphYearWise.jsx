import React, { useEffect, useState } from "react";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Box,
} from "@mui/material";
import LoadingComp from "./../../../../components/loadingComp/LoadingComp";
import ErrorComp from "./../../../../components/error/ErrorComp";
import Cookies from "js-cookie"; // Import Cookies
import { financialYearConfig } from "../../../../functionforAll";
import { useQuery } from "@tanstack/react-query";
import { quoPurYearGraphApiFn } from "../../../../api/purchaseApi";

export default function QuotationGraphYearWise() {
  const [invoiceGraphData, setInvoiceGraphData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(
    financialYearConfig.currentYear()
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

  // ============================================================
  const { data, isLoading } = useQuery({
    queryKey: ["quoPurYearGraphApi"],
    queryFn: quoPurYearGraphApiFn,
  });
  useEffect(() => {
    setInvoiceGraphData(data?.data.data || []);
  }, [data]);
  // ======================================================================

  const fetchInvoice = async (year) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_URL}/api/monthWiseEntityBooking?EntityType=SUPP&BillCode=QUO&BillYear=${year}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: sanctumToken,
          },
        }
      );
      setInvoiceGraphData(res.data.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const result =
    invoiceGraphData?.map((i) => {
      if (!i || !i.Entities)
        return {
          month: i?.Month || 0,
          monthName: i?.MonthName?.substring(0, 3) || "",
          grandTotalAmount: 0,
        };

      const grandTotalAmountAll = i.Entities.reduce((acc, entity) => {
        return acc + Number(entity.TotalAmountAD || 0);
      }, 0);

      const shortMonthName = i.MonthName?.substring(0, 3) || ""; // Add null check here too

      return {
        month: i.Month,
        monthName: shortMonthName,
        grandTotalAmount: grandTotalAmountAll,
      };
    }) || [];

  // useEffect(() => {
  //   fetchInvoice(selectedYear);
  // }, [selectedYear]);

  // const handleYearChange = (event) => {
  //   setSelectedYear(event.target.value);
  // };

  return (
    <Box
      sx={{
        width: "100%",
        height: "450px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          height: "400px",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ color: "#1b5e20", marginBottom: "1rem" }}
        >
          <RequestQuoteIcon color="success" />
          <h2 style={{ color: "#008000" }}>Quotation Graph Year Wise</h2>
        </Stack>
        <Box sx={{ height: "3.5rem" }}>
          <FormControl
            variant="outlined"
            style={{ minWidth: 120, marginBottom: 20 }}
          >
            <InputLabel id="year-select-label">Year</InputLabel>
            <Select
              labelId="year-select-label"
              id="year-select"
              value={selectedYear}
              onChange={(e) => {
                fetchInvoice(e.target.value);
                setSelectedYear(e.target.value);
              }}
              label="Year"
            >
              <MenuItem value={financialYearConfig.currentYear()}>
                {financialYearConfig.currentYear()}
              </MenuItem>
              <MenuItem value={financialYearConfig.currentYear() - 1}>
                {financialYearConfig.currentYear() - 1}
              </MenuItem>
              <MenuItem value={financialYearConfig.currentYear() - 2}>
                {financialYearConfig.currentYear() - 2}
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Stack>
      <Box sx={{ flexGrow: 1, width: "100%", minHeight: "500px" }}>
        <ResponsiveContainer width="100%" height="80%">
          <LineChart data={result}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="monthName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="grandTotalAmount"
              name="Grand Total Amount" // Change label here
              stroke="#1b5e20"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
      <LoadingComp loading={loading} />
      <ErrorComp error={error} />
    </Box>
  );
}
