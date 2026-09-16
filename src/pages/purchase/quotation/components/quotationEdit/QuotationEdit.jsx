import React, { useRef, useState, useCallback, useEffect } from "react";
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
import LoadingComp from "../../../../../components/loadingComp/LoadingComp";
import Quotation from "./../../../../sales/AdvncedORder/AdvncedORder";
import Cookies from "js-cookie"; // Import Cookies library
import { consoleLoggingIntegration } from "@sentry/react";

export default function QuotationEdit({
  supplierList,
  allItems,
  companyList,
  signatoryList,
  selectdQuo,
  fetchQuotationsFn,
  handleClose,
  onClose,
}) {
  console.log("selectdQuo", selectdQuo);
  const token = Cookies.get("token"); // Get token from cookies
  const [customerSelect, setCustomerSelect] = useState([]);
  const [paymentInformation, setPaymentInformation] = useState({});

  const [itemSelect, setItemSelect] = useState(
    (selectdQuo?.ModelMappingData || []).map((it) => ({
      ...it,
      ColorList: it.AvailableColors || [],
    }))
  ); // Define itemSelect
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
  // console.log(itemSelect);

  const schema = Yup.object().shape({
    items: Yup.array().of(
      Yup.object().shape({
        id: Yup.string().required("Select Product"),
        // HSNMasterID: Yup.string().required("required"),
        StripeOf: Yup.number().typeError("Not valid").min(0, "Min 0"),
        StripeQty: Yup.number().typeError("Not valid").min(0, "Min 0"),
        Price: Yup.number().typeError("Not valid"),
        // .required("Qty Per Box is required"),
        discount: Yup.number().typeError("Not valid"),
        SGSTP: Yup.number().typeError("invalid"),
        CGSTP: Yup.number().typeError("invalid"),
      })
    ),

    // company: Yup.string().required("Company is required"),
    // checkedBy: Yup.string().required("Checked By is required"),
    // preparedBy: Yup.string().required("Prepared By is required"),
    authorizeBy: Yup.string().required("Authorize By is required"),
    // receiptDate: Yup.date()
    //   .required("Receipt Date is required")
    //   .typeError("Invalid date"),
  });
  const item = Array.isArray(selectdQuo?.ModelMappingData)
    ? selectdQuo?.ModelMappingData
    : [];
  // console.log(itemSelect);
  // =======================================use form ===========================

  const methods = useForm({
    resolver: yupResolver(schema),
    shouldUnregister: true,
    defaultValues: {
      items: (selectdQuo?.ModelMappingData || []).map((it) => ({
        id: it.ProductModelID,
        label: it.ProductModelName,
        Quantity: Number(it.Quantity),
        UnitQuantity: it.UnitQuantity,
        Price: Number(it.Price || 0),
        StripeOf: Number(it.StripOf || 0),
        StripeQty: Number(it.StripQty || 0),
        discount: !isNaN(Number(it?.DISP)) ? Number(it.DISP) : 0, // Ensure valid number or fallback to 0
        CGSTP: !isNaN(Number(it.CGSTP)) ? Number(it.CGSTP) : 0, // Ensure valid number or fallback to 0
        SGSTP: !isNaN(Number(it.SGSTP)) ? Number(it.SGSTP) : 0, // Ensure valid number or fallback to 0
        Amount: Number(it.Amount || 0),
        result: Number(it.Amount || 0) || Number(it.Price * it.Quantity) || 0,
        BrandMasterID: it.BrandMasterID,
        lQty:
          Number(it?.Quantity || 0) -
          (Number(it?.StripQty) || 0) * (Number(it?.StripOf) || 0),
      })),
      QuotationBookingMasterID: selectdQuo?.QuotationBookingMasterID,
      QuotationDate: selectdQuo?.QuotationDate,
      Source: selectdQuo?.Source,
      QuotationNo: selectdQuo?.QuotationNo,
      BillCode: selectdQuo?.BillCode,
      QABRemarks: selectdQuo?.QABRemarks,
      totalAmountBD: Number(selectdQuo?.TotalAmountBD) || 0,
      discount: Number(selectdQuo?.Discount) || 0,
      discountDesc: selectdQuo?.QABRemarks || "Festival Discount",
      roundUpAmount: Number(selectdQuo?.RoundOffAmount) || 0,
      totalAmountAD: Number(selectdQuo?.TotalAmountAD) || 0,
      sgstValue: Number(selectdQuo?.SGSTAmount) || 0,
      cgstValue: Number(selectdQuo?.CGSTAmount) || 0,
      GrandTotalAmount: Number(selectdQuo?.GrandTotalAmount) || 0,
      // SGSTP: Number(selectdQuo?.SGSTP) || 9,
      // CGSTP: Number(selectdQuo?.CGSTP) || 9,
      remarks: selectdQuo?.QABRemarks || "",
      checkedBy: signatoryList?.CheckedByList?.[0]?.ID || "",
      preparedBy: signatoryList?.PreparedByList?.[0]?.ID || "",
      authorizeBy: selectdQuo?.AuthorizedSignatoryByID || "",
      NetTotalAmount: selectdQuo?.NetTotalAmount || 0,
      TotalGst: selectdQuo?.SGSTAmount,
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
      const {
        Price,
        StripeOf,
        StripeQty,
        discount,
        CGSTP = 0,
        SGSTP = 0,
        lQty,
      } = row;

      const Quantity =
        (Number(StripeOf) || 0) * (Number(StripeQty) || 0) +
        (Number(lQty) || 0);

      // Calculate base result
      const baseResult = (Number(Price) || 0) * Quantity || 0;

      const finalResult =
        baseResult - (baseResult * (Number(discount) || 0)) / 100;
      const CgstValue = round((finalResult * CGSTP || 0) / 100, 2);
      const SgstValue = round((finalResult * SGSTP || 0) / 100, 2);

      setValue(
        `items.${index}.result`,
        round(finalResult + CgstValue + SgstValue, 2)
      );

      // ===========================
      const items = getValues("items");

      const netTotalAmount = items?.reduce((acc, item) => {
        const itemQty =
          (Number(item.StripeOf) || 0) * (Number(item.StripeQty) || 0) +
          (Number(item.lQty) || 0);
        const itemResult = itemQty * (Number(item.Price) || 0);
        const discountAmount =
          (itemResult * (Number(item.discount) || 0)) / 100;

        return acc + itemResult - discountAmount;
      }, 0);
      setValue("NetTotalAmount", round(netTotalAmount, 2));
      // ===========================

      const totalGst = items?.reduce((acc, item, index) => {
        const Quantity =
          (Number(StripeOf) || 0) * (Number(StripeQty) || 0) +
          (Number(lQty) || 0);

        // Calculate base result
        const baseResult = (Number(Price) || 0) * Quantity || 0;

        const discountAmount =
          (baseResult * (Number(item.discount) || 0)) / 100;
        const mainAmount = baseResult - discountAmount;

        const sgstValue = (round(mainAmount) * (Number(item.SGSTP) || 0)) / 100;
        const cgstValue = (round(mainAmount) * (Number(item.CGSTP) || 0)) / 100;

        return acc + round(Number(sgstValue) + Number(cgstValue), 2);
      }, 0);

      setValue("TotalGst", round(totalGst, 2) || 0, {
        shouldDirty: true,
        shouldValidate: true,
      });

      // =======================
      const gstAndNetTotalAmount = round(totalGst + netTotalAmount, 2);

      // console.log("totalAmountPaid", totalAmountPaid);

      const decimalValue =
        gstAndNetTotalAmount - Math.floor(gstAndNetTotalAmount);
      if (decimalValue > 0.5) {
        setValue("roundUpAmount", round(1 - decimalValue, 2) || 0);
        setValue("GrandTotalAmount", Math.ceil(gstAndNetTotalAmount) || 0);
        setValue("dueAmount", Math.ceil(gstAndNetTotalAmount));
      } else {
        setValue("roundUpAmount", -round(decimalValue, 2));
        setValue("GrandTotalAmount", Math.floor(gstAndNetTotalAmount));
      }

      // trigger([
      //   "sgstValue",
      //   "cgstValue",
      //   "grandTotalAmount",
      //   "NetTotalAmount",
      //   "totalGst",
      //   "dueAmount",

      //   "StripeQty",
      //   "items",
      //   "StripOf",
      // ]); // Trigger validation
    }, 500),
    [getValues, setValue]
  );

  // ==================================fetxh customer, supplier, subdealer=======================

  const handleOpenAddDialog = () => setAddDialogOpen(true);
  const handleCloseAddDialog = () => setAddDialogOpen(false);

  // const handlePaymentValidation = (isValid) => {
  //   if (paymentIsValid.current !== isValid) {
  //     paymentIsValid.current = isValid;
  //     forceRender((prev) => !prev);
  //   }
  // };
  // const getPaymentDataFn = (value) => {
  //   setPaymentInformation(value);
  // };
  // ============================================ submit ==================================
  const onSubmit = async (data) => {
    setLoading(true);
    const formattedData = {
      EntityType: selectdQuo?.EntityType || "CUST",
      EntityID: selectdQuo?.EntityID || null,
      BillCode: "QUO",
      BillEntityType: selectdQuo?.BillEntityType || "CUST",
      BillEntityID: selectdQuo?.BillEntityID || null,
      Source: "O",
      QuotationDate: selectdQuo?.QuotationDate || dayjs().format("YYYY-MM-DD"),
      TotalAmountBD: data.totalAmountBD,
      Discount: Number(data?.discount),
      SGSTAmount: round(data?.TotalGst, 2),
      GrandTotalAmount: data.GrandTotalAmount || 0,
      RoundOffAmount: data.roundUpAmount,
      NetTotalAmount: data.NetTotalAmount || 0,
      AuthorizedSignatoryByID: data.authorizeBy || "",
      ModelMappingData: data.items.map((item, index) => ({
        ProductModelID: item.id,
        ColorMasterID: 1,
        HSNMasterID: null,
        BrandMasterID: null,
        CGSTP: (item.CGSTP !== undefined ? item.CGSTP : 5).toString(),
        SGSTP: (item.SGSTP !== undefined ? item.SGSTP : 5).toString(),
        Quantity:
          Number(item.StripeOf || 0) * Number(item.StripeQty || 0) +
          Number(item.lQty || 0),
        Unit: null,
        Price: item.Price,
        DISP: item.discount || 0,
        Amount: item.result,
        DueDays: null,
        UnitQuantity: null,
        QtyPerBox: null,
        MRP: item.MRP || 0,
        StripOf: item.StripeOf || 0,
        StripQty: item.StripeQty || 0,
      })),
    };
    console.log(formattedData);

    // console.log(formattedData);
    const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;
    const url = `${process.env.REACT_APP_URL}/api/Updatequotationbooking/${selectdQuo?.QuotationBookingMasterID}`;
    // console.log(url);
    try {
      const res = await axios.put(url, formattedData, {
        headers: {
          Authorization: sanctumToken,
        },
      });
      setSnackbarMessage(res.data.message);
      setSnackbarOpen(true);
      setLoading(false);
      fetchQuotationsFn();
      onClose();
      handleClose();
    } catch (error) {
      console.error("Error submitting quotation:", error);
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

  const fieldStyles = {
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
  }; // Define fieldStyles

  const selectComponentStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#ffffff",
      borderColor: state.isFocused ? "#1976d2" : base.borderColor,
      boxShadow: "none",
      minHeight: "50px",
      "&:hover": {
        borderColor: "#1976d2",
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
      backgroundColor: state.isFocused ? "#1976d2" : "#ffffff",
      color: state.isFocused ? "#fff" : "#000",
      padding: "10px",
      "&:hover": {
        backgroundColor: "#1976d2",
        color: "#fff",
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: "#1976d2",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#1976d2",
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
        backgroundColor: "#1976d2",
        color: "#fff",
      },
    }),
  };

  // for item =========================================================
  const itemOptions = allItems?.map((item, index) => ({
    id: item.ProductModelID,
    value: item.ProductModelID,
    label: `${item.ModelNumber}`,
    Quantity: 1,
    UnitQuantity: "Piece",
    Rate: 0,
    Amount: 0,
    discount: 0,
    name: `${item.ModelNumber}`,
    date: item?.SupplierDetails?.SupplierEntryTimeStamp,
    Price: item.Price,
    ColorList: item?.AvailableColors || item?.ColorList || [],
  }));

  const roundedStyle = () => ({});
  const removeFn = (index) => {
    remove(index);

    // const newItemSelect = [...itemSelect];
    // newItemSelect.splice(index, 1);
    // setItemSelect(newItemSelect);
  };
  const handleDateChange = (newValue) => {
    setReceiptDate(dayjs(newValue).format("YYYY-MM-DD")); // Format date as "YYYY-MM-DD"
  };

  return (
    <Box padding={3}>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <Typography
            variant="h6"
            component="div"
            sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <AccountCircleIcon />
            Name: {selectdQuo?.CompanyName}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography
            variant="h6"
            component="div"
            sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <ReceiptLongIcon />
            Quotation No: {selectdQuo?.QuotationNo}
          </Typography>
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
                    <Grid item xs={7} sm={2}>
                      <Controller
                        name={`items.${index}`}
                        control={control}
                        rules={{ required: "Product Model is required" }}
                        render={({ field }) => {
                          return (
                            <>
                              <SelectComponent
                                {...field}
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

                                  setValue(
                                    `items.${index}.ProductModelID`,
                                    selectedItem.ProductModelID
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
                                    `items.${index}.ModelNumber`,
                                    selectedItem.ModelNumber
                                  );
                                  setValue(
                                    `items.${index}.Price`,
                                    selectedItem.Price
                                  );
                                  setValue(
                                    `items.${index}.result`,
                                    selectedItem.Price *
                                      watch(`items.${index}.Quantity`)
                                  );
                                  setValue(
                                    `items.${index}.AvailableQuantity`,
                                    selectedItem.AvailableQuantity
                                  );

                                  // Parse ColorListJson if present, fallback to AvailableColors
                                  let colorList = [];
                                  if (selectedItem.ColorListJson) {
                                    try {
                                      colorList = JSON.parse(
                                        selectedItem.ColorListJson
                                      ).map((c) => ({
                                        ID: c.ColorMasterID,
                                        Color: c.Color,
                                      }));
                                    } catch {
                                      colorList = [];
                                    }
                                  } else if (selectedItem.AvailableColors) {
                                    colorList = selectedItem.AvailableColors;
                                  }

                                  setValue(
                                    `items.${index}.AvailableColors`,
                                    colorList
                                  );

                                  // Set ColorMasterID to "Standard" if present, else first color's ID, else ""
                                  let defaultColorId = "";
                                  if (colorList.length > 0) {
                                    const standardColor = colorList.find(
                                      (c) =>
                                        c.Color?.toLowerCase() === "standard" ||
                                        c.Color?.toLowerCase() === "standerd"
                                    );
                                    defaultColorId = standardColor
                                      ? standardColor.ID
                                      : colorList[0].ID;
                                  }
                                  setValue(
                                    `items.${index}.ColorMasterID`,
                                    defaultColorId
                                  );

                                  // Update itemSelect state for color dropdown rendering
                                  const newItemSelect = [...itemSelect];
                                  newItemSelect[index] = {
                                    ...selectedItem,
                                    ColorList: colorList,
                                  };
                                  setItemSelect(newItemSelect);

                                  field.onChange(selectedOption);
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
                    <Grid item xs={5} sm={0.9}>
                      <Controller
                        name={`items.${index}.StripeOf`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Stripe Of"
                            sx={{
                              background: "white",
                              ...greenBorderStyle,
                              "& .MuiInputBase-root": {
                                height: "3.2rem",
                              },
                            }}
                            error={!!errors.items?.[index]?.StripeOf}
                            defaultValue={0}
                            helperText={
                              errors.items?.[index]?.StripeOf?.message
                            }
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              updateResult(index); // Trigger calculation
                            }}
                          />
                        )}
                      />
                      {/* {errors.items?.[index]?.StripeOf && (
                                                       <FormHelperText sx={{ color: "red" }}>
                                                         {errors.items[index].StripeOf.message}
                                                       </FormHelperText>
                                                     )} */}
                    </Grid>
                    <Grid item xs={5} sm={0.9}>
                      <Controller
                        name={`items.${index}.StripeQty`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Stripe Qty"
                            sx={{
                              background: "white",
                              ...greenBorderStyle,
                              "& .MuiInputBase-root": {
                                height: "3.2rem",
                              },
                            }}
                            error={!!errors.items?.[index]?.StripeQty}
                            defaultValue={0}
                            helperText={
                              errors.items?.[index]?.StripeQty?.message
                            }
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              updateResult(index); // Trigger calculation
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={5} sm={0.9}>
                      <Controller
                        name={`items.${index}.lQty`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="L. Qty"
                            sx={{
                              background: "white",
                              ...greenBorderStyle,
                              "& .MuiInputBase-root": {
                                height: "3.2rem",
                              },
                            }}
                            error={!!errors.items?.[index]?.StripeQty}
                            defaultValue={0}
                            helperText={
                              errors.items?.[index]?.StripeQty?.message
                            }
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              updateResult(index); // Trigger calculation
                            }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={5} sm={0.9}>
                      <Controller
                        name={`items.${index}.Price`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Rate"
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
                      {/* {errors.items?.[index]?.Price && (
                                                       <FormHelperText sx={{ color: "red" }}>
                                                         {errors.items[index].Price.message}
                                                       </FormHelperText>
                                                     )} */}
                    </Grid>
                    <Grid item xs={5} sm={0.9}>
                      <Controller
                        name={`items.${index}.discount`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            // defaultValue={5}
                            fullWidth
                            label="Discount"
                            sx={{
                              background: "white",
                              ...greenBorderStyle,
                              "& .MuiInputBase-root": {
                                height: "3.2rem",
                              },
                            }}
                            error={!!errors.items?.[index]?.SGSTP}
                            helperText={errors.items?.[index]?.SGSTP?.message}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              updateResult(index); // Trigger calculation
                            }}
                          />
                        )}
                      />
                      {errors.items?.[index]?.SGSTP && (
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.items[index].SGSTP.message}
                        </FormHelperText>
                      )}
                    </Grid>

                    <Grid item xs={5} sm={0.9}>
                      <Controller
                        name={`items.${index}.SGSTP`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            // defaultValue={5}
                            fullWidth
                            label="SGSTP"
                            sx={{
                              background: "white",
                              ...greenBorderStyle,
                              "& .MuiInputBase-root": {
                                height: "3.2rem",
                              },
                            }}
                            error={!!errors.items?.[index]?.SGSTP}
                            helperText={errors.items?.[index]?.SGSTP?.message}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              updateResult(index); // Trigger calculation
                            }}
                          />
                        )}
                      />
                      {errors.items?.[index]?.SGSTP && (
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.items[index].SGSTP.message}
                        </FormHelperText>
                      )}
                    </Grid>
                    <Grid item xs={5} sm={0.9}>
                      <Controller
                        name={`items.${index}.CGSTP`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="CGSTP"
                            sx={{
                              background: "white",
                              ...greenBorderStyle,
                              "& .MuiInputBase-root": {
                                height: "3.2rem",
                              },
                            }}
                            error={!!errors.items?.[index]?.CGSTP}
                            // defaultValue={5}
                            helperText={errors.items?.[index]?.CGSTP?.message}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              updateResult(index); // Trigger calculation
                            }}
                          />
                        )}
                      />
                      {errors.items?.[index]?.CGSTP && (
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.items[index].CGSTP.message}
                        </FormHelperText>
                      )}
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
                  variant="contained"
                  onClick={() =>
                    append({
                      ProductModelID: "",
                      HSNMasterID: "",
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
            <Grid
              container
              spacing={2}
              sx={{ mt: 2, ml: 1, justifyContent: "flex-end", mb: 2 }}
            >
              <Grid item xs={6} sm={2}>
                <Controller
                  name="NetTotalAmount"
                  control={control}
                  defaultValue={0}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      id="lumpsum-discount"
                      label="Net Total Amount"
                      sx={{ ...roundedStyle(), ...greenBorderStyle }}
                      fullWidth
                      error={!!fieldState.error}
                      helperText={
                        fieldState.error ? fieldState.error.message : null
                      }
                      InputProps={{
                        inputProps: { min: 0 },
                        readOnly: true, // Makes the TextField read-only
                      }}
                      value={field.value || ""} // Ensure blank if invalid
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6} sm={2}>
                <Controller
                  name="TotalGst"
                  control={control}
                  defaultValue={0}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      id="lumpsum-discount"
                      label="Total Gst"
                      sx={{ ...roundedStyle(), ...greenBorderStyle }}
                      fullWidth
                      error={!!fieldState.error}
                      helperText={
                        fieldState.error ? fieldState.error.message : null
                      }
                      InputProps={{
                        inputProps: { min: 0 },
                        readOnly: true, // Makes the TextField read-only
                      }}
                      value={field.value || ""} // Ensure blank if invalid
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6} sm={2}>
                <Controller
                  name="roundUpAmount"
                  control={control}
                  defaultValue={0}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      id="lumpsum-discount"
                      label="Roundup Amount"
                      sx={{ ...roundedStyle(), ...greenBorderStyle }}
                      fullWidth
                      error={!!fieldState.error}
                      helperText={
                        fieldState.error ? fieldState.error.message : null
                      }
                      InputProps={{
                        inputProps: { min: 0 },
                        readOnly: true, // Makes the TextField read-only
                      }}
                      value={field.value || ""} // Ensure blank if invalid
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6} sm={2}>
                <Controller
                  name="GrandTotalAmount"
                  control={control}
                  defaultValue={0}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      id="lumpsum-discount"
                      label="Final Amount"
                      sx={{ ...roundedStyle(), ...greenBorderStyle }}
                      fullWidth
                      error={!!fieldState.error}
                      helperText={
                        fieldState.error ? fieldState.error.message : null
                      }
                      InputProps={{
                        inputProps: { min: 0 },
                        readOnly: true, // Makes the TextField read-only
                      }}
                      value={field.value || ""} // Ensure blank if invalid
                    />
                  )}
                />
              </Grid>
            </Grid>

            {/* <Grid item xs={12} sm={12}> */}

            {/* </Grid> */}

            <Box></Box>
            {/* <Grid item xs={12}>
              <InvoiceEditPaymentFormS
                paymentAll={allPaymentType}
                finalAmount={getValues("grandTotalAmount")}
                // paymentIsValidFn={handlePaymentValidation}
                // paymentinfoFn={getPaymentDataFn}
                roundedStyle={roundedStyle}
                setValue={setValue} // Pass setValue as a prop
                // darkGreenBorderStyle={darkGreenBorderStyle} // Pass darkGreenBorderStyle as a prop
              />
            </Grid> */}

            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            ></Grid>
            <Grid container spacing={2} sx={{ marginTop: 0 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Remarks"
                  {...register("remarks")}
                  sx={{
                    backgroundColor: "white",
                    ...greenBorderStyle,
                    "& .MuiInputBase-root": {
                      height: "3.2rem",
                    },
                  }}
                  InputProps={{
                    sx: { fontSize: "14px" },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl
                  fullWidth
                  sx={{
                    backgroundColor: "white",
                    ...greenBorderStyle,
                    "& .MuiInputBase-root": {
                      height: "3.2rem",
                    },
                  }}
                  error={!!errors.authorizeBy}
                >
                  <InputLabel>Authorized By</InputLabel>
                  <Controller
                    name="authorizeBy"
                    control={control}
                    defaultValue={signatoryList[0]?.ID || ""}
                    render={({ field }) => (
                      <Select
                        {...field}
                        label="Authorized By"
                        sx={{
                          height: "3.2rem",
                          "& .MuiInputLabel-root": {
                            color: "#1b5e20",
                            "&.Mui-focused": {
                              color: "#1b5e20",
                            },
                          },
                        }}
                      >
                        {signatoryList &&
                          signatoryList.map((signatory) => (
                            <MenuItem key={signatory.ID} value={signatory.ID}>
                              {signatory.Name}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                  />
                  <FormHelperText>{errors.authorizeBy?.message}</FormHelperText>
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
                Edit Quotation
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
