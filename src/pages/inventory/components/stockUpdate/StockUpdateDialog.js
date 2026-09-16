import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormHelperText,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  AccountCircleRounded,
  LocalPhoneRounded,
  HomeRounded,
  ApartmentRounded,
  PostAddRounded,
  AssuredWorkload,
  AddBox,
} from "@mui/icons-material";
import axios from "axios";
import SelectComponent from "react-select";
import ProductCreateForm from "../../../purchase/productPage/component/ProductCreateForm";
import SupplierEditDetailsDialog from "../../../purchase/supplier/component/supplierDetailsDialog/component/supplierEditDetailsDialog/SupplierEditDetailsDialog";
import LoadingComp from "../../../../components/loadingComp/LoadingComp";
import _ from "lodash";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Cookies from "js-cookie";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

import WarningComp from "../../../../components/warningComp/WarningComp";
import {
  productListApiFn,
  supplierListApiFn,
} from "../../../../api/purchaseApi";
import { signatoryMasterApiFn } from "../../../../api/commonApi";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const fieldStyles = {
  backgroundColor: "#fff",
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "blue" },
    "&:hover fieldset": { borderColor: "blue" },
    "&.Mui-focused fieldset": { borderColor: "blue" },
    height: "50px",
  },
  "& .MuiInputLabel-root": { color: "blue" },
  "& .MuiInputLabel-root.Mui-focused": { color: "blue" },
  "& input": { height: "15px", padding: "15.5px 14px" },
};

const round = (v, d) => Number(Math.round(v + "e" + d) + "e-" + d);

const schema = Yup.object().shape({
  SupplierId: Yup.string().required("SupplierId is required"),
  dateTime: Yup.date().required("Date and time is required"),
  items: Yup.array().of(
    Yup.object().shape({
      ProductModelID: Yup.string().required("Select Product"),
      BatchNo: Yup.string().required("required"),
      ExpiryDate: Yup.date()
        .required("required")

        .typeError("Invalid date")
        .min(new Date(), "Expiry date must be in the future"),

      MRP: Yup.string().required("required"),
      StripeOf: Yup.number()
        .typeError("Not valid")
        .required("required")
        .min(0, "Min 0"),
      StripeQty: Yup.number()
        .typeError("Not valid")
        .required("required")
        .min(0, "Min 0"),
      Price: Yup.number().typeError("Not valid").required("required"),
      // .required("Qty Per Box is required"),
      discount: Yup.number().typeError("Not valid"),
      SGSTP: Yup.number().typeError("invalid"),
      CGSTP: Yup.number().typeError("invalid"),
    })
  ),
});
const responsiveStyles = {
  formContainer: { p: { xs: 1, sm: 2, md: 3 } },
  dateField: { width: "100%" },
  selectionGrid: {
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    width: "100%",
    mt: { xs: 2, sm: 0 },
  },
  selectField: { width: { xs: "100%", sm: "45%" }, mb: { xs: 2, sm: 0 } },
  supplierButton: { width: { xs: "100%", sm: "auto" }, mt: { xs: 2, sm: 0 } },
  itemDetailsContainer: {
    width: "100%",
    p: { xs: 1, sm: 2 },
    borderRadius: "10px",
    mt: 2,
  },
  itemRow: {
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    // gap: { xs: 2, sm: 1 },
    p: { xs: 2, sm: 1 },
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    mb: 2,
    bgcolor: "white",
  },
  mobileItemField: {
    width: "100%",
    "& .MuiFormControl-root": { width: "100%" },
  },
  mobileTwoColumns: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 2,
    width: "100%",
  },
};

