import React, { useEffect, useState } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import {
  TextField,
  Button,
  Grid,
  Typography,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  FormHelperText,
  Box,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  AccountCircleRounded as AccountCircleRoundedIcon,
  DateRange as DateRangeIcon,
  CurrencyRupee as CurrencyRupeeIcon,
  CurrencyRupeeRounded as CurrencyRupeeRoundedIcon,
  ApartmentRounded as ApartmentRoundedIcon,
} from "@mui/icons-material";
import axios from "axios";
import SelectComponent from "react-select";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import MoneyReciptPaymentForm from "./MoneyReciptPaymentForm";
import LoadingComp from "../../../../../../components/loadingComp/LoadingComp";
import moneyReciptInvpdf from "../../MoneyReciptInvpdf copy";
import Cookies from "js-cookie"; // Import Cookies
import { useQueryClient } from "@tanstack/react-query";

const schema = Yup.object().shape({
  ReceiptDate: Yup.date().required("Receipt Date is required"),
  CheckedByID: Yup.string().required("Checked By is required"),
  PreparedByID: Yup.string().required("Prepared By is required"),
  AuthorizedSignatoryByID: Yup.string().required("Authorize By is required"),
});

export default function MoneyReciptFormWithInvoice({
  handleClose,
  fetchAllEnquiry,
  fetchAllMoneyRecipt,
  signatoryDetails,
  allCompanyList,
  allPaymentType,
  fetchAllMoenyRecipt,
  handleAddCustomerClose,
}) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [invoiceGroup, setInvoiceGroup] = useState([]);
  const [invoiceSelect, setInvoiceSelect] = useState("");
  const [custSubdSelect, setCustSubdSelect] = useState(null);
  const [typeSupplier, setTypeSupplier] = useState("customer");
  const [success, setSuccess] = useState(false);
  const [searchType, setSearchType] = useState("customer");
  const [subdSelect, setSubdSelect] = useState(null);
  const [customerList, setCustomerList] = useState([]);
  const [subDealerList, setSubDealerList] = useState([]);
  const today = dayjs().format("YYYY-MM-DD");
  const greenBorderStyle = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "green" },
      "&:hover fieldset": { borderColor: "green" },
      "&.Mui-focused fieldset": { borderColor: "darkgreen" },
    },
    "& .MuiInputLabel-root": { color: "green" },
    "& .MuiInputLabel-root.Mui-focused": { color: "darkgreen" },
    "& .MuiSelect-root": {
      "& fieldset": { borderColor: "green" },
      "&:hover fieldset": { borderColor: "green" },
      "&.Mui-focused fieldset": { borderColor: "darkgreen" },
    },
    "& .MuiSelect-root.Mui-focused": { color: "darkgreen" },
  };

  const darkGreenBorderStyle = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "darkgreen" },
      "&:hover fieldset": { borderColor: "darkgreen" },
      "&.Mui-focused fieldset": { borderColor: "darkgreen" },
    },
    "& .MuiInputLabel-root": { color: "darkgreen" },
    "& .MuiInputLabel-root.Mui-focused": { color: "darkgreen" },
    "& .MuiSelect-root": {
      "& fieldset": { borderColor: "darkgreen" },
      "&:hover fieldset": { borderColor: "darkgreen" },
      "&.Mui-focused fieldset": { borderColor: "darkgreen" },
    },
    "& .MuiSelect-root.Mui-focused": { color: "darkgreen" },
  };

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      paymentDetails: {},
      NetPaidAmount: 0,
      NetDueAmount: 0,
      CheckedByID: signatoryDetails?.CheckedByList?.[0]?.ID || "",
      PreparedByID: signatoryDetails?.PreparedByList?.[0]?.ID || "",
      AuthorizedSignatoryByID:
        signatoryDetails?.AuthorizedSignatoryList?.[0]?.ID || "",
    },
  });
  console.log("invoiceSelect", invoiceSelect);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = methods;

  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;
  // ===================================================================================
  const queryClient = useQueryClient();

  const onSubmit = async (data) => {
    console.log(data.PaymentDetails);
    setLoading(true);
    try {
      const formattedData = {
        BillCode: "MRIS",
        ReceiptDate: dayjs(data.ReceiptDate).format("YYYY-MM-DD"), // Format date as YYYY-MM-DD
        RefReceiptNumber: invoiceSelect.ReceiptNumber,
        // ReceiptNumber: invoiceSelect.ReceiptID,
        RefReceiptID: invoiceSelect.ReceiptID,

        Source: "O",
        FullName: invoiceSelect.Name,
        CompanyName: invoiceSelect.CompanyName,
        MobileNumber: invoiceSelect.PhoneNumber1,
        Email: invoiceSelect.Email,
        Address: invoiceSelect.AddressLine1,
        GSTNo: invoiceSelect.GSTNumber,
        TotalAmountBD: invoiceSelect.TotalAmountBD,
        DiscountAmount: invoiceSelect.DiscountAmount,
        TotalAmountAD: invoiceSelect.TotalAmountAD,
        CGSTP: invoiceSelect.CGSTP,
        CGSTAmount: invoiceSelect.CGSTAmount,
        SGSTP: invoiceSelect.SGSTP,
        SGSTAmount: invoiceSelect.SGSTAmount,
        GrandTotalAmount: invoiceSelect.GrandTotalAmount,
        RoundOffAmount: invoiceSelect.RoundOffAmount,
        NetTotalAmount: invoiceSelect.NetTotalAmount,
        Remarks: data.remarks,
        CheckedByID: data.CheckedByID,
        PreparedByID: data.PreparedByID,
        AuthorizedSignatoryByID: data.AuthorizedSignatoryByID,
        PaymentDetails: data.PaymentDetails,
        Bill_BankName: invoiceSelect.Bill_BankName,
        Bill_AccountNumber: invoiceSelect.Bill_AccountNumber,
        Bill_IFSCCode: invoiceSelect.Bill_IFSCCode,
        Bill_BranchName: invoiceSelect.Bill_BranchName,
        Bill_CompanyName: invoiceSelect.Bill_CompanyName,
        CheckedByName: invoiceSelect.CheckedByName,
        PreparedByName: invoiceSelect.PreparedByName,
        AuthorizedSignatoryByName: invoiceSelect.AuthorizedSignatoryByName,
        NetPaidAmount: data.NetPaidAmount,
        NetTotalAmount: invoiceSelect?.GrandTotalAmount,
        NetDueAmount: data.NetDueAmount,
        ReceiptID: invoiceSelect.ReceiptID,
        PaymentType: invoiceSelect.PaymentType,
        DiscountDesc: invoiceSelect.DiscountDesc,
        DiscountUnit: invoiceSelect.DiscountUnit,
        PaymentStatus: invoiceSelect.PaymentStatus,
        EntityType: invoiceSelect.EntityType,
        EntityID: invoiceSelect.EntityID,
        BillEntityType: invoiceSelect.BillEntityType,
        BillEntityID: invoiceSelect.BillEntityID,
        ReceiptProductModelList: invoiceSelect.ReceiptProductModelList,
      };
      console.log("Formatted Data:", formattedData);
      console.log("formattedData", formattedData);
      const res = await axios.post(
        `${process.env.REACT_APP_URL}/api/moneyReceipt`,
        formattedData,
        {
          headers: {
            Authorization: sanctumToken,
          },
        }
      );
      console.log("aaaajjj", formattedData);
      console.log("PDF data:", res.data); // Add this line
      moneyReciptInvpdf(res.data);

      setLoading(false);
      setSuccess(true);
      fetchAllMoenyRecipt();
      handleAddCustomerClose();
      // ======================================

      const queryKeys = [
        ["dueGraphApi"],
        ["moneyReciptYearWiseGraphApi"],
        ["gstSalesGraphApi"],
        // ==========================================
        ["moneyReciptSalesGraphApi"],
        // ["purchaseTransuctionListApiFn"],
      ];

      const delay = 1500; // milliseconds delay between each query

      queryKeys.forEach((key, index) => {
        setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: key,
            refetchType: "active",
          });
        }, index * delay);
      });
    } catch (error) {
      console.error("Form submission error:", error);
      setLoading(false);
      setErr(true);
    }
  };
  // const fetchInvoice = async () => {
  //   setLoading(true);
  //   const url = `${process.env.REACT_APP_URL}/api/receipts?source=O&entityType=${typeSupplier === "customer" ? "CUST" : "SUBD"}`;

  //   try {
  //     const res = await axios.get(url, {
  //       headers: {
  //         Authorization: sanctumToken,
  //       },
  //     });
  //     setInvoiceGroup(res.data);
  //     console.log("Invoice group:", res.data);
  //   } catch (error) {
  //     console.error("Error fetching dealer list:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   fetchInvoice();
  //   if (custSubdSelect) {
  //     fetchInvoice();
  //   }
  // }, [custSubdSelect, typeSupplier]);
  // console.log(customerList);

  // --- Fetch customer/subdealer lists (purchase mode only) ---
  useEffect(() => {
    const fetchEntities = async (entityType) => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/api/getentitylistbasedonreceipt?source=O&entityType=${entityType}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: sanctumToken,
            },
          }
        );
        if (entityType === "CUST") setCustomerList(response.data);
        else if (entityType === "SUBD") setSubDealerList(response.data);
      } catch (error) {
        // handle error
      }
    };
    fetchEntities("CUST");
    fetchEntities("SUBD");
  }, []);

  // --- Fetch invoices when subdSelect or searchType changes ---
  useEffect(() => {
    const fetchInvoices = async () => {
      if (!subdSelect || !subdSelect.id) {
        setInvoiceGroup([]);
        setInvoiceSelect("");
        return;
      }
      // Map entity type as in CreateDamage
      let entityType = "";
      if (searchType === "customer") entityType = "CUST";
      else if (searchType === "subDealer") entityType = "SUBD";
      else entityType = "CUST"; // fallback

      const url = `${process.env.REACT_APP_URL}/api/getInvoiceDamageReturn?Source=O&BillCode=INVS&EntityID=${subdSelect.id}&EntityType=${entityType}`;
      setLoading(true);
      try {
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: sanctumToken,
          },
        });
        let data = response.data;
        // Defensive: handle if data is wrapped in .data
        if (data && Array.isArray(data.data)) data = data.data;
        if (!Array.isArray(data)) data = [];
        setInvoiceGroup(data);
        // Auto-select first invoice if available
        if (data.length > 0) setInvoiceSelect(data[0]);
        else setInvoiceSelect("");
        // Debug logs
        console.log("Invoice fetch URL:", url);
        console.log("Fetched invoices:", data);
      } catch (error) {
        setInvoiceGroup([]);
        setInvoiceSelect("");
        console.error("Error fetching invoices:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, [subdSelect, searchType, sanctumToken]);

  // --- Options for react-select ---
  const custOptions = customerList?.map((customer) => ({
    label: `${customer.Name}${
      customer.PhoneNumber1 ? ` - ${customer.PhoneNumber1}` : ""
    }`,
    id: customer.EntityID,
    name: customer.CustomerID,
  }));
  const subdOptions = subDealerList?.map((subd) => ({
    label: `${subd.Name}${subd.PhoneNumber1 ? ` - ${subd.PhoneNumber1}` : ""}`,
    id: subd.EntityID,
    name: subd.Name,
  }));

  return (
    <Box padding={2.5} sx={{ border: "2.2px solid green" }}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {/* --- Restore Receipt Date field --- */}
            <Grid item xs={12} sx={{ display: "flex", gap: 2, mb: 2 }}>
              <Box sx={{ width: "25%" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name="ReceiptDate"
                    control={control}
                    defaultValue={today}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="Receipt Date"
                        sx={{
                          backgroundColor: "white",
                          width: "100%",
                          ...greenBorderStyle,
                        }}
                        value={dayjs(field.value)}
                        onChange={(newValue) => {
                          // Ensure YYYY-MM-DD format for the form value
                          const formattedDate =
                            dayjs(newValue).format("YYYY-MM-DD");
                          field.onChange(formattedDate);
                        }}
                        // Display format remains DD-MM-YYYY
                        format="DD-MM-YYYY"
                      />
                    )}
                  />
                </LocalizationProvider>
                {errors.receiptDate && (
                  <FormHelperText sx={{ color: "red" }}>
                    {errors.receiptDate.message}
                  </FormHelperText>
                )}
              </Box>
              {/* --- New Customer/SubDealer/Invoice Selection UI --- */}
              <Box sx={{ width: "25%" }}>
                <FormControl fullWidth sx={darkGreenBorderStyle}>
                  <InputLabel sx={{ color: "darkgreen" }}>
                    Select Type
                  </InputLabel>
                  <Select
                    value={searchType}
                    label="Select Type"
                    onChange={(e) => {
                      setSearchType(e.target.value);
                      setSubdSelect(null);
                      setInvoiceSelect("");
                    }}
                    sx={{ backgroundColor: "white", ...darkGreenBorderStyle }}
                  >
                    <MenuItem value="customer">Customer</MenuItem>
                    <MenuItem value="subDealer">Sub Dealer</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ width: "35%" }}>
                <SelectComponent
                  value={subdSelect}
                  onChange={(selectedOption) => {
                    setSubdSelect(selectedOption);
                    setInvoiceSelect("");
                  }}
                  options={
                    searchType === "customer" ? custOptions : subdOptions
                  }
                  placeholder={`Search ${
                    searchType === "customer" ? "Customer" : "Sub Dealer"
                  }`}
                  isSearchable={true}
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: "#ffffff",
                      borderColor: "darkgreen",
                      boxShadow: "none",
                      height: "55px",
                      "&:hover": { borderColor: "darkgreen" },
                      "&.Mui-focused": { borderColor: "darkgreen" },
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: "#ffffff",
                      boxShadow: "0 2px 4px rgba(0,100,0,0.1)",
                      zIndex: 100,
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? "#4D795B" : "#ffffff",
                      color: state.isFocused ? "#fff" : "#2e7d32",
                      opacity: 1,
                      padding: "10px",
                      "&:hover": {
                        backgroundColor: "#1b5e20", // Changed to a deeper green
                        color: "#ffffff", // Changed text color to white for better contrast
                      },
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: "darkgreen",
                    }),
                  }}
                />
              </Box>
              <Box sx={{ width: "25%" }}>
                <FormControl fullWidth sx={darkGreenBorderStyle}>
                  <InputLabel sx={{ color: "darkgreen" }}>
                    Select Invoice
                  </InputLabel>
                  <Select
                    value={invoiceSelect}
                    label="Select Invoice"
                    onChange={(e) => setInvoiceSelect(e.target.value)}
                    sx={{ backgroundColor: "white", ...darkGreenBorderStyle }}
                  >
                    {invoiceGroup?.map((i, index) => (
                      <MenuItem key={index} value={i}>
                        {i.ReceiptNumber}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            {/* --- End new selection UI --- */}

            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "space-around",
                flexWrap: "wrap",
              }}
            >
              {custSubdSelect?.name && (
                <Grid item>
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AccountCircleRoundedIcon
                      sx={{ fontSize: { xs: 30 }, mr: 1 }}
                    />
                    {custSubdSelect.name}
                  </Typography>
                </Grid>
              )}
              {custSubdSelect?.MobileNo1 && (
                <Grid item>
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <DateRangeIcon sx={{ fontSize: { xs: 30 }, mr: 1 }} />
                    {custSubdSelect.MobileNo1}
                  </Typography>
                </Grid>
              )}
              {custSubdSelect?.bank && (
                <Grid item>
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CurrencyRupeeIcon sx={{ fontSize: { xs: 30 }, mr: 1 }} />
                    {custSubdSelect.bank}
                  </Typography>
                </Grid>
              )}
              {custSubdSelect?.company && (
                <Grid item>
                  <Typography
                    variant="body1"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ApartmentRoundedIcon
                      sx={{ fontSize: { xs: 30 }, mr: 1 }}
                    />
                    {custSubdSelect.company}
                  </Typography>
                </Grid>
              )}
            </Grid>
            {invoiceSelect && (
              <Grid container spacing={2} sx={{ mt: 0, ml: 1.5 }}>
                <Grid item xs={4} sx={{ textAlign: "center" }}>
                  <Typography variant="h6">
                    <span style={{ color: "green", fontWeight: "bold" }}>
                      Grand Total Amount:
                    </span>{" "}
                    {invoiceSelect?.GrandTotalAmount}
                  </Typography>
                  <Divider
                    sx={{
                      borderColor: "darkgreen",
                      width: "100%",
                      mb: 0.4,
                      mt: -0.2,
                    }}
                  />
                </Grid>
                <Grid item xs={4} sx={{ textAlign: "center" }}>
                  <Typography variant="h6">
                    <span style={{ color: "green", fontWeight: "bolder" }}>
                      Total Paid:
                    </span>{" "}
                    {invoiceSelect?.NetPaidAmount}
                  </Typography>
                  <Divider
                    sx={{
                      borderColor: "darkgreen",
                      width: "100%",
                      mb: 0.4,
                      mt: -0.2,
                    }}
                  />
                </Grid>
                <Grid item xs={4} sx={{ textAlign: "center" }}>
                  <Typography variant="h6">
                    <span style={{ color: "green", fontWeight: "bold" }}>
                      Total Due:
                    </span>{" "}
                    {invoiceSelect?.NetDueAmount}
                  </Typography>
                  <Divider
                    sx={{
                      borderColor: "darkgreen",
                      width: "100%",
                      mb: 0.4,
                      mt: -0.2,
                    }}
                  />
                </Grid>
              </Grid>
            )}
            <Grid item xs={12}></Grid>
            <Grid container spacing={2} sx={{ mt: 0, ml: 1 }}>
              <Box sx={{ float: "left" }}>
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: "left",
                    width: "100%",
                    mt: 0,
                    display: "flex",
                    alignItems: "center",
                    mb: 0,
                    fontWeight: "bold",
                  }}
                  gutterBottom
                >
                  <CurrencyRupeeRoundedIcon />
                  Payment section
                </Typography>
              </Box>
              <Box sx={{ width: "100%" }}>
                <MoneyReciptPaymentForm
                  paymentAll={allPaymentType}
                  finalAmount={getValues("grandTotalAmount")}
                  setValue={setValue}
                  sx={darkGreenBorderStyle}
                  invoiceSelect={invoiceSelect}
                  netDewAmt={invoiceSelect?.NetDueAmount}
                />
              </Box>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item>
                    <Controller
                      name="NetPaidAmount"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Total Amount"
                          sx={{
                            bgcolor: "white",
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": { borderColor: "darkgreen" },
                              "&:hover fieldset": { borderColor: "darkgreen" },
                              "&.Mui-focused fieldset": {
                                borderColor: "darkgreen",
                              },
                            },
                            "& .MuiInputLabel-root": { color: "darkgreen" },
                          }}
                          InputProps={{
                            readOnly: true,
                          }}
                          gutterBottom
                        />
                      )}
                    />
                  </Grid>
                  <Grid item>
                    <Controller
                      name="NetDueAmount"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Due Amount"
                          sx={{
                            bgcolor: "white",
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": { borderColor: "darkgreen" },
                              "&:hover fieldset": { borderColor: "darkgreen" },
                              "&.Mui-focused fieldset": {
                                borderColor: "darkgreen",
                              },
                            },
                            "& .MuiInputLabel-root": { color: "darkgreen" },
                          }}
                          InputProps={{
                            readOnly: true,
                          }}
                          gutterBottom
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Remarks"
                  sx={{
                    bgcolor: "white",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "darkgreen" },
                      "&:hover fieldset": { borderColor: "darkgreen" },
                      "&.Mui-focused fieldset": { borderColor: "darkgreen" },
                    },
                    "& .MuiInputLabel-root": { color: "darkgreen" },
                  }}
                  {...methods.register("remarks")}
                  gutterBottom
                />
              </Grid>

              <Grid item xs={4}>
                <FormControl
                  fullWidth
                  error={!!errors.CheckedByID}
                  sx={greenBorderStyle}
                >
                  <InputLabel sx={{ color: "green" }}>Checked By:</InputLabel>
                  <Controller
                    name="CheckedByID"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        sx={{ backgroundColor: "white", ...greenBorderStyle }}
                        label="Checked By:"
                        defaultValue={
                          signatoryDetails?.CheckedByList?.[0]?.ID || ""
                        }
                      >
                        {signatoryDetails?.CheckedByList?.map((item, index) => (
                          <MenuItem value={item.ID} key={index}>
                            {item.Name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />

                  {errors.CheckedByID && (
                    <FormHelperText sx={{ color: "red" }}>
                      {errors.CheckedByID.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl
                  fullWidth
                  error={!!errors.PreparedByID}
                  sx={greenBorderStyle}
                >
                  <InputLabel sx={{ color: "green" }}>Prepared By:</InputLabel>
                  <Controller
                    name="PreparedByID"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        sx={{ backgroundColor: "white", ...greenBorderStyle }}
                        label="Prepared By:"
                        defaultValue={
                          signatoryDetails?.PreparedByList?.[0]?.ID || ""
                        }
                      >
                        {signatoryDetails?.PreparedByList?.map(
                          (item, index) => (
                            <MenuItem value={item.ID} key={index}>
                              {item.Name}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    )}
                  />
                  {errors.PreparedByID && (
                    <FormHelperText sx={{ color: "red" }}>
                      {errors.PreparedByID.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl
                  fullWidth
                  error={!!errors.AuthorizedSignatoryByID}
                  sx={greenBorderStyle}
                >
                  <InputLabel sx={{ color: "green" }}>Authorize By:</InputLabel>
                  <Controller
                    name="AuthorizedSignatoryByID"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        sx={{ backgroundColor: "white", ...greenBorderStyle }}
                        label="Authorize By:"
                        defaultValue={
                          signatoryDetails?.AuthorizedSignatoryList?.[0]?.ID ||
                          ""
                        }
                      >
                        {signatoryDetails?.AuthorizedSignatoryList?.map(
                          (item, index) => (
                            <MenuItem value={item.ID} key={index}>
                              {item.Name}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    )}
                  />
                  {errors.AuthorizedSignatoryByID && (
                    <FormHelperText sx={{ color: "red" }}>
                      {errors.AuthorizedSignatoryByID.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Button
                variant="contained"
                type="submit"
                sx={{
                  height: "3rem",
                  textTransform: "none",
                  backgroundColor: "#4D795B",
                  display: "block",
                  mx: "auto",
                  mt: 1,
                }}
              >
                Generate Money Receipt
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert
          onClose={() => setSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Invoice generated successfully!
        </Alert>
      </Snackbar>
      <LoadingComp loading={loading} />
      <errorComp error={err} />
    </Box>
  );
}
