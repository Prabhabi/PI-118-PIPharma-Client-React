import React, { useEffect, useState, useCallback } from "react";
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
  MenuItem as MuiMenuItem,
  FormHelperText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Divider,
  Breadcrumbs,
  Link,
  Stack,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import axios from "axios";
import {
  AccountCircleRounded as AccountIcon,
  LocalPhoneRounded as PhoneIcon,
  HomeRounded as HomeIcon,
  ApartmentRounded as CompanyIcon,
  PostAddRounded as PostAddIcon,
  AssuredWorkload as BankIcon,
} from "@mui/icons-material";
import SelectComponent from "react-select";
import ProductCreateForm from "../../../productPage/component/ProductCreateForm";
import SupplierEditDetailsDialog from "../../../supplier/component/supplierDetailsDialog/component/supplierEditDetailsDialog/SupplierEditDetailsDialog";
import LoadingComp from "../../../../../components/loadingComp/LoadingComp";
import LibraryAddIcon from "@mui/icons-material/AddBox";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import quotationPdf from "./QuotationPdf";
import Cookies from "js-cookie"; // Import Cookies
import WarningComp from "../../../../../components/warningComp/WarningComp";
import QuotationEmailDirectForm from "./component/quotationEmail/QuotationEmailDirectForm";
import advncedORderPdf from "../../../../sales/AdvncedORder/components/AdvanceORderForm/AdvncedORderPdf";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { BlobProvider } from "@react-pdf/renderer";
import AdvncedORderPdf from "../../../../sales/AdvncedORder/components/AdvanceORderForm/AdvncedORderPdf";
import _, { get, set, round } from "lodash";

const fieldStyles = {
  backgroundColor: "#fff",
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#1976d2" },
    "&:hover fieldset": { borderColor: "#1976d2" },
    "&.Mui-focused fieldset": { borderColor: "#1976d2" },
    height: "50px",
  },
  "& .MuiInputLabel-root": {
    color: "#1976d2",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#1976d2",
  },
  "& input": {
    height: "15px",
    padding: "15.5px 14px",
  },
};

const schema = Yup.object().shape({
  SupplierId: Yup.string().required("Supplier is required"), // Ensure validation for SupplierId
  CompanyId: Yup.string().required("Company is required"), // Ensure validation for CompanyId
  dateTime: Yup.date()
    .typeError("Date is required")
    .required("Date is required"),
  AuthorizedSignatoryByID: Yup.string().required(
    "Authorized Signatory is required"
  ), // Add this line
  items: Yup.array().of(
    Yup.object().shape({
      ProductModelID: Yup.string().required("Select Product"),

      StripeOf: Yup.number().typeError("Not valid").min(0, "Min 0"),
      StripeQty: Yup.number().typeError("Not valid").min(0, "Min 0"),
      Price: Yup.number().typeError("Not valid"),
      // .required("Qty Per Box is required"),
      discount: Yup.number().typeError("Not valid"),
      SGSTP: Yup.number().typeError("invalid"),
      CGSTP: Yup.number().typeError("invalid"),
    })
  ),
});

// Add these responsive styles at the top
const responsiveStyles = {
  formContainer: {
    padding: { xs: 1, sm: 2, md: 3 },
  },
  dateField: {
    width: { xs: "100%", sm: "100%", md: "100%" },
  },
  selectionGrid: {
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    gap: 2,
    width: "100%",
    mt: { xs: 2, sm: 0 },
  },
  selectField: {
    width: { xs: "100%", sm: "45%" },
    mb: { xs: 2, sm: 0 },
  },
  supplierButton: {
    width: { xs: "100%", sm: "auto" },
    mt: { xs: 2, sm: 0 },
  },
  itemDetailsContainer: {
    width: "100%",
    padding: { xs: 1, sm: 2 },
    borderRadius: "10px",
    mt: 2,
  },
  itemRow: {
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    gap: { xs: 2, sm: 1 },
    p: { xs: 2, sm: 1 },
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    mb: 2,
    bgcolor: "white",
  },
  mobileItemField: {
    width: "100%",
    "& .MuiFormControl-root": {
      width: "100%",
    },
  },
  mobileTwoColumns: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 2,
    width: "100%",
  },
  deleteButton: {
    alignSelf: { xs: "flex-end", sm: "center" },
  },
  summaryTable: {
    "& .MuiTableRow-root": {
      display: {
        xs: "flex",
        sm: "grid",
      },
      flexDirection: { xs: "column", sm: "unset" },
      gridTemplateColumns: {
        xs: "1fr",
        sm: "repeat(2, 1fr)",
        md: "repeat(4, 1fr)",
      },
      gap: { xs: 2, sm: 1 },
    },
    "& .MuiTableCell-root": {
      width: { xs: "100%", sm: "auto" },
      padding: { xs: 1, sm: 2 },
    },
  },
};

