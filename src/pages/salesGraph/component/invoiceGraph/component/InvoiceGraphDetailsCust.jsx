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
import Cookies from "js-cookie"; // Import Cookies

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
import InvoiceDetailsDialog from "../../../../sales/invoice/components/InvoiceDetailsDialog";

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
        <p className="label">{`Month: ${data.MonthName}`}</p>
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

export default function InvoiceGraphDetailsCust({ startingYear, endingYear }) {
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
  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;
  const fetchYearWiseData = async (year) => {
    const res = await axios.get(
      `${process.env.REACT_APP_URL}/api/getMonthlyEntities?EntityType=CUST&BillCode=INVS&BillYear=${year}`,
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

  const handleNameChange = (event) => {
    const name = event.target.value;
    setSelectedName(name);
    const selectedData = yearWiseData.find((data) => data.Name === name);
    setMonthlyData(selectedData ? selectedData.MonthlyData : []);
    if (selectedData) {
      const invoiceCounts = selectedData.MonthlyData.map((data) => ({
        MonthName: monthShortNames[data.MonthName],
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
    <Box sx={{ minHeight: "400px", mt: 2 }}>
      <Stack direction="row" spacing={2}>
        <Box flex={1}>
          <Stepper activeStep={-1} orientation="vertical">
            {steps.reverse().map((step, index) => (
              <Step
                key={step.label}
                onClick={() => handleStepClick(index, step.label)}
                sx={{
                  cursor: "pointer",
                  "& .MuiStepIcon-root": {
                    color: "#1976d2", // blue
                    "&.Mui-active": {
                      color: "#1565c0", // darker blue
                    },
                  },
                }}
                completed={false}
                active={activeStep === index}
              >
                <StepLabel
                  sx={{
                    "& .MuiStepLabel-label": {
                      color: activeStep === index ? "#1565c0" : "inherit", // blue for active
                    },
                  }}
                >
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
          <LineChart
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
            <Line
              type="monotone"
              dataKey="GrandTotalAmount"
              name="Grand Total Amount"
              stroke="#8884d8"
            />
          </LineChart>
        </Box>
      </Stack>
    </Box>
  );
}
