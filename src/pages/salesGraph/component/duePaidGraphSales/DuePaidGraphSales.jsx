import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Stack, Box } from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import { dueGraphApiFn } from "../../../../api/purchaseApi";
import { useQuery } from "@tanstack/react-query";

export default function DuePaidGraphSales() {
  // const [invoiceGraphData, setInvoiceGraphData] = useState([]);
  const [startingYear, setStartingYear] = useState(null);
  const [endingYear, setEndingYear] = useState(null);
  const [advbGraphDataCust, setAdvbGraphDataCust] = useState([]);

  // const fetchInvoice = async () => {
  //   try {
  //     const token = Cookies.get("token");
  //     const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

  //     const res = await axios.get(
  //       `${process.env.REACT_APP_URL}/api/getReceiptPayment?BillCode=INVS`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: sanctumToken,
  //         },
  //       }
  //     );
  //     setInvoiceGraphData(res.data);
  //     setStartingYear(res.data?.[0]?.StartingYear);
  //     setEndingYear(res.data?.[0]?.CurrentYear);
  //     setAdvbGraphDataCust(res.data);
  //   } catch (error) {
  //   }
  // };

  // useEffect(() => {
  //   fetchInvoice();
  // }, []);
  const { data, isLoading, error } = useQuery({
    queryKey: ["dueGraphApi"],
    queryFn: dueGraphApiFn,
  });
  const invoiceGraphData = data?.data || [];

  const dataa = invoiceGraphData?.map((item) => {
    const payment = item?.PaymentDetails ? JSON.parse(item.PaymentDetails) : [];
    const totalPaid = payment.reduce((acc, p) => acc + p.Amount, 0);
    return {
      customerName: item?.Name,
      invoiceNumber: item?.ReceiptNumber,
      grandTotalAmount: item?.GrandTotalAmount,
      due: item?.PDueDueAmount,
      paid: totalPaid,
    };
  });

  const totals = dataa?.reduce(
    (acc, curr) => ({
      totalGrandAmount: acc.totalGrandAmount + Number(curr.grandTotalAmount),
      totalDue: acc.totalDue + Number(curr.due),
      totalPaid: acc.totalPaid + Number(curr.paid),
    }),
    {
      totalGrandAmount: 0,
      totalDue: 0,
      totalPaid: 0,
    }
  );

  const pieChartData = [
    { name: "Due Amount", value: totals?.totalDue || 0 },
    { name: "Paid Amount", value: totals?.totalPaid || 0 },
  ];

  // Change COLORS to blue shades
  const COLORS = ["#1976d2", "#64b5f6"];

  return (
    <div style={{ minHeight: "28rem" }}>
      <Box>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <BarChartIcon sx={{ color: "#388e3c", fontSize: 28 }} />
            <h2 style={{ color: "#388e3c", margin: 0 }}>
              Invoice Due and Payment Status
            </h2>
          </Stack>
        </Stack>
      </Box>
      <div
        style={{
          width: "100%",
          height: "400px",
          position: "relative",
        }}
      >
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent, cx, cy, x, y }) => {
                const label = `${name}: ${(percent * 100).toFixed(1)}%`;
                return (
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="12px"
                  >
                    {label}
                  </text>
                );
              }}
              style={{ zIndex: 10 }}
              outerRadius="80%"
              innerRadius="0%"
              fill="#8884d8"
              dataKey="value"
            >
              {pieChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `₹${value.toLocaleString()}`}
              contentStyle={{
                background: "rgba(255, 255, 255, 1)",
                borderRadius: "4px",
                padding: "8px",
                zIndex: 1000,
              }}
              labelStyle={{
                color: "#666",
                fontWeight: "bold",
                marginBottom: "4px",
              }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            pointerEvents: "none",
            zIndex: 1,
            color: "#000 ",
          }}
        >
          <div>Grand Total₹{totals?.totalGrandAmount.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
