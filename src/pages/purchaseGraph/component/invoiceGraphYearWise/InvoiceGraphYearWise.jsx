import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
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
import { BarChart as BarChartIcon } from "@mui/icons-material";
import { financialYearConfig } from "./../../../../functionforAll";
import { incoicePurYearGraphApiFn } from "../../../../api/purchaseApi";
import { useQuery } from "@tanstack/react-query";

export default function InvoiceGraphYearWise() {
  const [invoiceGraphData, setInvoiceGraphData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(
    financialYearConfig.currentYear()
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

  // ============================================================
  const { data, isLoading } = useQuery({
    queryKey: ["incoicePurYearGraphApi"],
    queryFn: incoicePurYearGraphApiFn,
    staleTime: Infinity,
  });

  useEffect(() => {
    setInvoiceGraphData(data?.data.data[0].MonthlyData || []);
    data?.data.data && setLoading(false);
  }, [data]);

  // ======================================================================

  const fetchInvoice = async (year) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_URL}/api/monthlyInvoiceData?entity_type=SUPP&bill_code=INVP&bill_year=${year}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: sanctumToken,
          },
        }
      );
      setInvoiceGraphData(res.data.data[0].MonthlyData);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const result =
    invoiceGraphData?.map((i) => {
      const grandTotalAmountAll =
        i?.Entities?.reduce((acc, entity) => {
          return acc + Number(entity?.GrandTotalAmount || 0);
        }, 0) || 0;

      const shortMonthName = i?.MonthName ? i.MonthName.substring(0, 3) : "";

      return {
        month: i?.Month || "",
        monthName: shortMonthName,
        grandTotalAmount: grandTotalAmountAll,
      };
    }) || [];

  // useEffect(() => {
  //   // fetchGst();
  //   fetchInvoice(selectedYear);
  // }, [selectedYear]);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "450px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {" "}
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <BarChartIcon sx={{ color: "#388e3c", fontSize: 28 }} />
          <h2 style={{ color: "#388e3c", margin: 0 }}>
            Invoice Graph Year Wise
          </h2>
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
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200,
                  },
                },
              }}
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          mt: 2,
        }}
      >
        <ResponsiveContainer width="95%" height={400}>
          <BarChart data={result}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="monthName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="grandTotalAmount"
              name="Grand Total Amount"
              fill="#1976d2"
              // radius={[0, 0, 50, 50]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
      {/* loading && <LoadingComp loading={loading} /> */}
      <ErrorComp error={error} />
    </Box>
  );
}
