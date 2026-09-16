import React, { useCallback, useState } from "react";
import {
  useForm,
  useFieldArray,
  Controller,
  FormProvider,
} from "react-hook-form";
import {
  TextField,
  Button,
  Grid,
  Typography,
  IconButton,
  Box,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  FormHelperText,
  Stack,
} from "@mui/material";
import { Add, Delete as DeleteIcon } from "@mui/icons-material";
import _, { round } from "lodash";
import axios from "axios";
import {
  AccountCircleRounded as AccountCircleRoundedIcon,
  ApartmentRounded as ApartmentRoundedIcon,
  PostAddRounded as PostAddRoundedIcon,
  DateRange as DateRangeIcon,
  CurrencyRupeeRounded as CurrencyRupeeRoundedIcon,
} from "@mui/icons-material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  LocalizationProvider,
  DatePicker,
  DateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import LoadingComp from "../../../../../../components/loadingComp/LoadingComp";
import moneyReciptNoInvpdf from "../../MoneyReciptNoInvpdf";
import SelectCreate from "../../../SelectCreate";
import { PDFDownloadLink } from "@react-pdf/renderer";

const schema = Yup.object().shape({
  ReceiptDate: Yup.date().required("required"),
  CustomerID: Yup.mixed()
    .transform((val) => (val && typeof val === "object" ? val.value : val))
    .when("ShowCustomerFields", {
      is: false, // validation applies when ShowCustomerFields is false
      then: (schema) =>
        schema
          .required("CustomerID is required")
          .test(
            "is-string",
            "CustomerID must be a string",
            (val) => typeof val === "string" && val.trim() !== ""
          ),
      otherwise: (schema) => schema.nullable(),
    }),
  FirstName: Yup.string().when("ShowCustomerFields", {
    is: true, // validation applies when ShowCustomerFields is true
    then: (schema) => schema.required("required"),
    otherwise: (schema) => schema.nullable(),
  }),
  LastName: Yup.string().when("ShowCustomerFields", {
    is: true, // validation applies when ShowCustomerFields is true
    then: (schema) => schema.required("required"),
    otherwise: (schema) => schema.nullable(),
  }),
  MobileNumber: Yup.string().nullable(),
  MoneyReceiptGoodsDetails: Yup.array().of(
    Yup.object().shape({
      MedicineName: Yup.string().required("required"),
      Quantity: Yup.number()
        .required("required")
        .typeError("invalid")
        .min(1, "Quantity must be at least 1"),
      Strip: Yup.string().nullable(),
      Price: Yup.number().nullable(),
      ExpecteadDelivery: Yup.date().required("Expected Delivery required"),
      InDemand: Yup.string().required("required"),
    })
  ),
  CheckedByID: Yup.string().nullable(),
  PreparedByID: Yup.string().nullable(),
  AuthorizedSignatoryByID: Yup.string().nullable(),
  TotalAmountBD: Yup.number().typeError("Booking Amount must be a number"),
  BookingAmount: Yup.number().typeError("Booking Amount must be a number"),
  // .min(0, "Booking Amount must be at least 0"),
  DueAmount: Yup.number().typeError("Booking Amount must be a number"),
  // .min(0, "Booking Amount must be at least 0"),
  ExpecteadDelivery: Yup.date().required("Overall Delivery required"), // If used in main form
});

