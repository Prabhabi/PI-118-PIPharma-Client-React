import React, { useEffect, useState } from "react";
import BarChartIcon from "@mui/icons-material/BarChart";
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
import { financialYearConfig } from "../../../../functionforAll";
import { incoiceSalesYearGraphApiFn } from "../../../../api/salesApi";
import { useQuery } from "@tanstack/react-query";

export default function InvoiceGraphYearWise() {
  const [invoiceGraphData, setInvoiceGraphData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(
    financialYearConfig.currentYear()
  );
  const [selectedEntity, setSelectedEntity] = useState("CUST");
  const [loadinga, setLoading] = useState(false);
  const [errora, setError] = useState(null);

  // =================================================================================
  const { data, isLoading, error } = useQuery({
    queryKey: ["incoiceSalesYearGraphApi"],
    queryFn: incoiceSalesYearGraphApiFn,
    staleTime: Infinity,
  });
  useEffect(() => {
    setInvoiceGraphData(data?.data.data[0].MonthlyData || []);

    data?.data.data && setLoading(false);
  }, [data]);
  // =================================================================================

  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;
  const fetchInvoice = async (year, entity) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_URL}/api/monthlyInvoiceData?entity_type=${entity}&bill_code=INVS&bill_year=${year}`,
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
  // =====================================================================================

  const result = Array.isArray(invoiceGraphData)
    ? invoiceGraphData.map((i) => {
        const grandTotalAmountAll = (
          Array.isArray(i?.Entities) ? i.Entities : []
        ).reduce((acc, entity) => {
          return acc + Number(entity?.GrandTotalAmount || 0);
        }, 0);

        const shortMonthName = i?.MonthName ? i.MonthName.substring(0, 3) : "";

        return {
          month: i?.Month || "",
          monthName: shortMonthName,
          grandTotalAmount: grandTotalAmountAll.toFixed(2),
        };
      })
    : [];

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    fetchInvoice(event.target.value, selectedEntity);
  };

  const handleEntityChange = (event) => {
    setSelectedEntity(event.target.value);
    fetchInvoice(selectedYear, event.target.value);
  };

  return (
    <div style={{ minHeight: "28rem" }}>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <BarChartIcon sx={{ color: "#388e3c", fontSize: 30 }} />
          <h2 style={{ color: "#388e3c" }}>Invoice Graph Year Wise</h2>
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
        <BarChart
          data={result}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          padding={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="monthName" />
          <YAxis
            tickFormatter={(value) =>
              value >= 1000000
                ? `${(value / 1000000).toFixed(1)}M`
                : value >= 1000
                  ? `${(value / 1000).toFixed(1)}K`
                  : value
            }
          />
          <Tooltip
            formatter={(value) =>
              new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(value)
            }
            wrapperStyle={{ zIndex: 1000 }}
          />
          <Legend />
          <Bar
            dataKey="grandTotalAmount"
            name="Grand Total Amount"
            fill="#1976d2"
          />
        </BarChart>
      </ResponsiveContainer>
      <LoadingComp loading={loadinga} />
      <ErrorComp error={errora} />
    </div>
  );
}
