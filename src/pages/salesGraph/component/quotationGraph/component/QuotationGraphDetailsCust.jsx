import {
  Box,
  Stack,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Select,
  MenuItem,
} from "@mui/material"; // Update imports
import PersonIcon from "@mui/icons-material/Person"; // Add this import
import { ShowChart as ShowChartIcon } from "@mui/icons-material"; // Add this import
import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie"; // Import Cookies

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts"; // Add recharts imports

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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            marginBottom: "5px",
          }}
        >
          <ShowChartIcon color="primary" fontSize="small" />
          <p style={{ margin: 0, fontWeight: "bold" }}>Monthly Details</p>
        </div>
        <p className="label">{`Month: ${data.MonthName}`}</p>
        <p className="intro">{`Net Total Amount: ${data.NetTotalAmount}`}</p>
      </div>
    );
  }
  return null;
};

export default function QuotationGraphDetailsCust({
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
      `${process.env.REACT_APP_URL}/api/getEntityWiseMonthlyBooking?EntityType=CUST&BillCode=ADVB&BillYear=${year}`,
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
  });

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
        MonthName: monthShortNames[data.MonthName],
        TotalAmountBD: data.TotalAmountBD,
        DiscountAmount: data.DiscountAmount,
        TotalAmountAD: data.TotalAmountAD,
        CGSTAmount: data.CGSTAmount,
        SGSTAmount: data.SGSTAmount,
        TotalGST: data.TotalGST,
        NetTotalAmount: data.NetTotalAmount,
      }));
      setInvoiceCountData(invoiceCounts);
    } else {
      setInvoiceCountData([]);
    }
  };

  return (
    <Box sx={{ height: "400px", mt: 2 }}>
      <Stack direction="row" spacing={2}>
        <Box flex={1}>
          <Stepper activeStep={-1} orientation="vertical">
            {steps.reverse().map((step, index) => (
              <Step
                key={step.label}
                onClick={() => handleStepClick(index, step.label)}
                sx={{
                  cursor: "pointer",
                  "& .MuiStepLabel-root .Mui-active": {
                    color: "blue",
                  },
                  "& .MuiStepLabel-root .Mui-completed": {
                    color: "blue",
                  },
                  "& .MuiStepConnector-root": {
                    "& .MuiStepConnector-line": {
                      borderColor: "blue",
                    },
                  },
                }}
                completed={false}
                active={activeStep === index}
              >
                <StepLabel>
                  {step.label} - {Number(step.label) + 1}
                </StepLabel>
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
            <Stack direction="row" spacing={1} alignItems="center">
              <PersonIcon color="success" />
              <Typography variant="h6">Select Customer</Typography>
            </Stack>
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
              dataKey="NetTotalAmount"
              name="Net Total Amount"
              stroke="#8884d8"
            />
          </LineChart>
        </Box>
      </Stack>
    </Box>
  );
}
