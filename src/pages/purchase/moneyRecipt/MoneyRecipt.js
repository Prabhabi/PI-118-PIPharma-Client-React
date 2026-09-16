import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Receipt as ReceiptIcon } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import MoneyReciptFormWithInvoice from "./components/moneyReciptDialog/component/MoneyReciptFormWithInvoice";
import MoneyReciptFormNoInvoice from "./components/moneyReciptDialog/component/OrderBookingCreateForm";
import MoneyReciptTable from "./components/MoneyReciptTable";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LoadingComp from "../../../components/loadingComp/LoadingComp";
import ErrorComp from "./../../../components/error/ErrorComp";
import InvoiceDetailsDialog from "../../sales/invoice/components/InvoiceDetailsDialog";
import Cookies from "js-cookie"; // Import Cookies
import { useQueries } from "@tanstack/react-query";
import { productListApiFn } from "../../../api/purchaseApi";
import {
  companyMasterApiFn,
  hsnMasterApiFn,
  paymentMasterApiFn,
  signatoryMasterApiFn,
} from "../../../api/commonApi";
import {
  customerListApiFn,
  moneyReciptListApiFn,
  orderRequestListApiFn,
  subDealerListApiFn,
} from "../../../api/salesApi";
import { isError } from "lodash";
import { useTheme } from "@emotion/react";
import OrderBookingCreateForm from "./components/moneyReciptDialog/component/OrderBookingCreateForm";

const theme = createTheme({
  palette: {
    primary: {
      main: "#228df1ff", // Dark green color
    },
  },
  typography: {
    fontWeightBold: 700,
  },
});