export default function QuotationFormOld({
  supplierList,
  allItems,
  companyList,
  signatoryList,
  fetchQuotationsFn,
  handleAddCustomerClose,
  fetchProduct,
}) {
  const queryClient = useQueryClient(); // Add this line to define queryClient
  const [supplierSelect, setSupplierSelect] = useState(null);
  const [companySelect, setCompanySelect] = useState(null);
  const [itemSelect, setItemSelect] = useState([]);
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [openSupplierDialog, setOpenSupplierDialog] = useState(false);
  const [resData, setResData] = useState(null);
  const [triggerPrint, setTriggerPrint] = useState(false);
  const [pdfTriggerCount, setPdfTriggerCount] = useState(0); // <-- counter state
  const pdfBlockRef = React.useRef(false); // Block duplicate PDF triggers
  const [row, setRow] = useState(null);

  const [loading, setLoading] = useState(false);
  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;
  // console.log("Sanctum Token:", sanctumToken);
  // console.log(supplierSelect);
  // ===============================================for email section ===========================================
  const [openEmailButton, setOpenEmailButton] = React.useState(false);
  const [openEmail, setOpenEmail] = React.useState(false);
  const [emailFormData, setEmailFormData] = React.useState({});
  const [emailmsz, setEmailMsz] = React.useState(false);
  const [status, setStatus] = React.useState(null);
  const [openDia, setOpenDia] = React.useState(false);
  const [data, setFormData] = React.useState(null);
  const successFunction = (data) => {
    // setSuccessMsz(data);
    // console.log("Success function called with data:", data); // Debug log
    if (data) {
      setStatus(2); // Update status to 2 when email is sent successfully
    }
  };

  const emailMszFn = (data) => {
    // console.log("emailMszFn called with data:", data); // Debug log
    setEmailMsz(data); // Ensure this is called with the correct value
    // console.log("Updated emailmsz state:", data); // Verify state update
  };
  // console.log("email msz", emailmsz);

  const handleEmaildata = (data) => {
    setEmailFormData(data);
  };

  const handleClickOpenEmail = () => {
    isValid && setOpenEmail(true);
  };

  const handleCloseEmail = () => {
    setOpenEmail(false);
  };

  // ===========================================================================================================
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
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    getValues, // Add getValues here
    reset, // Add reset here
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit", // Add this line to validate on change

    defaultValues: {
      items: [
        {
          ProductModelID: "",
          Quantity: 1,
          UnitQuantity: "Piece",
          BrandName: "",
          Amount: 0,
          DueDays: 0,
          SGSTP: 5,
          CGSTP: 5,
        },
      ],
      dateTime: new Date().toISOString().slice(0, 10),
      remarks: "",
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

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
        console.log("itemQty", itemQty);
        const itemResult = itemQty * (Number(item.Price) || 0);
        const discountAmount =
          (itemResult * (Number(item.discount) || 0)) / 100;
        console.log("itemResult", itemResult);
        return acc + itemResult - discountAmount;
      }, 0);
      setValue("NetTotalAmount", round(netTotalAmount, 2));
      // ===========================

      const totalGst = items?.reduce((acc, item, index) => {
        const Quantity =
          (Number(StripeOf) || 0) * (Number(StripeQty) || 0) +
          (Number(lQty) || 0);
        console.log("Quantity", Quantity);

        // Calculate base result
        const baseResult = (Number(Price) || 0) * Quantity || 0;
        console.log("baseResult", baseResult);

        const discountAmount =
          (baseResult * (Number(item.discount) || 0)) / 100;
        console.log("discountAmount", discountAmount);
        const mainAmount = baseResult - discountAmount;
        console.log("mainAmount", mainAmount);

        const sgstValue = (round(mainAmount) * (Number(item.SGSTP) || 0)) / 100;
        const cgstValue = (round(mainAmount) * (Number(item.CGSTP) || 0)) / 100;
        console.log("sgstValue", sgstValue);
        console.log("cgstValue", cgstValue);

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
  // New state to track PDF generation
  const [pdfGenerated, setPdfGenerated] = useState(false);

  // useEffect(() => {
  //   if (pdfGenerated) {
  //     const queryKeys = [
  //       ["quotationtListApi"],
  //       // ["quotationGraphApi"],
  //       // ["quoPurYearGraphApi"],
  //       // // ...other query keys...
  //     ];
  //     queryKeys.forEach((key) => {
  //       queryClient.invalidateQueries(key, { refetchType: "active" });
  //     });
  //     setPdfGenerated(false); // Reset for next time
  //   }
  // }, [pdfGenerated]);

  //  =======================================quotation warning section ======================================
  const [warningStatus, setWarningStatus] = useState(false);
  const [warningData, setWarningData] = useState(null);
  const warningDataFn = async (data1) => {
    setWarningStatus(false);
    if (data1) {
      setLoading(true);

      // Define missing variables
      const subTotal = getValues("totalAmountBD");
      const discount = getValues("discount");
      const discountedAmount = getValues("totalAmountAD");

      const cgst = round(getValues("CGSTP"), 2); // Round to 2 decimal places
      const sgst = round(getValues("SGSTP"), 2); // Round to 2 decimal places
      const netTotalAmount = getValues("grandTotalAmount");

      const finalData = {
        EntityType: "SUPP",
        EntityID: +supplierSelect.id,
        BillEntityType: "COMP",
        BillEntityID: +companySelect.id,
        BillCode: "QUO",
        QuotationDate: data?.dateTime.slice(0, 10),
        QABRemarks: data?.remarks,
        TotalAmountBD: null,
        Discount: null,
        DiscountAmount: subTotal - discountedAmount,
        TotalAmountAD: null,
        CGSTP: 0,
        CGSTAmount: round(discountedAmount * (cgst / 100), 2),
        SGSTP: 0,
        Discount: Number(data?.discount),
        SGSTAmount: round(data?.TotalGst, 2),
        GrandTotalAmount: data.GrandTotalAmount || 0,
        RoundOffAmount: netTotalAmount - netTotalAmount,
        NetTotalAmount: data.NetTotalAmount || 0,
        AuthorizedSignatoryByID: data?.AuthorizedSignatoryByID,

        ModelMappingData: data.items.map((item, index) => ({
          ProductModelID: item.ProductModelID,
          ColorMasterID: 1,
          BatchNo: item.BatchNo || null,
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
      console.log("Final Data:", finalData); // Log the final data to be sent
      console.log(finalData);

      // 1. Generate PDF first
      try {
        await fetchImageAndGeneratePdf(finalData);
      } catch (err) {
        console.error("PDF generation error:", err);
      }

      // 2. Then call API
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_URL}/api/postquotationbooking`,
          finalData,
          {
            headers: {
              Authorization: sanctumToken,
            },
          }
        );
        console.log("Response:", response.data); // Log the response data
        const responseData = Array.isArray(response.data)
          ? response.data[0]
          : response.data;

        if (responseData.ModelMappingData) {
          setRow(responseData);
          // Only trigger PDF if NOT sending email
          if (!openEmailButton && !triggerPrint) {
            setTriggerPrint(true);
            setPdfTriggerCount(0); // Reset counter for each new quotation
          }
          openEmailButton && setResData(responseData);
          openEmailButton && setOpenEmail(true);
          openEmailButton && setEmailMsz(false);
          openEmailButton || handleAddCustomerClose();
        }

        // Now, refetch queries after PDF generation
        const queryKeys = [
          ["quotationGraphApi"],
          ["quoPurYearGraphApi"],
          // ...other query keys...
          // REMOVE ["signatoryMasterApi"] from here!
        ];
        queryKeys.forEach((key) => {
          queryClient.invalidateQueries(key, { refetchType: "active" });
        });
        setLoading(false);
      } catch (error) {
        console.error("Error posting data:", error);
        setLoading(false);
      }
    }
  };

  //  =============================================================================

  //  =============================================================================

  const roundedStyle = () => ({
    backgroundColor: "#fff",
    outline: "none",
    border: "none",
    "& .MuiOutlinedInput-root": {
      "& fieldset": { outline: "none" },
      "&:hover fieldset": { outline: "none" },
      "&.Mui-focused fieldset": { outline: "none" },
      height: "50px", // Set height for all fields
    },
  });
  const greenBorderStyle = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#1976d2",
      },
      "&:hover fieldset": {
        borderColor: "#1976d2",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#1976d2",
      },
      height: "50px", // Set height for all fields
    },
    "& .MuiInputLabel-root": {
      color: "#1976d2",
    },
    "& .MuiFormControlLabel-root": {
      color: "#1976d2",
    },
    "& .MuiSelect-root": {
      "& fieldset": {
        borderColor: "#1976d2",
      },
      "&:hover fieldset": {
        borderColor: "#1976d2",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#1976d2",
      },
      height: "50px", // Set height for all fields
    },
    "& .MuiRadio-root": {
      color: "#1976d2",
      "&.Mui-checked": {
        color: "#1976d2",
      },
    },
    "& .MuiCheckbox-root": {
      color: "#1976d2",
      "&.Mui-checked": {
        color: "#1976d2",
      },
    },
  };

  const blackBorderStyle = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "black",
      },
      "&:hover fieldset": {
        borderColor: "black",
      },
      "&.Mui-focused fieldset": {
        borderColor: "black",
      },
      height: "50px", // Set height for all fields
    },
    "& .MuiInputLabel-root": {
      color: "black",
    },
    "& .MuiFormControlLabel-root": {
      color: "black",
    },
    "& .MuiSelect-root": {
      "& fieldset": {
        borderColor: "black",
      },
      "&:hover fieldset": {
        borderColor: "black",
      },
      "&.Mui-focused fieldset": {
        borderColor: "black",
      },
      height: "50px", // Set height for all fields
    },
    "& .MuiRadio-root": {
      color: "black",
      "&.Mui-checked": {
        color: "black",
      },
    },
    "& .MuiCheckbox-root": {
      color: "black",
      "&.Mui-checked": {
        color: "black",
      },
    },
  };

  // ===============option supplier ==========================

  const supplierOptions = supplierList.map((supplier) => ({
    label: supplier.SupplierName,
    id: supplier.SupplierID,
    name: supplier.SupplierName,
    contactPerson: supplier.ContactPerson,
    MobileNo1: supplier.MobileNo1,
    address: `${supplier.AddressLine1 == null ? "" : supplier.AddressLine1} ${
      supplier.AddressLine2 == null ? "" : supplier.AddressLine2
    }`,
    company: supplier.companyName,
    bank: `${supplier.BankName == null ? "" : supplier.BankName} ${
      supplier.AccountNumber == null ? "" : supplier.AccountNumber
    } Ifsc: ${supplier.IFSCCode == null ? "" : supplier.IFSCCode}`,
  }));

  const companyOptions = companyList.map((company) => ({
    label: company.CompanyName,
    id: company.CompanyID,
    name: company.CompanyName,
    phone: company.PhoneNumber1,
    address: `${company.AddressLine1} ${company.AddressLine2}`,
    email: company.CompanyEmail,
    gst: company.GSTNumber,
    bank: `${company.BankName} ${company.AccountNumber} Ifsc: ${company.IFSCCode}`,
  }));

  const itemOptions = allItems.map((item) => ({
    value: item.ProductModelID,
    label: ` ${item.ModelNumber}`,
    name: `${item.BrandName} ${item.ModelNumber}`,
    availableQuantity: item.AvailableQuantity, // Ensure available quantity is included
  }));

  // Utility function to format date as yyyy-mm-dd
  const formatDateYYYYMMDD = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    return [d.getFullYear(), month, day].join("-");
  };

  const onSubmit = async (data) => {
    // Format dateTime to yyyy-mm-dd before using
    data.dateTime = formatDateYYYYMMDD(data.dateTime);
    setWarningStatus(true);
    setFormData(data);
    setPdfTriggerCount(0); // Reset PDF counter when starting a new quotation
    setTriggerPrint(false); // Reset trigger
    pdfBlockRef.current = false; // Reset block for new quotation
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
        ...colorList.map((color) => ({
          value: color.Color,
          label: color.Color,
        })),
      ];
    } catch (error) {
      return [{ value: "Standard", label: "Standard" }];
    }
  };

  const handleInput = (input) => {
    input.value
      ? input.classList.add("has-content")
      : input.classList.remove("has-content");
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
        field.value
          ? options.find((option) => option.value === field.value)
          : null
      }
      onChange={(selectedOption) => {
        field.onChange(selectedOption ? selectedOption.value : "");
        onChange(selectedOption);
      }}
      options={options}
      placeholder={placeholder}
      isSearchable
      styles={{
        control: (base, state) => ({
          ...base,
          backgroundColor: "#fff",
          color: "#1976d2",
          borderColor: state.isFocused ? "#1976d2" : "#1976d2", // Change border color on focus
          "&:hover": {
            borderColor: "#1976d2", // Change border color on hover
          },
          boxShadow: "none",
          minHeight: "50px",
          borderRadius: "6px",
          width: "100%",
          ...fieldStyles, // Apply fieldStyles here
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: "#fff",
          boxShadow: "none",
          zIndex: 100,
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused ? "#1976d2" : "#fff",
          color: state.isFocused ? "#fff" : "#000",
          padding: "10px",
        }),
        singleValue: (base) => ({
          ...base,
          color: "#1976d2",
        }),
        placeholder: (base) => ({
          ...base,
          color: "#1976d2",
        }),
      }}
    />
  );

  const fetchImageAndGeneratePdf = async (data) => {
    try {
      const response = await axios.get(data.ModelMappingData[0].Image1, {
        responseType: "blob",
      });
      const imageUrl = URL.createObjectURL(response.data);
      quotationPdf({ ...data, imageUrl });
    } catch (error) {
      // console.error("Error fetching image:", error);
    }
  };

  const [rowsToAdd, setRowsToAdd] = useState(1); // Add this state

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name && name.includes("UnitQuantity")) {
        const index = name.split(".")[1];
        const unit = value.items[index].UnitQuantity;
        let qtyPerBox = "";
        if (unit === "Pair") qtyPerBox = 2;
        else if (unit === "Dozen") qtyPerBox = 12;
        else if (unit === "Piece") qtyPerBox = 1;
        setValue(`items.${index}.QtyPerBox`, qtyPerBox);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  return (
    <Box sx={responsiveStyles.formContainer}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 5,
          mt: -4,
        }}
      >
        {/* {emailmsz && (
          <Typography
            variant="body2"
            color="success.main"
            sx={{ fontWeight: "bold", mt: 2 }}
          >
            Email sent successfully!
          </Typography>
        )} */}
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={{ xs: 1, sm: 2 }}>
          <Grid
            container
            spacing={2}
            sx={{
              // ml: { xs: 0, sm: 0.5 },
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
                        color: "#1976d2",
                        "&.Mui-focused": { color: "#1976d2" },
                      },
                    }}
                    sx={{
                      backgroundColor: "#fff",
                      "& .MuiOutlinedInput-root": {
                        height: "50px",
                        "& fieldset": { borderColor: "#1976d2" },
                        "&:hover fieldset": { borderColor: "#1976d2" },
                        "&.Mui-focused fieldset": { borderColor: "#1976d2" },
                        "& input": {
                          height: "15px",
                          padding: "15.5px 14px",
                        },
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={10}>
              <Box sx={responsiveStyles.selectionGrid}>
                <Box sx={responsiveStyles.selectField}>
                  <Controller
                    name="CompanyId"
                    control={control}
                    render={({ field }) =>
                      renderSelectComponent(
                        null,
                        field,
                        companyOptions,
                        "Select Company",
                        (selectedOption) => {
                          setValue(
                            "CompanyId",
                            selectedOption ? selectedOption.id : ""
                          );
                          setCompanySelect(selectedOption);
                        }
                      )
                    }
                  />
                  <Typography color="error">
                    {errors.CompanyId?.message} {/* Display validation error */}
                  </Typography>
                </Box>
                <Box sx={responsiveStyles.selectField}>
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
                    {errors.SupplierId?.message}{" "}
                    {/* Display validation error */}
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
                    bgcolor: "#1976d2",
                    textTransform: "none",
                  }}
                >
                  New supplier
                </Button>
              </Box>
            </Grid>

            {/* Supplier details section */}
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
                        color: "#1976d2",
                      }}
                    >
                      <AccountIcon sx={{ fontSize: { xs: 30 }, mr: 1 }} />{" "}
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
                        color: "#1976d2",
                      }}
                    >
                      <PhoneIcon sx={{ fontSize: { xs: 30 }, mr: 1 }} />{" "}
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
                        color: "#1976d2",
                      }}
                    >
                      <HomeIcon sx={{ fontSize: { xs: 30 }, mr: 1 }} />{" "}
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
                        color: "#1976d2",
                      }}
                    >
                      <BankIcon sx={{ fontSize: { xs: 30 }, mr: 1 }} />{" "}
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
                        color: "#1976d2",
                      }}
                    >
                      <CompanyIcon sx={{ fontSize: { xs: 30 }, mr: 1 }} />{" "}
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
                  color: "#1976d2",
                  fontWeight: "bold",
                }}
              >
                <PostAddIcon /> Item Details:
              </Typography>
              <Button
                variant="contained"
                onClick={handleProductDialogOpen}
                sx={{
                  height: "3rem",
                  color: "#fff",
                  fontWeight: "bold",

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
              sx={{
                margin: ".5rem 0",
                padding: ".5rem 1rem",
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
                      justifyContent: "space-evenly",
                      rowGap: 5,
                      marginBottom: "1rem",
                    }}
                  >
                    <Grid
                      sx={{
                        alignContent: "center",
                        justifyContent: "center",
                      }}
                      item
                      xs={7}
                      sm={0.2}
                    >
                      <Typography variant="body1">{index + 1}.</Typography>
                    </Grid>

                    <Grid item xs={7} sm={2}>
                      <Controller
                        name={`items.${index}.ProductModelID`}
                        control={control}
                        render={({ field }) => (
                          <SelectComponent
                            {...field}
                            value={
                              itemOptions.find(
                                (option) =>
                                  option.value ===
                                  watch(`items.${index}.ProductModelID`)
                              ) || null
                            }
                            onChange={(selectedOption) => {
                              const selectedItem = allItems.find(
                                (item) =>
                                  item.ProductModelID === selectedOption.value
                              );

                              if (!selectedItem) return;

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
                                `items.${index}.Color`,
                                selectedItem.ColorNames
                              );
                              setValue(
                                `items.${index}.ModelNumber`,
                                selectedItem.ModelNumber
                              );

                              setValue(
                                `items.${index}.Price`,
                                selectedItem.Price || 0
                              );

                              const quantity = Number(
                                watch(`items.${index}.Quantity`) || 0
                              );
                              setValue(
                                `items.${index}.result`,
                                (selectedItem.Price || 0) * quantity
                              );

                              setValue(
                                `items.${index}.AvailableQuantity`,
                                selectedItem.AvailableQuantity
                              );

                              field.onChange(selectedOption.value); // update the form field value
                            }}
                            options={itemOptions}
                            placeholder="Select Product"
                            isSearchable={true}
                            styles={selectComponentStyles}
                          />
                        )}
                      />
                      {errors.items?.[index]?.ProductModelID && (
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.items[index].ProductModelID.message}
                        </FormHelperText>
                      )}
                    </Grid>

                    <Grid item xs={5} sm={0.8}>
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
                    <Grid item xs={5} sm={0.8}>
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
                    <Grid item xs={5} sm={0.8}>
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

                    <Grid item xs={5} sm={0.8}>
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

                    <Grid item xs={5} sm={0.8}>
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
                    </Grid>
                    <Grid item xs={5} sm={0.8}>
                      <Controller
                        name={`items.${index}.SGSTP`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            defaultValue={5}
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

                    <Grid item xs={5} sm={0.8}>
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
                            defaultValue={5}
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
                    <Grid item xs={5} sm={1.2}>
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
            </Grid>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                pr: 6,
                gap: 0, // Add gap between the elements
              }}
            >
              <FormControl sx={{ width: "80px", ...greenBorderStyle }}>
                <InputLabel>------</InputLabel>
                <Select
                  value={rowsToAdd}
                  onChange={(e) => setRowsToAdd(e.target.value)}
                  label="Rows"
                  sx={{
                    height: "50px",
                    width: "80px",
                    backgroundColor: "white",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderWidth: "2px" },
                    },
                  }}
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                  {/* <MenuItem value={10}>10</MenuItem> */}
                </Select>
              </FormControl>
              <Button
                variant="text"
                onClick={() => {
                  for (let i = 0; i < rowsToAdd; i++) {
                    append({
                      ProductModelID: "",
                      Quantity: 1,
                      UnitQuantity: "Piece",
                      Rate: 0,
                      Amount: 0,
                      discount: 0,
                      QtyPerBox: 1,
                      SGSTP: 5,
                      CGSTP: 5,
                    });
                  }
                }}
                sx={{
                  ml: 0,
                  color: "#235c35",
                  textTransform: "none",
                  borderColor: "#235c35",
                  fontWeight: "bold",
                }}
                startIcon={<LibraryAddIcon />}
              >
                Item
              </Button>
            </Box>
            <Divider sx={{ mb: 0 }} />

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
                        {signatoryList &&
                          signatoryList.map((signatory) => (
                            <MenuItem key={signatory.ID} value={signatory.ID}>
                              {signatory.Name}
                            </MenuItem>
                          ))}
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
          {emailmsz && (
            <Box sx={{ width: "100%", textAlign: "center" }}>
              <Typography
                color="error"
                variant="body2"
                sx={{ mt: 2, fontSize: "1.2rem" }}
              >
                Email has been sent successfully{" "}
              </Typography>
            </Box>
          )}
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
              onClick={() => setOpenEmailButton(false)}
              sx={{
                height: "3rem",
                width: { xs: "100%", sm: "auto" },
                textTransform: "none",
                backgroundColor: "#4D795B",
              }}
            >
              Generate Quotation
            </Button>
            <Button
              variant="contained"
              type="submit"
              onClick={() => setOpenEmailButton(true)}
              sx={{
                height: "3rem",
                width: { xs: "100%", sm: "auto" },
                textTransform: "none",
                backgroundColor: "#4D795B",
              }}
            >
              send Email{" "}
            </Button>
            {/* <QuotationEmailDirect
              onSubmita={() => {
                // console.log("Updated formData:", emailFormData); // Debug log
                handleSubmit(onSubmit)(); // Ensure form submission with updated data
              }}
              handleClickOpenEmail={handleClickOpenEmail}
              handleCloseEmail={handleCloseEmail}
              openEmail={openEmail}
              handleEmaildata={handleEmaildata}
            /> */}
            {/* {openEmail && (
              <QuotationEmailDirectForm
                openEmail={openEmail}
                handleCloseEmail={handleCloseEmail}
                handleClickOpenEmail={handleClickOpenEmail}
                emailData={resData}
                type="QUO"
              />
            )} */}
          </Grid>
        </Grid>
      </form>
      <Dialog
        open={openProductDialog}
        onClose={() => {
          handleProductDialogClose();
          reset(); // Reset the form when the dialog is closed
        }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <ProductCreateForm fetchProduct={fetchProduct} />
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
          reset(); // Reset the form when the dialog is closed
        }}
        fullWidth
        maxWidth="md"
      >
        <DialogContent>
          <SupplierEditDetailsDialog />
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
      <LoadingComp loading={loading} />

      {openEmail && (
        <QuotationEmailDirectForm
          openEmail={openEmail}
          handleCloseEmail={handleCloseEmail}
          handleClickOpenEmail={handleClickOpenEmail}
          emailData={resData}
          type="QUO"
          handleAddCustomerClose={handleAddCustomerClose}
        />
      )}

      {warningStatus && (
        <WarningComp
          warningStatus={warningStatus}
          warningDataFn={warningDataFn}
          message="Are you sure you want to Generate Quotation?"
        />
      )}
      {/* Removed duplicate/old PDF generation logic. Only one PDF will be generated per action. */}
      {triggerPrint &&
        row &&
        typeof row === "object" &&
        pdfTriggerCount < 1 &&
        !pdfBlockRef.current && (
          <BlobProvider document={<AdvncedORderPdf {...row} />}>
            {({ url, loading }) => {
              if (url && !loading) {
                pdfBlockRef.current = true; // Block further triggers
                window.open(url, "_blank");
                setTriggerPrint(false);
                setPdfTriggerCount(1); // Ensure only one PDF is generated
              }
              return null;
            }}
          </BlobProvider>
        )}
    </Box>
  );
}
