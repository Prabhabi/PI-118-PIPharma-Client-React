import {
  Box,
  Stack,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
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
} from "recharts"; // Add recharts imports
import Cookies from "js-cookie"; // Import Cookies

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum, entry) => sum + Number(entry.value), 0);
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#fff",
          padding: "10px",
          border: "1px solid #ccc",
        }}
      >
        <p className="label">{`Month: ${payload[0].payload.MonthName}`}</p>
        <p className="intro">{`CGST: ${payload[0].payload.TotalCGSTAmount || 0}`}</p>
        <p className="intro">{`SGST: ${payload[0].payload.TotalSGSTAmount || 0}`}</p>
        <p className="intro">{`Total: ${total}`}</p>
      </div>
    );
  }
  return null;
};

const monthNameToShort = (monthName) => {
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

export default function GstGraphDetails({ startingYear, endingYear }) {
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

  const years = [];
  for (let year = startingYear; year <= endingYear; year++) {
    years.push(year);
  }

  const steps = years.map((year) => ({
    label: `${year}`,
    description: `Total CGST Amount: ${totalGSTAmount.TotalCGSTAmount}`,
    description2: `Total SGST Amount: ${totalGSTAmount.TotalSGSTAmount}`,
    total:
      Number(totalGSTAmount.TotalCGSTAmount) +
      Number(totalGSTAmount.TotalSGSTAmount),
  }));

  const handleStepClick = (step, label) => {
    setActiveStep(step);
    setActiveLabel(label);
    setYearWiseData([]); // Reset data to empty array
    setTotalGSTAmount({
      TotalCGSTAmount: 0,
      TotalSGSTAmount: 0,
    });
  };
  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

  const fetchYearWiseData = async (year) => {
    const res = await axios.get(
      `${process.env.REACT_APP_URL}/api/getTotalGstByMonthYear?BillCode=INVP&BillYear=${year}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: sanctumToken,
        },
      }
    );
    const data = res.data.map((item) => ({
      ...item,
      MonthName: item.MonthName.substring(0, 3), // Shorten month name to first 3 letters
    }));
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
  }, [activeLabel]);

  return (
    <Box sx={{ minHeight: "400px", mt: 3 }}>
      <Stack direction="row" spacing={2}>
        <Box flex={1}>
          <Stepper
            activeStep={-1}
            orientation="vertical"
            sx={{
              "& .MuiStepLabel-root .Mui-active": {
                color: "blue",
              },
              "& .MuiStepLabel-root .Mui-completed": {
                color: "blue",
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
                <StepContent>
                  <Typography>{step.description}</Typography>
                  <Typography>{step.description2}</Typography>
                  <Typography>Total: {step.total}</Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Box>
        <Box
          flex={3}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          {activeLabel && (
            <BarChart
              width={600}
              height={300}
              data={yearWiseData}
              margin={{
                top: 50,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="MonthName" tickFormatter={monthNameToShort} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="TotalCGSTAmount"
                name="Total CGST Amount"
                fill="#8884d8"
              />
              <Bar
                dataKey="TotalSGSTAmount"
                name="Total SGST Amount"
                fill="#82ca9d"
              />
            </BarChart>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
