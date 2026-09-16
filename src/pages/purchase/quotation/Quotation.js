import React, { useState, useEffect } from "react";
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
import CloseIcon from "@mui/icons-material/Close";

import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import QuotationFormOld from "./components/QuotationForm/QuotationFormOld";
import LoadingComp from "../../../components/loadingComp/LoadingComp";
import ErrorComp from "../../../components/error/ErrorComp";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import Cookies from "js-cookie"; // Import Cookies

import QuotationTable from "./components/QuotationForm/QuotationTable";
import {
  productListApiFn,
  quotationtListApiFn,
  supplierListApiFn,
} from "../../../api/purchaseApi";
import { useQueries } from "@tanstack/react-query";
import {
  companyMasterApiFn,
  signatoryMasterApiFn,
} from "../../../api/commonApi";
import { useTheme } from "@emotion/react";

const Quotation = () => {
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  // const [supplierList, setSupplierList] = useState([]);
  // const [allItems, setAllItems] = useState([]);
  // const [companyList, setCompanyList] = useState([]);
  // const [signatoryList, setSignatoryList] = useState([]);
  const [error, setError] = useState(false);
  // const [quotaionList, setQuotationList] = useState([]);

  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

  // const fetchData = async () => {
  //   try {
  //     const [suppliers, items, companies, signatories] = await Promise.all([
  //       axios.get(`${process.env.REACT_APP_URL}/api/getSuppliers`, {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: sanctumToken,
  //         },
  //       }),
  //       axios.get(`${process.env.REACT_APP_URL}/api/getProductModels`, {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: sanctumToken,
  //         },
  //       }),
  //       axios.get(`${process.env.REACT_APP_URL}/api/getCompany`, {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: sanctumToken,
  //         },
  //       }),
  //       axios.get(`${process.env.REACT_APP_URL}/api/getsignatorydetails`, {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: sanctumToken,
  //         },
  //       }),
  //     ]);
  //     setSupplierList(suppliers.data.data || []);
  //     setAllItems(items.data || []);
  //     setCompanyList(companies.data.data || []);
  //     const signatoryData = JSON.parse(
  //       signatories.data.data[0].SignatoryDetails
  //     ).SignatoryDetails.AuthorizedSignatoryList;

  //     setSignatoryList(signatoryData);
  //   } catch (error) {
  //     // console.error("Error fetching data:", error);
  //     setError(true);
  //   }
  // };
  // const fetchQuotationsFn = async () => {
  //   setLoading(true);
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
  //     setQuotationList(res.data);
  //   } catch (err) {
  //     setError(true);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  //   fetchQuotationsFn();
  // }, []);
  // ======================================================================================

  const results = useQueries({
    queries: [
      {
        queryKey: ["quotationListApi"],
        queryFn: quotationtListApiFn,
        staleTime: Infinity,
        cacheTime: Infinity,
        gcTime: Infinity, // For React Query v5+
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: "never", // <-- Use "never" for v5, not false
        refetchInterval: false,
        refetchIntervalInBackground: false,
        enabled: true,
      },
      {
        queryKey: ["supplierListApi"],
        queryFn: supplierListApiFn,
        staleTime: Infinity,
        cacheTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: "never", // <-- Use "never" for v5, not false
        refetchInterval: false,
        refetchIntervalInBackground: false,
        enabled: false,
      },
      {
        queryKey: ["productListApi"], // fixed typo from productListApii
        queryFn: productListApiFn,
        staleTime: Infinity,
        cacheTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: "never", // <-- Use "never" for v5, not false
        refetchInterval: false,
        refetchIntervalInBackground: false,
        enabled: false,
      },
      {
        queryKey: ["companyMasterApi"],
        queryFn: companyMasterApiFn,
        staleTime: Infinity,
        cacheTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: "never", // <-- Use "never" for v5, not false
        refetchInterval: false,
        refetchIntervalInBackground: false,
        enabled: false,
      },
      {
        queryKey: ["signatoryMasterApi"],
        queryFn: signatoryMasterApiFn,
        staleTime: Infinity,
        cacheTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: "never", // <-- Use "never" for v5, not false
        refetchInterval: false,
        refetchIntervalInBackground: false,
        enabled: true,
      },
    ],
  });

  // Destructure the responses
  const [quoQuery, supplierQuery, productQuery, companyQuery, signatoryQuery] =
    results;

  const isLoading = quoQuery.isLoading;

  // Access data, loading state etc.
  const supplierList = supplierQuery?.data?.data?.data || [];
  const allItems = productQuery?.data?.data || [];
  const companyList = companyQuery?.data?.data?.data || [];
  const signatoryListString = signatoryQuery?.data?.data?.data || [];
  const signatoryList =
    JSON.parse(signatoryListString?.[0]?.SignatoryDetails || "{}")
      ?.SignatoryDetails?.AuthorizedSignatoryList || [];
  const quotaionList = quoQuery?.data?.data || [];

  // ======================================================================================

  const handleAddCustomerOpen = () => {
    setAddCustomerOpen(true);
  };

  const handleAddCustomerClose = () => {
    setAddCustomerOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredQuotationList = quotaionList.filter((quotation) => {
    const searchTermLower = searchTerm.toLowerCase();
    return Object.values(quotation).some(
      (value) =>
        value && value.toString().toLowerCase().includes(searchTermLower)
    );
  });
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          p: { xs: 2, sm: 4 },
          bgcolor: theme.palette.background.main,
          minHeight: "100vh",
        }}
      >
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
              fontSize: { xs: "1.8rem", sm: "2.125rem" },
              color: "blue",
            }}
          >
            <StickyNote2Icon style={{ fontSize: "2.2rem", color: "blue" }} />{" "}
            Quotation Management
          </Typography>
        </Box>
        <Box
          display="flex"
          sx={{
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 2, sm: 0 },
          }}
          justifyContent="space-between"
          alignItems="center"
        >
          {/* <Typography
            variant="h5"
            sx={{
              color: "#225222",
              fontWeight: "bold",
              width: { xs: "100%", sm: "20%" },
              textAlign: { xs: "center", sm: "left" },
              fontSize: { xs: "1.2rem", sm: "1.5rem" },
            }}
          >
            Quotation List
          </Typography> */}
          <TextField
            placeholder="Search Quotation"
            fullWidth
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
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
              backgroundColor: "#4D795B",
              color: "#fff",
              width: { xs: "100%", sm: "24%" },
              px: -4,
              height: 50,
              borderRadius: "15px",
            }}
            onClick={handleAddCustomerOpen}
            startIcon={<StickyNote2Icon style={{ fontSize: "1.5rem" }} />}
          >
            Add Quotation
          </Button>
        </Box>
        <QuotationTable
          filteredQuotationList={filteredQuotationList}
          supplierList={supplierList}
          allItems={allItems}
          companyList={companyList}
          signatoryList={signatoryList}
          fetchQuotationsFn={quoQuery.refetch}
        />

        <Dialog
          open={addCustomerOpen}
          onClose={handleAddCustomerClose}
          maxWidth="xl"
          fullWidth
          sx={{
            "& .MuiDialog-paper": {
              width: { xs: "95%", sm: "100%" },
              margin: { xs: "10px", sm: "32px" },
            },
          }}
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
            <StickyNote2Icon sx={{ color: "white" }} />
            Generate Quotation
            <IconButton
              onClick={handleAddCustomerClose}
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
            <QuotationFormOld
              supplierList={supplierList}
              allItems={allItems}
              companyList={companyList}
              signatoryList={signatoryList}
              fetchQuotationsFn={quoQuery.refetch}
              handleAddCustomerClose={handleAddCustomerClose}
              fetchProduct={productQuery.refetch}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddCustomerClose} variant="text">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <LoadingComp loading={isLoading} />
      <ErrorComp error={error} />
    </>
  );
};

export default Quotation;
