import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Typography, Dialog, Box, Stack, Alert } from "@mui/material";
import { Inventory, Error, Close } from "@mui/icons-material";
import InventoryAllDialog from "../../../inventory/components/inventoryAlldialog/InventoryAllDialog";
import { useQuery } from "@tanstack/react-query";
import { inventoryGraphApiFn } from "../../../../api/purchaseApi";

export default function InventoryGraph() {
  const [open, setOpen] = useState(false);
  const [aboutDetails, setAboutDetails] = useState("");
  // const [error, setError] = useState(null);
  // const [inventoryList, setInventoryList] = useState([]);
  // const [currentStock, setCurrentStock] = useState(0);
  // const [lowStock, setLowStock] = useState(0);

  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

  // const fetchGetInventory = async () => {
  //   setError(null);
  //   try {
  //     const res = await axios.get(
  //       `${process.env.REACT_APP_URL}/api/inventory`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: sanctumToken,
  //         },
  //       }
  //     );

  //     setInventoryList(res.data.data);
  //     const lowStockItems = res.data.data.filter(
  //       (item) => Number(item.MinStockLevel) || 25 >= Number(item.Quantity)
  //     );
  //     setLowStock(lowStockItems.length);
  //     const totalQuantity = res.data.data?.reduce(
  //       (acc, item) => acc + parseInt(item.Quantity, 10),
  //       0
  //     );
  //     setCurrentStock(totalQuantity);
  //   } catch (error) {
  //     setError("Error fetching inventory");
  //   }
  // };

  // useEffect(() => {
  //   fetchGetInventory();
  // }, []);
  const { data, isLoading, error } = useQuery({
    queryKey: ["inventoryGraphApi"],
    queryFn: inventoryGraphApiFn,
  });

  const inventoryList = data?.data.data || [];
  const lowStockItems = inventoryList.filter(
    (item) => Number(item.Quantity) <= (Number(item.MinStockLevel) || 25)
  );

  const lowStock = lowStockItems.length;
  // const totalQuantity =
  //   data?.reduce((acc, item) => acc + parseInt(item.Quantity, 10), 0) || 0;
  // const currentStock = totalQuantity;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "linear-gradient(45deg, #d32f2f 30%, #ef5350 80%)",
            padding: "1rem",
            cursor: "pointer",
            minWidth: "15rem",
            borderRadius: "20px",
            position: "relative",
          }}
          onClick={() => {
            setOpen(true);
            setAboutDetails({
              title: "Stock Alerts",
              value: `${lowStock} Items`,
              details: {
                total: lowStock,
                categories: {
                  critical: Math.floor(lowStock / 2),
                  warning: Math.ceil(lowStock / 2),
                },
              },
            });
          }}
        >
          <Error
            sx={{
              position: "absolute",
              right: "-20px",
              bottom: "-20px",
              fontSize: "160px",
              opacity: "0.2",
              color: "#ffffff",
              transform: "rotate(-10deg)",
            }}
          />
          <Stack
            direction="row"
            spacing={2}
            sx={{
              mb: 2,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h3" sx={{ color: "#fff" }}>
              {lowStock}
            </Typography>
            <Stack direction="column" alignItems="flex-end">
              <Typography variant="h6" sx={{ color: "#fff" }}>
                Stock Alerts
              </Typography>
            </Stack>
          </Stack>

          <Typography variant="body1" sx={{ color: "#fff" }}>
            Total Items: {lowStock}
          </Typography>
        </Box>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="lg"
      >
        <InventoryAllDialog
          open={open}
          handleClose={handleClose}
          inventoryList={inventoryList}
          aboutDetails="Stock Alerts"
        />
      </Dialog>
    </>
  );
}
