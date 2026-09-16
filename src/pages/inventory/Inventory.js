import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  DialogTitle,
  DialogContent,
  IconButton, // <-- Add Button import
} from "@mui/material";
import { Warning, Error, Inventory } from "@mui/icons-material";
import Dialog from "@mui/material/Dialog";
import InventoryAllDialog from "./components/inventoryAlldialog/InventoryAllDialog";
import StockUpdateDialog from "./components/stockUpdate/StockUpdateDialog"; // Add this import
import axios from "axios";
import { isError, set } from "lodash";
import { InventoryTransuctionTabs } from "./components/inventoryTransuction/InventoryTransuctionTabs";
import LoadingComp from "./../../components/loadingComp/LoadingComp";
import ErrorComp from "./../../components/error/ErrorComp";
import Cookies from "js-cookie"; // Import Cookies
import { inventoryListApiFn } from "../../api/purchaseApi";
import { useQuery } from "@tanstack/react-query";
import CloseIcon from "@mui/icons-material/Close";
import InventoryIcon from "@mui/icons-material/Inventory";

import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@emotion/react";

const Inventor = () => {
  const [open, setOpen] = useState(false);
  // const [inventoryList, setInventoryList] = useState([]);
  const [aboutDetails, setAboutDetails] = useState("");
  // const [currentStock, setCurrentStock] = useState("");
  // const [lowStock, setLowStock] = useState("");
  const [transuctionType, setTransuctionType] = useState("all");
  const [transuctionList, setTransuctionList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openStockUpdate, setOpenStockUpdate] = useState(false); // Add state

  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

  // const handleTransuctionChange = (type) => {
  //   setTransuctionType({ type });
  //   fetchtransuction({ type });
  // };

  const handleClose = () => {
    setOpen(false);
  };

  // const fetchGetInvenroty = async () => {
  //   setLoading(true);
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
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const fetchtransuction = async ({ type }) => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const res = await axios.get(
  //       `${process.env.REACT_APP_URL}/api/inventoryTransaction/${type}`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: sanctumToken,
  //         },
  //       }
  //     );
  //     setTransuctionList(res.data);
  //   } catch (error) {
  //     setError("Error fetching transactions");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchtransuction(transuctionType);
  // }, []);

  // =======================================================================
  const { data, isLoading, refetch, isError } = useQuery({
    queryKey: ["inventoryListApi"],
    queryFn: inventoryListApiFn, // Same as in prefetch
    staleTime: Infinity,
    // refetchOnWindowFocus: false,
    // refetchInterval: false,
  });
  const inventoryList = data?.data?.data || [];
  const lowStockItems =
    data?.data?.data?.filter(
      (item) => Number(item?.MinStockLevel) || 25 >= Number(item.Quantity)
    ) || [];
  const lowStock = lowStockItems?.length;
  const totalQuantity = data?.data?.data?.reduce(
    (acc, item) => acc + parseInt(item.Quantity, 10),
    0
  );
  const currentStock = totalQuantity;

  // ===========================================================================
  // Handler for Add Stock button
  const handleAddStock = () => {
    setOpenStockUpdate(true); // Open the StockUpdate dialog
  };
  const theme = useTheme();
  return (
    <Box
      sx={{
        padding: 2,
        bgcolor: theme.palette.background.main,
        minHeight: "100vh",
        pt: 3,
      }}
    >
      {/* Header Summary */}
      <Grid container spacing={2} alignItems="center" justifyContent={"center"}>
        <Grid item xs>
          <Grid container spacing={2} justifyContent="center">
            {[
              {
                title: "Current Stock",
                value: `${currentStock} Items` || 0,
                color: "#cce7f6",
                icon: <Inventory color="primary" />,
              },
              {
                title: "Stock Alerts",
                value: `${lowStock} Items` || 0,
                color: "#f8d7da",
                icon: <Error color="error" />,
              },
            ].map((item, index) => (
              <>
                <Grid item key={index} xs={12} sm={4} md={2}>
                  <Paper
                    sx={{
                      padding: 2,
                      textAlign: "center",
                      backgroundColor: item.color,
                      borderRadius: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setOpen(true);
                      setAboutDetails(item.title);
                    }}
                    elevation={3}
                  >
                    {item.icon}
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography variant="body1">{item.value}</Typography>
                  </Paper>
                </Grid>
              </>
            ))}
            <Grid item>
              <Paper
                onClick={handleAddStock}
                sx={{
                  padding: 2,
                  textAlign: "center",
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                  minWidth: "12rem",
                  minHeight: 97, // Ensure minimum height for consistency
                  justifyContent: "center",
                  boxShadow: 3,
                  background: "#e0f2f1",
                  transition: "box-shadow 0.2s, background 0.2s",
                  "&:hover": {
                    boxShadow: 6,
                    background: "#b2dfdb",
                  },
                }}
                elevation={3}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "blue",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AddIcon sx={{ color: "#fff", fontSize: 28 }} />
                </Box>
                <Typography
                  variant="h6"
                  sx={{ color: "#1b5e20", fontWeight: 600 }}
                >
                  Add stocks
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        {/* Inventory Overview */}
        <Grid item xs={12} sm={5}>
          <Paper
            sx={{
              padding: 2,
              height: "500px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Inventory color="primary" /> Inventory Overview
            </Typography>
            <Divider />
            <Box sx={{ overflowY: "auto", flexGrow: 1 }}>
              <List>
                {inventoryList
                  .filter(
                    (item) =>
                      Number(item.MinStockLevel) || 25 >= Number(item.Quantity)
                  )
                  .map((item, index) => (
                    <ListItem key={index}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#1b5e20",
                          backgroundColor: "#e8f5e9",
                          padding: "0.15rem",
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: "1rem",
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                          border: "1px solid #1b5e20",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                        }}
                      >
                        {index + 1}
                      </Typography>
                      <Warning color="error" />
                      <ListItemText
                        primary={`${item.ModelNumber} - Low Stock (${item.Quantity} items)`}
                        sx={{ marginLeft: 1 }}
                      />
                    </ListItem>
                  ))}
              </List>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={7} sx={{ minHeight: "500px" }}>
          <InventoryTransuctionTabs
            // handleTransuctionChange={handleTransuctionChange}
            transuctionList={transuctionList}
          />
        </Grid>
      </Grid>

      {/* Export Buttons */}

      {/* Stock Update Dialog */}
      <Dialog
        open={openStockUpdate}
        onClose={() => setOpenStockUpdate(false)}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle
          sx={{
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: ".5rem",
            padding: "16px",
          }}
        >
          <InventoryIcon sx={{ color: "white" }} />
          Add Stock
          <IconButton
            onClick={() => setOpenStockUpdate(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "white",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <StockUpdateDialog
            // Pass any required props here, e.g. supplierList, allItems, etc.
            handleAddCustomerClose={() => setOpenStockUpdate(false)}
            transuctionUpdate={refetch}
            addStockDialogClose={() => setOpenStockUpdate(false)}
            // ...other props as needed...
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="lg"
      >
        {/* Dialog content goes here */}
        <InventoryAllDialog
          open={open}
          handleClose={handleClose}
          inventoryList={inventoryList}
          aboutDetails={aboutDetails}
        />
      </Dialog>
      <LoadingComp loading={isLoading} />
      <ErrorComp error={isError} />
    </Box>
  );
};

export default Inventor;
