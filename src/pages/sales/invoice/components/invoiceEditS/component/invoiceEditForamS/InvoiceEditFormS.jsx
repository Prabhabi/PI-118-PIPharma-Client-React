import React, { useRef, useState, useCallback } from "react";
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
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Add,
  Delete as DeleteIcon,
  ReceiptLong as ReceiptLongIcon,
} from "@mui/icons-material";
import SelectComponent from "react-select";
import { CurrencyRupeeRounded as CurrencyRupeeRoundedIcon } from "@mui/icons-material";

import dayjs from "dayjs";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import PostAddRoundedIcon from "@mui/icons-material/Add";
import _, { result, round } from "lodash";
import axios, { all } from "axios";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import InvoiceEditPaymentFormS from "./component/InvoiceEditPaymentFormS";
import LoadingComp from "../../../../../../../components/loadingComp/LoadingComp";
import Cookies from "js-cookie";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function InvoiceEditFormS({
  allItems,
  allHsn,
  dummyQuotation,
  signatoryDetails,
  invoiceDetails,
  allPaymentType,
  fetchAllInvoice,
  handleClose,
}) {
  // console.log(invoiceDetails);
  const [customerSelect, setCustomerSelect] = useState([]);
  const [paymentInformation, setPaymentInformation] = useState({});

  // const [itemSelect, setItemSelect] = useState([]);
  // const [finalAmount, setFinalAmount] = useState(0);
  const paymentIsValid = useRef(false);
  const [, forceRender] = useState(false);
  // const [rowTotal, setRowTotal] = useState([]);
  const [loading, setLoading] = useState(false);
  const [receiptDate, setReceiptDate] = useState(dayjs().format("YYYY-MM-DD"));
  // const [customerList, setCustomerList] = useState([]);
  // const [subDealerList, setSubDealerList] = useState([]);
  const [typeSupplier, setTypeSupplier] = useState("customer");
  const [quoSection, setQuoSection] = useState(true);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  // const [calculateTrigger, setCalculateTrigger] = useState(false);
  // const [signatorySelect, setSignetorySelect] = useState({
  //   CheckedByID: null,
  //   PreparedByID: null,
  //   AuthorizedSignatoryByID: null,
  // });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const handleDateChange = (newValue) => {
    setReceiptDate(dayjs(newValue).format("YYYY-MM-DD")); // Format date as "YYYY-MM-DD"
  };

  const schema = Yup.object().shape({
    items: Yup.array().of(
      Yup.object().shape({
        id: Yup.string().required("Select Product"),
        HSNMasterID: Yup.string().required("required"),
        Quantity: Yup.number()
          .typeError("Not valid")
          .required("Quantity is required")
          .min(1, "Minimum quantity is 1"),
        UnitQuantity: Yup.string().required("required"),
        Price: Yup.number()
          .typeError("Not valid")
          .required("required")
          .min(0, "Min 0"),
        discount: Yup.number()
          .typeError("Not valid")
          .required("required")
          .min(0, "Min 0"),
      })
    ),
    discountDesc: Yup.string().required("Discount Description is required"),
    SGSTP: Yup.number()
      .required("SGST Percentage is required")
      .min(0, "Minimum SGST is 0"),
    CGSTP: Yup.number()
      .required("CGST Percentage is required")
      .min(0, "Minimum CGST is 0"),
    discount: Yup.number()
      .required("Discount is required")
      .min(0, "Minimum discount is 0"),
    roundUpAmount: Yup.number(),
    // company: Yup.string().required("Company is required"),
    checkedBy: Yup.string().required("Checked By is required"),
    preparedBy: Yup.string().required("Prepared By is required"),
    authorizeBy: Yup.string().required("Authorize By is required"),
    // receiptDate: Yup.date()
    //   .required("Receipt Date is required")
    //   .typeError("Invalid date"),
  });
  const item = Array.isArray(invoiceDetails?.ReceiptProductModelList)
    ? invoiceDetails?.ReceiptProductModelList
    : JSON.parse(invoiceDetails?.ReceiptProductModelList || "[]");
  console.log(item);

  // =======================================use form ===========================

  const methods = useForm({
    resolver: yupResolver(schema),
    shouldUnregister: true,
    defaultValues: {
      paymentDetails: invoiceDetails?.PaymentDetails
        ? JSON.parse(invoiceDetails.PaymentDetails)
        : [],
      receiptDate: invoiceDetails?.ReceiptDate
        ? dayjs(invoiceDetails.ReceiptDate).format("YYYY-MM-DD")
        : dayjs().format("YYYY-MM-DD"),
      items: item.map((it) => ({
        receiptDate: it.ReceiptDate,
        id: it.ProductModelID,
        value: it.ProductModelID, // Add this line
        label: `${it.BrandName} ${it.ModelNumber}`,
        Quantity: Number(it.Quantity),
        UnitQuantity: it.UnitQuantity,
        Rate: Number(it.Rate),
        Price: Number(it.Rate),
        Amount: Number(it.Amount),
        discount: Number(it.DISP),
        result: Number(it.Amount),
        HSNMasterID: it.HSNMasterID || allHsn?.[0]?.ID || "",
        BrandMasterID: it.BrandMasterID,
        ColorMasterID: it.ColorMasterID,
        BrandName: it.BrandName,
        ModelNumber: it.ModelNumber,
        // Add other fields as needed from it
      })),
      discount: Number(invoiceDetails?.Discount) || 0,
      discountDesc: invoiceDetails?.DiscountDesc || "",
      roundUpAmount: Number(invoiceDetails?.RoundOffAmount) || 0,
      totalAmountBD: Number(invoiceDetails?.TotalAmountBD) || 0,
      totalAmountAD: Number(invoiceDetails?.TotalAmountAD) || 0,
      sgstValue: Number(invoiceDetails?.SGSTAmount) || 0,
      cgstValue: Number(invoiceDetails?.CGSTAmount) || 0,
      grandTotalAmount: Number(invoiceDetails?.GrandTotalAmount) || 0,
      SGSTP: Number(invoiceDetails?.SGSTP) || 9,
      CGSTP: Number(invoiceDetails?.CGSTP) || 9,
      remarks: invoiceDetails?.Remarks || "",
      checkedBy:
        invoiceDetails?.CheckedByID ||
        signatoryDetails?.CheckedByList?.[0]?.ID ||
        "",
      preparedBy:
        invoiceDetails?.PreparedByID ||
        signatoryDetails?.PreparedByList?.[0]?.ID ||
        "",
      authorizeBy:
        invoiceDetails?.AuthorizedSignatoryByID ||
        signatoryDetails?.AuthorizedSignatoryList?.[0]?.ID ||
        "",
      // Add other fields as needed
    },
    mode: "onSubmit",
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    getValues,
    trigger,
    watch,
  } = methods;

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const redBorderStyle = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#1b5e20",
      },
      "&:hover fieldset": {
        borderColor: "#1b5e20",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#1b5e20",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#1b5e20",
      "&.Mui-focused": {
        color: "#1b5e20",
      },
    },
    "& .MuiFormControlLabel-root": {
      color: "#1b5e20",
    },
    "& .MuiSelect-root": {
      "& fieldset": {
        borderColor: "#1b5e20",
      },
      "&:hover fieldset": {
        borderColor: "#1b5e20",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#1b5e20",
      },
    },
    "& .MuiRadio-root": {
      color: "#1b5e20",
      "&.Mui-checked": {
        color: "#1b5e20",
      },
    },
    "& .MuiCheckbox-root": {
      color: "#1b5e20",
      "&.Mui-checked": {
        color: "#1b5e20",
      },
    },
  };
  // ==================================validate payment and disable submit ====================
  // const paymentsDetails = watch("paymentsDetails");

  // useEffect(() => {
  //   console.log(paymentsDetails);
  // }, [paymentsDetails]);

  // ======================================== update result =========================
  const updateResult = useCallback(
    _.debounce((index) => {
      const row = getValues(`items.${index}`);
      if (!row) return; // Return early if row is undefined
      const { Price, Quantity, discount } = row;

      // Calculate base result
      const baseResult = (Number(Price) || 0) * (Number(Quantity) || 0);

      const finalResult =
        baseResult - (baseResult * (Number(discount) || 0)) / 100;

      setValue(`items.${index}.result`, round(finalResult, 2));

      // Calculate total result of all items
      const items = getValues("items");
      const totalResult = items?.reduce((acc, item) => {
        const itemResult =
          (Number(item.Price) || 0) * (Number(item.Quantity) || 0) -
          ((Number(item.Price) || 0) *
            (Number(item.Quantity) || 0) *
            (Number(item.discount) || 0)) /
            100;
        return acc + itemResult;
      }, 0);
      const totalAmountBd = round(totalResult, 2);
      setValue("totalAmountBD", totalAmountBd);

      // Calculate discount value based on total result
      const discountPercentage = getValues("discount");
      const discountValue = round(
        (totalResult * Number(discountPercentage)) / 100,
        2
      );
      setValue("discountValue", discountValue);
      const totalAmountAD = round(totalAmountBd - discountValue, 2);
      setValue("totalAmountAD", totalAmountAD);

      const sgstp = getValues("SGSTP");
      const cgstp = getValues("CGSTP");
      const sgstValue = round((totalAmountAD * sgstp) / 100, 2);
      const cgstValue = round((totalAmountAD * cgstp) / 100, 2);
      setValue("sgstValue", sgstValue);
      setValue("cgstValue", cgstValue);
      const roundupamount = getValues("roundUpAmount");
      let grandTotalAmount =
        totalAmountAD + sgstValue + cgstValue - roundupamount;

      // Round off grandTotalAmount
      const decimalPart = grandTotalAmount - Math.floor(grandTotalAmount);
      if (decimalPart >= 0.5) {
        grandTotalAmount = Math.ceil(grandTotalAmount);
      } else {
        grandTotalAmount = Math.floor(grandTotalAmount);
      }
      setValue("grandTotalAmount", grandTotalAmount);
      setValue(
        "roundUpAmount",
        round(grandTotalAmount - (totalAmountAD + sgstValue + cgstValue), 2)
      );
    }, 300),
    [getValues, setValue]
  );
  // =================================================update grand result ===========================

  const updateGrandResult = _.debounce(() => {
    const items = getValues("items");

    const totalResult = items?.reduce((acc, item) => {
      const itemResult =
        (Number(item.Price) || 0) * (Number(item.Quantity) || 0) -
        ((Number(item.Price) || 0) *
          (Number(item.Quantity) || 0) *
          (Number(item.discount) || 0)) /
          100;
      return acc + itemResult;
    }, 0);
    const totalAmountBd = round(totalResult, 2);
    // Calculate discount value based on total result
    const discountPercentage = getValues("discount");
    const discountValue = round(
      (totalAmountBd * Number(discountPercentage)) / 100,
      2
    );
    setValue("totalAmountBD", totalAmountBd);

    setValue("discountValue", discountValue);
    const totalAmountAD = round(totalAmountBd - discountValue, 2);

    setValue("totalAmountAD", totalAmountAD);
    const sgstp = getValues("SGSTP");
    const cgstp = getValues("CGSTP");
    const sgstValue = round((totalAmountAD * sgstp) / 100, 2);
    const cgstValue = round((totalAmountAD * cgstp) / 100, 2);
    setValue("sgstValue", sgstValue);
    setValue("cgstValue", cgstValue);
    const roundupamount = getValues("roundUpAmount");
    let grandTotalAmount =
      totalAmountAD + sgstValue + cgstValue - roundupamount;

    // Round off grandTotalAmount
    const decimalPart = grandTotalAmount - Math.floor(grandTotalAmount);
    if (decimalPart >= 0.5) {
      grandTotalAmount = Math.ceil(grandTotalAmount);
    } else {
      grandTotalAmount = Math.floor(grandTotalAmount);
    }
    setValue("grandTotalAmount", grandTotalAmount);
    setValue(
      "roundUpAmount",
      round(grandTotalAmount - (totalAmountAD + sgstValue + cgstValue), 2)
    );
  }, 300);

  // ==================================fetxh customer, supplier, subdealer=======================

  const handleOpenAddDialog = () => setAddDialogOpen(true);
  const handleCloseAddDialog = () => setAddDialogOpen(false);

  const handlePaymentValidation = (isValid) => {
    if (paymentIsValid.current !== isValid) {
      paymentIsValid.current = isValid;
      forceRender((prev) => !prev);
    }
  };
  const getPaymentDataFn = (value) => {
    setPaymentInformation(value);
  };
  // ============================================ submit ==================================
  const token = Cookies.get("token"); // Get token from cookies

  const onSubmit = async (data) => {
    setLoading(true);
    const totalAmountPaid = data?.paymentsDetails?.reduce((acc, payment) => {
      return acc + Number(payment.Amount);
    }, 0);

    const formattedData = {
      ReceiptID: invoiceDetails?.ReceiptID || null,
      BillCode: "INVS",
      ReceiptDate: receiptDate,
      PaymentType: data.PaymentType || "F",
      Source: "W",
      TotalAmountBD: data.totalAmountBD,
      DiscountDesc: data.discountDesc,
      DiscountUnit: "P",
      Discount: Number(data.discount),
      DiscountAmount: data.discountValue || 0,
      TotalAmountAD: data.totalAmountAD,
      CGSTP: data.CGSTP,
      CGSTAmount: data.cgstValue,
      SGSTP: data.SGSTP,
      SGSTAmount: data.sgstValue,
      GrandTotalAmount: data.grandTotalAmount,
      RoundOffAmount: data.roundUpAmount || 0,
      NetTotalAmount:
        Number(data.totalAmountAD) +
        Number(data.cgstValue) +
        Number(data.sgstValue),
      NetPaidAmount: totalAmountPaid || 0,
      NetDueAmount: data.grandTotalAmount - (totalAmountPaid || 0),
      Remarks: data.remarks || "",
      ExpectedDueDate: null,
      PaymentStatus:
        totalAmountPaid >= data.grandTotalAmount ? "Paid" : "Partial Due",
      EntityType: invoiceDetails.EntityType,
      EntityID: invoiceDetails?.EntityID,
      BillEntityType: "COMP",
      BillEntityID: invoiceDetails.BillEntityID,
      QuotationBookingMasterId: invoiceDetails.QuotationBookingMasterId || null,
      QuotationNo: invoiceDetails.QuotationNo || null,
      CheckedByID: data.checkedBy || signatoryDetails?.CheckedByList[0]?.ID,
      PreparedByID: data.preparedBy || signatoryDetails?.PreparedByList[0]?.ID,
      AuthorizedSignatoryByID:
        data.authorizeBy || signatoryDetails?.AuthorizedSignatoryList[0]?.ID,
      ReceiptProductModelList: data.items.map((item) => ({
        ProductModelID: item.id,
        HSNMasterID: item.HSNMasterID,
        BrandMasterID: item.BrandMasterID,
        GSTP: Number(watch("CGSTP")),
        Quantity: item.Quantity,
        Rate: item.Price,
        DISP: item.discount,
        Amount: item.result,
        UnitQuantity: item.UnitQuantity,
        ColorMasterID: item.ColorMasterID || null, // Ensure null is explicitly set
        QtyPerBox: null, // Explicitly set null
        ProductModelStatus: "N",
      })),
      PaymentDetails: data?.paymentsDetails?.map((payment) => ({
        PaymentModeID: payment.PaymentModeID,
        PaymentModeDesc: payment.PaymentModeDesc || "",
        Amount: payment.Amount,
        PaymentDate: payment.PaymentDate || new Date().toISOString(),
        transactionNumber: payment.transactionNumber || "",
      })),
    };

    console.log(formattedData);

    const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

    try {
      const res = await axios.put(
        `${process.env.REACT_APP_URL}/api/putreceipt`,
        formattedData,
        {
          headers: {
            Authorization: sanctumToken,
          },
        }
      );
      setSnackbarMessage(res.data.message);
      setSnackbarOpen(true);
      setLoading(false);
      fetchAllInvoice();
      setLoading(false);
      handleClose();
    } catch (error) {
      console.error("Error submitting invoice:", error);
    } finally {
      setLoading(false);
    }
  };

  // =====================================style ============================
  const greenBorderStyle = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#1b5e20",
      },
      "&:hover fieldset": {
        borderColor: "#1b5e20",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#1b5e20",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#1b5e20",
      "&.Mui-focused": {
        color: "#1b5e20",
      },
    },
    "& .MuiFormControlLabel-root": {
      color: "#1b5e20",
    },
    "& .MuiSelect-root": {
      "& fieldset": {
        borderColor: "#1b5e20",
      },
      "&:hover fieldset": {
        borderColor: "#1b5e20",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#1b5e20",
      },
    },
    "& .MuiRadio-root": {
      color: "#1b5e20",
      "&.Mui-checked": {
        color: "#1b5e20",
      },
    },
    "& .MuiCheckbox-root": {
      color: "#1b5e20",
      "&.Mui-checked": {
        color: "#1b5e20",
      },
    },
  };

  const selectComponentStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#ffffff",
      borderColor: state.isFocused ? "#1b5e20" : base.borderColor,
      boxShadow: "none",
      minHeight: "50px",
      "&:hover": {
        borderColor: "#1b5e20",
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#ffffff",
      boxShadow: "none",
      zIndex: 100,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#1b5e20" : "#ffffff",
      color: state.isFocused ? "#fff" : "#000",
      padding: "10px",
      "&:hover": {
        backgroundColor: "#1b5e20",
        color: "#fff",
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: "#1b5e20",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#1b5e20",
      color: "#fff",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#fff",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#fff",
      "&:hover": {
        backgroundColor: "#1b5e20",
        color: "#fff",
      },
    }),
  };

  // for item =========================================================
  const itemOptions = allItems?.map((item, index) => ({
    id: item.ProductModelID,
    value: item.ProductModelID,
    label: ` ${item.ModelNumber}`,
    Quantity: 1,
    UnitQuantity: "Piece",
    Rate: 0,
    Amount: 0,
    discount: 0,
    name: `${item.ModelNumber}`,
    date: item?.SupplierDetails?.SupplierEntryTimeStamp,
    Price: item.Price,
    HSNMasterID: allHsn?.[0]?.ID || "",
  }));

  const roundedStyle = () => ({});
  const removeFn = (index) => {
    remove(index);
    updateGrandResult(); // Trigger calculation

    // const newItemSelect = [...itemSelect];
    // newItemSelect.splice(index, 1);
    // setItemSelect(newItemSelect);
  };

  return (
    <Box padding={3} sx={{ backgroundColor: "#e8f5e9" }}>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <Typography
            variant="h6"
            component="div"
            sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <AccountCircleIcon />
            Name: {invoiceDetails?.Name}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography
            variant="h6"
            component="div"
            sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <ReceiptLongIcon />
            Invoice No: {invoiceDetails?.ReceiptNumber}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name="receiptDate"
              control={control}
              // defaultValue={dayjs().format("YYYY-MM-DD")}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="Receipt Date"
                  sx={{
                    backgroundColor: "white",
                    width: "10rem",
                    "& .MuiInputBase-root": {
                      backgroundColor: "white",
                    },
                    ...greenBorderStyle,
                  }}
                  value={dayjs(field.value)}
                  onChange={(newValue) => {
                    field.onChange(dayjs(newValue).format("YYYY-MM-DD"));
                    handleDateChange(newValue);
                  }}
                  format="DD-MM-YYYY"
                />
              )}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingX: "2rem",
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: "center",
                    display: "flex",
                    gap: ".5rem",
                    alignItems: "center",
                  }}
                >
                  <PostAddRoundedIcon /> Item Details:
                </Typography>
              </Box>
            </Grid>
            <Grid
              container
              spacing={2}
              sx={{
                margin: ".5rem 0",
                // padding: ".5rem 1rem",
                // border: "1px solid gray",
                alignItems: "center",
              }}
            >
              {fields.map((field, index) => {
                return (
                  <Stack
                    direction="row"
                    key={field.id}
                    sx={{
                      width: "100%",
                      justifyContent: "space-between",
                      rowGap: 5,
                      mb: 2,
                    }}
                  >
                    <p>{index + 1}.</p>
                    {/* <Grid item xs={7} sm={2.5}>
                      <Controller
                        name={`items.${index}.ProductModelID`}
                        control={control}
                        render={({ field }) => (
                          <SelectComponent
                            {...field}
                            options={itemOptions}
                            placeholder="Select Product"
                            isSearchable={true}
                            styles={selectComponentStyles}
                          />
                        )}
                      />
                      {errors.items?.[index]?.ProductModelID && (
                        <Typography color="red" sx={{ ml: 2 }}>
                          {errors.items[index].ProductModelID.message}
                        </Typography>
                      )}
                    </Grid> */}
                    {/* <RecatSelect
                        options={itemOptions}
                        name={`items.${index}.ProductModelId`}
                      /> */}
                    <Grid item xs={7} sm={2.5}>
                      <Controller
                        name={`items.${index}`}
                        control={control}
                        rules={{ required: "Product Model is required" }}
                        render={({ field }) => {
                          // Create the complete option object for the default value
                          const defaultOption = field.value
                            ? {
                                id: field.value.id,
                                value: field.value.id,
                                label: field.value.label,
                              }
                            : null;

                          return (
                            <>
                              <SelectComponent
                                {...field}
                                value={defaultOption}
                                options={itemOptions}
                                placeholder="Select Product"
                                isSearchable={true}
                                styles={selectComponentStyles}
                                onChange={(selectedOption) => {
                                  const selectedItem = allItems.find(
                                    (item) =>
                                      item.ProductModelID ===
                                      selectedOption.value
                                  );

                                  // Update the field with the complete selected option
                                  field.onChange({
                                    id: selectedOption.id,
                                    value: selectedOption.value,
                                    label: selectedOption.label,
                                  });

                                  // Set individual values
                                  setValue(
                                    `items.${index}.id`,
                                    selectedOption.id
                                  );
                                  setValue(
                                    `items.${index}.label`,
                                    selectedOption.label
                                  );
                                  setValue(
                                    `items.${index}.value`,
                                    selectedOption.value
                                  );
                                  setValue(
                                    `items.${index}.BrandName`,
                                    selectedItem.BrandName
                                  );
                                  setValue(
                                    `items.${index}.BrandMasterID`,
                                    selectedItem.BrandMasterID
                                  );
                                  setValue(
                                    `items.${index}.Color`,
                                    selectedItem.ColorNames
                                  );
                                  setValue(
                                    `items.${index}.ModelNumber`,
                                    selectedItem.ModelNumber
                                  );
                                  setValue(
                                    `items.${index}.UnitQuantity`,
                                    "Piece"
                                  );
                                  setValue(`items.${index}.discount`, 0);
                                  setValue(
                                    `items.${index}.HSNMasterID`,
                                    selectedItem.HSNMasterID ||
                                      allHsn?.[0]?.ID ||
                                      ""
                                  );
                                  setValue(`items.${index}.Discount`, 0);
                                  setValue(
                                    `items.${index}.Price`,
                                    selectedItem.Price
                                  );
                                  setValue(`items.${index}.Quantity`, 1);
                                  setValue(
                                    `items.${index}.result`,
                                    (Number(selectedItem.Price) || 0) *
                                      (Number(
                                        watch(`items.${index}.Quantity`)
                                      ) || 1)
                                  );
                                }}
                              />
                              {errors.items?.[index]?.id && (
                                <Typography color="red" sx={{ ml: 2 }}>
                                  {errors.items[index].id.message}
                                </Typography>
                              )}
                            </>
                          );
                        }}
                      />

                      <Typography color="error">
                        {errors.items?.[index]?.ProductModelID?.message}
                      </Typography>
                    </Grid>
                    <Grid item xs={5} sm={1}>
                      <Controller
                        name={`items.${index}.HSNMasterID`}
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth sx={greenBorderStyle}>
                            <InputLabel
                              id={`item-details-label-${index}`}
                              sx={{ color: "#1b5e20" }}
                              defaultValue={allHsn?.[0]?.ID || ""}
                            >
                              HSN
                            </InputLabel>
                            <Select
                              labelId={`item-details-label-${index}`}
                              error={!!errors.items?.[index]?.HSNMasterID}
                              {...field}
                              label="HSN"
                              sx={{
                                bgcolor: "#fff",
                                ...greenBorderStyle,
                                height: "3.2rem",
                                "& .MuiInputLabel-root": {
                                  color: "#1b5e20",
                                  "&.Mui-focused": {
                                    color: "#1b5e20",
                                  },
                                },
                              }}
                              defaultValue={allHsn?.[0]?.ID || ""}
                            >
                              {allHsn?.map((item) => (
                                <MenuItem
                                  key={item.HsnMasterID}
                                  value={item.ID}
                                >
                                  {item.HSNCode}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.items?.[index]?.HSNMasterID && (
                              <FormHelperText sx={{ color: "red" }}>
                                {errors.items[index].HSNMasterID.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid item xs={5} sm={1}>
                      <Controller
                        name={`items.${index}.Quantity`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Quantity"
                            sx={{
                              background: "white",
                              ...greenBorderStyle,
                              "& .MuiInputBase-root": {
                                height: "3.2rem",
                              },
                            }}
                            error={!!errors.items?.[index]?.Quantity}
                            helperText={
                              errors.items?.[index]?.Quantity?.message
                            }
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              updateResult(index); // Trigger calculation
                            }}
                          />
                        )}
                      />
                      {/* {errors.items?.[index]?.Quantity && (
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.items[index].Quantity.message}
                        </FormHelperText>
                      )} */}
                    </Grid>
                    <Grid item xs={5} sm={1}>
                      <FormControl fullWidth sx={greenBorderStyle}>
                        <InputLabel
                          id={`item-details-label-${index}`}
                          sx={{ color: "#1b5e20" }}
                        >
                          Unit
                        </InputLabel>
                        <Controller
                          name={`items.${index}.UnitQuantity`}
                          control={control}
                          error={!!errors.items?.[index]?.UnitQuantity}
                          render={({ field }) => (
                            <Select
                              sx={{
                                ...greenBorderStyle,
                                bgcolor: "white", // Ensure background color is white
                                height: "3.2rem",
                                "& .MuiInputLabel-root": {
                                  color: "#1b5e20",
                                  "&.Mui-focused": {
                                    color: "#1b5e20",
                                  },
                                },
                              }}
                              labelId={`item-details-label-${index}`}
                              error={!!errors.items?.[index]?.UnitQuantity}
                              {...field}
                              label="Unit"
                              defaultValue="Piece"
                            >
                              {["Box", "Piece", "Pair", "Dozen"].map(
                                (item, index) => (
                                  <MenuItem value={item} key={index}>
                                    {item}
                                  </MenuItem>
                                )
                              )}
                            </Select>
                          )}
                        />
                        {errors.items?.[index]?.UnitQuantity && (
                          <FormHelperText sx={{ color: "red" }}>
                            {errors.items[index].UnitQuantity.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={5} sm={1}>
                      <Controller
                        name={`items.${index}.Price`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Price"
                            sx={{
                              background: "white",
                              ...greenBorderStyle,
                              "& .MuiInputBase-root": {
                                height: "3.2rem",
                              },
                            }}
                            error={!!errors.items?.[index]?.Price}
                            defaultValue={0}
                            helperText={errors.items?.[index]?.Price?.message}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              updateResult(index); // Trigger calculation
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={5} sm={1}>
                      <Controller
                        name={`items.${index}.discount`}
                        control={control}
                        defaultValue={0}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Discount%"
                            sx={{
                              background: "white",
                              ...greenBorderStyle,
                              "& .MuiInputBase-root": {
                                height: "3.2rem",
                              },
                            }}
                            error={!!errors.items?.[index]?.discount}
                            helperText={
                              errors.items?.[index]?.discount?.message
                            }
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              updateResult(index); // Trigger calculation
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={5} sm={1}>
                      <Controller
                        name={`items.${index}.result`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            sx={{
                              background: "white",
                              ...greenBorderStyle,
                              "& .MuiInputBase-root": {
                                height: "3.2rem",
                              },
                            }}
                            label="Total"
                            variant="outlined"
                            size="small"
                            fullWidth
                            InputLabelProps={{
                              shrink: true, // Keeps the label inside the field even when focused or filled
                            }}
                            InputProps={{
                              readOnly: true, // Makes the TextField read-only
                            }}
                          />
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
                        mt: 1,
                      }}
                    >
                      <DeleteIcon style={{ color: "red" }} />
                    </IconButton>
                  </Stack>
                );
              })}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%",
                }}
              >
                <Button
                  variant="text"
                  onClick={() =>
                    append({
                      ProductModelID: "",
                      HSNMasterID: allHsn?.[0]?.ID || "",
                      Quantity: 1,
                      UnitQuantity: "Piece",
                      Rate: 0,
                      Amount: 0,
                      discount: 0,
                    })
                  }
                  sx={{
                    // borderRadius: "30px",
                    // padding: "0 1rem",
                    height: "3rem",
                    backgroundColor: "#4D795B",
                    color: "white",
                  }}
                  startIcon={<Add />}
                >
                  Add Product
                </Button>
              </Box>
            </Grid>
            <Box
              sx={{
                width: "100%",
                mb: 2,
                display: "flex",
                justifyContent: "flex-end",
                // background: "red",
              }}
            >
              <Box sx={{ width: "60%" }}>
                <hr
                  style={{
                    border: ".5px solid green",
                  }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}
            ></Box>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4}>
                <Controller
                  name="discountDesc"
                  control={control}
                  defaultValue="festival discount"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Discount Description"
                      fullWidth
                      InputProps={{ inputProps: { min: 0 } }}
                      sx={{
                        ...roundedStyle(),
                        backgroundColor: "white",
                        ...greenBorderStyle,
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6} sm={2}>
                <Controller
                  name="SGSTP"
                  control={control}
                  defaultValue="9"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="SGST Percentage"
                      // sx={{ ...roundedStyle(), ...greenBorderStyle }}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        updateGrandResult(); // Trigger calculation
                      }}
                      fullWidth
                      type="number"
                      InputProps={{ inputProps: { min: 0 } }}
                      sx={{
                        ...roundedStyle(),
                        backgroundColor: "white",
                        ...greenBorderStyle,
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6} sm={2}>
                <Controller
                  name="CGSTP"
                  control={control}
                  defaultValue={9}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        updateGrandResult(); // Trigger calculation
                      }}
                      label="CGST percentage"
                      fullWidth
                      type="number"
                      InputProps={{ inputProps: { min: 0 } }}
                      sx={{
                        ...roundedStyle(),
                        backgroundColor: "white",
                        ...greenBorderStyle,
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6} sm={2}>
                <Controller
                  name="discount"
                  control={control}
                  defaultValue="0"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Discount"
                      sx={{ ...roundedStyle(), ...greenBorderStyle }}
                      fullWidth
                      type="number"
                      InputProps={{ inputProps: { min: 0 } }}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        updateGrandResult(); // Trigger calculation
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6} sm={2}>
                <Controller
                  name="roundUpAmount"
                  control={control}
                  defaultValue={0}
                  rules={{
                    required: "This field is required",
                    min: { value: 0, message: "Value must be at least 0" },
                  }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      id="lumpsum-discount"
                      label="Roundup Amount"
                      sx={{
                        ...roundedStyle(),
                        backgroundColor: "white",
                        ...greenBorderStyle,
                      }}
                      fullWidth
                      error={!!fieldState.error}
                      helperText={
                        fieldState.error ? fieldState.error.message : null
                      }
                      InputProps={{
                        inputProps: { min: 0 },
                        readOnly: true, // Make the field non-editable
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>

            {/* <Grid item xs={12} sm={12}> */}
            <Grid container spacing={2} sx={{ mt: 1.5 }}>
              <Grid item xs={12} sm={2.4}>
                <Controller
                  name="totalAmountBD"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Total Price Before Discount"
                      variant="outlined"
                      size="small"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                        style: { color: "#1b5e20" },
                      }}
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{
                        input: {
                          textAlign: "center",
                          background: "white",
                          borderColor: "#1b5e20",
                        },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#1b5e20",
                          },
                          "&:hover fieldset": {
                            borderColor: "#1b5e20",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#1b5e20",
                          },
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={2.4}>
                <Controller
                  name="totalAmountAD"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Total Price After Discount"
                      variant="outlined"
                      size="small"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                        style: { color: "#1b5e20" },
                      }}
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{
                        input: {
                          textAlign: "center",
                          background: "white",
                          borderColor: "#1b5e20",
                        },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#1b5e20",
                          },
                          "&:hover fieldset": {
                            borderColor: "#1b5e20",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#1b5e20",
                          },
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={2.4}>
                <Controller
                  name="sgstValue"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="SGST"
                      variant="outlined"
                      size="small"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                        style: { color: "#1b5e20" },
                      }}
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{
                        input: {
                          textAlign: "center",
                          background: "white",
                          borderColor: "#1b5e20",
                        },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#1b5e20",
                          },
                          "&:hover fieldset": {
                            borderColor: "#1b5e20",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#1b5e20",
                          },
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={2.4}>
                <Controller
                  name="cgstValue"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="CGST"
                      variant="outlined"
                      size="small"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                        style: { color: "#1b5e20" },
                      }}
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{
                        input: {
                          textAlign: "center",
                          background: "white",
                          borderColor: "#1b5e20",
                        },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#1b5e20",
                          },
                          "&:hover fieldset": {
                            borderColor: "#1b5e20",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#1b5e20",
                          },
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={2.4}>
                <Controller
                  name="grandTotalAmount"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Final Price"
                      variant="outlined"
                      size="small"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                        style: { color: "#1b5e20" },
                      }}
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{
                        input: {
                          textAlign: "center",
                          background: "white",
                          borderColor: "#1b5e20",
                        },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#1b5e20",
                          },
                          "&:hover fieldset": {
                            borderColor: "#1b5e20",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#1b5e20",
                          },
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            {/* </Grid> */}

            <Box>
              <Typography
                variant="h6"
                sx={{
                  textAlign: "left",
                  width: "100%",
                  mt: 4,
                  display: "flex",
                  gap: ".5rem",
                  alignItems: "center",
                  mb: 0,
                }}
                gutterBottom
              >
                {" "}
                <CurrencyRupeeRoundedIcon />
                Payment section
              </Typography>
            </Box>
            <Grid item xs={12}>
              <InvoiceEditPaymentFormS
                paymentAll={allPaymentType}
                finalAmount={getValues("grandTotalAmount")}
                // paymentIsValidFn={handlePaymentValidation}
                // paymentinfoFn={getPaymentDataFn}
                receiptDate={receiptDate}
                setValue={setValue} // Pass setValue as a prop
                // darkGreenBorderStyle={darkGreenBorderStyle} // Pass darkGreenBorderStyle as a prop
              />
            </Grid>

            <Grid item xs={12} sx={{ mt: 1.5 }}>
              <TextField
                fullWidth
                multiline
                rows={1}
                label="Remarks"
                sx={{
                  bgcolor: "white",
                  "& .MuiInputLabel-root": {
                    color: "#1b5e20",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#1b5e20",
                    },
                    "&:hover fieldset": {
                      borderColor: "#1b5e20",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1b5e20",
                    },
                  },
                }}
                {...register("remarks")}
                gutterBottom
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
            >
              <Box sx={{ display: "flex", gap: "1rem", mr: 0, mb: 2 }}>
                <Typography
                  variant="h6"
                  sx={{ textAlign: "center", width: "100%" }}
                >
                  Due amount
                </Typography>
                <Controller
                  name="dueAmount"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      variant="outlined"
                      size="small"
                      fullWidth
                      InputLabelProps={{
                        shrink: true, // Keeps the label inside the field even when focused or filled
                      }}
                      InputProps={{
                        readOnly: true, // Makes the TextField read-only
                      }}
                      sx={{
                        input: {
                          textAlign: "center", // Centers the value text
                          background: "white",
                        },
                        ...greenBorderStyle,
                      }}
                    />
                  )}
                />
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            ></Grid>
            <Grid container spacing={2} sx={{ mt: 1.5 }}>
              <Grid item xs={4} sm={4}>
                <FormControl
                  fullWidth
                  error={!!errors.checkedBy}
                  sx={greenBorderStyle}
                >
                  <InputLabel sx={{ color: "#1b5e20" }}>Checked By:</InputLabel>
                  <Controller
                    name="checkedBy"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        sx={{
                          backgroundColor: "white",
                          ...greenBorderStyle,
                          "& .MuiInputLabel-root": {
                            color: "#1b5e20",
                            "&.Mui-focused": {
                              color: "#1b5e20",
                            },
                          },
                        }}
                        label="Checked By:"
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      >
                        {signatoryDetails?.CheckedByList?.map((item, index) => (
                          <MenuItem value={item.ID} key={index}>
                            {item.Name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.checkedBy && (
                    <FormHelperText sx={{ color: "red" }}>
                      {errors.checkedBy.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={4} sm={4}>
                <FormControl
                  fullWidth
                  error={!!errors.preparedBy}
                  sx={greenBorderStyle}
                >
                  <InputLabel sx={{ color: "#1b5e20" }}>
                    Prepared By:
                  </InputLabel>
                  <Controller
                    name="preparedBy"
                    control={control}
                    render={({ field }) => (
                      <Select
                        sx={{
                          backgroundColor: "white",
                          ...greenBorderStyle,
                          "& .MuiInputLabel-root": {
                            color: "#1b5e20",
                            "&.Mui-focused": {
                              color: "#1b5e20",
                            },
                          },
                        }}
                        {...field}
                        label="Prepared By:"
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
                  {errors.preparedBy && (
                    <FormHelperText sx={{ color: "red" }}>
                      {errors.preparedBy.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={4} sm={4}>
                <FormControl
                  fullWidth
                  error={!!errors.authorizeBy}
                  sx={greenBorderStyle}
                >
                  <InputLabel sx={{ color: "#1b5e20" }}>
                    Authorize By:
                  </InputLabel>
                  <Controller
                    name="authorizeBy"
                    control={control}
                    render={({ field }) => (
                      <Select
                        sx={{
                          backgroundColor: "white",
                          ...greenBorderStyle,
                          "& .MuiInputLabel-root": {
                            color: "#1b5e20",
                            "&.Mui-focused": {
                              color: "#1b5e20",
                            },
                          },
                        }}
                        {...field}
                        label="Authorize By:"
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
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
                  {errors.authorizeBy && (
                    <FormHelperText sx={{ color: "red" }}>
                      {errors.authorizeBy.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center", mt: 3.5 }}
            >
              <Button
                variant="contained"
                type="submit"
                sx={{
                  height: "3rem",
                  textTransform: "none",
                  backgroundColor: "#4D795B",
                }}
              >
                Save Changes
              </Button>
            </Grid>
            {/* </Grid> */}
          </Grid>
        </form>

        <LoadingComp loading={loading} />
      </FormProvider>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
