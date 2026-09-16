import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import InvoiceTable from "./components/InvoiceTable";
import LoadingComp from "../../../components/loadingComp/LoadingComp";
import InvoiceCreateDialogFormS from "./components/invoiceDialog/InvoiceCreateDialogFormS";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import ErrorComp from "../../../components/error/ErrorComp";
import Cookies from "js-cookie"; // Import Cookies
import {
  companyMasterApiFn,
  hsnMasterApiFn,
  paymentMasterApiFn,
  signatoryMasterApiFn,
} from "../../../api/commonApi";
import {
  advbListApiFn,
  customerListApiFn,
  invoiceListApiFn,
  subDealerListApiFn,
} from "../../../api/salesApi";
import { useQueries } from "@tanstack/react-query";
import { productListApiFn } from "../../../api/purchaseApi";
import { useTheme } from "@emotion/react";

const InvoiceSales = () => {
  const [open, setOpen] = useState(false);
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  // const [allItems, setAllItems] = useState([]);
  // const [allHsn, setAllHsn] = useState([]);
  // const [dummyQuotation, setDummyQuotation] = useState([]);
  // const [allPaymentType, setAllPaymentType] = useState([]);
  // const [allInvoice, setAllInvoice] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [signatoryDetails, setAllSignatoryDetails] = useState([]);
  // const [allCompanyList, setAllCompany] = useState([]);
  // const [customerList, setCustomerList] = useState([]);
  // const [subDealerList, setSubDealerList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState(false);

  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

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
  //     setAllHsn(hsnRes.data.data); // Ensure HSN is an array
  //     setAllPaymentType(paymentsRes.data.data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     setError(true);
  //   }
  // };

  // const fetchAllQuotation = async () => {
  //   try {
  //     const res = await axios.get(
  //       `${process.env.REACT_APP_URL}/api/getquotationbookings?BillCode=ADVB`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: sanctumToken,
  //         },
  //       }
  //     );
  //     setDummyQuotation(res.data);
  //   } catch (error) {
  //     console.error("Error fetching quotations:", error);
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
  //     console.error("Error fetching signatory details:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const fetchAllInvoice = async () => {
  //   try {
  //     const res = await axios.get(
  //       `${process.env.REACT_APP_URL}/api/getReceiptPayment?BillCode=INVS`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: sanctumToken,
  //         },
  //       }
  //     );
  //     setAllInvoice(res.data);
  //     console.log(res.data);
  //   } catch (error) {
  //     console.error("Error fetching invoices:", error);
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
  //     console.error("Error fetching companies:", error);
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
  //     console.error("Error fetching customers:", error);
  //   }
  // };

  // const fetchallSubDealer = async () => {
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
  //     console.error("Error fetching sub-dealers:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchAllData();
  //   fetchAllQuotation();
  //   fetchAllInvoice();
  //   fetchAllSignatoryDetails();
  //   fetchAllCompany();
  //   fetchallSubDealer();
  //   fetchAllCustomer();
  // }, []);

  // ======================================================================================

  const results = useQueries({
    queries: [
      {
        queryKey: ["productListApi"],
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
        queryKey: ["advbListApi"],
        queryFn: advbListApiFn,
        staleTime: Infinity,
      },
      {
        queryKey: ["signatoryMasterApi"],
        queryFn: signatoryMasterApiFn,
        staleTime: Infinity,
      },
      {
        queryKey: ["invoiceListApi"],
        queryFn: invoiceListApiFn,
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
    ],
  });

  // Destructure the responses
  const [
    productQuery,
    hsnQuery,
    paymentQuery,
    advbQuery,
    signatoryQuery,
    invoiceQuery,
    companyQuery,
    customerQuery,
    subDealerQuery,
  ] = results;

  const isLoading = invoiceQuery.isLoading;
  const theme = useTheme();

  // Access data, loading state etc.

  const allItems = productQuery?.data?.data || [];
  const allHsn = hsnQuery?.data?.data?.data || [];
  const allPaymentType = paymentQuery?.data?.data?.data || [];
  const dummyQuotation = advbQuery?.data?.data || [];
  const allInvoice = invoiceQuery?.data?.data || [];
  const subDealerList = subDealerQuery?.data?.data?.data || [];
  const customerList = customerQuery?.data?.data?.data || [];
  const allCompanyList = companyQuery?.data?.data?.data || [];
  const signatoryListString = signatoryQuery?.data?.data?.data || [];
  const signatoryList =
    JSON.parse(signatoryListString?.[0]?.SignatoryDetails || "{}")
      ?.SignatoryDetails || [];

  const handleRefetchAdbv = () => {
    advbQuery.refetch();
  };
  console.log("CUSTOMER LIST", signatoryList);

  // ======================================================================================
  const afterFilter = allInvoice.filter((item) => {
    if (searchText) {
      return Object.values(item).some((value) =>
        value
          ? value.toString().toLowerCase().includes(searchText.toLowerCase())
          : false
      );
    }
    return true;
  });

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
  console.log(allInvoice);

  return (
    <Box
      sx={{ p: 4, minHeight: "100vh", bgcolor: theme.palette.background.main }}
    >
      {/* Page Title and Add Customer Button */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            marginBottom: 4,
            color: "#4D795B",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            mb: 6,
            color: "blue",
          }}
        >
          <NewspaperIcon style={{ fontSize: "2.2rem", color: "blue" }} /> Sales
          Invoice
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
          backgroundColor: "#e8f5e9",
        }}
      >
        <TextField
          placeholder="Search...Invoice"
          variant="outlined"
          fullWidth
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ color: "#006400", mr: 1, color: "blue" }} />
            ),
          }}
          sx={{
            width: { xs: "100%", md: "100%" },
            mr: { xs: 0, md: 2 },
            "& .MuiOutlinedInput-root": {
              borderRadius: "22px",
              backgroundColor: "white",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "blue !important", // 🔵 Force default
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "blue !important", // 🔵 Force hover
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "blue !important", // 🔵 Force active/focused
              },
            },
          }}
        />
        <Button
          variant="contained"
          sx={{
            borderRadius: "15px",
            backgroundColor: "#4D795B",
            height: "50px",
            fontWeight: "bold",
            // fontSize: "18px",
            width: "20rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
          onClick={handleAddCustomerOpen}
        >
          <NewspaperIcon /> Create Invoice
        </Button>
      </Box>

      {/* Product Items Table */}
      <InvoiceTable
        allInvoice={afterFilter}
        searchText={searchText}
        setSearchText={setSearchText}
        allHsn={allHsn}
        dummyQuotation={dummyQuotation}
        allPaymentType={allPaymentType}
        signatoryDetails={signatoryList}
        allCompanyList={allCompanyList}
        customerList={customerList}
        subDealerList={subDealerList}
        fetchAllCustomer={() => customerQuery.refetch()}
        allItems={allItems}
        fetchallSubDealer={subDealerQuery.refetch}
        fetchAllInvoice={invoiceQuery.refetch}
      />

      {/* {/* Add Customer Dialog ======================================= */}
      <Dialog
        open={addCustomerOpen}
        onClose={handleAddCustomerClose}
        maxWidth="xl"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            color: "white",
            padding: "16px",
            position: "relative",
          }}
        >
          <NewspaperIcon sx={{ color: "white" }} />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, color: "white" }}
          >
            Generate Invoice
          </Typography>
          <IconButton
            onClick={handleAddCustomerClose}
            sx={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              color: "white",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <InvoiceCreateDialogFormS
            allItems={allItems}
            allHsn={allHsn}
            dummyQuotation={dummyQuotation}
            allPaymentType={allPaymentType}
            signatoryDetails={signatoryList}
            allCompanyList={allCompanyList}
            customerList={customerList}
            subDealerList={subDealerList}
            fetchAllCustomer={customerQuery.refetch}
            fetchallSubDealer={subDealerQuery.refetch}
            fetchAllInvoice={invoiceQuery.refetch}
            handleAddCustomerClose={handleAddCustomerClose}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleAddCustomerClose}
            variant="text"
            color="success"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <LoadingComp loading={isLoading} />
      <ErrorComp error={error} />
    </Box>
  );
};

export default InvoiceSales;
