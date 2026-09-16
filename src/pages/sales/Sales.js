import React from "react";
import { Box, Grid, Typography, Card, CardContent, CircularProgress } from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const Sales = () => {
  // Dummy data for the line chart
  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Revenue",
        data: [15, 25, 20, 35, 45, 55, 50, 40, 30, 20, 25, 35],
        borderColor: "#4D795B",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        tension: 0.4,
      },
      {
        label: "Transactions",
        data: [10, 15, 25, 30, 40, 50, 60, 45, 35, 25, 20, 30],
        borderColor: "#4D795B",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        tension: 0.4,
      },
    ],
  };

  return (
    <Box sx={{ backgroundColor: "#e8f5e9", minHeight: "100vh", padding: "20px" }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", color: "#4D795B" }}>
        Sales Overview
      </Typography>
      <Typography variant="subtitle1" sx={{ color: "#555" }}>
        Latest sales overview all the time
      </Typography>

      <Grid container spacing={2} sx={{ marginTop: "20px" }}>
        {/* Info Cards */}
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: "#fff", borderRadius: "10px", color: "#4D795B" }}>
            <CardContent>
              <Typography variant="h6">Total Revenue</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                ₹938,003,200
              </Typography>
              <Typography variant="subtitle2" sx={{ color: "green" }}>
                +15.20% <br /> ₹7,259.00 last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: "#fff", borderRadius: "10px", color: "#4D795B" }}>
            <CardContent>
              <Typography variant="h6">Total Sales</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                ₹120,993,000
              </Typography>
              <Typography variant="subtitle2" sx={{ color: "green" }}>
                +10.49% <br /> ₹6,453.00 last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: "#fff", borderRadius: "10px", color: "#4D795B" }}>
            <CardContent>
              <Typography variant="h6">Total Transactions</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                ₹496,085,100
              </Typography>
              <Typography variant="subtitle2" sx={{ color: "red" }}>
                -12.57% <br /> ₹5,634.00 last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts and Other Content */}
      <Grid container spacing={2} sx={{ marginTop: "30px" }}>
        {/* Line Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ padding: "20px", backgroundColor: "#fff", borderRadius: "10px" }}>
            <Typography variant="h6" sx={{ marginBottom: "10px", fontWeight: "bold", color: "#4D795B" }}>
              Revenue and Transactions
            </Typography>
            <Line data={lineChartData} options={{ responsive: true }} />
          </Card>
        </Grid>

        {/* Upcoming Schedule */}
        <Grid item xs={12} md={3}>
          <Card sx={{ padding: "20px", backgroundColor: "#fff", borderRadius: "10px" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#4D795B" }}>
              Upcoming Schedule
            </Typography>
            <Typography variant="body1" sx={{ marginTop: "10px", color: "#555" }}>
              <strong>Business Analytics Press</strong>
            </Typography>
            <Typography variant="body2" sx={{ color: "#555" }}>
              Thu, 24 Aug
            </Typography>
            <Typography variant="h5" sx={{ color: "#4D795B", fontWeight: "bold" }}>
              9:30 AM
            </Typography>
          </Card>
        </Grid>

        {/* Mail Activity */}
        <Grid item xs={12} md={3}>
          <Card sx={{ padding: "20px", backgroundColor: "#fff", borderRadius: "10px", textAlign: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#4D795B", marginBottom: "10px" }}>
              Email Activity
            </Typography>
            <CircularProgress
              variant="determinate"
              value={75}
              size={120}
              sx={{ color: "#4D795B", margin: "10px auto" }}
            />
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#4D795B" }}>
              10,980
            </Typography>
            <Typography variant="body2" sx={{ color: "#555" }}>
              Emails Sent
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Sales;
