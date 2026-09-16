import React from "react";
import { Box, Grid, Typography, Card, CardContent } from "@mui/material";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

const Purches = () => {
  // Dummy data for the line chart
  const lineChartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Revenue",
        data: [10, 20, 15, 25, 35, 50, 40, 30, 20, 10, 15, 25],
        borderColor: "#4D795B",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        tension: 0.4,
      },
      {
        label: "Transactions",
        data: [15, 10, 20, 30, 40, 60, 50, 40, 30, 20, 25, 35],
        borderColor: "#4D795B",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        tension: 0.4,
      },
    ],
  };

  // Dummy data for the bar chart
  const barChartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Purchases",
        data: [50, 100, 75, 125, 150, 200, 175, 125, 100, 75, 50, 125],
        backgroundColor: [
          "#4D795B",
          "#6B8F71",
          "#8AA688",
          "#A9BD9E",
          "#C8D4B5",
          "#E7EBCC",
          "#4D795B",
          "#6B8F71",
          "#8AA688",
          "#A9BD9E",
          "#C8D4B5",
          "#E7EBCC",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box
      sx={{ backgroundColor: "#e8f5e9", minHeight: "100vh", padding: "20px" }}
    >
      <Typography variant="h5" sx={{ fontWeight: "bold", color: "#4D795B" }}>
        Purchase Overview
      </Typography>
      <Typography variant="subtitle1" sx={{ color: "#555" }}>
        Latest sales overview all the time
      </Typography>

      <Grid container spacing={2} sx={{ marginTop: "20px" }}>
        {/* Info Cards */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              backgroundColor: "#fff",
              borderRadius: "10px",
              color: "#4D795B",
            }}
          >
            <CardContent>
              <Typography variant="h6">Total Balance</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                ₹938,003,200
              </Typography>
              <Typography variant="subtitle2" sx={{ color: "green" }}>
                +12.84% <br /> ₹6,259.00 last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              backgroundColor: "#fff",
              borderRadius: "10px",
              color: "#4D795B",
            }}
          >
            <CardContent>
              <Typography variant="h6">Total Income</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                ₹120,993,000
              </Typography>
              <Typography variant="subtitle2" sx={{ color: "green" }}>
                +11.49% <br /> ₹5,953.00 last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              backgroundColor: "#fff",
              borderRadius: "10px",
              color: "#4D795B",
            }}
          >
            <CardContent>
              <Typography variant="h6">Total Expend</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                ₹496,085,100
              </Typography>
              <Typography variant="subtitle2" sx={{ color: "red" }}>
                -20.57% <br /> ₹4,234.00 last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Side by Side */}
      <Grid container spacing={2} sx={{ marginTop: "30px" }}>
        {/* Line Chart */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              padding: "20px",
              backgroundColor: "#fff",
              borderRadius: "10px",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                marginBottom: "10px",
                fontWeight: "bold",
                color: "#4D795B",
              }}
            >
              Revenue and Transactions
            </Typography>
            <Line data={lineChartData} options={{ responsive: true }} />
          </Card>
        </Grid>

        {/* Bar Chart */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              padding: "20px",
              backgroundColor: "#fff",
              borderRadius: "10px",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                marginBottom: "10px",
                fontWeight: "bold",
                color: "#4D795B",
              }}
            >
              Monthly Purchases
            </Typography>
            <Bar data={barChartData} options={{ responsive: true }} />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Purches;
