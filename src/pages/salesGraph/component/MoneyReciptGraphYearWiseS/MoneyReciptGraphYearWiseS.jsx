import React, { useEffect, useState } from "react";
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
import BarChartIcon from "@mui/icons-material/BarChart";
import { financialYearConfig } from "../../../../functionforAll";
import { moneyReciptYearWiseGraphApiFn } from "../../../../api/salesApi";
import { useQuery } from "@tanstack/react-query";

export default function MoneyReciptGraphYearWiseS() {
  const [invoiceGraphData, setInvoiceGraphData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(
    financialYearConfig.currentYear()
  );
  const [selectedEntity, setSelectedEntity] = useState("CUST");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = Cookies.get("token");
  const monthAbbreviations = {
    January: "Jan",
    February: "Feb",
    March: "Mar",
    April: "Apr",
    May: "May",
    June: "Jun",
    July: "Jul",
    August: "Aug",
    September: "Sep",
    October: "Oct",
    November: "Nov",
    December: "Dec",
  };
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;
  const fetchInvoice = async (year, entity) => {
    setLoading(true);
    setError(null);
    console.log(
      `${process.env.REACT_APP_URL}/api/monthWiseBill?BillCode=MRIS&BillYear=${year}&Entity=${entity}`
    );
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_URL}/api/monthWiseBill?BillCode=MRIS&BillYear=${year}&Entity=${entity}`,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: sanctumToken,
          },
        }
      );

      const processedData = res.data.map((item) => ({
        monthName: monthAbbreviations[item.MonthName] || item.MonthName,
        grandTotalAmount: item.MoneyReceipts.reduce(
          (acc, receipt) => acc + receipt.GrandTotalAmount,
          0
        ),
      }));
      setInvoiceGraphData(processedData);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // =================================================================================
  const { data, isLoading } = useQuery({
    queryKey: ["moneyReciptYearWiseGraphApi"],
    queryFn: moneyReciptYearWiseGraphApiFn,
    staleTime: Infinity,
  });

  useEffect(() => {
    // Defensive: get array from data?.data?.data or data?.data or data
    let arr = [];
    if (Array.isArray(data?.data)) {
      arr = data?.data || [];
    } else if (Array.isArray(data?.data)) {
      arr = data?.data || [];
    } else if (Array.isArray(data)) {
      arr = data;
    }
    if (arr.length > 0) {
      const processedData = arr.map((item) => ({
        monthName: monthAbbreviations[item.MonthName] || item.MonthName,
        grandTotalAmount: Array.isArray(item.MoneyReceipts)
          ? item.MoneyReceipts.reduce(
              (acc, receipt) => acc + (receipt.GrandTotalAmount || 0),
              0
            )
          : 0,
      }));
      setInvoiceGraphData(processedData);
    }
  }, [data]);
  // =================================================================================

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    fetchInvoice(event.target.value, selectedEntity);
  };

  const handleEntityChange = (event) => {
    setSelectedEntity(event.target.value);
    fetchInvoice(selectedYear, event.target.value);
  };

  return (
    <Box>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <BarChartIcon sx={{ color: "#388e3c", fontSize: 30 }} />
          <h2 style={{ color: "#388e3c" }}>Money Recipt Graph Year Wise</h2>
        </Stack>{" "}
        <Stack direction="row" gap={0.5}>
          <Box sx={{ height: "3.5rem" }}>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, marginBottom: 20 }}
            >
              <InputLabel id="entity-select-label">Entity</InputLabel>
              <Select
                labelId="entity-select-label"
                id="entity-select"
                value={selectedEntity}
                onChange={handleEntityChange}
                label="Entity"
              >
                <MenuItem value="CUST">Customer</MenuItem>
                <MenuItem value="SUBD">Sub Dealer</MenuItem>
                {/* Add more entities as needed */}
              </Select>
            </FormControl>
          </Box>
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
                onChange={handleYearChange}
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
      </Stack>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={invoiceGraphData} margin={{ left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="monthName" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="grandTotalAmount"
            name="Grand Total Amount"
            stroke="#388e3c"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
      <LoadingComp loading={loading} />
      <ErrorComp error={error} />
    </Box>
  );
}
