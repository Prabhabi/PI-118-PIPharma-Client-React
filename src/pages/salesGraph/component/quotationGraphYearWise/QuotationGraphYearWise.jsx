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
import { financialYearConfig } from "../../../../functionforAll";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useQuery } from "@tanstack/react-query";
import { advbSalesYearGraphApiFn } from "../../../../api/salesApi";

export default function QuotationGraphYearWise() {
  const [invoiceGraphData, setInvoiceGraphData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(
    financialYearConfig.currentYear()
  );
  const [selectedEntity, setSelectedEntity] = useState("CUST");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

  const fetchInvoice = async (year, entity) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_URL}/api/monthWiseEntityBooking?EntityType=${entity}&BillCode=ADVB&BillYear=${year}`,
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
  // =================================================================================
  const { data, isLoading } = useQuery({
    queryKey: ["advbSalesYearGraphApi"],
    queryFn: advbSalesYearGraphApiFn,
  });
  useEffect(() => {
    setInvoiceGraphData(data?.data.data);

    // data?.data.data && setLoading(false);
  }, [data]);
  // =================================================================================
  const monthShortNames = {
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

  const result =
    invoiceGraphData?.map((i) => {
      const grandTotalAmountAll = (i?.Entities || []).reduce((acc, entity) => {
        return acc + Number(entity?.NetTotalAmount || 0);
      }, 0);

      return {
        month: i?.Month || "",
        monthName: monthShortNames[i?.MonthName] || i?.MonthName || "",
        grandTotalAmount: grandTotalAmountAll.toFixed(2),
      };
    }) || [];

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
          <h2 style={{ color: "#388e3c" }}>Quotation Graph Year Wise</h2>
        </Stack>
        <Stack direction="row" gap={0.5}>
          <Box>
            <FormControl
              variant="outlined"
              style={{ minWidth: 120, marginBottom: 20, marginLeft: 20 }}
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
      <ResponsiveContainer width="100%" height={400} minWidth={300}>
        <LineChart
          data={result}
          margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="monthName"
            angle={0}
            textAnchor="middle"
            height={60}
          />
          <YAxis
            width={80}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
          />
          <Tooltip
            formatter={(value) => [
              `₹${Number(value).toLocaleString()}`,
              "Grand Total Amount",
            ]}
          />
          <Legend verticalAlign="top" height={36} />
          <Line
            type="monotone"
            dataKey="grandTotalAmount"
            name="Grand Total Amount"
            stroke="#1b5e20"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
      <LoadingComp loading={loading} />
      <ErrorComp error={error} />
    </Box>
  );
}
