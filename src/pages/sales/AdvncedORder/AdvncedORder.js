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
import {
  Close as CloseIcon,
  Search as SearchIcon,
  Add as AddIcon, // Import AddIcon
} from "@mui/icons-material";
import axios from "axios";
import QuotationFormOld from "./components/AdvanceORderForm/AdvncedORderFormOld";
import LoadingComp from "../../../components/loadingComp/LoadingComp";

import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import ErrorComp from "./../../../components/error/ErrorComp";
import AdvanceOrderTable from "./components/AdvanceOrderTable";
import Cookies from "js-cookie"; // Import Cookies
import { useQueries } from "@tanstack/react-query";
import {
  advbListApiFn,
  customerListApiFn,
  subDealerListApiFn,
} from "../../../api/salesApi";
import { productListApiFn } from "../../../api/purchaseApi";
import {
  companyMasterApiFn,
  signatoryMasterApiFn,
} from "../../../api/commonApi";
import { useTheme } from "@emotion/react";

const Quotation = () => {
  const [open, setOpen] = useState(false);
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [customerList, setCustomerList] = useState([]);
  // const [allItems, setAllItems] = useState([]);
  // const [companyList, setCompanyList] = useState([]);
  // const [subdealerList, setSubdealerList] = useState([]);
  // const [signatoryList, setSignatoryList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [error, setError] = useState(false);
  // const [advOrderList, setAdvOrderList] = useState([]);

  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

  // const fetchAdvaceOrder = async () => {
  //   const res = await axios.get(
  //     `${process.env.REACT_APP_URL}/api/getquotationbookings?BillCode=ADVB`,
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: sanctumToken,
  //       },
  //     }
  //   );
  //   setAdvOrderList(res.data);
  //   console.log(res.data);
  // };

  // const fetchData = async () => {
  //   setLoading(true);
  //   try {
  //     const [customers, subdealers, items, companies, signatories] =
  //       await Promise.all([
  //         axios.get(`${process.env.REACT_APP_URL}/api/getCustomers`, {
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: sanctumToken,
  //           },
  //         }),
  //         axios.get(`${process.env.REACT_APP_URL}/api/getSubDealers`, {
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: sanctumToken,
  //           },
  //         }),
  //         axios.get(`${process.env.REACT_APP_URL}/api/getProductModels`, {
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: sanctumToken,
  //           },
  //         }),
  //         axios.get(`${process.env.REACT_APP_URL}/api/getCompany`, {
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: sanctumToken,
  //           },
  //         }),
  //         axios.get(`${process.env.REACT_APP_URL}/api/getsignatorydetails`, {
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: sanctumToken,
  //           },
  //         }),
  //       ]);
  //     setCustomerList(customers.data.data || []);
  //     setSubdealerList(subdealers.data.data || []);
  //     setAllItems(items.data || []);
  //     setCompanyList(companies.data.data || []);
  //     setSignatoryList(
  //       JSON.parse(signatories.data.data[0].SignatoryDetails).SignatoryDetails
  //         .AuthorizedSignatoryList
  //     );
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     setError(true);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  //   fetchAdvaceOrder();
  // }, []);
  // console.log(advOrderList);
  // ======================================================================================

  const results = useQueries({
    queries: [
      {
        queryKey: ["advbListApi"],
        queryFn: advbListApiFn,
      },
      {
        queryKey: ["subDealerListApi"],
        queryFn: subDealerListApiFn,
      },
      {
        queryKey: [" customerListApi"],
        queryFn: customerListApiFn,
      },
      {
        queryKey: ["productListApi"],
        queryFn: productListApiFn,
      },
      {
        queryKey: ["companyMasterApi"],
        queryFn: companyMasterApiFn,
      },
      {
        queryKey: ["signatoryMasterApi"],
        queryFn: signatoryMasterApiFn,
      },
    ],
  });

  // Destructure the responses
  const [
    advbQuery,
    subDealerQuery,
    customerQuery,
    productQuery,
    companyQuery,
    signatoryQuery,
  ] = results;

  const isLoading = advbQuery.isLoading;
  const theme = useTheme();

  // Access data, loading state etc.
  const advOrderList = advbQuery?.data?.data || [];
  const subdealerList = subDealerQuery?.data?.data?.data || [];
  const customerList = customerQuery?.data?.data?.data || [];
  const allItems = productQuery?.data?.data || [];
  const companyList = companyQuery?.data?.data?.data || [];
  const signatoryListString = signatoryQuery?.data?.data?.data || [];
  const signatoryList =
    JSON.parse(signatoryListString?.[0]?.SignatoryDetails || "{}")
      ?.SignatoryDetails?.AuthorizedSignatoryList || [];

  const handleRefetchAdbv = () => {
    advbQuery.refetch();
  };

  // ======================================================================================

  const handleOpen = (data) => {
    setSelectedData(
      data || {
        quotationNo: "",
        customerDetails: {},
        subDealerDetails: {},
        companyDetails: {},
        items: [],
      }
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedData(null);
  };

  const handleAddCustomerOpen = () => setAddCustomerOpen(true);
  const handleAddCustomerClose = () => setAddCustomerOpen(false);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = advOrderList.filter(
    (order) =>
      order.QuotationNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.CompanyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.Name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const renderSection = (title, details) =>
    details &&
    Object.keys(details).length > 0 && (
      <>
        <Typography variant="h6">{title}</Typography>
      </>
    );

  return (
    <Box
      sx={{ p: 4, bgcolor: theme.palette.background.main, minHeight: "100vh" }}
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
          }}
        >
          <StickyNote2Icon style={{ fontSize: "2.2rem" }} /> Advanced Order
          Managment
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search...Advanced Orders"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: "#006400", mr: 1 }} />,
          }}
          sx={{
            mr: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "22px",
              backgroundColor: "white",
              "& fieldset": {
                borderColor: "#006400", // dark green
              },
              "&:hover fieldset": {
                borderColor: "#006400", // dark green
              },
              "&.Mui-focused fieldset": {
                borderColor: "#006400", // dark green
              },
            },
            "& .MuiInputBase-input::placeholder": {
              color: "#004d00", // darker green placeholder text color
              opacity: 0.8, // make it fully opaque
            },
          }}
        />
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#4D795B",
            borderRadius: "15px",
            color: "#fff",
            width: "24%",
            px: -4,
            height: 50,
          }}
          onClick={handleAddCustomerOpen}
          startIcon={<StickyNote2Icon style={{ fontSize: "1.5rem" }} />} // Add the AddIcon here
        >
          Order Advance
        </Button>
      </Box>

      <Dialog
        open={addCustomerOpen}
        onClose={handleAddCustomerClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            color: "white",
            gap: ".5rem",
            position: "relative",
            "& .MuiSvgIcon-root": {
              color: "white",
            },
          }}
        >
          <StickyNote2Icon /> Generate Quotation / Advance Order
          <IconButton
            onClick={handleAddCustomerClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <QuotationFormOld
            customerList={customerList}
            allItems={allItems}
            companyList={companyList}
            subdealerList={subdealerList}
            signatoryList={signatoryList}
            // fetchCusomer={() => fetchData()}
            // fetchallSubDealer={() => fetchData()}
            handleAddCustomerClose={handleAddCustomerClose}
            fetchAdvaceOrder={handleRefetchAdbv}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddCustomerClose} variant="text">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <LoadingComp loading={isLoading} />
      <ErrorComp error={error} />
      <AdvanceOrderTable
        advOrderList={advOrderList}
        signatoryList={signatoryList}
        allItems={allItems}
        fetchAdvaceOrder={handleRefetchAdbv}
      />
    </Box>
  );
};

export default Quotation;
