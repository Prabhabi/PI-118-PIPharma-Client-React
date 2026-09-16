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
import * as XLSX from "xlsx";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import InvoiceTable from "./components/InvoiceTable";
import LoadingComp from "../../../components/loadingComp/LoadingComp";
import InvoiceCreateDialogFormP from "./components/invoiceDialog/InvoiceCreateDialogFormP";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import ErrorComp from "../../../components/error/ErrorComp";
import Cookies from "js-cookie"; // Import Cookies
import {
  invoicePurListApiFn,
  productListApiFn,
  quotationtListApiFn,
  supplierListApiFn,
} from "../../../api/purchaseApi";
import {
  companyMasterApiFn,
  hsnMasterApiFn,
  paymentMasterApiFn,
  signatoryMasterApiFn,
} from "./../../../api/commonApi";
import { invoiceListApiFn } from "../../../api/salesApi";
import { useQueries } from "@tanstack/react-query";
import { useTheme } from "@emotion/react";
import CropFreeIcon from "@mui/icons-material/CropFree"; // Add maximize icon
import FilterNoneIcon from "@mui/icons-material/FilterNone"; // Add restore icon

const InvoicePur = () => {
  const [open, setOpen] = useState(false);
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  // const [allItems, setAllItems] = useState([]);
  // const [allHsn, setAllHsn] = useState([]);
  // const [dummyQuotation, setDummyQuotation] = useState([]);
  // const [allPaymentType, setAllPaymentType] = useState([]);
  // const [allInvoice, setAllInvoice] = useState([]);
  const [signatoryDetails, setAllSignatoryDetails] = useState([]);
  // const [allCompanyList, setAllCompany] = useState([]);
  // const [supplierList, setSupplierList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectSearchType, setSelectSearchType] = useState("Name");
  const [dialogMaxWidth, setDialogMaxWidth] = useState("xxl"); // Track dialog width
  // const [error, setError] = useState(false);

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
  //       }), // Use the provided API to fetch HSN data
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

  // const fetchAllSupplier = async () => {
  //   try {
  //     const res = await axios.get(
  //       `${process.env.REACT_APP_URL}/api/getSuppliers`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: sanctumToken,
  //         },
  //       }
  //     );
  //     setSupplierList(res.data.data);
  //   } catch (error) {
  //     setError(true);
  //     // console.error("Error fetching suppliers:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchAllData();
  //   fetchAllQuotation();
  //   fetchAllInvoice();
  //   fetchAllSignatoryDetails();
  //   fetchAllCompany();
  //   fetchAllSupplier();
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
        queryKey: ["quotationtListApi"],
        queryFn: quotationtListApiFn,
        staleTime: Infinity,
      },
      {
        queryKey: ["signatoryMasterApi"],
        queryFn: signatoryMasterApiFn,
        staleTime: Infinity,
      },
      {
        queryKey: ["invoicePurListApi"],
        queryFn: invoicePurListApiFn,
        staleTime: Infinity,
      },
      {
        queryKey: ["companyMasterApi"],
        queryFn: companyMasterApiFn,
        staleTime: Infinity,
      },
      {
        queryKey: ["supplierListApi"],
        queryFn: supplierListApiFn,
        staleTime: Infinity,
      },
      ,
    ],
  });

  // Destructure the responses
  const [
    productQuery,
    hsnQuery,
    paymentQuery,
    quoQuery,
    signatoryQuery,
    invoiceQuery,
    companyQuery,
    supplierQuery,
  ] = results;

  const isLoading = invoiceQuery.isLoading;

  // Access data, loading state etc.

  const loading = invoiceQuery.isLoading;
  const error = invoiceQuery.isError;

  const allItems = productQuery?.data?.data || [];
  const allHsn = hsnQuery?.data?.data?.data || [];
  const allPaymentType = paymentQuery?.data?.data?.data || [];
  const dummyQuotation = quoQuery?.data?.data || [];
  const allInvoice = invoiceQuery?.data?.data || [];
  const supplierList = supplierQuery?.data?.data?.data || [];
  const allCompanyList = companyQuery?.data?.data?.data || [];
  const signatoryListString = signatoryQuery?.data?.data?.data || [];

  const signatoryList =
    JSON.parse(signatoryListString?.[0]?.SignatoryDetails || "{}")
      ?.SignatoryDetails || [];

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

  const handleToggleDialogWidth = () => {
    setDialogMaxWidth((prev) => (prev === "xxl" ? "xl" : "xxl"));
  };

  const theme = useTheme();

  return (
    <Box
      sx={{ p: 4, bgcolor: theme.palette.background.main, minHeight: "100vh" }}
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
          <NewspaperIcon style={{ fontSize: "2.2rem" }} /> Invoice
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
            startAdornment: <SearchIcon sx={{ color: "blue", mr: 1 }} />,
          }}
          sx={{
            width: { xs: "100%", md: "100%" },
            mr: { xs: 0, md: 2 },
            "& .MuiOutlinedInput-root": {
              borderRadius: "22px",
              backgroundColor: "white",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "blue !important", // 🔵 Force blue border
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "blue !important", // 🔵 Hover
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "blue !important", // 🔵 Focus
              },
            },
            "& .MuiInputAdornment-root .MuiSvgIcon-root": {
              color: "blue !important", // 🔵 Force blue icon (wrapper + svg)
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
      />

      {/* Add Customer Dialog */}
      <Dialog
        open={addCustomerOpen}
        onClose={handleAddCustomerClose}
        maxWidth={dialogMaxWidth}
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            color: "white",
            justifyContent: "flex-start",
          }}
        >
          <NewspaperIcon sx={{ color: "white" }} />
          Generate Invoice
          <Box
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              display: "flex",
              gap: 1,
            }}
          >
            <IconButton
              onClick={handleToggleDialogWidth}
              sx={{ color: "white" }}
              aria-label={dialogMaxWidth === "xxl" ? "Shorten" : "Maximize"}
            >
              {dialogMaxWidth === "xxl" ? <FilterNoneIcon /> : <CropFreeIcon />}
            </IconButton>
            <IconButton
              onClick={handleAddCustomerClose}
              sx={{ color: "white" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <InvoiceCreateDialogFormP
            allItems={allItems}
            allHsn={allHsn} // Pass HSN data as a prop
            dummyQuotation={dummyQuotation}
            allPaymentType={allPaymentType}
            signatoryDetails={signatoryList}
            fetchAllSupplier={supplierQuery.refetch}
            supplierList={supplierList}
            allCompanyList={allCompanyList}
            fetchAllInvoice={invoiceQuery.refetch}
            handleAddCustomerClose={handleAddCustomerClose}
            sx={{
              "& .MuiSelect-select": {
                backgroundColor: "#fff", // Change background to white
              },
            }}
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
      <LoadingComp loading={loading} />
      <ErrorComp error={error} />
    </Box>
  );
};

export default InvoicePur;