const MoneyRecipt = () => {
  const [open, setOpen] = useState(false);
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [invoiceSection, setInvoiceSection] = useState(true);
  // const [allItems, setAllItems] = useState([]);
  // const [allHsn, setAllHsn] = useState([]);
  // const [allPaymentType, setAllPaymentType] = useState([]);
  // const [error, setError] = useState(false);
  // const [dummyQuotation, setDummyQuotation] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [allSignatoryDetails, setAllSignatoryDetails] = useState([]);
  // const [allInvoice, setAllInvoice] = useState([]);
  // const [allCompany, setAllCompany] = useState([]);
  // const [subDealerList, setSubDealerList] = useState([]);
  // const [customerList, setCustomerList] = useState([]);
  // const [moneyReciptList, setAllMoneyReciptList] = useState([]);
  const [details, setDetails] = React.useState({});
  const [openModal, setOpenModal] = React.useState(false);

  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

  const handleOpenModal = (details) => {
    setDetails(details);
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);
  // Dummy data for table
  const data = [
    {
      id: 1,
      supplierName: "Supplier A",
      phone: "123-456-7890",
      brand: "Brand A",
      productType: "Type 1",
      category: "Category X",
      subCategory: "Sub-Category Y",
      color: "Blue",
      unit: "10x20x30",
      quantity: 5,
      items: [
        {
          brand: "Brand A",
          productType: "Type 1",
          category: "Category X",
          subCategory: "Sub-Category Y",
          color: "Blue",
          unit: "10x20x30",
          quantity: 5,
        },
      ],
    },
    {
      id: 2,
      supplierName: "Supplier B",
      phone: "987-654-3210",
      brand: "Brand B",
      productType: "Type 2",
      category: "Category Z",
      subCategory: "Sub-Category W",
      color: "Red",
      unit: "15x25x35",
      quantity: 3,
      items: [
        {
          brand: "Brand B",
          productType: "Type 2",
          category: "Category Z",
          subCategory: "Sub-Category W",
          color: "Red",
          unit: "15x25x35",
          quantity: 3,
        },
      ],
    },
  ];

  const handleOpen = (data) => {
    setSelectedData(data);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedData(null);
  };

  const handleAddCustomerOpen = () => {
    setAddCustomerOpen(true);
  };

  const handleAddCustomerClose = () => {
    setAddCustomerOpen(false);
  };

  // const fetchAllData = async () => {
  //   try {
  //     const [itemsRes, hsnRes, paymentsRes] = await Promise.all([
  //       axios.get(`${process.env.REACT_APP_URL}/api/getProductModels`, {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: sanctumToken,
  //         },
  //       }),
  //       axios.get(`${process.env.REACT_APP_URL}/api/getHSN`, {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: sanctumToken,
  //         },
  //       }),
  //       axios.get(`${process.env.REACT_APP_URL}/api/getPaymentModes`, {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: sanctumToken,
  //         },
  //       }),
  //     ]);
  //     setAllItems(itemsRes.data);
  //     setAllHsn(hsnRes.data);
  //     setAllPaymentType(paymentsRes.data.data);
  //   } catch (error) {
  //     setError(true);
  //     // console.error("Error fetching data:", error);
  //   }
  // };

  // const fetchAllQuotation = async () => {
  //   try {
  //     const res = await axios.get(
  //       `${process.env.REACT_APP_URL}/api/getquotationbookings?BillCode=QUO`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: sanctumToken,
  //         },
  //       }
  //     );
  //     setDummyQuotation(res.data);
  //   } catch (error) {
  //     setError(true);
  //     // console.error("Error fetching quotations:", error);
  //   }
  // };

  // const fetchAllSignatoryDetails = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await axios.get(
  //       `${process.env.REACT_APP_URL}/api/getsignatorydetails`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: sanctumToken,
  //         },
  //       }
  //     );
  //     const parsedData = JSON.parse(res.data.data[0].SignatoryDetails);
  //     setAllSignatoryDetails(parsedData.SignatoryDetails);
  //   } catch (error) {
  //     setError(true);
  //     // console.error("Error fetching signatory details:", error);
  //     setError(true);
  //     setLoading(false);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const fetchAllInvoice = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await axios.get(
  //       `${process.env.REACT_APP_URL}/api/getReceiptPayment?BillCode=INVP`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: sanctumToken,
  //         },
  //       }
  //     );
  //     setAllInvoice(res.data);
  //     // console.log(res.data);
  //   } catch (error) {
  //     setError(true);
  //     // console.error("Error fetching invoices:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const fetchAllCompany = async () => {
  //   try {
  //     const res = await axios.get(
  //       `${process.env.REACT_APP_URL}/api/getCompany`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: sanctumToken,
  //         },
  //       }
  //     );
  //     setAllCompany(res.data.data);
  //   } catch (error) {
  //     setError(true);
  //   }
  // };
  // const fetchAllMoenyRecipt = async () => {
  //   try {
  //     const res = await axios.get(
  //       `${process.env.REACT_APP_URL}/api/moneyReceiptPayment`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: sanctumToken,
  //         },
  //       }
  //     );
  //     setAllMoneyReciptList(res.data.data);
  //   } catch (error) {
  //     setError(true);
  //     // console.error("Error fetching suppliers:", error);
  //   }
  // };

  // const fetchAllSubDealer = async () => {
  //   try {
  //     const res = await axios.get(
  //       `${process.env.REACT_APP_URL}/api/getSubDealers`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: sanctumToken,
  //         },
  //       }
  //     );
  //     setSubDealerList(res.data.data);
  //   } catch (error) {
  //     setError(true);
  //     // console.error("Error fetching suppliers:", error);
  //   }
  // };
  // const fetchAllCustomer = async () => {
  //   try {
  //     const res = await axios.get(
  //       `${process.env.REACT_APP_URL}/api/getCustomers`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: sanctumToken,
  //         },
  //       }
  //     );
  //     setCustomerList(res.data.data);
  //   } catch (error) {
  //     setError(true);
  //     console.error("Error fetching suppliers:", error);
  //   }
  // };
  // // console.log(moneyReciptList);

  // useEffect(() => {
  //   fetchAllData();
  //   // fetchAllQuotation();
  //   // fetchAllInvoice();
  //   fetchAllSignatoryDetails();
  //   fetchAllCompany();
  //   fetchAllSubDealer();
  //   fetchAllCustomer();
  //   fetchAllMoenyRecipt();
  // }, []);

  //  ======================================================================================

  const results = useQueries({
    queries: [
      {
        queryKey: ["productListApii"],
        queryFn: productListApiFn,
        staleTime: Infinity,
      },
      {
        queryKey: ["hsnMasterApi"],
        queryFn: hsnMasterApiFn,
        staleTime: Infinity,
      },
      {
        queryKey: ["paymentMasterApi"],
        queryFn: paymentMasterApiFn,
        staleTime: Infinity,
      },

      {
        queryKey: ["signatoryMasterApi"],
        queryFn: signatoryMasterApiFn,
        staleTime: Infinity,
      },

      {
        queryKey: ["companyMasterApi"],
        queryFn: companyMasterApiFn,
        staleTime: Infinity,
      },
      {
        queryKey: ["customerListApi"],
        queryFn: customerListApiFn,
        staleTime: Infinity,
      },
      {
        queryKey: ["subDealerListApi"],
        queryFn: subDealerListApiFn,
        staleTime: Infinity,
      },

      {
        queryKey: ["orderRequestListApi"],
        queryFn: orderRequestListApiFn,
        staleTime: Infinity,
      },
    ].map((query) => ({
      ...query,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false,
      staleTime: Infinity,
    })),
  });

  // Destructure the responses
  const [
    productQuery,
    hsnQuery,
    paymentQuery,
    signatoryQuery,
    companyQuery,
    customerQuery,
    subDealerQuery,
    moneyReciptQuery,
  ] = results;

  const isLoading = moneyReciptQuery.isLoading;
  const isError = moneyReciptQuery.isError;

  // Access data, loading state etc.

  const allItems = productQuery?.data?.data || [];
  const allHsn = hsnQuery?.data?.data?.data || [];
  const allPaymentType = paymentQuery?.data?.data?.data || [];

  const subDealerList = subDealerQuery?.data?.data?.data || [];
  const customerList = customerQuery?.data?.data?.data || []; // Parse customer list data
  const allCompany = companyQuery?.data?.data?.data || [];
  const signatoryListString = signatoryQuery?.data?.data?.data || [];
  const allSignatoryDetails =
    JSON.parse(signatoryListString?.[0]?.SignatoryDetails || "{}")
      ?.SignatoryDetails || [];
  const moneyReciptList = moneyReciptQuery?.data?.data?.data || [];
  // const moneyReciptList = [];

  // ======================================================================================
  const theme = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          mt: 4,
          p: 2.5,
          boxShadow: 8,
          borderRadius: 3,
          bgcolor: theme.palette.background.main,
          minHeight: "100vh",
        }}
      >
        {" "}
        {/* Page Title and Add Customer Button */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box></Box>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2,
              color: "blue",
            }}
          >
            <ReceiptIcon fontSize="2rem" color="blue" /> Order Request{" "}
          </Typography>

          <Button
            variant="contained"
            onClick={handleAddCustomerOpen}
            sx={{ bgcolor: "#0034c4ff", height: 45, borderRadius: "15px" }}
            startIcon={<AddIcon />}
          >
            Request Order
          </Button>
        </Box>
        {/* Product Items Table */}
        {/* Existing Dialog */}
        {/* Dialog Box */}
        <MoneyReciptTable moneyReciptList={moneyReciptList} />
        <Dialog
          open={addCustomerOpen}
          onClose={handleAddCustomerClose}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle
            sx={{
              color: "white",
              fontWeight: "bold",
              // textAlign: "center",
              display: "flex",
              alignItems: "center",
              // justifyContent: "center",
              gap: 1,
            }}
          >
            <ReceiptIcon />
            Order Booking
            <IconButton
              onClick={handleAddCustomerClose}
              sx={{
                position: "absolute",
                right: 1,
                top: 8,
                color: "white",
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <>
              <FormControl component="fieldset">
                <FormLabel component="legend"></FormLabel>
                <RadioGroup
                  row
                  value="withoutInvoice" // Default to "withoutInvoice"
                >
                  {/* <FormControlLabel
                    value="withoutInvoice"
                    control={<Radio color="primary" />}
                    label={
                      <Typography sx={{ color: "#0059ffff", fontWeight: "bold" }}>
                       
                      </Typography>
                    }
                  /> */}
                </RadioGroup>
              </FormControl>
              <OrderBookingCreateForm
                signatoryDetails={allSignatoryDetails}
                allCompanyList={allCompany}
                allPaymentType={allPaymentType}
                fetchAllMoenyRecipt={moneyReciptQuery.refetch}
                handleAddCustomerClose={handleAddCustomerClose}
                allItems={allItems}
                customerList={customerList} // Pass customer list to the form
              />
            </>
          </DialogContent>
          <DialogActions>
            <Button
              variant="text"
              onClick={handleAddCustomerClose}
              color="success"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <LoadingComp loading={isLoading} />
      <ErrorComp error={isError} />
      <InvoiceDetailsDialog
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        row={details}
        // fetchCustomers={fetchCustomers}
      />{" "}
    </ThemeProvider>
  );
};

export default MoneyRecipt;