export default function OrderBookingCreateForm({
  allItems,
  signatoryDetails,
  allCompanyList,
  allPaymentType,
  fetchAllMoenyRecipt,
  handleAddCustomerClose,
  customerList, // Receive customer list
}) {
  // console.log("customerList", customerList);

  const customerOptions =
    customerList?.map((item) => ({
      value: item.CustomerID, // value is string
      label:
        item.FirstName + " " + item.LastName + " (" + item.MobileNumber + ")",
    })) || [];
  console.log("customerList", customerList);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [rowsToAdd, setRowsToAdd] = useState(1);
  const [showCustomerFields, setShowCustomerFields] = useState(false); // State to toggle visibility
  const today = dayjs().format("YYYY-MM-DD");
  const [pdfData, setPdfData] = useState(null);
  const [pdfReady, setPdfReady] = useState(false);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      CustomerID: "",
      FirstName: "",
      LastName: "",
      MobileNumber: "",
      MoneyReceiptGoodsDetails: [
        {
          MedicineName: "",
          Quantity: 1,
          Strip: "Piece",
          Price: "", // <-- Make Price default to empty string
          TotalAmount: 0,
        },
      ],
      CheckedByID: signatoryDetails?.CheckedByList?.[0]?.ID || "",
      PreparedByID: signatoryDetails?.PreparedByList?.[0]?.ID || "",
      AuthorizedSignatoryByID:
        signatoryDetails?.AuthorizedSignatoryList?.[0]?.ID || "",
      TotalAmountBD: 0, // <-- Ensure default
      BookingAmount: 0, // <-- Ensure default
      DueAmount: 0, // <-- Ensure default
      ShowCustomerFields: false, // <-- Add this line
    },
  });

  console.log("customerID", methods.getValues("CustomerID")?.value);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    // watch, // REMOVE watch
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "MoneyReceiptGoodsDetails",
  });

  // REMOVE: Watch BookingAmount and MoneyReceiptGoodsDetails for recalculation
  // const bookingAmount = watch("BookingAmount");
  // const moneyReceiptGoodsDetails = watch("MoneyReceiptGoodsDetails");
  // const customerIDValue = watch("CustomerID");

  // Use watch only for CustomerID (for conditional rendering)
  const customerIDValue = methods.watch("CustomerID");

  // REMOVE: useEffect for recalculation
  // React.useEffect(() => {
  //   moneyReceiptGoodsDetails?.forEach((item, idx) => {
  //     const itemTotal = (Number(item.Price) || 0) * (Number(item.Quantity) || 0);
  //     setValue(`MoneyReceiptGoodsDetails.${idx}.TotalAmount`, round(itemTotal, 2));
  //   });
  //   const totalResult = moneyReceiptGoodsDetails?.reduce((acc, item) => {
  //     return acc + (Number(item.Price) || 0) * (Number(item.Quantity) || 0);
  //   }, 0);
  //   setValue("TotalAmountBD", round(totalResult, 2));
  //   setValue("DueAmount", round((totalResult || 0) - (Number(bookingAmount) || 0), 2));
  // }, [moneyReceiptGoodsDetails, bookingAmount, setValue]);

  // Hide customer fields if a customer is selected
  React.useEffect(() => {
    if (customerIDValue && customerIDValue.value) {
      // setShowCustomerFields(false);
    }
  }, [customerIDValue]);

  // Recalculate totals only when relevant fields change
  const updateResult = useCallback(
    (index) => {
      const row = getValues(`MoneyReceiptGoodsDetails.${index}`);
      if (!row) return;
      const { Price, Quantity } = row;
      const baseResult = (Number(Price) || 0) * (Number(Quantity) || 0);
      setValue(
        `MoneyReceiptGoodsDetails.${index}.TotalAmount`,
        round(baseResult, 2)
      );
      // Immediately update overall total amount
      const allItems = getValues("MoneyReceiptGoodsDetails");
      const totalResult = allItems?.reduce((acc, item) => {
        return acc + (Number(item.Price) || 0) * (Number(item.Quantity) || 0);
      }, 0);
      setValue("TotalAmountBD", round(totalResult, 2));
      setValue(
        "DueAmount",
        round((totalResult || 0) - (Number(getValues("BookingAmount")) || 0), 2)
      );
    },
    [getValues, setValue]
  );

  // New handler for BookingAmount change
  const handleBookingAmountChange = (field) => (e) => {
    const val = e.target.value;
    field.onChange(val === "" ? "" : Number(val));
    // recalculate DueAmount only
    const totalResult = getValues("TotalAmountBD");
    setValue(
      "DueAmount",
      round((Number(totalResult) || 0) - (Number(val) || 0), 2)
    );
  };

  const removeFn = (index) => {
    remove(index);
  };

  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

  const onSubmit = async (data) => {
    console.log("Form submitted, data:", data); // Debug: confirm submit
    setLoading(true);
    console.log("Submitting data:", data);
    try {
      const formattedData = {
        EntityID: data.CustomerID || null, // <-- Only the ID string

        EntityType: "CUST",
        FirstName: data.FirstName,
        LastName: data.LastName,
        MobileNumber: data.MobileNumber,
        RequestOrderDate: data.ReceiptDate
          ? dayjs(data.ReceiptDate).format("YYYY-MM-DD HH:mm:ss")
          : null,
        AdvanceAmount: Number(data.BookingAmount) || 0,
        ApproxBillAmount: Number(data.TotalAmountBD) || 0,
        DueAmount: Number(data.DueAmount) || 0,
        OverallDeliveryDateTime: data.ExpecteadDelivery
          ? dayjs(data.ExpecteadDelivery).format("YYYY-MM-DD HH:mm:ss")
          : null,
        CheckedByID: data.CheckedByID ? Number(data.CheckedByID) : null,
        PreparedByID: data.PreparedByID ? Number(data.PreparedByID) : null,
        AuthorizedSignatoryByID: data.AuthorizedSignatoryByID
          ? Number(data.AuthorizedSignatoryByID)
          : null,
        Remarks: data.remarks, // <-- Added Remarks here
        ProductOrderDetails: (data.MoneyReceiptGoodsDetails || []).map(
          (item) => ({
            ModelNumber: item.MedicineName,
            Quantity: Number(item.Quantity) || 0,
            Price: Number(item.Price) || 0,
            Total: Number(item.TotalAmount) || 0,
            InDemand: item.InDemand ? Number(item.InDemand) : null,
            ExpectedDeliveryDateTime: item.ExpecteadDelivery
              ? dayjs(item.ExpecteadDelivery).format("YYYY-MM-DD HH:mm:ss")
              : null,
          })
        ),
      };

      console.log("Formatted Data:", formattedData);
      const res = await axios.post(
        `${process.env.REACT_APP_URL}/api/insertRequestOrder`,
        formattedData,
        {
          headers: {
            Authorization: sanctumToken,
          },
        }
      );

      console.log("Response:", res.data);
      setLoading(false);
      if (
        res.data?.success &&
        Array.isArray(res.data?.data) &&
        res.data.data.length > 0
      ) {
        setPdfData(res.data.data[0]);
        setPdfReady(true);
      }
      fetchAllMoenyRecipt();
      handleAddCustomerClose();
    } catch (error) {
      console.error("Form submission error:", error);
      setLoading(false);
      setErr(true);
    }
  };

  const getColorByValue = (value) => {
    switch (value) {
      case "1":
        return "green";
      case "2":
        return "orange";
      case "3":
        return "red";
      case "4":
        return "blue";
      default:
        return "green"; // default color
    }
  };

  const toggleCustomerFields = () => {
    setShowCustomerFields(true); // Show fields for new customer
    setValue("ShowCustomerFields", true); // Sync with form state for Yup
    setValue("CustomerID", null);
  };

  return (
    <Box padding={5}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {" "}
            {/* Changed base spacing to 3 */}
            {/* Receipt Date Section */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
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
                            width: "100%", // Changed from fixed width
                          }}
                          value={dayjs(field.value)}
                          onChange={(newValue) => {
                            const formattedDate =
                              dayjs(newValue).format("YYYY-MM-DD");
                            field.onChange(formattedDate);
                          }}
                          format="DD-MM-YYYY"
                        />
                      )}
                    />
                  </LocalizationProvider>
                  {errors.ReceiptDate && (
                    <FormHelperText sx={{ color: "red" }}>
                      {errors.ReceiptDate.message}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={4}>
                  <SelectCreate
                    control={control}
                    options={customerOptions}
                    onCreateFn={toggleCustomerFields}
                    name="CustomerID"
                    label="SelectCustomer "
                  />
                  {errors.CustomerID && (
                    <FormHelperText sx={{ color: "red" }}>
                      {errors.CustomerID.message}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>
            </Grid>
            {/* Customer Details Section */}
            {showCustomerFields && !customerIDValue?.value && (
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="FirstName"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField {...field} label="First Name" fullWidth />
                      )}
                    />
                    {errors.FirstName && (
                      <FormHelperText sx={{ color: "red" }}>
                        {errors.FirstName.message}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="LastName"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField {...field} label="Last Name" fullWidth />
                      )}
                    />
                    {errors.LastName && (
                      <FormHelperText sx={{ color: "red" }}>
                        {errors.LastName.message}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="MobileNumber"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField {...field} label="Mobile Number" fullWidth />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
            )}
            {/* Item Details Header */}
            <Grid item xs={12}>
              <Typography
                variant="h6"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <PostAddRoundedIcon /> Item Details:
              </Typography>
            </Grid>
            {/* Item Details List */}
            <Grid item xs={12}>
              <Grid
                container
                spacing={2}
                sx={{
                  margin: "0",
                  padding: "0",
                  alignItems: "center",
                }}
              >
                {fields.map((field, index) => (
                  <Stack
                    direction="row"
                    key={field.id}
                    sx={{
                      width: "100%",
                      justifyContent: "space-evenly",
                      rowGap: 5,
                      mb: 2,
                    }}
                  >
                    <p>{index + 1}.</p>
                    <Grid item xs={7} sm={2.5}>
                      <Controller
                        name={`MoneyReceiptGoodsDetails.${index}.MedicineName`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Medicine Name"
                            fullWidth
                            sx={{
                              background: "white",
                            }}
                            error={
                              !!errors.MoneyReceiptGoodsDetails?.[index]
                                ?.MedicineName
                            }
                            helperText={
                              errors.MoneyReceiptGoodsDetails?.[index]
                                ?.MedicineName?.message
                            }
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={5} sm={1}>
                      <Controller
                        name={`MoneyReceiptGoodsDetails.${index}.Quantity`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Quantity"
                            type="number"
                            sx={{
                              background: "white",
                            }}
                            error={
                              !!errors.MoneyReceiptGoodsDetails?.[index]
                                ?.Quantity
                            }
                            helperText={
                              errors.MoneyReceiptGoodsDetails?.[index]?.Quantity
                                ?.message
                            }
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              updateResult(index); // Only recalc for this row
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={5} sm={1}>
                      <Controller
                        name={`MoneyReceiptGoodsDetails.${index}.Price`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Price"
                            type="number"
                            sx={{
                              background: "white",
                            }}
                            value={field.value === null ? "" : field.value}
                            onChange={(e) => {
                              const val = e.target.value;
                              field.onChange(val === "" ? "" : Number(val));
                              updateResult(index); // Only recalc for this row
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={5} sm={1}>
                      <Controller
                        name={`MoneyReceiptGoodsDetails.${index}.TotalAmount`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            sx={{
                              background: "white",
                            }}
                            label="Total"
                            variant="outlined"
                            // size="small"
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={5} sm={2.6}>
                      <Controller
                        name={`MoneyReceiptGoodsDetails.${index}.ExpecteadDelivery`}
                        control={control}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                              {...field}
                              label="Expectead Delivery"
                              format="DD-MM-YYYY hh-mm-a" // <-- custom format here
                              sx={{
                                background: "white",
                              }}
                              onChange={(newValue) => {
                                field.onChange(newValue);
                              }}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      {errors.MoneyReceiptGoodsDetails?.[index]
                        ?.ExpecteadDelivery && (
                        <FormHelperText sx={{ color: "red" }}>
                          {
                            errors.MoneyReceiptGoodsDetails?.[index]
                              ?.ExpecteadDelivery?.message
                          }
                        </FormHelperText>
                      )}
                    </Grid>
                    <Grid item xs={5} sm={1.7}>
                      <Controller
                        name={`MoneyReceiptGoodsDetails.${index}.InDemand`}
                        control={control}
                        render={({ field }) => (
                          <FormControl
                            fullWidth
                            error={
                              !!errors.MoneyReceiptGoodsDetails?.[index]
                                ?.InDemand
                            }
                          >
                            <InputLabel
                              sx={{ color: getColorByValue(field.value) }}
                            >
                              In Demand
                            </InputLabel>
                            <Select
                              {...field}
                              label="In Demand"
                              sx={{
                                background: "white",
                                color: getColorByValue(field.value),
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor: getColorByValue(field.value),
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                  borderColor: getColorByValue(field.value),
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
                                    borderColor: getColorByValue(field.value),
                                  },
                              }}
                            >
                              <MenuItem value="1" sx={{ color: "green" }}>
                                High Demand
                              </MenuItem>
                              <MenuItem value="2" sx={{ color: "Orange" }}>
                                Mid Demand
                              </MenuItem>
                              <MenuItem value="3" sx={{ color: "red" }}>
                                Low Demand
                              </MenuItem>
                              <MenuItem value="4" sx={{ color: "blue" }}>
                                Rare Demand
                              </MenuItem>
                            </Select>
                            {errors.MoneyReceiptGoodsDetails?.[index]
                              ?.InDemand && (
                              <FormHelperText sx={{ color: "red" }}>
                                {
                                  errors.MoneyReceiptGoodsDetails?.[index]
                                    ?.InDemand?.message
                                }
                              </FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />
                    </Grid>

                    <IconButton
                      color="error"
                      onClick={() => {
                        removeFn(index);
                      }}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        // mt: 1,
                      }}
                    >
                      <DeleteIcon style={{ color: "red" }} />
                    </IconButton>
                  </Stack>
                ))}
              </Grid>
            </Grid>
            {/* Add Items Button */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%",
                  // gap: 2,
                  // mt: 2,
                }}
              >
                <FormControl variant="standard" sx={{ minWidth: 15 }}>
                  <InputLabel id="rows-to-add-label">Rows</InputLabel>
                  <Select
                    labelId="rows-to-add-label"
                    value={rowsToAdd}
                    onChange={(e) => setRowsToAdd(e.target.value)}
                    label="Rows"
                    sx={{ backgroundColor: "white" }}
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="text"
                  onClick={() => {
                    for (let i = 0; i < rowsToAdd; i++) {
                      append({
                        MedicineName: "",
                        Quantity: 1,
                        Strip: "",
                        Price: 0,
                        TotalAmount: 0,
                      });
                    }
                  }}
                  sx={{
                    borderRadius: "20px",
                    height: "3rem",
                    color: "blue",
                    borderColor: "Darkblue",
                  }}
                  startIcon={<Add />}
                >
                  Items
                </Button>
              </Box>
            </Grid>
            {/* Amount Summary Section */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <Controller
                    name="TotalAmountBD"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Total Amount"
                        fullWidth
                        InputProps={{ readOnly: true }}
                        value={field.value || 0}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Controller
                    name="BookingAmount"
                    control={control}
                    defaultValue={0}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Booking Amount"
                        fullWidth
                        type="number"
                        onChange={handleBookingAmountChange(field)}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Controller
                    name="DueAmount"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Due Amount"
                        fullWidth
                        InputProps={{ readOnly: true }}
                        value={field.value || 0}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={5} sm={3}>
                  <Controller
                    name={`ExpecteadDelivery`}
                    control={control}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                          {...field}
                          label="Expectead Delivery"
                          format="DD-MM-YYYY hh-mm-a" // <-- custom format here
                          sx={{
                            background: "white",
                          }}
                          onChange={(newValue) => {
                            field.onChange(newValue);
                          }}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  {errors.ExpecteadDelivery && (
                    <FormHelperText sx={{ color: "red" }}>
                      {errors.ExpecteadDelivery.message}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>
            </Grid>
            {/* Remarks Section */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Remarks"
                {...methods.register("remarks")}
              />
            </Grid>
            {/* Signatory Section */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <FormControl fullWidth error={!!errors.CheckedByID}>
                    <InputLabel sx={{ color: "green" }}>Checked By:</InputLabel>
                    <Controller
                      name="CheckedByID"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          sx={{ backgroundColor: "white" }}
                          label="Checked By:"
                          defaultValue={
                            signatoryDetails?.CheckedByList?.[0]?.ID || ""
                          }
                        >
                          {signatoryDetails?.CheckedByList?.map(
                            (item, index) => (
                              <MenuItem value={item.ID} key={index}>
                                {item.Name}
                              </MenuItem>
                            )
                          )}
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
                  <FormControl fullWidth error={!!errors.PreparedByID}>
                    <InputLabel sx={{ color: "green" }}>
                      Prepared By:
                    </InputLabel>
                    <Controller
                      name="PreparedByID"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          sx={{ backgroundColor: "white" }}
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
                  >
                    <InputLabel sx={{ color: "green" }}>
                      Authorize By:
                    </InputLabel>
                    <Controller
                      name="AuthorizedSignatoryByID"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          sx={{ backgroundColor: "white" }}
                          label="Authorize By:"
                          defaultValue={
                            signatoryDetails?.AuthorizedSignatoryList?.[0]
                              ?.ID || ""
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
              </Grid>
            </Grid>
            {/* Submit Button Section */}
            <Grid item xs={12} sx={{ textAlign: "center", mt: 2 }}>
              <Button
                variant="contained"
                type="submit"
                sx={{
                  height: "3rem",
                  textTransform: "none",
                  backgroundColor: "#4D795B",
                }}
              >
                Requst Order
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
      <LoadingComp loading={loading} />
      {/* PDF Download Link (auto-trigger) */}
      {pdfReady && pdfData && (
        <PDFDownloadLink
          document={moneyReciptNoInvpdf(pdfData)}
          fileName="money-receipt.pdf"
          style={{ display: "none" }}
        >
          {({ blob, url, loading, error }) => {
            if (url && !loading) {
              setPdfReady(false); // Reset after download
              window.open(url, "_blank");
            }
            return null;
          }}
        </PDFDownloadLink>
      )}
    </Box>
  );
}