export default function StockUpdateDialog({
  allItems,
  companyList,
  fetchQuotationsFn,
  handleAddCustomerClose,
  transuctionUpdate,
  addStockDialogClose,
}) {
  // const [supplierList, setSupplierList] = useState([]);
  const [supplierSelect, setSupplierSelect] = useState(null);
  const [itemSelect, setItemSelect] = useState([]);
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [openSupplierDialog, setOpenSupplierDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [productList, setProductList] = useState([]);
  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;
  const [data, setFormData] = useState(null);
  const [rowsToAdd, setRowsToAdd] = useState(1);
  // const [signatoryList, setSignatoryList] = useState([]);
  const queryClient = useQueryClient();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
    defaultValues: {
      items: [
        {
          ProductModelID: "",
          Quantity: 1,
          UnitQuantity: "Piece",
          BrandName: "",
          Color: "",
          Price: 0,
          Amount: 0,
          DueDays: 0,
        },
      ],
      dateTime: new Date().toISOString().slice(0, 10),
      remarks: "",
    },
  });
  // ======================================================================================
  const results = useQueries({
    queries: [
      {
        queryKey: ["supplierListApi"],
        queryFn: supplierListApiFn,
        staleTime: Infinity,
      },
      {
        queryKey: ["productListApi"],
        queryFn: productListApiFn,
        staleTime: Infinity,
      },
      {
        queryKey: ["signatoryMasterApi"],
        queryFn: signatoryMasterApiFn,
        staleTime: Infinity,
      },

      ,
    ],
  });

  const [supplierListQuery, productListQuery, signatoryListQuery] = results;

  const supplierList = supplierListQuery.data?.data?.data || [];
  const productList = productListQuery.data?.data || [];
  const signatoryListString = signatoryListQuery?.data?.data?.data || [];

  const signatoryList =
    JSON.parse(signatoryListString?.[0]?.SignatoryDetails || "{}")
      ?.SignatoryDetails || [];

  const isLoading =
    supplierListQuery.isLoading ||
    productListQuery.isLoading ||
    signatoryListQuery.isLoading;
  const isError =
    supplierListQuery.isError ||
    productListQuery.isError ||
    signatoryListQuery.isError;

  // ======================================================================================

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const updateGrandResult = _.debounce(() => {
    const items = getValues("items");
    const totalResult = items?.reduce(
      (acc, item) =>
        (Number(item.Price) || 0) * (Number(item.Quantity) || 0) -
        ((Number(item.Price) || 0) *
          (Number(item.Quantity) || 0) *
          (Number(item.discount) || 0)) /
          100 +
        acc,
      0
    );
    const totalAmountBd = round(totalResult, 2);
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
    setValue(
      "grandTotalAmount",
      round(totalAmountAD + sgstValue + cgstValue, 2)
    );
  }, 300);

  const [warningStatus, setWarningStatus] = useState(false);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  // ====================================================warning ================================================
  const warningDataFn = async (data1) => {
    if (data1) {
      setLoading(true);
      const finalData = {
        ReceiptDate: data1?.dateTime, // already formatted as yyyy-mm-dd
        EntityID: data1?.SupplierId,
        EntityType: "SUPP",
        BillCode: "INVP",
        BillEntityType: null,
        BillEntityID: null,
        QuotationBookingMasterId: null,
        // Source:"O",
        QuotationNo: null,
        CheckedByID: null, // Replace with actual value if needed
        PreparedByID: null, // Replace with actual value if needed
        AuthorizedSignatoryByID: null,
        ReceiptProductModelList: data1?.items?.map((item) => {
          const selectedItem =
            itemOptions.find((opt) => opt.value === item.ProductModelID) || {};
          const colorOption = selectedItem.ColorListJson
            ? JSON.parse(selectedItem.ColorListJson).find(
                (c) => c.Color === item.Color
              )
            : null;
          return {
            ProductModelID: item.ProductModelID,
            ColorMasterID: null,
            HSNMasterID: null,
            BrandMasterID: null,

            CGSTP: null,
            SGSTP: null,
            Quantity: item.StripOf * item.StripQty || 0,
            Unit: null,
            Rate: item.Price,
            DISP: item.discount,
            Amount: item.result,
            UnitQuantity: null,
            QtyPerBox: null,
            // Ensure ExpiryDate is always in 'YYYY-MM-DD' format
            ExpiryDate: item.ExpiryDate
              ? dayjs(item.ExpiryDate).format("YYYY-MM-DD")
              : null,

            MRP: item.MRP || 0,
            StripOf: item.StripeOf || 0,
            StripQty: item.StripeQty || 0,
            BatchNo: item.BatchNo || "",
            Quantity:
              Number(item.StripeOf || 0) * Number(item.StripeQty || 0) +
              Number(item.lQty || 0),
          };
        }),
        PaymentDetails: [],
      };
      console.log("Final Data to POST:", finalData);
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_URL}/api/directStockUpdate`,
          finalData,
          { headers: { Authorization: sanctumToken } }
        );
        // console.log("POST success:", response.data);
        setLoading(false);
        if (response.data) {
          setOpenProductDialog(false);
          setSuccessSnackbarOpen(true); // Show success message
          // transuctionUpdate();
          addStockDialogClose();
          // queryClient.invalidateQueries(["allTransuctionListApi"]);
          // queryClient.invalidateQueries(["purchaseTransuctionListApi"]);
          // queryClient.invalidateQueries(["saleTransuctionListApi"]);
          // queryClient.invalidateQueries(["PurchaseReturTransuctionListApi"]);
          // queryClient.invalidateQueries(["SaleReturnTransuctionListApi"]);
        }

        const queryKeys = [
          ["allTransuctionListApi"],
          ["purchaseTransuctionListApi"],

          ["inventoryGraphApi"],
          ["productListApi"],
          ["inventoryListApi"],
          // ==========================================
          ["allTransuctionListApiFn"],
          ["purchaseTransuctionListApiFn"],
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
        console.log("POST error:", error);
        setLoading(false);
      }
    }
  };

  const supplierOptions = Array.isArray(supplierList)
    ? supplierList?.map((s) => ({
        label: s.SupplierName,
        id: s.SupplierID,
        entityId: s.SupplierID,
        name: s.SupplierName,
        contactPerson: s.ContactPerson,
        MobileNo1: s.MobileNo1,
        address: `${s.AddressLine1 || ""} ${s.AddressLine2 || ""}`,
        company: s.companyName,
        bank: `${s.BankName || ""} ${s.AccountNumber || ""} Ifsc: ${s.IFSCCode || ""}`,
      }))
    : [];
  const companyOptions = Array.isArray(companyList)
    ? companyList?.map((c) => ({
        label: c.CompanyName,
        id: c.CompanyID,
        name: c.CompanyName,
        phone: c.PhoneNumber1,
        address: `${c.AddressLine1} ${c.AddressLine2}`,
        email: c.CompanyEmail,
        gst: c.GSTNumber,
        bank: `${c.BankName} ${c.AccountNumber} Ifsc: ${c.IFSCCode}`,
      }))
    : [];
  const itemOptions = Array.isArray(productList)
    ? productList?.map((i) => ({
        value: i.ProductModelID,
        label: `${i.ModelNumber}`,
        name: `${i.ModelNumber}`,
        availableQuantity: i.AvailableQuantity,
        ...i,
      }))
    : [];

  const formatDateYYYYMMDD = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return [
      d.getFullYear(),
      `${d.getMonth() + 1}`.padStart(2, "0"),
      `${d.getDate()}`.padStart(2, "0"),
    ].join("-");
  };

  const onSubmit = async (data) => {
    data.dateTime = formatDateYYYYMMDD(data.dateTime);
    await warningDataFn(data);
  };

  const handleProductDialogOpen = () => setOpenProductDialog(true);
  const handleProductDialogClose = () => setOpenProductDialog(false);
  const handleSupplierDialogOpen = () => setOpenSupplierDialog(true);
  const handleSupplierDialogClose = () => setOpenSupplierDialog(false);

  const parseColorOptions = (colorListJson) => {
    try {
      const colorList = JSON.parse(colorListJson);
      return [
        { value: "Standard", label: "Standard" },
        ...colorList?.map((c) => ({ value: c.Color, label: c.Color })),
      ];
    } catch {
      return [{ value: "Standard", label: "Standard" }];
    }
  };

  const removeFn = (index) => {
    remove(index);
    const newItemSelect = [...itemSelect];
    newItemSelect.splice(index, 1);
    setItemSelect(newItemSelect);
  };

  const renderSelectComponent = (
    index,
    field,
    options,
    placeholder,
    onChange
  ) => (
    <SelectComponent
      {...field}
      value={
        field.value ? options.find((option) => option.id === field.value) : null
      }
      onChange={(selectedOption) => {
        field.onChange(selectedOption ? selectedOption.id : "");
        onChange(selectedOption);
      }}
      options={options}
      getOptionLabel={(option) => option.label}
      getOptionValue={(option) => option.id}
      placeholder={placeholder}
      isSearchable
      styles={{
        control: (base, state) => ({
          ...base,
          backgroundColor: "#fff",
          color: "blue",
          borderColor: state.isFocused ? "darkgreen" : "blue",
          "&:hover": { borderColor: "darkblue" },
          boxShadow: "none",
          minHeight: "50px",
          borderRadius: "6px",
          width: "100%",
          ...fieldStyles,
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: "#fff", // dropdown background stays white
          boxShadow: "none",
          zIndex: 100,
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isSelected
            ? "blue" // selected item
            : state.isFocused
              ? "blue" // hover
              : "#fff", // default white
          color: state.isSelected || state.isFocused ? "#fff" : "#000",
          padding: "10px",
        }),
        singleValue: (base) => ({ ...base, color: "blue" }),
        placeholder: (base) => ({ ...base, color: "blue" }),
      }}
    />
  );

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name && name.includes("UnitQuantity")) {
        const index = name.split(".")[1];
        const unit = value.items[index].UnitQuantity;
        let qtyPerBox = unit === "Pair" ? 2 : unit === "Dozen" ? 12 : 1;
        setValue(`items.${index}.QtyPerBox`, qtyPerBox);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  // useEffect(() => {
  //   async function fetchSuppliers() {
  //     try {
  //       const token = Cookies.get("token");
  //       const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;
  //       const res = await axios.get(
  //         `${process.env.REACT_APP_URL}/api/getSuppliers`,
  //         {
  //           headers: { Authorization: sanctumToken },
  //         }
  //       );
  //       if (Array.isArray(res.data?.data)) {
  //         console.log("Fetched suppliers:", res.data.data);
  //         setSupplierList(res.data.data);
  //       } else {
  //         setSupplierList([]);
  //       }
  //     } catch (e) {
  //       setSupplierList([]);
  //     }
  //   }
  //   fetchSuppliers();
  // }, []);

  // useEffect(() => {
  //   async function fetchProducts() {
  //     try {
  //       const token = Cookies.get("token");
  //       const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;
  //       const res = await axios.get(
  //         `${process.env.REACT_APP_URL}/api/getProductModels`,
  //         {
  //           headers: { Authorization: sanctumToken },
  //         }
  //       );
  //       if (Array.isArray(res.data)) {
  //         console.log("Fetched products:", res.data);
  //         setProductList(res.data);
  //       } else {
  //         setProductList([]);
  //       }
  //     } catch (e) {
  //       setProductList([]);
  //     }
  //   }
  //   fetchProducts();
  // }, []);

  // useEffect(() => {
  //   async function fetchSignatories() {
  //     try {
  //       const token = Cookies.get("token");
  //       const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;
  //       const res = await axios.get(
  //         `${process.env.REACT_APP_URL}/api/getsignatorydetails`,
  //         {
  //           headers: { Authorization: sanctumToken },
  //         }
  //       );
  //       if (res.data?.data?.[0]?.SignatoryDetails) {
  //         const details = JSON.parse(res.data.data[0].SignatoryDetails);
  //         if (details?.SignatoryDetails?.CheckedByList) {
  //           setSignatoryList(details.SignatoryDetails.CheckedByList);
  //           console.log(
  //             "Fetched CheckedByList:",
  //             details.SignatoryDetails.CheckedByList
  //           );
  //         } else {
  //           setSignatoryList([]);
  //         }
  //       } else {
  //         setSignatoryList([]);
  //       }
  //     } catch (e) {
  //       setSignatoryList([]);
  //     }
  //   }
  //   fetchSignatories();
  // }, []);

  return (
    <Box sx={{ minHeight: "60vh", ...responsiveStyles.formContainer }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={{ xs: 1, sm: 2 }}>
          <Grid
            container
            spacing={2}
            sx={{
              p: { xs: 1, sm: 1 },
              borderRadius: "10px",
              width: "100%",
              marginLeft: { xs: 0, sm: 0.35 },
            }}
          >
            <Grid item xs={12} sm={2}>
              <Controller
                name="dateTime"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Date"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                      sx: {
                        color: "#1d7d1d",
                        "&.Mui-focused": { color: "darkgreen" },
                      },
                    }}
                    sx={{
                      backgroundColor: "#fff",
                      "& .MuiOutlinedInput-root": {
                        height: "50px",
                        "& fieldset": { borderColor: "#1d7d1d" },
                        "&:hover fieldset": { borderColor: "#1d7d1d" },
                        "&.Mui-focused fieldset": { borderColor: "#1d7d1d" },
                        "& input": { height: "15px", padding: "15.5px 14px" },
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={10}>
              <Box sx={responsiveStyles.selectionGrid}>
                <Box sx={responsiveStyles.selectField}>
                  {/* Replace company dropdown with Quotation No input */}
                  <TextField
                    fullWidth
                    label="Quotation No"
                    {...register("QuotationNo")}
                    sx={fieldStyles}
                  />
                  <Typography color="error">
                    {errors.QuotationNo?.message}
                  </Typography>
                </Box>

                <Box sx={{ ...responsiveStyles.selectField, mx: 2 }}>
                  <Controller
                    name="SupplierId"
                    control={control}
                    render={({ field }) =>
                      renderSelectComponent(
                        null,
                        field,
                        supplierOptions,
                        "Select Supplier",
                        (selectedOption) => {
                          setValue(
                            "SupplierId",
                            selectedOption ? selectedOption.id : ""
                          );
                          setSupplierSelect(selectedOption);
                        }
                      )
                    }
                  />
                  <Typography color="error">
                    {errors.SupplierId?.message}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  onClick={handleSupplierDialogOpen}
                  sx={{
                    ...responsiveStyles.supplierButton,
                    height: "3rem",
                    color: "#fff",
                    fontWeight: "bold",
                    bgcolor: "#235c35",
                    textTransform: "none",
                  }}
                >
                  New supplier
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  flexWrap: "wrap",
                  gap: 2,
                  justifyContent: "space-around",
                }}
              >
                {supplierSelect?.name && (
                  <Grid item>
                    <Typography
                      variant="body1"
                      gutterBottom
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#235c35",
                      }}
                    >
                      <AccountCircleRounded
                        sx={{ fontSize: { xs: 30 }, mr: 1 }}
                      />{" "}
                      {supplierSelect.name}
                    </Typography>
                  </Grid>
                )}
                {supplierSelect?.MobileNo1 && (
                  <Grid item>
                    <Typography
                      variant="body1"
                      gutterBottom
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#235c35",
                      }}
                    >
                      <LocalPhoneRounded sx={{ fontSize: { xs: 30 }, mr: 1 }} />{" "}
                      {supplierSelect.MobileNo1} ({supplierSelect.contactPerson}
                      )
                    </Typography>
                  </Grid>
                )}
                {supplierSelect?.address && (
                  <Grid item>
                    <Typography
                      variant="body1"
                      gutterBottom
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#235c35",
                      }}
                    >
                      <HomeRounded sx={{ fontSize: { xs: 30 }, mr: 1 }} />{" "}
                      {supplierSelect.address == "null"
                        ? ""
                        : supplierSelect.address}
                    </Typography>
                  </Grid>
                )}
                {supplierSelect?.bank && (
                  <Grid item>
                    <Typography
                      variant="body1"
                      gutterBottom
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#235c35",
                      }}
                    >
                      <AssuredWorkload sx={{ fontSize: { xs: 30 }, mr: 1 }} />{" "}
                      {supplierSelect.bank}
                    </Typography>
                  </Grid>
                )}
                {supplierSelect?.company && (
                  <Grid item>
                    <Typography
                      variant="body1"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#235c35",
                      }}
                    >
                      <ApartmentRounded sx={{ fontSize: { xs: 30 }, mr: 1 }} />{" "}
                      {supplierSelect.company}
                    </Typography>
                  </Grid>
                )}
              </Box>
            </Grid>
          </Grid>
          <Box sx={responsiveStyles.itemDetailsContainer}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  display: "flex",
                  gap: ".5rem",
                  alignItems: "center",
                  color: "blue",
                  fontWeight: "bold",
                }}
              >
                <PostAddRounded color="blue" /> Item Details:
              </Typography>
              <Button
                variant="contained"
                onClick={handleProductDialogOpen}
                sx={{
                  height: "3rem",
                  color: "#fff",
                  fontWeight: "bold",
                  bgcolor: "#235c35",
                  textTransform: "none",
                  mb: 4,
                }}
              >
                New Product
              </Button>
            </Box>
            <Grid
              container
              spacing={2}
              sx={{ px: 1, justifyContent: "center", alignItems: "center" }}
            >
              {fields?.map((field, index) => (
                <Box
                  key={field.id}
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "stretch", sm: "center" },
                    gap: 2,
                    p: 2,
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    mb: 2,
                    bgcolor: "white",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#1b5e20",
                      backgroundColor: "#e8f5e9",
                      p: "0.25rem",
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: { xs: 0, sm: "1rem" },
                      mb: { xs: 1, sm: 0 },
                      fontSize: "0.875rem",
                      fontWeight: "bold",
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flex: 1,
                      gap: 2,
                      flexWrap: { xs: "wrap", sm: "nowrap" },
                      alignItems: "center",
                    }}
                  >
                    {/* Product Selector==================================================== */}
                    <Box sx={{ minWidth: 100, flex: 1.5 }}>
                      <Controller
                        name={`items.${index}.ProductModelID`}
                        control={control}
                        render={({ field }) => (
                          <>
                            <SelectComponent
                              {...field}
                              value={
                                (itemOptions || []).find(
                                  (option) => option.value === field.value
                                ) || null
                              }
                              onChange={(selectedOption) => {
                                // Safe check for allItems
                                let selectedItem = (allItems || []).find(
                                  (item) =>
                                    item.ProductModelID ===
                                    selectedOption?.value
                                );

                                if (!selectedItem && selectedOption) {
                                  selectedItem = selectedOption;
                                }

                                // Update form field
                                field.onChange(
                                  selectedOption ? selectedOption.value : ""
                                );

                                setValue(
                                  `items.${index}.ProductModelID`,
                                  selectedOption?.value || ""
                                );

                                setValue(
                                  `items.${index}.MRP`,
                                  selectedItem?.MRP || 0
                                );

                                // Update itemSelect state safely
                                const newItemSelect = [...itemSelect];
                                newItemSelect[index] = selectedOption || null;
                                setItemSelect(newItemSelect);
                              }}
                              options={itemOptions || []}
                              placeholder="Select Product"
                              isSearchable={true}
                              styles={{
                                control: (provided, state) => ({
                                  ...provided,
                                  minHeight: "3.0rem",
                                  height: "3.0rem",
                                  borderColor: "green",
                                  boxShadow: state.isFocused
                                    ? "0 0 0 1px green"
                                    : "none",
                                  "&:hover": { borderColor: "green" },
                                }),
                                valueContainer: (provided) => ({
                                  ...provided,
                                  height: "3.0rem",
                                  padding: "0 8px",
                                }),
                                input: (provided) => ({
                                  ...provided,
                                  margin: "0px",
                                }),
                                indicatorsContainer: (provided) => ({
                                  ...provided,
                                  height: "3.0rem",
                                }),
                              }}
                            />
                          </>
                        )}
                      />

                      <Typography color="error">
                        {errors.items?.[index]?.ProductModelID?.message}
                      </Typography>
                    </Box>

                    <Box sx={{ minWidth: 100, flex: 1 }}>
                      <Controller
                        name={`items.${index}.BatchNo`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Batch No"
                            sx={{
                              background: "white",
                              "& .MuiInputBase-root": {
                                height: "3.2rem",
                              },
                            }}
                            error={!!errors.items?.[index]?.BatchNo}
                            helperText={errors.items?.[index]?.BatchNo?.message}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              // updateResult(index); // Trigger calculation
                            }}
                          />
                        )}
                      />
                      {/* {errors.items?.[index]?.BatchNo && (
                                            <FormHelperText sx={{ color: "red" }}>
                                              {errors.items[index].BatchNo.message}
                                            </FormHelperText>
                                          )} */}
                    </Box>
                    <Box sx={{ minWidth: 100, flex: 1 }}>
                      <Controller
                        name={`items.${index}.ExpiryDate`}
                        control={control}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              {...field}
                              label="Expiry Date"
                              format="DD-MM-YYYY"
                              value={
                                field.value
                                  ? dayjs(field.value, "YYYY-MM-DD") // parses stored string correctly
                                  : null
                              }
                              onChange={(newValue) => {
                                const formatted =
                                  newValue && dayjs(newValue).isValid()
                                    ? dayjs(newValue).format("YYYY-MM-DD")
                                    : "";
                                field.onChange(formatted); // this will save string like "2026-12-10"
                                // updateResult(index);
                              }}
                              sx={{
                                background: "white",
                                // ...greenBorderStyle,
                                "& .MuiInputBase-root": {
                                  height: "3.2rem",
                                },
                              }}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      {errors.items?.[index]?.ExpiryDate && (
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.items[index].ExpiryDate.message}
                        </FormHelperText>
                      )}
                    </Box>
                    <Box sx={{ minWidth: 100, flex: 1 }}>
                      <Controller
                        name={`items.${index}.MRP`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="MRP"
                            sx={{
                              background: "white",
                              // ...greenBorderStyle,
                              "& .MuiInputBase-root": {
                                height: "3.2rem",
                              },
                            }}
                            error={!!errors.items?.[index]?.MRP}
                            defaultValue={0}
                            helperText={errors.items?.[index]?.MRP?.message}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              // updateResult(index); // Trigger calculation
                            }}
                          />
                        )}
                      />
                      {/* {errors.items?.[index]?.MRP && (
                                            <FormHelperText sx={{ color: "red" }}>
                                              {errors.items[index].MRP.message}
                                            </FormHelperText>
                                          )} */}
                    </Box>
                    {/* Color Selector */}
                    {/* <Box sx={{ minWidth: 120, flex: 1 }}>
                      <FormControl
                        fullWidth
                        sx={fieldStyles}
                        error={!!errors.items?.[index]?.Color}
                      >
                        <InputLabel>Color</InputLabel>
                        <Controller
                          name={`items.${index}.Color`}
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              label="Color"
                              sx={{ height: "48px" }}
                            >
                              {parseColorOptions(
                                itemSelect[index]?.ColorListJson || "[]"
                              )?.map((option) => (
                                <MenuItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                      </FormControl>
                    </Box> */}
                    {/* Quantity */}
                    <Box sx={{ minWidth: 100, flex: 1 }}>
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
                              // updateResult(index); // Trigger calculation
                            }}
                          />
                        )}
                      />
                      {/* {errors.items?.[index]?.StripeOf && (
                                        <FormHelperText sx={{ color: "red" }}>
                                          {errors.items[index].StripeOf.message}
                                        </FormHelperText>
                                      )} */}
                    </Box>
                    <Box sx={{ minWidth: 100, flex: 1 }}>
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
                              // ...greenBorderStyle,
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
                              // updateResult(index); // Trigger calculation
                            }}
                          />
                        )}
                      />
                    </Box>
                    {/* Unit Selector */}

                    {/* Remove Button */}
                    <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
                      <IconButton
                        onClick={() => removeFn(index)}
                        sx={{ color: "red" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              ))}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%",
                  gap: 2,
                }}
              >
                <FormControl
                  variant="outlined"
                  sx={{
                    minWidth: 40,
                    height: "2rem",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "darkgreen" },
                      "&:hover fieldset": { borderColor: "darkgreen" },
                      "&.Mui-focused fieldset": { borderColor: "darkgreen" },
                    },
                  }}
                >
                  <InputLabel
                    id="rows-to-add-label"
                    sx={{
                      color: "darkgreen",
                      fontWeight: "bold",
                      "&.Mui-focused": {
                        color: "darkgreen",
                        fontWeight: "bold",
                      },
                      "&:hover": { color: "darkgreen", fontWeight: "bold" },
                    }}
                  >
                    -------
                  </InputLabel>
                  <Select
                    labelId="rows-to-add-label"
                    value={rowsToAdd}
                    onChange={(e) => setRowsToAdd(e.target.value)}
                    label="Rows"
                    sx={{ height: "2rem" }}
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <MenuItem
                        key={value}
                        value={value}
                        sx={{
                          fontWeight: rowsToAdd === value ? "bold" : "normal",
                          color: rowsToAdd === value ? "darkgreen" : "inherit",
                        }}
                      >
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  onClick={() => {
                    for (let i = 0; i < rowsToAdd; i++)
                      append({
                        ProductModelID: "",
                        Quantity: 1,
                        UnitQuantity: "Box",
                        BrandName: "",
                        Color: "red",
                        Price: 0,
                        Amount: 0,
                        DueDays: 0,
                      });
                  }}
                  sx={{
                    height: "2rem",
                    color: "blue",
                    borderColor: "red",
                  }}
                  startIcon={<AddBox color="red" />}
                >
                  Add
                </Button>
              </Box>
            </Grid>

            <Grid container spacing={2} sx={{ marginTop: 0 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Remarks"
                  {...register("remarks")}
                  sx={fieldStyles}
                  InputProps={{
                    sx: { height: "50px", padding: "0", fontSize: "14px" },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl
                  fullWidth
                  sx={fieldStyles}
                  error={!!errors.AuthorizedSignatoryByID}
                >
                  <InputLabel>Authorized By</InputLabel>
                  <Controller
                    name="AuthorizedSignatoryByID"
                    control={control}
                    defaultValue={signatoryList[0]?.ID || ""}
                    render={({ field }) => (
                      <Select
                        {...field}
                        label="Authorized By"
                        value={field.value ?? ""}
                        sx={{ height: "50px" }}
                      >
                        {signatoryList?.AuthorizedSignatoryList &&
                          signatoryList?.AuthorizedSignatoryList.map(
                            (signatory) => (
                              <MenuItem key={signatory.ID} value={signatory.ID}>
                                {signatory.Name}
                              </MenuItem>
                            )
                          )}
                      </Select>
                    )}
                  />
                  {errors.AuthorizedSignatoryByID && (
                    <FormHelperText error>
                      {errors.AuthorizedSignatoryByID.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: { xs: 2, sm: 2 },
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              type="submit"
              sx={{
                height: "3rem",
                width: { xs: "100%", sm: "auto" },
                textTransform: "none",
                backgroundColor: "#4D795B",
              }}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
      <Dialog
        open={openProductDialog}
        onClose={() => {
          handleProductDialogClose();
          reset();
        }}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <ProductCreateForm />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleProductDialogClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openSupplierDialog}
        onClose={() => {
          handleSupplierDialogClose();
          reset();
        }}
        fullWidth
        maxWidth="lg"
      >
        <DialogContent>
          <SupplierEditDetailsDialog />
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
      <LoadingComp loading={loading} />
      <Snackbar
        open={successSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <MuiAlert
          onClose={() => setSuccessSnackbarOpen(false)}
          severity="success"
          elevation={6}
          variant="filled"
          sx={{ width: "100%" }}
        >
          Stock updated successfully!
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}
//       >
//         <DialogContent>
//           <SupplierEditDetailsDialog />
//         </DialogContent>
//         <DialogActions></DialogActions>
//       </Dialog>
//       <LoadingComp loading={loading} />
//       <Snackbar
//         open={successSnackbarOpen}
//         autoHideDuration={3000}
//         onClose={() => setSuccessSnackbarOpen(false)}
//         anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
//       >
//         <MuiAlert
//           onClose={() => setSuccessSnackbarOpen(false)}
//           severity="success"
//           elevation={6}
//           variant="filled"
//           sx={{ width: "100%" }}
//         >
//           Stock updated successfully!
//         </MuiAlert>
//       </Snackbar>
//     </Box>
//   );
// }
//           elevation={6}
//           variant="filled"
//           sx={{ width: "100%" }}
//         >
//           Stock updated successfully!
//         </MuiAlert>
//       </Snackbar>
//     </Box>
//   );
// }
