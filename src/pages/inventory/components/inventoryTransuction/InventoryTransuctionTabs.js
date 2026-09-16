import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import TransuctionGraphSales from "./component/TransuctionGraphSales";
import TransuctionGraphAll from "./component/TransuctionGraphAll";
import TransuctionGraphPurchase from "./component/TransuctionGraphPurchase";
import axios from "axios";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Warning from "@mui/icons-material/Warning";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Inventory from "@mui/icons-material/Inventory";
import { Grid } from "@mui/material";
import Cookies from "js-cookie"; // Import Cookies
import IconButton from "@mui/material/IconButton";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import {
  allTransuctionListApiFn,
  purchaseTransuctionListApiFn,
  PurchaseReturTransuctionListApiFn,
  SaleReturnTransuctionListApiFn,
  saleTransuctionListApiFn,
  supplierListApiFn,
} from "./../../../../api/purchaseApi";
import { useQueries } from "@tanstack/react-query";
import { formatDate } from "../../../../functionforAll";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export function InventoryTransuctionTabs({
  handleTransuctionChange,
  transuctionList,
}) {
  const [value, setValue] = React.useState(0);
  // const [inventoryAll, setInventoryAll] = React.useState([]); // Fix initialization to an empty array
  // const [inventoryPurchase, setInventoryPurchase] = React.useState([]); // Fix initialization to an empty array
  // const [inventorySales, setInventorySales] = React.useState([]); // Fix initialization to an empty array
  // const [inventoryPDamage, setInventoryPDamage] = React.useState([]);
  // const [inventorySDamage, setInventorySDamage] = React.useState([]);
  const [inventoryPReturn, setInventoryPReturn] = React.useState([]);
  const [inventorySReturn, setInventorySReturn] = React.useState([]);
  // const [purchaseReturn, setPurchaseReturn] = React.useState([]);
  // const [saleReturn, setSaleReturn] = React.useState([]);
  // const [loading, setLoading] = React.useState(false);

  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

  // =======================================================================
  // const fetchAllInventoryTransuction = async (type) => {
  //   try {
  //     // Add query parameter 'param' to specify transaction type
  //     const url = `${process.env.REACT_APP_URL}/api/inventoryTransaction/${type}`;
  //     const res = await axios.get(url, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: sanctumToken,
  //       },
  //     });

  //     switch (type) {
  //       case "all":
  //         setInventoryAll(res.data);
  //         break;
  //       case "purchase":
  //         setInventoryPurchase(res.data);
  //         break;
  //       case "sale":
  //         setInventorySales(res.data);
  //         break;
  //       case "PurchaseReturn":
  //         setPurchaseReturn(res.data);
  //         break;
  //       case "SaleReturn":
  //         setSaleReturn(res.data);
  //         break;
  //     }
  //   } catch (error) {}
  // };

  // React.useEffect(() => {
  //   const types = ["all", "purchase", "sale", "PurchaseReturn", "SaleReturn"];

  //   // Fetch data for each type sequentially
  //   types.forEach((type) => fetchAllInventoryTransuction(type));
  // }, []);

  // ======================================================================================
  const results = useQueries({
    queries: [
      {
        queryKey: ["allTransuctionListApi"],
        queryFn: allTransuctionListApiFn,
        staleTime: Infinity,
      },
      {
        queryKey: ["purchaseTransuctionListApi"],
        queryFn: purchaseTransuctionListApiFn,
        staleTime: Infinity,
      },
      {
        queryKey: ["saleTransuctionListApi"],
        queryFn: saleTransuctionListApiFn,
        staleTime: Infinity,
      },
      {
        queryKey: ["PurchaseReturTransuctionListApi"],
        queryFn: PurchaseReturTransuctionListApiFn,
        staleTime: Infinity,
      },
      {
        queryKey: ["SaleReturnTransuctionListApi"],
        queryFn: SaleReturnTransuctionListApiFn,
        staleTime: Infinity,
      },

      ,
    ],
  });

  const [
    allTransuctionQuery,
    purchaseTransuctionQuery,
    saleTransuctionQuery,
    purchaseReturnTransuctionQuery,
    saleReturnTransuctionQuery,
  ] = results;

  const isError =
    allTransuctionQuery.isError ||
    purchaseTransuctionQuery.isError ||
    saleTransuctionQuery.isError ||
    purchaseReturnTransuctionQuery.isError ||
    saleReturnTransuctionQuery.isError;

  const inventoryAll = allTransuctionQuery?.data?.data || [];
  const inventoryPurchase = purchaseTransuctionQuery?.data?.data || [];
  const inventorySales = saleTransuctionQuery?.data?.data || [];
  const purchaseReturn = purchaseReturnTransuctionQuery?.data?.data || [];
  const saleReturn = saleReturnTransuctionQuery?.data?.data || [];

  // ======================================================================================

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", minHeight: "500px" }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          backgroundColor: "white",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          ScrollButtonComponent={({ direction, onClick }) => (
            <IconButton
              onClick={onClick}
              sx={{
                color: "#1b5e20",
                bgcolor: "white",
                "&:hover": { bgcolor: "#e8f5e9" },
                position: "absolute",
                [direction === "left" ? "left" : "right"]: 0,
                zIndex: 2,
                height: "100%",
              }}
            >
              {direction === "left" ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </IconButton>
          )}
          TabIndicatorProps={{ style: { backgroundColor: "#1b5e20" } }}
          sx={{
            "& .Mui-selected": { color: "#1b5e20" },
            position: "relative",
            "& .MuiTabs-scrollButtons": {
              "&.Mui-disabled": { opacity: 0.3 },
            },
            // Add padding to the scroller to prevent tab overlap with buttons
            "& .MuiTabs-scroller": {
              ml: 4, // Add left margin/padding
              mr: 4, // Add right margin/padding
            },
          }}
        >
          <Tab
            label="All"
            // onClick={() => handleTransuctionChange("all")}
            {...a11yProps(0)}
            sx={{ color: "#1b5e20" }} // Change tab color
          />
          <Tab
            label="Purchase"
            // onClick={() => handleTransuctionChange("purchase")}
            {...a11yProps(1)}
            sx={{ color: "#1b5e20" }} // Change tab color
          />
          <Tab
            label="Sales"
            // onClick={() => handleTransuctionChange("sale")}
            {...a11yProps(3)}
            sx={{ color: "#1b5e20" }} // Change tab color
          />
          {/* <Tab
            label="P Damage"
            // onClick={() => handleTransuctionChange("PurchaseReturnDamage")}
            {...a11yProps(4)}
            sx={{ color: "#1b5e20" }} // Change tab color
          /> */}
          {/* <Tab
            label="S Damage"
            // onClick={() => handleTransuctionChange("SaleReturnDamage")}
            {...a11yProps(5)}
            sx={{ color: "#1b5e20" }} // Change tab color
          /> */}
          <Tab
            label="P Return"
            // onClick={() => handleTransuctionChange("PurchaseReturn")}
            {...a11yProps(6)}
            sx={{ color: "#1b5e20" }} // Change tab color
          />
          <Tab
            label="S Return"
            // onClick={() => handleTransuctionChange("SaleReturn")}
            {...a11yProps(7)}
            sx={{ color: "#1b5e20" }} // Change tab color
          />
        </Tabs>
      </Box>
      {/* <CustomTabPanel value={value} index={0} sx={{ background: "green" }}> */}
      {/* <TransuctionGraphAll transuctionList={transuctionList} /> */}

      <Paper
        sx={{
          padding: 2,
          height: "calc(500px - 48px)", // 48px is the height of the Tabs
          display: "flex",
          flexDirection: "column",
        }}
      >
        {value == 0 && (
          <List sx={{ overflowY: "scroll", height: "100%" }}>
            {inventoryAll?.map((item, index) => (
              <ListItem
                key={index}
                sx={{
                  py: 2,
                  borderBottom: "1px solid #e0e0e0",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "#1b5e20",
                    backgroundColor: "#e8f5e9",
                    padding: "0.25rem",
                    width: "15px",
                    height: "15px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "1rem",
                    fontSize: "0.875rem",
                    fontWeight: "bold",
                    border: "1px solid #1b5e20",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  }}
                >
                  {index + 1}
                </Typography>
                {item.TransactionType === "Sale" ? (
                  <Warning color="error" sx={{ fontSize: 30 }} />
                ) : (
                  <CheckCircle color="success" sx={{ fontSize: 30 }} />
                )}
                <ListItemText
                  primary={`${item.ModelNumber}   - ${item?.BatchNo} - ${item.TransactionType} (${item.Quantity} items)`}
                  secondary={`Date: ${new Date(item.EntryTimeStamp).toLocaleDateString()}`}
                  sx={{
                    marginLeft: 2,
                    "& .MuiTypography-primary": {
                      fontSize: "1.1rem",
                      fontWeight: 500,
                    },
                    "& .MuiTypography-secondary": {
                      fontSize: "0.9rem",
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        )}
        {value == 1 && (
          <List sx={{ overflowY: "scroll", height: "100%" }}>
            {inventoryPurchase.map((item, index) => (
              <ListItem key={index}>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#1b5e20",
                    backgroundColor: "#e8f5e9",
                    padding: "0.25rem",
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "1rem",
                    fontSize: "0.875rem",
                    fontWeight: "bold",
                    border: "1px solid #1b5e20",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  }}
                >
                  {index + 1}
                </Typography>
                {item.TransactionType === "Sale" ? (
                  <Warning color="error" sx={{ fontSize: 30 }} />
                ) : (
                  <CheckCircle color="success" sx={{ fontSize: 30 }} />
                )}
                <ListItemText
                  primary={`${item.ModelNumber} - ${item?.BatchNo} - ${item.TransactionType} (${item.Quantity} items)`}
                  secondary={`Date: ${new Date(item.EntryTimeStamp).toLocaleDateString()}`}
                  sx={{
                    marginLeft: 2,
                    "& .MuiTypography-primary": {
                      fontSize: "1.1rem",
                      fontWeight: 500,
                    },
                    "& .MuiTypography-secondary": {
                      fontSize: "0.9rem",
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        )}
        {value == 2 && (
          <List sx={{ overflowY: "scroll", height: "100%" }}>
            {inventorySales.map((item, index) => (
              <ListItem key={index}>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#1b5e20",
                    backgroundColor: "#e8f5e9",
                    padding: "0.25rem",
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "1rem",
                    fontSize: "0.875rem",
                    fontWeight: "bold",
                    border: "1px solid #1b5e20",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  }}
                >
                  {index + 1}
                </Typography>
                {item.TransactionType === "Sale" ? (
                  <Warning color="error" sx={{ fontSize: 30 }} />
                ) : (
                  <CheckCircle color="success" sx={{ fontSize: 30 }} />
                )}
                <ListItemText
                  primary={`${item.ModelNumber} - ${item?.BatchNo} - ${item.TransactionType} (${item.Quantity} items)`}
                  secondary={`Date: ${new Date(item.EntryTimeStamp).toLocaleDateString()}`}
                  sx={{
                    marginLeft: 2,
                    "& .MuiTypography-primary": {
                      fontSize: "1.1rem",
                      fontWeight: 500,
                    },
                    "& .MuiTypography-secondary": {
                      fontSize: "0.9rem",
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        )}
        {value == 3 && (
          <List sx={{ overflowY: "scroll", height: "100%" }}>
            {purchaseReturn
              .filter((item) => item.ProductModelStatus === "D")
              .map((item, index) => (
                <ListItem key={index}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#1b5e20",
                      backgroundColor: "#e8f5e9",
                      padding: "0.25rem",
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "1rem",
                      fontSize: "0.875rem",
                      fontWeight: "bold",
                      border: "1px solid #1b5e20",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    }}
                  >
                    {index + 1}
                  </Typography>
                  {/* {item.TransactionType === "Sale" ? (
                  <Warning color="error" sx={{ fontSize: 30 }} />
                ) : (
                  <CheckCircle color="success" sx={{ fontSize: 30 }} />
                ) */}
                  <ListItemText
                    primary={`${item.ModelNumber}  - ${item?.BatchNo} - ${item.TransactionType} (${item.Quantity} items)`}
                    secondary={`Date: ${new Date(item.EntryTimeStamp).toLocaleDateString()}`}
                    sx={{
                      marginLeft: 2,
                      "& .MuiTypography-primary": {
                        fontSize: "1.1rem",
                        fontWeight: 500,
                      },
                      "& .MuiTypography-secondary": {
                        fontSize: "0.9rem",
                      },
                    }}
                  />
                </ListItem>
              ))}
          </List>
        )}
        {value == 4 && (
          <List sx={{ overflowY: "scroll", height: "100%" }}>
            {saleReturn
              .filter((item) => item.ProductModelStatus === "D")
              .map((item, index) => (
                <ListItem key={index}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#1b5e20",
                      backgroundColor: "#e8f5e9",
                      padding: "0.25rem",
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "1rem",
                      fontSize: "0.875rem",
                      fontWeight: "bold",
                      border: "1px solid #1b5e20",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    }}
                  >
                    {index + 1}
                  </Typography>
                  {/* {item.TransactionType === "Sale" ? (
                  <Warning color="error" sx={{ fontSize: 30 }} />
                ) : (
                  <CheckCircle color="success" sx={{ fontSize: 30 }} />
                ) */}
                  <ListItemText
                    primary={`${item.ModelNumber}  - ${item?.BatchNo} - ${item.TransactionType} (${item.Quantity} items)`}
                    secondary={`Date: ${new Date(item.EntryTimeStamp).toLocaleDateString()}`}
                    sx={{
                      marginLeft: 2,
                      "& .MuiTypography-primary": {
                        fontSize: "1.1rem",
                        fontWeight: 500,
                      },
                      "& .MuiTypography-secondary": {
                        fontSize: "0.9rem",
                      },
                    }}
                  />
                </ListItem>
              ))}
          </List>
        )}
        {value == 5 && (
          <List sx={{ overflowY: "scroll", height: "100%" }}>
            {purchaseReturn
              .filter((item) => item.ProductModelStatus === "R")
              .map((item, index) => (
                <ListItem key={index}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#1b5e20",
                      backgroundColor: "#e8f5e9",
                      padding: "0.25rem",
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "1rem",
                      fontSize: "0.875rem",
                      fontWeight: "bold",
                      border: "1px solid #1b5e20",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    }}
                  >
                    {index + 1}
                  </Typography>
                  {/* {item.TransactionType === "Sale" ? (
                  <Warning color="error" sx={{ fontSize: 30 }} />
                ) : (
                  <CheckCircle color="success" sx={{ fontSize: 30 }} />
                ) */}
                  <ListItemText
                    primary={`${item.ModelNumber}  - ${item?.BatchNo} - ${item.TransactionType} (${item.Quantity} items)`}
                    secondary={`Date: ${new Date(item.EntryTimeStamp).toLocaleDateString()}`}
                    sx={{
                      marginLeft: 2,
                      "& .MuiTypography-primary": {
                        fontSize: "1.1rem",
                        fontWeight: 500,
                      },
                      "& .MuiTypography-secondary": {
                        fontSize: "0.9rem",
                      },
                    }}
                  />
                </ListItem>
              ))}
          </List>
        )}
        {value == 6 && (
          <List sx={{ overflowY: "scroll", height: "100%" }}>
            {saleReturn
              .filter((item) => item.ProductModelStatus === "R")
              .map((item, index) => (
                <ListItem key={index}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#1b5e20",
                      backgroundColor: "#e8f5e9",
                      padding: "0.25rem",
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "1rem",
                      fontSize: "0.875rem",
                      fontWeight: "bold",
                      border: "1px solid #1b5e20",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    }}
                  >
                    {index + 1}
                  </Typography>
                  {/* {item.TransactionType === "Sale" ? (
                  <Warning color="error" sx={{ fontSize: 30 }} />
                ) : (
                  <CheckCircle color="success" sx={{ fontSize: 30 }} />
                )} */}
                  <ListItemText
                    primary={`${item.ModelNumber}  - ${item?.BatchNo} - ${item.TransactionType} (${item.Quantity} items)`}
                    secondary={`Date: ${formatDate(new Date(item.EntryTimeStamp).toLocaleDateString())}`}
                    sx={{
                      marginLeft: 2,
                      "& .MuiTypography-primary": {
                        fontSize: "1.1rem",
                        fontWeight: 500,
                      },
                      "& .MuiTypography-secondary": {
                        fontSize: "0.9rem",
                      },
                    }}
                  />
                </ListItem>
              ))}
          </List>
        )}
      </Paper>
      {/* </CustomTabPanel> */}
    </Box>
  );
}
