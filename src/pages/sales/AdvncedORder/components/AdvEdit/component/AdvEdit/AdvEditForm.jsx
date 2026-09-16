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
import LoadingComp from "../../../../../../../components/loadingComp/LoadingComp";
// import Quotation from "./../../../../sales/AdvncedORder/AdvncedORder";
import Cookies from "js-cookie"; // Import Cookies library

export default function AdvEditForm({
  supplierList,
  allItems,
  companyList,
  signatoryList,
  selectdQuo,
  fetchQuotationsFn,
  handleClose,
  onClose,
  fetchAdvaceOrder,
}) {
  const token = Cookies.get("token"); // Get token from cookies
  const [customerSelect, setCustomerSelect] = useState([]);
  const [paymentInformation, setPaymentInformation] = useState({});

  const [itemSelect, setItemSelect] = useState([]); // Define itemSelect
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

  const schema = Yup.object().shape({
    items: Yup.array().of(
      Yup.object().shape({
        id: Yup.string().required("Select Product"),
        // HSNMasterID: Yup.string().required("required"),
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
        ColorMasterID: Yup.string().required("Color is required"), // Add validation for Color
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
  // =======================================use form ===========================
  const methods = useForm({
    resolver: yupResolver(schema),
    shouldUnregister: true,
    // defaultValues: {
    //   items: item.map((it) => ({
    //     id: it.ProductModelID,
    //     label: it.ProductModelName,
    //     Quantity: Number(it.Quantity),
    //     UnitQuantity: it.UnitQuantity,
    //     Price: Number(it.Price),
    //     Amount: Number(it.Amount),
    //     discount: 0, // Assuming no discount in the provided data
    //     result: Number(it.Amount || it.Price * it.Quantity),
    //     HSNMasterID: it.HSNMasterID || "",
    //     BrandMasterID: it.BrandMasterID,
    //     ColorMasterID: it.ColorMasterID || "", // Ensure empty string if no value
    //     BrandName: it.BrandName,
    //     ModelNumber: it.ModelNumber,
    //   })),
    //   discount: Number(selectdQuo?.Discount) || 0,
    //   discountDesc: selectdQuo?.QABRemarks || "Fastival Discount",
    //   roundUpAmount: Number(selectdQuo?.RoundedOffAmount) || 0,
    //   totalAmountBD: Number(selectdQuo?.TotalAmountBD) || 0,
    //   totalAmountAD: Number(selectdQuo?.TotalAmountAD) || 0,
    //   sgstValue: Number(selectdQuo?.SGSTAmount) || 0,
    //   cgstValue: Number(selectdQuo?.CGSTAmount) || 0,
    //   grandTotalAmount: Number(selectdQuo?.GrandTotalAmount) || 0,
    //   SGSTP: Number(selectdQuo?.SGSTP) || 9,
    //   CGSTP: Number(selectdQuo?.CGSTP) || 9,
    //   remarks: selectdQuo?.QABRemarks || "",
    //   checkedBy: signatoryList?.CheckedByList?.[0]?.ID || "",
    //   preparedBy: signatoryList?.PreparedByList?.[0]?.ID || "",
    //   authorizeBy: selectdQuo?.AuthorizedSignatoryByID || "",
    // },
    defaultValues: {
      items: (selectdQuo?.ModelMappingData || []).map((it) => ({
        id: it.ProductModelID,
        label: it.ProductModelName,
        Quantity: Number(it.Quantity),
        UnitQuantity: it.UnitQuantity,
        Price: Number(it.Price || 0),
        Amount: Number(
          Number(it.Amount || 0)
          // Number(it.Price || 0) * Number(it.Quantity || 0)
        ),
        discount: 0,
        result: Number(it.Amount || 0) || Number(it.Price * it.Quantity) || 0,
        HSNMasterID: it.HSNMasterID || "",
        BrandMasterID: it.BrandMasterID,
        ColorMasterID: it.ColorMasterID, // Always use ID
        BrandName: it.BrandName,
        ModelNumber: it.ModelNumber,
        AvailableColors: it.AvailableColors || [], // Set color list from selectdQuo
      })),
      QuotationBookingMasterID: selectdQuo?.QuotationBookingMasterID,
      QuotationDate: selectdQuo?.QuotationDate,
      Source: selectdQuo?.Source,
      QuotationNo: selectdQuo?.QuotationNo,
      BillCode: selectdQuo?.BillCode,
      QABRemarks: selectdQuo?.QABRemarks,
      totalAmountBD: Number(selectdQuo?.TotalAmountBD) || 0,
      discount: Number(selectdQuo?.Discount) || 0,
      discountDesc: selectdQuo?.QABRemarks || "Fastival Discount",
      roundUpAmount: Number(selectdQuo?.RoundOffAmount) || 0,
      totalAmountAD: Number(selectdQuo?.TotalAmountAD) || 0,
      sgstValue: Number(selectdQuo?.SGSTAmount) || 0,
      cgstValue: Number(selectdQuo?.CGSTAmount) || 0,
      grandTotalAmount: Number(selectdQuo?.GrandTotalAmount) || 0,
      SGSTP: Number(selectdQuo?.SGSTP) || 9,
      CGSTP: Number(selectdQuo?.CGSTP) || 9,
      remarks: selectdQuo?.QABRemarks || "",
      checkedBy: signatoryList?.CheckedByList?.[0]?.ID || "",
      preparedBy: signatoryList?.PreparedByList?.[0]?.ID || "",
      authorizeBy: selectdQuo?.AuthorizedSignatoryByID || "",
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
      EntityType: selectdQuo?.EntityType,
      EntityID: selectdQuo?.EntityID || null,
      BillCode: "ADVB",
      BillEntityType: selectdQuo?.BillEntityType || "CUST",
      BillEntityID: selectdQuo?.BillEntityID || null,
      Source: "O",
      QuotationDate: selectdQuo?.QuotationDate || dayjs().format("YYYY-MM-DD"),
      TotalAmountBD: data.totalAmountBD,
      Discount: Number(data.discount),
      DiscountAmount: data.discountValue,
      TotalAmountAD: data.totalAmountAD,
      CGSTP: data.CGSTP,
      CGSTAmount: data.cgstValue,
      SGSTP: data.SGSTP,
      SGSTAmount: data.sgstValue,
      GrandTotalAmount: data.grandTotalAmount,
      RoundOffAmount: data.roundUpAmount,
      NetTotalAmount:
        Number(data.totalAmountAD) +
        Number(data.cgstValue) +
        Number(data.sgstValue),
      AuthorizedSignatoryByID: data.authorizeBy || "",
      ModelMappingData: data.items.map((item) => ({
        ProductModelID: item.id,
        ColorMasterID: item.ColorMasterID || "",
        HSNMasterID: item.HSNMasterID || "",
        BrandMasterID: item.BrandMasterID || "",
        Quantity: String(item.Quantity),
        UnitQuantity: item.UnitQuantity,
        Price: String(item.Price),
      })),
    };

    const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;
    const url = `${process.env.REACT_APP_URL}/api/Updatequotationbooking/${selectdQuo?.QuotationBookingMasterID}`;
    try {
      const res = await axios.put(url, formattedData, {
        headers: {
          Authorization: sanctumToken,
        },
      });
      setSnackbarMessage(res.data.message);
      setSnackbarOpen(true);
      setLoading(false);
      fetchAdvaceOrder();
      handleClose(); // Close the dialog
      onClose && onClose(); // Invoke onClose if provided
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

  const parseColorOptions = (colorListJson) => {
    try {
      const colorList = JSON.parse(colorListJson);
      return [
        { value: "Standard", label: "Standard", id: 1 },
        ...colorList?.map((color) => ({
          value: color.Color,
          label: color.Color,
          id: color.ColorMasterID,
        })),
      ];
    } catch (error) {
      return [{ value: "Standard", label: "Standard" }];
    }
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
  }));

  const roundedStyle = () => ({});
  const removeFn = (index) => {
    remove(index);
    updateGrandResult(); // Trigger calculation

    // const newItemSelect = [...itemSelect];
    // newItemSelect.splice(index, 1);
    // setItemSelect(newItemSelect);
  };
  const handleDateChange = (newValue) => {
    setReceiptDate(dayjs(newValue).format("YYYY-MM-DD")); // Format date as "YYYY-MM-DD"
  };

  // ============================================================================================

  useEffect(() => {
    /**
     * Maps through selectdQuo.ModelMappingData and returns ColorListJson for matching ProductModelID.
     * @param {Array} modelMappingData - The ModelMappingData array from selectdQuo.
     * @param {Array} allItems - The allItems array containing product details.
     * @returns {Array} - An array of objects with ProductModelID and ColorListJson.
     */
    const mapColorListJson = (allItems, selectdQuo) => {
      const modelMappingIds =
        selectdQuo?.ModelMappingData?.map(
          (mapping) => mapping.ProductModelID
        ) || [];

      return allItems
        .filter((item) => modelMappingIds.includes(Number(item.ProductModelID)))
        .map((item) => ({
          ...item,
          ColorListJson: item?.ColorListJson || "[]", // Default to an empty array if no ColorListJson
        }));
    };

    // Example usage
    const mappedModelMappingData = mapColorListJson(allItems || [], selectdQuo);
    setItemSelect(mappedModelMappingData); // Set the itemSelect state with the mapped data
  }, [allItems, selectdQuo]); // Add dependencies to ensure it runs when these values change

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
                    <Grid item xs={7} sm={2.5}>
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

                                  updateGrandResult();
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
                    <Grid item xs={10} sm={2}>
                      <Stack direction="row" spacing={2}>
                        <FormControl
                          fullWidth
                          error={!!errors.items?.[index]?.Color} // Display error if validation fails
                        >
                          <InputLabel sx={{ color: "#1b5e20" }}>
                            Color
                          </InputLabel>
                          <Controller
                            name={`items.${index}.ColorMasterID`}
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                label="Color"
                                sx={{
                                  height: "48px",
                                  backgroundColor: "white",
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
                                onChange={(event) => {
                                  field.onChange(event.target.value); // Update form state
                                  setValue(
                                    `items.${index}.ColorMasterID`,
                                    event.target.value
                                  ); // Ensure ColorMasterID is updated
                                }}
                              >
                                <MenuItem key="-1" value={1}>
                                  Standard
                                </MenuItem>
                                {(
                                  watch(`items.${index}.AvailableColors`) ||
                                  itemSelect[index]?.ColorList ||
                                  []
                                ).map((option) => (
                                  <MenuItem key={option.ID} value={option.ID}>
                                    {option.Color}
                                  </MenuItem>
                                ))}
                              </Select>
                            )}
                          />
                          {errors.items?.[index]?.ColorMasterID && ( // Show error message
                            <FormHelperText sx={{ color: "red" }}>
                              {errors.items[index].ColorMasterID.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Stack>
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
                    {/* <Grid item xs={5} sm={1}>
                      <TextField
                        fullWidth
                        label="Discount%"
                        sx={{
                          background: "white",
                          ...greenBorderStyle,
                          "& .MuiInputBase-root": {
                            height: "3.2rem",
                          },
                        }}
                        {...register(`items.${index}.discount`)}
                        error={!!errors.items?.[index]?.discount}
                        defaultValue={0}
                        helperText={errors.items?.[index]?.discount?.message}
                        onChange={(e) => {
                          setValue(`items.${index}.discount`, e.target.value);
                          updateResult(index); // Trigger calculation
                        }}
                      />
                      {errors.items?.[index]?.discount && (
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.items[index].discount.message}
                        </FormHelperText>
                      )}
                    </Grid> */}
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
                      error={!!errors.discountDesc}
                      helperText={errors.discountDesc?.message}
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
                      fullWidth
                      type="number"
                      InputProps={{ inputProps: { min: 0 } }}
                      sx={{
                        backgroundColor: "white",
                        ...greenBorderStyle,
                        "& .MuiInputBase-root": {
                          height: "3.2rem",
                        },
                      }}
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
                    defaultValue={signatoryList?.[0]?.ID || ""}
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
