// .import React from "react";
// import { Grid, Card, CardContent, Typography, Box, List, ListItem, ListItemText, CircularProgress } from "@mui/material";
// import { styled } from "@mui/system";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// // Custom Styled Card for consistent design
// const StyledCard = styled(Card)(({ theme }) => ({
//   backgroundColor: "#f2faff",
//   borderRadius: "12px",
//   boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
// }));

// // Line Chart Data and Options
// const purchaseChartData = {
//   labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
//   datasets: [
//     {
//       label: "Monthly Purchases (₹)",
//       data: [1000, 1200, 1500, 1800, 2000, 2400, 2600, 3000, 3500, 4000, 4500, 5000],
//       borderColor: "#4D795B",
//       backgroundColor: "rgba(255, 255, 255, 0.8)",
//       tension: 0.3,
//       fill: true,
//     },
//   ],
// };

// const purchaseChartOptions = {
//   responsive: true,
//   plugins: {
//     legend: { display: true, position: "top" },
//   },
//   scales: {
//     x: { grid: { display: false } },
//     y: { beginAtZero: true },
//   },
// };

// const Hm = () => {
//   return (
//     <Box sx={{ padding: "20px", backgroundColor: "#e8f5e9", minHeight: "100vh" }}>
//       <Typography variant="h4" align="center" gutterBottom sx={{ color: "#4D795B" }}>
//         Dashboard
//       </Typography>

//       <Grid container spacing={3}>
//         {/* Top Overview Panels */}
//         <Grid item xs={3}>
//           <StyledCard>
//             <CardContent>
//               <Typography variant="h6" sx={{ color: "#4D795B" }}>Purchase Overview</Typography>
//               <Box mt={2}>
//                 <Typography>Annual Sales: ₹12,458</Typography>
//                 <Typography>Annual Profit: ₹8,248</Typography>
//                 <Typography>Daily Sales: ₹880</Typography>
//                 <Typography>Daily Profit: ₹1,548</Typography>
//               </Box>
//             </CardContent>
//           </StyledCard>
//         </Grid>

//         <Grid item xs={3}>
//           <StyledCard>
//             <CardContent>
//               <Typography variant="h6" sx={{ color: "#4D795B" }}>Order Overview</Typography>
//               <Box mt={2}>
//                 <Typography>Ordered Items: 45</Typography>
//                 <Typography>Delivered Items: 8</Typography>
//                 <Typography>Today Delivery: 80</Typography>
//                 <Typography>In-week Delivery: 548</Typography>
//               </Box>
//             </CardContent>
//           </StyledCard>
//         </Grid>

//         <Grid item xs={3}>
//           <StyledCard>
//             <CardContent>
//               <Typography variant="h6" sx={{ color: "#4D795B" }}>Stock Alert</Typography>
//               <Box mt={2}>
//                 <List>
//                   <ListItem>
//                     <ListItemText primary="DG-FLT_RG" secondary="16" />
//                   </ListItem>
//                   <ListItem>
//                     <ListItemText primary="DG-SAR-02" secondary="14" />
//                   </ListItem>
//                   <ListItem>
//                     <ListItemText primary="DG-HUM-4401" secondary="25" />
//                   </ListItem>
//                   <ListItem>
//                     <ListItemText primary="DG-DTP-6601" secondary="11" />
//                   </ListItem>
//                   <ListItem>
//                     <ListItemText primary="DG-EMG-07B" secondary="22" />
//                   </ListItem>
//                 </List>
//               </Box>
//             </CardContent>
//           </StyledCard>
//         </Grid>

//         <Grid item xs={3}>
//           <StyledCard>
//             <CardContent>
//               <Typography variant="h6" sx={{ color: "#4D795B" }}>Stock Overview</Typography>
//               <Box mt={2} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
//                 <CircularProgress
//                   variant="determinate"
//                   value={75}
//                   size={80}
//                   thickness={5}
//                   sx={{ color: "#4D795B" }}
//                 />
//                 <Typography variant="h6" sx={{ marginLeft: 2, color: "#4D795B" }}>
//                   15200
//                 </Typography>
//               </Box>
//             </CardContent>
//           </StyledCard>
//         </Grid>

//         {/* Purchase Chart */}
//         <Grid item xs={8}>
//           <StyledCard>
//             <CardContent>
//               <Typography variant="h6" sx={{ color: "#4D795B" }}>Purchase Chart</Typography>
//               <Box mt={2}>
//                 <Line data={purchaseChartData} options={purchaseChartOptions} />
//               </Box>
//             </CardContent>
//           </StyledCard>
//         </Grid>

//         {/* Frequent Purchase */}
//         <Grid item xs={4}>
//           <StyledCard>
//             <CardContent>
//               <Typography variant="h6" sx={{ color: "#4D795B" }}>Frequent Purchase</Typography>
//               <Box mt={2}>
//                 <List>
//                   <ListItem>
//                     <ListItemText primary="DG-FLT_RG" secondary="Coat Hook" />
//                   </ListItem>
//                   <ListItem>
//                     <ListItemText primary="DG-SAR-02" secondary="Towel Ring" />
//                   </ListItem>
//                   <ListItem>
//                     <ListItemText primary="DG-HUM-4401" secondary="HUMMING" />
//                   </ListItem>
//                   <ListItem>
//                     <ListItemText primary="DG-DTP-6601" secondary="D Type" />
//                   </ListItem>
//                   <ListItem>
//                     <ListItemText primary="DG-EMG-07B" secondary="Towel Rail" />
//                   </ListItem>
//                 </List>
//               </Box>
//             </CardContent>
//           </StyledCard>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default Hm;
