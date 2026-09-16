import {
  Box,
  Stack,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material"; // Update imports
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts"; // Add recharts imports
import Cookies from "js-cookie"; // Import Cookies

const monthShortForm = (monthName) => {
  const monthMap = {
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
  return monthMap[monthName] || monthName;
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#fff",
          padding: "10px",
          border: "1px solid #ccc",
        }}
      >
        <p className="label">{`Month: ${monthShortForm(data.MonthName)}`}</p>
        <p className="intro">{`Total Amount Before Discount: ${data.TotalAmountBD}`}</p>
        <p className="intro">{`Discount Amount: ${data.DiscountAmount}`}</p>
        <p className="intro">{`Total Amount After Discount: ${data.TotalAmountAD}`}</p>
        <p className="intro">{`CGST Amount: ${data.CGSTAmount}`}</p>
        <p className="intro">{`SGST Amount: ${data.SGSTAmount}`}</p>
        <p className="intro">{`Total GST: ${data.TotalGST}`}</p>
        <p className="intro">{`Grand Total Amount: ${data.GrandTotalAmount}`}</p>
        <p className="intro">{`Round Off Amount: ${data.RoundOffAmount}`}</p>
        <p className="intro">{`Net Total Amount: ${data.NetTotalAmount}`}</p>
        <p className="intro">{`Net Paid Amount: ${data.NetPaidAmount}`}</p>
        <p className="intro">{`Net Due Amount: ${data.NetDueAmount}`}</p>
      </div>
    );
  }
  return null;
};

export default function QuotationGraphDetailsSubd({
  startingYear,
  endingYear,
}) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const defaultYear = currentMonth < 3 ? currentYear - 1 : currentYear;
  const [activeStep, setActiveStep] = useState(0);
  const [activeLabel, setActiveLabel] = useState(defaultYear);
  const [yearWiseData, setYearWiseData] = useState([]);
  const [totalGSTAmount, setTotalGSTAmount] = useState({
    TotalCGSTAmount: 0,
    TotalSGSTAmount: 0,
  });
  const [selectedName, setSelectedName] = useState("");
  const [names, setNames] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [invoiceCountData, setInvoiceCountData] = useState([]);

  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

  const years = [];
  for (let year = startingYear; year <= endingYear; year++) {
    years.push(year);
  }

  const steps = years.map((year) => ({
    label: `${year}`,
    description: `CGST: ${totalGSTAmount.TotalCGSTAmount}`,
    description2: ` SGST: ${totalGSTAmount.TotalSGSTAmount}`,
    total:
      Number(totalGSTAmount.TotalCGSTAmount) +
      Number(totalGSTAmount.TotalSGSTAmount),
  }));

  const handleStepClick = (step, label) => {
    setActiveStep(step);
    setActiveLabel(label);
  };
  const fetchYearWiseData = async (year) => {
    const res = await axios.get(
      `${process.env.REACT_APP_URL}/api/getEntityWiseMonthlyBooking?EntityType=SUPP&BillCode=QUO&BillYear=${year}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: sanctumToken,
        },
      }
    );
    setYearWiseData(res.data);
    const totalCGST = res.data.reduce(
      (sum, item) => sum + parseFloat(item.TotalCGSTAmount),
      0
    );
    const totalSGST = res.data.reduce(
      (sum, item) => sum + parseFloat(item.TotalSGSTAmount),
      0
    );
    setTotalGSTAmount({
      TotalCGSTAmount: totalCGST,
      TotalSGSTAmount: totalSGST,
      TotalGST: totalCGST + totalSGST,
    });
  };
  useEffect(() => {
    fetchYearWiseData(activeLabel);
    setSelectedName(""); // Reset the selected name when activeLabel changes
  }, [activeLabel]);

  useEffect(() => {
    if (yearWiseData.length > 0) {
      const uniqueNames = [...new Set(yearWiseData.map((data) => data.Name))];
      setNames(uniqueNames);
    }
  }, [yearWiseData]);

  const handleNameChange = (event) => {
    const name = event.target.value;
    setSelectedName(name);
    const selectedData = yearWiseData.find((data) => data.Name === name);
    setMonthlyData(selectedData ? selectedData.MonthlyData : []);
    if (selectedData) {
      const invoiceCounts = selectedData.MonthlyData.map((data) => ({
        MonthName: monthShortForm(data.MonthName),
        GrandTotalAmount: data.GrandTotalAmount,
        TotalAmountBD: data.TotalAmountBD,
        DiscountAmount: data.DiscountAmount,
        TotalAmountAD: data.TotalAmountAD,
        CGSTAmount: data.CGSTAmount,
        SGSTAmount: data.SGSTAmount,
        TotalGST: data.TotalGST,
        RoundOffAmount: data.RoundOffAmount,
        NetTotalAmount: data.NetTotalAmount,
        NetPaidAmount: data.NetPaidAmount,
        NetDueAmount: data.NetDueAmount,
      }));
      setInvoiceCountData(invoiceCounts);
    } else {
      setInvoiceCountData([]);
    }
  };

  return (
    <Box sx={{ minHeight: "400px", mt: 3 }}>
      <Stack direction="row" spacing={2}>
        <Box flex={1}>
          <Stepper
            activeStep={-1}
            orientation="vertical"
            sx={{
              "& .MuiStepIcon-root": {
                color: "#1976d2", // blue for inactive
                "&.Mui-active": { color: "#1976d2" }, // blue for active
                "&.Mui-completed": { color: "#1976d2" }, // blue for completed
              },
              "& .MuiStepLabel-label": {
                color: "#1976d2", // blue for label
                "&.Mui-active": { color: "#1976d2", fontWeight: 600 },
                "&.Mui-completed": { color: "#1976d2" },
              },
            }}
          >
            {steps.reverse().map((step, index) => (
              <Step
                key={step.label}
                onClick={() => handleStepClick(index, step.label)}
                sx={{ cursor: "pointer" }}
                completed={false}
                active={activeStep === index}
              >
                <StepLabel>
                  {step.label} - {Number(step.label) + 1}
                </StepLabel>
                {/* <StepContent>
                  <Typography>{step.description}</Typography>
                  <Typography>{step.description2}</Typography>
                  <Typography>Total: {step.total}</Typography>
                </StepContent> */}
              </Step>
            ))}
          </Stepper>
        </Box>
        <Box
          flex={3}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            mt: 5,
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{
              justifyContent: "center",
              gap: 2,
              alignItems: "center",
              mb: 4,
            }}
          >
            <Typography variant="h6">Select supplier</Typography>
            <Box sx={{ width: "15rem" }}>
              <Select
                value={selectedName}
                onChange={handleNameChange}
                displayEmpty
                fullWidth
              >
                <MenuItem value="" disabled>
                  Select
                </MenuItem>
                {names.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Stack>

          <BarChart
            width={600}
            height={300}
            data={invoiceCountData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="MonthName" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="NetTotalAmount"
              name="Net Total Amount"
              fill="#82ca9d"
            />
          </BarChart>
        </Box>
      </Stack>
    </Box>
  );
}
