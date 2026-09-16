import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  useForm,
  useFieldArray,
  Controller,
  useWatch,
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
  FormControlLabel,
  FormHelperText,
  Stack,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Radio,
  RadioGroup,
  FormLabel,
  CircularProgress,
} from "@mui/material";
import {
  Add,
  ConstructionOutlined,
  Delete as DeleteIcon,
  Discount,
} from "@mui/icons-material";
import axios from "axios";
import Cookies from "js-cookie"; // Import Cookies
import SelectComponent from "react-select";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import {
  AccountCircleRounded as AccountCircleRoundedIcon,
  HomeRounded as HomeRoundedIcon,
  ApartmentRounded as ApartmentRoundedIcon,
  PostAddRounded as PostAddRoundedIcon,
  NoteAdd as NoteAddIcon,
  DateRange as DateRangeIcon,
  CurrencyRupee as CurrencyRupeeIcon,
  CurrencyRupeeRounded as CurrencyRupeeRoundedIcon,
  LibraryAdd as LibraryAddIcon,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import InvoicePurPaymentForm from "./component/InvoicePurPaymentForm";
import LoadingComp from "./../../../../../components/loadingComp/LoadingComp";
import SupplierCreateDialog from "../../../supplier/component/AddSupplierDailog/AddNewSupplierDailog";
import _, { get, set, round } from "lodash";
import { useQueryClient } from "@tanstack/react-query";
import { BlobProvider } from "@react-pdf/renderer";
import InvoicePurCreatepdf from "./component/InvoicePurCreatepdf";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
// import ReactToPrint from "react-to-print";

const greenBorderStyle = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "green",
    },
    "&:hover fieldset": {
      borderColor: "green",
    },
    "&.Mui-focused fieldset": {
      borderColor: "green",
    },
  },
  "& .MuiInputLabel-root": {
    color: "green",
    "&.Mui-focused": {
      color: "darkgreen",
    },
  },
  "& .MuiFormControlLabel-root": {
    color: "green",
  },
  "& .MuiSelect-root": {
    "& fieldset": {
      borderColor: "green",
    },
    "&:hover fieldset": {
      borderColor: "green",
    },
    "&.Mui-focused fieldset": {
      borderColor: "green",
    },
  },
  "& .MuiRadio-root": {
    color: "green",
    "&.Mui-checked": {
      color: "green",
    },
  },
  "& .MuiCheckbox-root": {
    color: "green",
    "&.Mui-checked": {
      color: "green",
    },
  },
};

const darkGreenBorderStyle = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "darkgreen",
    },
    "&:hover fieldset": {
      borderColor: "darkgreen",
    },
    "&.Mui-focused fieldset": {
      borderColor: "darkgreen",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#525252",
  },
  "& .MuiFormControlLabel-root": {
    color: "#525252",
  },
  "& .MuiSelect-root": {
    "& fieldset": {
      borderColor: "darkgreen",
    },
    "&:hover fieldset": {
      borderColor: "darkgreen",
    },
    "&.Mui-focused fieldset": {
      borderColor: "darkgreen",
    },
  },
  "& .MuiRadio-root": {
    color: "#525252",
    "&.Mui-checked": {
      color: "#525252",
    },
  },
  "& .MuiCheckbox-root": {
    color: "#525252",
    "&.Mui-checked": {
      color: "#525252",
    },
  },
};

// const selectComponentStyles = {
//   control: (base, state) => ({
//     ...base,
//     backgroundColor: "#ffffff",
//     borderColor: state.isFocused ? "green" : base.borderColor,
//     boxShadow: "none",
//     minHeight: "50px",
//     "&:hover": {
//       borderColor: "green",
//     },
//   }),
//   menu: (base) => ({
//     ...base,
//     backgroundColor: "#ffffff",
//     boxShadow: "none",
//     zIndex: 100,
//   }),
//   option: (base, state) => ({
//     ...base,
//     backgroundColor: state.isFocused ? "green" : "#ffffff",
//     color: state.isFocused ? "#fff" : "#000",
//     padding: "10px",
//     "&:hover": {
//       backgroundColor: "green",
//       color: "#fff",
//     },
//   }),
//   singleValue: (base) => ({
//     ...base,
//     color: "green",
//   }),
//   multiValue: (base) => ({
//     ...base,
//     backgroundColor: "green",
//     color: "#fff",
//   }),
//   multiValueLabel: (base) => ({
//     ...base,
//     color: "#fff",
//   }),
//   multiValueRemove: (base) => ({
//     ...base,
//     color: "#fff",
//     "&:hover": {
//       backgroundColor: "green",
//       color: "#fff",
//     },
//   }),
// };
// //

export default function InvoiceCreateDialogFormP({
  allItems,
  dummyQuotation,
  allPaymentType,
  signatoryDetails,
  allCompanyList,
  fetchAllSupplier,
  allHsn,
  supplierList,
  handleAddCustomerClose,
  fetchAllInvoice, // <-- Add this prop
}) {
  const [rowsToAdd, setRowsToAdd] = useState(1); // Moved inside the component
  const [productModelError, setProductModelError] = useState(false);
  const [customerSelect, setCustomerSelect] = useState([]);
  const [allDescription, setAllDescription] = useState([]);
  const [paymentInformation, setPaymentInformation] = useState({});
  const [gstValue, setGstValue] = useState({});
  const [printType, setPrintType] = useState(1);
  const [itemSelect, setItemSelect] = useState([]);
  const [finalAmount, setFinalAmount] = useState(0);
  const paymentIsValid = useRef(false);
  const [, forceRender] = useState(false);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allItemsa, setAllItemsa] = useState([]);
  const [receiptDate, setReceiptDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [row, setRow] = useState(null);
  const [triggerPrint, setTriggerPrint] = useState(false);
  const [pdfTriggerCount, setPdfTriggerCount] = useState(0); // <-- Add counter state
  const pdfBlockRef = React.useRef(false); // Block duplicate PDF triggers

  const [typeSupplier, setTypeSupplier] = useState("customer");
  const [quoSection, setQuoSection] = useState(true);
  const [company, setCompany] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [render, setRender] = useState(false);

  const [signatorySelect, setSignetorySelect] = useState({
    CheckedByID: null,
    PreparedByID: null,
    AuthorizedSignatoryByID: null,
  });

  const schema = Yup.object().shape({
    selectedSupplier: quoSection
      ? Yup.string().nullable()
      : Yup.string().required("Supplier is required"),
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
    // discountUnit: Yup.string().required("Discount Unit is required"),
    // SGSTP: Yup.number()
    //   .required("SGST Percentage is required")
    //   .min(0, "Minimum SGST is 0"),
    // CGSTP: Yup.number()
    //   .required("CGST Percentage is required")
    //   .min(0, "Minimum CGST is 0"),
    // discount: Yup.number()
    //   .required("Discount is required")
    //   .min(0, "Minimum discount is 0"),
    // roundUpAmount: Yup.number(),
    company: Yup.string().required("Company is required"),
    checkedBy: Yup.string().required("Checked By is required"),
    preparedBy: Yup.string().required("Prepared By is required"),
    authorizeBy: Yup.string().required("Authorize By is required"),
    receiptDate: Yup.date()
      .required("Receipt Date is required")
      .typeError("Invalid date"),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    shouldUnregister: true,
    defaultValues: {
      paymentDetails: {},
      items: [
        //  {
        //   ProductModelID: "",
        // HSNMasterID: allHsn[0]?.ID,
        //   Quantity: 1,
        //   UnitQuantity: "Piece",
        //   Rate: 0,
        //   Amount: 0,
        //   discount: 0,
        // },
      ],
      company: "",

      checkedBy: signatoryDetails?.CheckedByList?.[0]?.ID || "",
      preparedBy: signatoryDetails?.PreparedByList?.[0]?.ID || "",
      authorizeBy: signatoryDetails?.AuthorizedSignatoryList?.[0]?.ID || "",
    },
    mode: "onSubmit", // ✅ Only validate on submit
    reValidateMode: "onSubmit",
    shouldUnregister: true, // <-- Important
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
  // console.log("ok");

  // Modify this useEffect to handle the "Box" case
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name && name.includes("UnitQuantity")) {
        const index = name.split(".")[1];
        const unit = value.items[index].UnitQuantity;
        let qtyPerBox = 0;
        if (unit === "Piece") qtyPerBox = 1;
        else if (unit === "Pair") qtyPerBox = 2;
        else if (unit === "Dozen") qtyPerBox = 12;
        else if (unit === "Box") qtyPerBox = 0;

        setValue(`items.${index}.QtyPerBox`, qtyPerBox || 1);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  const handleOpenAddDialog = () => setAddDialogOpen(true);
  const handleCloseAddDialog = () => setAddDialogOpen(false);

  const cgstp = 9;
  const sgstp = 9;
  const watchroundUpAmount = 0;
  const watchDiscountType = "P";

  // ======================================== update result =========================
  // const updateResult = useCallback(
  //   _.debounce((index) => {
  //     const row = getValues(`items.${index}`);
  //     if (!row) return; // Return early if row is undefined
  //     const { Price, StripeOf, StripeQty, discount, CGSTP, SGSTP, lQty } = row;

  //     const Quantity =
  //       (Number(StripeOf) || 0) * (Number(StripeQty) || 0) +
  //       (Number(lQty) || 0);

  //     // Calculate base result
  //     const baseResult = (Number(Price) || 0) * Quantity || 0;

  //     const finalResult =
  //       baseResult - (baseResult * (Number(discount) || 0)) / 100;

  //     // Use CGSTP and SGSTP as numbers, default to 0 if undefined/null/empty string
  //     const cgstPercent =
  //       CGSTP !== undefined && CGSTP !== null && CGSTP !== ""
  //         ? Number(CGSTP)
  //         : 0;
  //     const sgstPercent =
  //       SGSTP !== undefined && SGSTP !== null && SGSTP !== ""
  //         ? Number(SGSTP)
  //         : 0;

  //     const CgstValue = round((finalResult * cgstPercent) / 100, 2);
  //     const SgstValue = round((finalResult * sgstPercent) / 100, 2);

  //     setValue(
  //       `items.${index}.result`,
  //       round(finalResult + CgstValue + SgstValue, 2)
  //     );

  //     // ===========================
  //     const items = getValues("items");

  //     const netTotalAmount = items?.reduce((acc, item) => {
  //       const itemQty =
  //         (Number(item.StripeOf) || 0) * (Number(item.StripeQty) || 0) +
  //         (Number(item.lQty) || 0);
  //       const itemResult = itemQty * (Number(item.Price) || 0);
  //       const discountAmount =
  //         (itemResult * (Number(item.discount) || 0)) / 100;

  //       return acc + itemResult - discountAmount;
  //     }, 0);
  //     setValue("NetTotalAmount", round(netTotalAmount, 2));
  //     // ===========================
  //     const totalGst = items?.reduce((acc, item, index) => {
  //       const itemQty =
  //         (Number(item.StripeOf) || 0) * (Number(item.StripeQty) || 0) +
  //         (Number(item.lQty) || 0);
  //       const itemResult = itemQty * (Number(item.Price) || 0);
  //       const discountAmount =
  //         (itemResult * (Number(item.discount) || 0)) / 100;

  //       const netTotalAmount = itemResult - discountAmount;

  //       // Use item.SGSTP and item.CGSTP as numbers, default to 0 if undefined/null/empty string
  //       const sgstPercent =
  //         item.SGSTP !== undefined && item.SGSTP !== null && item.SGSTP !== ""
  //           ? Number(item.SGSTP)
  //           : 0;
  //       const cgstPercent =
  //         item.CGSTP !== undefined && item.CGSTP !== null && item.CGSTP !== ""
  //           ? Number(item.CGSTP)
  //           : 0;

  //       const sgstValue = (round(netTotalAmount) * sgstPercent) / 100;
  //       const cgstValue = (round(netTotalAmount) * cgstPercent) / 100;

  //       return acc + round(Number(sgstValue) + Number(cgstValue), 2);
  //     }, 0);

  //     setValue("TotalGst", round(totalGst || 0, 2), {
  //       shouldDirty: true,
  //       shouldValidate: true,
  //     });

  //     // =======================
  //     const gstAndNetTotalAmount = round(totalGst + netTotalAmount, 2);
  //     const paymentsDetails = getValues("paymentsDetails") || [];
  //     const totalAmountPaid = paymentsDetails.reduce((sum, payment) => {
  //       return sum + (payment.Amount ? Number(payment.Amount) : 0);
  //     }, 0);
  //     console.log("totalAmountPaid", totalAmountPaid);

  //     const decimalValue =
  //       gstAndNetTotalAmount - Math.floor(gstAndNetTotalAmount);
  //     if (decimalValue > 0.5) {
  //       setValue("roundUpAmount", round(1 - decimalValue, 2));
  //       setValue("GrandTotalAmount", Math.ceil(gstAndNetTotalAmount));
  //       setValue(
  //         "dueAmount",
  //         Math.ceil(gstAndNetTotalAmount) - totalAmountPaid
  //       );
  //     } else {
  //       setValue("roundUpAmount", -round(decimalValue, 2));
  //       setValue("GrandTotalAmount", Math.floor(gstAndNetTotalAmount));
  //       setValue(
  //         "dueAmount",
  //         Math.floor(gstAndNetTotalAmount) - totalAmountPaid || ""
  //       );
  //     }

  //     // trigger([
  //     //   "sgstValue",
  //     //   "cgstValue",
  //     //   "grandTotalAmount",
  //     //   "NetTotalAmount",
  //     //   "totalGst",
  //     //   "dueAmount",

  //     //   "StripeQty",
  //     //   "items",
  //     //   "StripOf",
  //     // ]); // Trigger validation
  //   }, 500),
  //   [getValues, setValue]
  // );
  const updateResult = useCallback(
    _.debounce((index) => {
      const row = getValues(`items.${index}`);
      if (!row) return; // Return early if row is undefined
      const { Price, StripeQty, discount, CGSTP, SGSTP } = row;

      // ✅ Quantity = only StripeQty (no lQty, no StripeOf)
      const Quantity = Number(StripeQty) || 0;

      // Calculate base result
      const baseResult = (Number(Price) || 0) * Quantity || 0;

      const finalResult =
        baseResult - (baseResult * (Number(discount) || 0)) / 100;

      // GST %
      const cgstPercent =
        CGSTP !== undefined && CGSTP !== null && CGSTP !== ""
          ? Number(CGSTP)
          : 0;
      const sgstPercent =
        SGSTP !== undefined && SGSTP !== null && SGSTP !== ""
          ? Number(SGSTP)
          : 0;

      const CgstValue = round((finalResult * cgstPercent) / 100, 2);
      const SgstValue = round((finalResult * sgstPercent) / 100, 2);

      setValue(
        `items.${index}.result`,
        round(finalResult + CgstValue + SgstValue, 2)
      );

      // ===========================
      const items = getValues("items");

      const netTotalAmount = items?.reduce((acc, item) => {
        const itemQty = Number(item.StripeQty) || 0; // ✅ only StripeQty
        const itemResult = itemQty * (Number(item.Price) || 0);
        const discountAmount =
          (itemResult * (Number(item.discount) || 0)) / 100;

        return acc + itemResult - discountAmount;
      }, 0);
      setValue("NetTotalAmount", round(netTotalAmount, 2));

      // ===========================
      const totalGst = items?.reduce((acc, item) => {
        const itemQty = Number(item.StripeQty) || 0; // ✅ only StripeQty
        const itemResult = itemQty * (Number(item.Price) || 0);
        const discountAmount =
          (itemResult * (Number(item.discount) || 0)) / 100;

        const netTotalAmount = itemResult - discountAmount;

        const sgstPercent =
          item.SGSTP !== undefined && item.SGSTP !== null && item.SGSTP !== ""
            ? Number(item.SGSTP)
            : 0;
        const cgstPercent =
          item.CGSTP !== undefined && item.CGSTP !== null && item.CGSTP !== ""
            ? Number(item.CGSTP)
            : 0;

        const sgstValue = (round(netTotalAmount) * sgstPercent) / 100;
        const cgstValue = (round(netTotalAmount) * cgstPercent) / 100;

        return acc + round(Number(sgstValue) + Number(cgstValue), 2);
      }, 0);

      setValue("TotalGst", round(totalGst || 0, 2), {
        shouldDirty: true,
        shouldValidate: true,
      });

      // =======================
      const gstAndNetTotalAmount = round(totalGst + netTotalAmount, 2);
      const paymentsDetails = getValues("paymentsDetails") || [];
      const totalAmountPaid = paymentsDetails.reduce((sum, payment) => {
        return sum + (payment.Amount ? Number(payment.Amount) : 0);
      }, 0);
      console.log("totalAmountPaid", totalAmountPaid);

      const decimalValue =
        gstAndNetTotalAmount - Math.floor(gstAndNetTotalAmount);
      if (decimalValue > 0.5) {
        setValue("roundUpAmount", round(1 - decimalValue, 2));
        setValue("GrandTotalAmount", Math.ceil(gstAndNetTotalAmount));
        setValue(
          "dueAmount",
          Math.ceil(gstAndNetTotalAmount) - totalAmountPaid
        );
      } else {
        setValue("roundUpAmount", -round(decimalValue, 2));
        setValue("GrandTotalAmount", Math.floor(gstAndNetTotalAmount));
        setValue(
          "dueAmount",
          Math.floor(gstAndNetTotalAmount) - totalAmountPaid || ""
        );
      }
    }, 500),
    [getValues, setValue]
  );

  const queryClient = useQueryClient();

  // ====================================customer select =======================
  useEffect(() => {
    setAllItemsa(setCustomerSelect?.items);

    if (customerSelect?.items) {
      reset({
        company: customerSelect.company,
        items: customerSelect.items.map((item) => {
          return {
            HSNMasterID: item.HSNMasterID ? item.HSNMasterID : allHsn[0]?.ID,
            StripeOf: item.StripOf ? item.StripOf : 0,
            StripeQty: item.StripQty ? item.StripQty : 0,
            lQty:
              Number(item.Quantity) -
              Number(item.StripQty) * Number(item.StripOf),
            Price: item.Price ? item.Price : 0,
            discount: item.DISP || 0,

            ...item,
          };
        }),
        discount: customerSelect.Discount || 0,
        roundUpAmount: customerSelect.RoundedOffAmount || 0,
        discountDesc: "festival discount",
      });
      setItemSelect(
        customerSelect.items.map((item) => ({
          value: item.ProductModelID,
          label:
            allItems.find((i) => i.ProductModelID == item.ProductModelID)
              ?.ModelNumber || "",
        }))
      );

      const timeout = setTimeout(() => {
        setLoading(false);
      }, 1000);

      return () => clearTimeout(timeout);
    }
    customerSelect?.items?.map((items, index) => {
      updateResult(index); // Trigger updateResult for each item with a slight delay
    });
  }, [customerSelect]);
  console.log("customerSelect", customerSelect);
  // =========================================== custmer select useEffect =======================
  useEffect(() => {
    const items = customerSelect?.items;
    // setAllItemsa(items);
    items?.forEach((i, index) => {
      // const row = getValues(`items.${index}`);
      const Price = i.Price || 0;
      const Quantity = i.Quantity;

      const discount = i.discount || 0;
      const amount = i.Amount || 0;

      // Calculate base result
      // const baseResult = (Number(Price) || 0) * (Number(Quantity) || 0);

      // const finalResult =
      //   baseResult - (baseResult * (Number(discount) || 0)) / 100;

      setValue(`items.${index}.result`, round(amount, 2));
    });

    const totalResult = items?.reduce((acc, item) => {
      const itemQty =
        (Number(item.StripeOf) || 0) * (Number(item.StripeQty) || 0) +
        (Number(item.lQty) || 0);
      const itemResulta = itemQty * (Number(item.Price) || 0);
      const itemResult =
        itemResulta - (itemResulta * (Number(item.discount) || 0)) / 100;
      return acc + itemResult;
    }, 0);
    const totalAmountBd = round(totalResult, 2);

    // Calculate discount value based on total result
    const discount = customerSelect?.Discount || 0;
    const roundUpAmount = customerSelect?.RoundedOffAmount || 0;

    const discountValue = round((totalResult * Number(discount)) / 100, 2);
    setValue("discountValue", discountValue);
    const totalAmountAD = round(totalAmountBd - discountValue, 2);
    setValue("totalAmountAD", totalAmountAD);

    const sgstp = Number(getValues("sgstValue")) || 9;
    const cgstp = getValues("cgstValue") || 9;

    const sgstValue = round((totalAmountAD * sgstp) / 100, 2);
    const cgstValue = round((totalAmountAD * cgstp) / 100, 2);
    setValue("sgstValue", sgstValue);
    setValue("cgstValue", cgstValue);

    // setValue("grandTotalAmount", grandTotalAmount);
    const netTotalAmount =
      round(Number(totalAmountAD) + Number(sgstValue) + Number(cgstValue), 2) ||
      "";
    const decimalValue = netTotalAmount - Math.floor(netTotalAmount);
    if (decimalValue > 0.5) {
      setValue("roundUpAmount", round(1 - decimalValue, 2) || "");
      setValue("grandTotalAmount", Math.ceil(netTotalAmount) || "");
      setValue("dueAmount", Math.ceil(netTotalAmount));
    } else {
      setValue("roundUpAmount", -round(decimalValue, 2) || "");
      setValue("grandTotalAmount", Math.floor(netTotalAmount) || "");
      setValue("dueAmount", Math.floor(netTotalAmount) || "");
    }
    setValue("netTotalAmount", netTotalAmount || "");
    const paymentsDetails = getValues("paymentsDetails") || [];
    const totalAmountPaid = paymentsDetails.reduce((sum, payment) => {
      return sum + (payment.Amount ? Number(payment.Amount) : 0);
    }, 0);

    const grandTotal = getValues("grandTotalAmount") || 0;
    const dueAmount = grandTotal - totalAmountPaid || "";
    console.log("dueAmount", dueAmount);
    console.log("grandTotal", grandTotal);
    setValue("dueAmount", dueAmount);

    setValue("NetTotalAmount", netTotalAmount || "");
    trigger(["SGSTAmount", "CGSTAmount", "grandTotalAmount", "netTotalAmount"]); // Trigger validation
  }, [customerSelect]);
  // Removed console.log(errors);

  // ============================================total bd =========================

  // const handlePaymentValidation = (isValid) => {
  //   if (paymentIsValid.current !== isValid) {
  //     paymentIsValid.current = isValid;
  //     forceRender((prev) => !prev);
  //   }
  // };

  // const getPaymentDataFn = (value) => {
  //   setPaymentInformation(value);
  //   setValue("paymentDetails", value); // Add this line to set the paymentDetails in the form state
  // };
  // console.log(errors);
  const customerOptions = useMemo(
    () =>
      dummyQuotation?.map((customer, index) => ({
        label: customer.QuotationNo,
        id: index,
        name: customer.Name,
        EntityID: customer.EntityID,
        MobileNo1: customer.PhoneNumber1,
        address: `${customer.AddressLine1} ${customer.AddressLine2} ${customer.City} ${customer.District} ${customer.State} ${customer.Pincode}`,
        Date: customer.QuotationDate,
        items: customer.ModelMappingData,
        BillEntityID: customer.BillEntityID,
        Discount: customer.Discount,
        RoundedOffAmount: customer.RoundedOffAmount,
        company: customer.BillEntityID,
        DealerName: customer.DealerNam,
        EntityType: customer.EntityType,
        subDealerAdd: `${customer.AddressLine1} ${customer.AddressLine2} ${customer.City} ${customer.District} ${customer.State} ${customer.PinCode}`,
      })),
    [dummyQuotation]
  );
  console.log("allItems", allItems);
  const itemOptions = useMemo(
    () =>
      allItems.map((item) => {
        return {
          value: item.ProductModelID,
          label: `${item.ModelNumber}`,
          name: `${item.ModelNumber}`,
          Price: item.Price,
          HSNMasterID: item.HSNMasterID ? item.HSNMasterID : allHsn[0]?.ID,
          AvailableQuantity: item.AvailableQuantity,
          StripeOf: item.StripOf || 0,
        };
      }),
    [allItems]
  );
  // console.log("itemOptions", itemOptions);
  // console.log("customerSelect", customerSelect);
  const roundedStyle = () => ({
    backgroundColor: "#fff",
    outline: "none",
    border: "none",
    "& .MuiOutlinedInput-root": {
      "& fieldset": { outline: "none" },
      "&:hover fieldset": { outline: "none", borderRadius: "15px" },
      "&.Mui-focused fieldset": { outline: "none", borderRadius: "15px" },
    },
  });
  const removeFn = (index) => {
    remove(index);
    const newItemSelect = [...itemSelect];
    newItemSelect.splice(index, 1);
    setItemSelect(newItemSelect);
  };
  const handleDateChange = (newValue) => {
    setReceiptDate(dayjs(newValue).format("YYYY-MM-DD")); // Format date as "YYYY-MM-DD"
  };

  // =========================================== custmer select useEffect =======================
  useEffect(() => {
    const items = customerSelect?.items;
    // setAllItemsa(items);
    items?.forEach((i, index) => {
      // const row = getValues(`items.${index}`);
      const Price = i.Price || 0;
      const Quantity = i.Quantity;
      const discount = 0;
      const amount = i.Amount || 0;

      // Calculate base result
      const baseResult = (Number(Price) || 0) * (Number(Quantity) || 0);

      const finalResult =
        baseResult - (baseResult * (Number(discount) || 0)) / 100;

      setValue(`items.${index}.result`, round(amount, 2));
    });
    // ===========================

    const netTotalAmount = items?.reduce((acc, item) => {
      const itemAmount = item.Price || 0;
      const itemQty = item.Quantity || 0;
      const total = itemAmount * itemQty;
      const discountP = item.DISP;
      const discountAmount = (total * (Number(discountP) || 0)) / 100;
      // Calculate base result
      // const baseResult = (Number(itemAmount) || 0) * (Number(itemQty) || 0);
      // const finalResult =
      //   baseResult - (baseResult * (Number(discountAmount) || 0)) / 100;
      // const result = round(finalResult, 2);
      const result = round(total - discountAmount, 2);

      return acc + result;
    }, 0);
    setValue("NetTotalAmount", round(netTotalAmount, 2));
    // ===========================
    const totalGst = items?.reduce((acc, item, index) => {
      const itemQty = Number(item.Quantity) || 0;
      console.log("itemQty", itemQty);
      console.log("item.Price", item.Price);
      const itemResult = itemQty * (Number(item.Price) || 0);
      const discountAmount = (itemResult * (Number(item.DISP) || 0)) / 100;
      console.log("itemResult", itemResult);
      console.log("discountAmount", discountAmount);

      const netTotalAmount = itemResult - discountAmount;
      console.log("netTotalAmount", netTotalAmount);

      // Use item.SGSTP and item.CGSTP as numbers, default to 0 if undefined/null/empty string
      const sgstPercent =
        item.SGSTP !== undefined && item.SGSTP !== null && item.SGSTP !== ""
          ? Number(item.SGSTP)
          : 0;
      const cgstPercent =
        item.CGSTP !== undefined && item.CGSTP !== null && item.CGSTP !== ""
          ? Number(item.CGSTP)
          : 0;

      const sgstValue = (round(netTotalAmount) * sgstPercent) / 100;
      const cgstValue = (round(netTotalAmount) * cgstPercent) / 100;

      return acc + round(Number(sgstValue) + Number(cgstValue), 2);
    }, 0);

    setValue("TotalGst", round(totalGst, 2), {
      shouldDirty: true,
      shouldValidate: true,
    });
    // =======================
    const gstAndNetTotalAmount = round(totalGst + netTotalAmount, 2);
    const paymentsDetails = getValues("paymentsDetails") || [];
    const totalAmountPaid = paymentsDetails.reduce((sum, payment) => {
      return sum + (payment.Amount ? Number(payment.Amount) : 0);
    }, 0);
    console.log("totalAmountPaid", totalAmountPaid);

    const decimalValue =
      gstAndNetTotalAmount - Math.floor(gstAndNetTotalAmount);
    if (decimalValue > 0.5) {
      setValue("roundUpAmount", round(1 - decimalValue, 2));
      setValue("GrandTotalAmount", Math.ceil(gstAndNetTotalAmount));
      setValue("dueAmount", Math.ceil(gstAndNetTotalAmount) - totalAmountPaid);
    } else {
      setValue("roundUpAmount", -round(decimalValue, 2));
      setValue("GrandTotalAmount", Math.floor(gstAndNetTotalAmount));
      setValue(
        "dueAmount",
        Math.floor(gstAndNetTotalAmount) - totalAmountPaid || ""
      );
    }
    // =======================
    // const totalResult = items?.reduce((acc, item) => {
    //   const itemQty =
    //     (Number(item.StripeOf) || 0) * (Number(item.StripeQty) || 0) +
    //     (Number(item.lQty) || 0);
    //   const itemResulta = itemQty * (Number(item.Price) || 0);
    //   const itemResult =
    //     itemResulta - (itemResulta * (Number(item.discount) || 0)) / 100;
    //   return acc + itemResult;
    // }, 0);
    // const totalAmountBd = round(totalResult, 2);

    // // Calculate discount value based on total result
    // const discount = customerSelect?.Discount || 0;
    // const roundUpAmount = customerSelect?.RoundedOffAmount || 0;

    // const discountValue = round((totalResult * Number(discount)) / 100, 2);
    // setValue("discountValue", discountValue);
    // const totalAmountAD = round(totalAmountBd - discountValue, 2);
    // setValue("totalAmountAD", totalAmountAD);

    // const sgstp = Number(getValues("sgstValue")) || 9;
    // const cgstp = getValues("cgstValue") || 9;

    // const sgstValue = round((totalAmountAD * sgstp) / 100, 2);
    // const cgstValue = round((totalAmountAD * cgstp) / 100, 2);
    // setValue("sgstValue", sgstValue);
    // setValue("cgstValue", cgstValue);

    // // setValue("grandTotalAmount", grandTotalAmount);
    // const netTotalAmount =
    //   round(Number(totalAmountAD) + Number(sgstValue) + Number(cgstValue), 2) ||
    //   "";
    // const decimalValue = netTotalAmount - Math.floor(netTotalAmount);
    // if (decimalValue > 0.5) {
    //   setValue("roundUpAmount", round(1 - decimalValue, 2) || "");
    //   setValue("grandTotalAmount", Math.ceil(netTotalAmount) || "");
    //   setValue("dueAmount", Math.ceil(netTotalAmount));
    // } else {
    //   setValue("roundUpAmount", -round(decimalValue, 2) || "");
    //   setValue("grandTotalAmount", Math.floor(netTotalAmount) || "");
    //   setValue("dueAmount", Math.floor(netTotalAmount) || "");
    // }
    // setValue("netTotalAmount", netTotalAmount || "");
    // const paymentsDetails = getValues("paymentsDetails") || [];
    // const totalAmountPaid = paymentsDetails.reduce((sum, payment) => {
    //   return sum + (payment.Amount ? Number(payment.Amount) : 0);
    // }, 0);

    // const grandTotal = getValues("grandTotalAmount") || 0;
    // const dueAmount = grandTotal - totalAmountPaid || "";
    // console.log("dueAmount", dueAmount);
    // console.log("grandTotal", grandTotal);
    // setValue("dueAmount", dueAmount);

    // setValue("NetTotalAmount", netTotalAmount || "");
    trigger(["SGSTAmount", "CGSTAmount", "grandTotalAmount", "netTotalAmount"]); // Trigger validation
  }, [customerSelect]);
  // Removed console.log(errors);
  // ==============================================onSubmit =============================
  const onSubmit = async (data) => {
    setLoading(true);
    // console.log("Form data:", data); // Add this line to log form data

    const totalAmountPaid = data?.paymentsDetails?.reduce((acc, payment) => {
      return acc + Number(payment.Amount);
    }, 0);
    // console.log("1111", quoSection ? customerSelect.EntityID : data.company);

    const arr = {
      BillCode: "INVP",
      ReceiptDate: `${receiptDate}T00:00:00`,
      PaymentType: data.PaymentType,
      QuotationNo: customerSelect?.label || null,

      // =======================================
      ReceiptProductModelList: data.items.map((item, index) => ({
        ProductModelID: item.ProductModelID,
        ColorMasterID: null,
        HSNMasterID: null,
        BrandMasterID: null,

        CGSTP: (watch("CGSTP") || 5).toString(),
        SGSTP: (watch("SGSTP") || 5).toString(),
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
      })),
      DiscountDesc: data.discountDesc || "",
      DiscountUnit: data.discountUnit || "P",
      SGSTP: data.SGSTP,
      CGSTP: data.CGSTP,
      Discount: data.discount,
      BillEntityType: "COMP",
      EntityType: "SUPP",
      EntityID: quoSection ? customerSelect.EntityID : data.selectedSupplier,

      BillEntityID: quoSection ? customerSelect.BillEntityID : data.company,
      CheckedByID: data.checkedBy || signatoryDetails?.CheckedByList[0]?.ID,
      PreparedByID: data.preparedBy || signatoryDetails?.PreparedByList[0]?.ID,
      AuthorizedSignatoryByID:
        data.authorizeBy || signatoryDetails?.AuthorizedSignatoryList[0]?.ID,
      RoundOffAmount: data.roundUpAmount || 0,
      customerProfileID: null,
      custProStatus: data.PaymentType || "",
      DiscountAmount: data.discountValue || 0,
      // TotalAmountAD: data.totalAmountAD || 0,
      TotalAmountAD: 0,
      //
      TotalAmountBD: 0,
      // TotalAmountBD: data.totalAmountBD || 0,

      CGSTAmount: data.cgstValue || 0,
      SGSTAmount: data.TotalGst || 0,
      GrandTotalAmount: data.GrandTotalAmount || 0,
      NetTotalAmount: data.NetTotalAmount || 0,
      PaymentDetails: data.paymentsDetails,
      NetPaidAmount: totalAmountPaid || 0,
      NetDueAmount: data.GrandTotalAmount - (totalAmountPaid || 0),
      ExpectedDueDate: paymentInformation.expectedDueDate,
      PaymentStatus: "Partial Due",
      QuotationBookingMasterId: customerSelect?.id || null,
      Remarks: data.remarks,
    };

    console.log("arr", arr);
    const token = Cookies.get("token");
    const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;
    console.log("arr", arr);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_URL}/api/insertReceiptPayment`,
        arr,
        {
          headers: {
            Authorization: sanctumToken,
          },
        }
      );
      // console.log("Post response:", res.data); // Add this line to log the response
      // console.log("Post response data:", res.data.data[0]); // Add this line to log the response data
      // invoicePurCreatepdf(res.data.data[0]);
      setRow(res.data.data[0]); // this will be passed to PDF
      if (!triggerPrint) {
        setTriggerPrint(true); // trigger the PDF opening only if not already triggered
      }

      setLoading(false);
      console.log("Post response:", res.data.data[0]);

      fetchAllInvoice(); // <-- Call to refresh invoice table
      handleAddCustomerClose();

      const queryKeys = [
        ["inventoryGraphApi"],
        ["gstGraphApi"],
        ["invoicePurGraphApi"],
        ["incoicePurYearGraphApi"], // fix typo if needed
        ["dueGraphApi"],
        ["inventoryListApi"],
        ["allTransuctionListApi"],
        ["purchaseTransuctionListApi"],
        ["productListApi"],
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
      console.log("Post error:", error); // Add this line to log the error
      setLoading(false);
      // handleAddCustomerClose();
      console.log(error);
    }
  };
  // =

  const today = dayjs().format("YYYY-MM-DD");
  console.log("errors", errors);

  // Snackbar state
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  React.useEffect(() => {
    if (productModelError) {
      setOpenSnackbar(true);
    }
  }, [productModelError]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
    setProductModelError(false);
  };

  return (
    <Box padding={3}>
      <FormProvider {...methods}>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            // setProductModelError(false);
            // const formData = getValues();
            // const items = formData.items || [];
            // const seen = new Set();
            // let hasDuplicate = false;
            // for (let item of items) {
            //   if (item.ProductModelID && seen.has(item.ProductModelID)) {
            //     hasDuplicate = true;
            //     break;
            //   }
            //   seen.add(item.ProductModelID);
            // }
            // if (hasDuplicate) {
            //   setProductModelError(true);
            //   setOpenSnackbar(true);
            //   return;
            // }
            handleSubmit(onSubmit)(e);
          }}
        >
          {/* Snackbar for duplicate ProductModelID error */}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={4000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          >
            <MuiAlert
              onClose={handleSnackbarClose}
              severity="error"
              sx={{ width: "100%" }}
              elevation={6}
              variant="filled"
            >
              Duplicate ProductModelID found. Please remove duplicates before
              submitting.
            </MuiAlert>
          </Snackbar>
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <FormControl component="fieldset" sx={{ float: "right" }}>
                <RadioGroup
                  row
                  value={quoSection ? "withQ" : "withoutQ"}
                  onChange={(event) => {
                    setQuoSection(event.target.value === "withQ");
                    if (event.target.value !== "withQ") {
                      reset({
                        company: "",
                        discountDesc: "festival discount",
                        items: [
                          {
                            ProductModelID: null,
                            Rate: 0,
                            Amount: 0,
                            discount: 0,
                            SGSTP: 5,
                            CGSTP: 5,
                            total: 0,
                          },
                        ],
                        discountUnit: "P",
                        SGSTP: 9,
                        CGSTP: 9,
                        discount: 0,
                        roundUpAmount: 0,
                        discountDesc: "festival discount",
                        selectedSupplier: "",
                        quoSection: event.target.value === "withQ",
                      });
                    } else {
                      reset({
                        company: "",
                        discountDesc: "festival discount",
                        items: [],
                        discountUnit: "P",
                        SGSTP: 5,
                        CGSTP: 5,
                        discount: 0,
                        roundUpAmount: 0,
                        selectedSupplier: "",
                        quoSection: event.target.value === "withQ",
                      });
                    }
                    setCustomerSelect([]);
                    setItemSelect([]);
                  }}
                  sx={greenBorderStyle}
                >
                  <FormControlLabel
                    value="withQ"
                    control={<Radio sx={{ color: "green" }} />}
                    label="With Quotation"
                    sx={{ color: "green" }}
                  />
                  <FormControlLabel
                    value="withoutQ"
                    control={<Radio sx={{ color: "green" }} />}
                    label="Without Quotation"
                    sx={{ color: "green" }}
                  />
                </RadioGroup>
              </FormControl>
              <Box sx={{ display: "flex", gap: "1rem" }}>
                <Box>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Controller
                      name="receiptDate"
                      control={control}
                      defaultValue={today} // Set default value to today's date
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
                            field.onChange(
                              dayjs(newValue).format("YYYY-MM-DD")
                            );
                            handleDateChange(newValue);
                          }}
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
                <Box sx={{ minWidth: 180 }}>
                  <FormControl
                    fullWidth
                    error={!!errors.company}
                    sx={greenBorderStyle}
                  >
                    <InputLabel
                      id="demo-simple-select-label"
                      sx={{ color: "green" }}
                    >
                      Select Company
                    </InputLabel>
                    <Controller
                      name="company"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          sx={{ backgroundColor: "white", ...greenBorderStyle }}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Select Company"
                          onChange={(e) => {
                            field.onChange(e);
                            // setCompany(e.target.value);
                          }}
                        >
                          {allCompanyList?.map((i, index) => (
                            <MenuItem key={index} value={i.CompanyID}>
                              {i.CompanyName}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.company && (
                      <FormHelperText sx={{ color: "red" }}>
                        {errors.company.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Box>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {!quoSection && (
                <>
                  <Box>
                    <SupplierCreateDialog fetchAllSupplier={fetchAllSupplier} />
                  </Box>

                  <Box sx={{ minWidth: 355 }}>
                    <FormControl fullWidth sx={greenBorderStyle}>
                      <InputLabel
                        id="demo-simple-select-label"
                        sx={{ color: "green" }}
                      >
                        Select Supplier
                      </InputLabel>
                      <Controller
                        name="selectedSupplier"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            sx={{ bgcolor: "white", ...greenBorderStyle }}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Select Supplier"
                            value={field.value}
                            // onChange={(e) => {
                            //   field.onChange(e);
                            //   const selectedSupplier = supplierList.find(
                            //     (supplier) =>
                            //       supplier.SupplierID === e.target.value
                            //   );
                            //   setCustomerSelect(selectedSupplier);
                            //   setValue(
                            //     "selectedSupplier",
                            //     selectedSupplier.SupplierID
                            //   ); // Ensure the value is updated
                            // }}
                          >
                            {supplierList?.map((customer) => (
                              <MenuItem
                                key={customer.SupplierID}
                                value={customer.SupplierID}
                              >
                                {customer.SupplierName}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                      {errors.selectedSupplier && (
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.selectedSupplier.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                </>
              )}
            </Grid>
            {quoSection && (
              <Grid item xs={12}>
                <Box sx={{ width: "30%" }}>
                  <SelectComponent
                    value={customerSelect}
                    onChange={(selectedOption) => {
                      setValue(
                        "CustomerId",
                        selectedOption ? selectedOption.id : ""
                      );
                      setValue(
                        "company",
                        selectedOption ? selectedOption.BillEntityID : ""
                      );
                      setCustomerSelect(selectedOption);
                    }}
                    options={customerOptions}
                    placeholder="Select Quotation"
                    isSearchable={true}
                    styles={greenBorderStyle}
                  />
                  <Typography color="error" sx={{ ml: 2 }}>
                    {customerSelect?.length === 0 && "select quotation"}
                  </Typography>
                </Box>
              </Grid>
            )}

            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "space-around",
                flexWrap: "wrap",
              }}
            >
              {(customerSelect?.name ||
                customerSelect?.DealerName ||
                customerSelect?.FirstName) && (
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
                    {customerSelect?.name ||
                      customerSelect?.DealerName ||
                      customerSelect?.FirstName}
                  </Typography>
                </Grid>
              )}
              {(customerSelect?.MobileNo1 || customerSelect?.MobileNumber) && (
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
                    <LocalPhoneIcon sx={{ fontSize: { xs: 30 }, mr: 1 }} />
                    {customerSelect.MobileNo1 || customerSelect?.MobileNumber}
                  </Typography>
                </Grid>
              )}
              {customerSelect?.Date && (
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
                    {customerSelect.Date}
                  </Typography>
                </Grid>
              )}
              {(customerSelect?.company || customerSelect?.AddressLine1) && (
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
                    {customerSelect.company ||
                      `${customerSelect.AddressLine1} ${customerSelect.AddressLine2} ${customerSelect.City} ${customerSelect.District} ${customerSelect.State} ${customerSelect.PinCode}`}
                  </Typography>
                </Grid>
              )}
            </Grid>
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
              <Stack
                direction="row"
                spacing={2}
                sx={{ width: "100%", justifyContent: "space-between" }}
              >
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
                <Stack direction="row" spacing={2}>
                  <Typography
                    variant="body1"
                    sx={{
                      textAlign: "center",
                      color: "red",
                      display: "flex",
                      gap: ".5rem",
                      alignItems: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Product already in the list. Increase quantity instead —
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      textAlign: "center",
                      color: "red",
                      display: "flex",
                      gap: ".5rem",
                      alignItems: "center",
                    }}
                  >
                    duplicates will cause submission errors.
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
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
                      mb: 2,
                    }}
                  >
                    <p>{index + 1}.</p>

                    <Grid item xs={7} sm={1.5}>
                      <Controller
                        name={`items.${index}.ProductModelID`}
                        control={control}
                        render={({ field }) => (
                          <>
                            <SelectComponent
                              {...field}
                              value={itemSelect[index] || null}
                              onChange={(selectedOption) => {
                                // Try to get from allItems, fallback to selectedOption if not found
                                let selectedItem = allItems.find(
                                  (item) =>
                                    item.ProductModelID === selectedOption.value
                                );
                                if (!selectedItem) {
                                  selectedItem = selectedOption;
                                }

                                setValue(
                                  `items.${index}.ProductModelID`,
                                  selectedItem.ProductModelID ||
                                    selectedOption.value
                                );
                                setValue(
                                  `items.${index}.BrandName`,
                                  selectedItem.BrandName ||
                                    selectedOption.BrandName ||
                                    selectedOption.label ||
                                    ""
                                );
                                setValue(
                                  `items.${index}.BrandMasterID`,
                                  selectedItem.BrandMasterID ||
                                    selectedOption.BrandMasterID ||
                                    ""
                                );
                                setValue(
                                  `items.${index}.Color`,
                                  selectedItem.ColorNames ||
                                    selectedOption.ColorNames ||
                                    ""
                                );
                                setValue(
                                  `items.${index}.ModelNumber`,
                                  selectedItem.ModelNumber ||
                                    selectedOption.ModelNumber ||
                                    ""
                                );
                                setValue(
                                  `items.${index}.HSNMasterID`,
                                  selectedItem.HSNMasterID ||
                                    selectedOption.HSNMasterID ||
                                    allHsn[0]?.ID
                                );
                                setValue(
                                  `items.${index}.CGSTP`,

                                  5
                                );
                                setValue(
                                  `items.${index}.MRP`,
                                  selectedItem.Price ||
                                    selectedOption.Price ||
                                    0
                                );
                                // StripeOf fallback logic
                                const stripeOfValue =
                                  selectedItem.StripeOf !== undefined &&
                                  selectedItem.StripeOf !== null &&
                                  selectedItem.StripeOf !== ""
                                    ? selectedItem.StripeOf
                                    : selectedOption.StripeOf !== undefined &&
                                        selectedOption.StripeOf !== null &&
                                        selectedOption.StripeOf !== ""
                                      ? selectedOption.StripeOf
                                      : "0";
                                setValue(
                                  `items.${index}.StripeOf`,
                                  String(stripeOfValue),
                                  {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                    shouldTouch: true,
                                  }
                                );
                                updateResult(index);

                                const quantity = Number(
                                  watch(`items.${index}.Quantity`) || 0
                                );
                                // setValue(
                                //   `items.${index}.result`,
                                //   (selectedItem.Price || 0) * quantity
                                // );

                                setValue(
                                  `items.${index}.AvailableQuantity`,
                                  selectedItem.AvailableQuantity
                                );

                                field.onChange(selectedOption.value); // Update the form field valu
                                // setValue(
                                //   `items.${index}.result`,
                                //   selectedItem.Price *
                                //     watch(`items.${index}.Quantity`)
                                // );

                                setValue(
                                  `items.${index}.AvailableQuantity`,
                                  selectedItem.AvailableQuantity
                                ); // <-- Add this line
                                const newItemSelect = [...itemSelect];
                                newItemSelect[index] = {
                                  value: selectedItem.ProductModelID,
                                  label: ` ${selectedItem.ModelNumber}`,
                                };
                                setItemSelect(newItemSelect);
                                field.onChange(selectedOption.value);
                              }}
                              options={itemOptions}
                              placeholder="Select Product"
                              isSearchable={true}
                              styles={{
                                ...greenBorderStyle,
                                control: (provided, state) => ({
                                  ...provided,
                                  minHeight: "3.0rem", // ✅ fixed height
                                  height: "3.0rem",
                                  borderColor: state.isFocused
                                    ? "green"
                                    : "green",
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
                      {/* <Typography sx={{ ml: 2 }}>
                        {allDescription[index]?.itemDesc}
                      </Typography> */}
                      {errors.items?.[index]?.ProductModelID && (
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.items[index].ProductModelID.message}
                        </FormHelperText>
                      )}
                      {/* <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ mt: 1, textAlign: "center" }}
                      >
                        Available:{" "}
                        {watch(`items.${index}.AvailableQuantity`) || 0}
                      </Typography> */}
                    </Grid>
                    <Grid item xs={5} sm={1}>
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
                              ...greenBorderStyle,
                              "& .MuiInputBase-root": {
                                height: "3.2rem",
                              },
                            }}
                            error={!!errors.items?.[index]?.BatchNo}
                            helperText={errors.items?.[index]?.BatchNo?.message}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              updateResult(index); // Trigger calculation
                            }}
                          />
                        )}
                      />
                      {/* {errors.items?.[index]?.BatchNo && (
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.items[index].BatchNo.message}
                        </FormHelperText>
                      )} */}
                    </Grid>
                    <Grid item xs={5} sm={1}>
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
                                updateResult(index);
                              }}
                              sx={{
                                background: "white",
                                ...greenBorderStyle,
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
                    </Grid>
                    <Grid item xs={5} sm={0.8}>
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
                              ...greenBorderStyle,
                              "& .MuiInputBase-root": {
                                height: "3.2rem",
                              },
                            }}
                            error={!!errors.items?.[index]?.MRP}
                            defaultValue={0}
                            helperText={errors.items?.[index]?.MRP?.message}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              updateResult(index); // Trigger calculation
                            }}
                          />
                        )}
                      />
                      {/* {errors.items?.[index]?.MRP && (
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.items[index].MRP.message}
                        </FormHelperText>
                      )} */}
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
                    {/* <Grid item xs={5} sm={0.8}>
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
                    </Grid> */}

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
                      <Controller
                        name={`items.${index}.discount`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            defaultValue={5}
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
                    <Grid item xs={5} sm={0.8}>
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
                            defaultValue={5}
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
                        updateResult(0);
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
            {customerSelect.length == 0 && quoSection && (
              <Box sx={{ width: "100%", textAlign: "center" }}>
                <Typography variant="body1" sx={{ color: "red" }}>
                  Please select the "Quotation" option to view items or proceed
                  to the "Without Quotation" section to add new items.
                </Typography>
              </Box>
            )}
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
                      HSNMasterID: allHsn[0]?.ID || 0,
                      Quantity: 1,
                      UnitQuantity: "Piece",
                      Rate: 0,
                      Amount: 0,
                      discount: 0,
                      QtyPerBox: 1,
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
            <Grid container spacing={2} sx={{ mt: 2, ml: 1 }}>
              <Grid
                container
                spacing={2}
                sx={{ mt: 2, ml: 1, justifyContent: "flex-end" }}
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
                        value={field.value} // Ensure blank if invalid
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
                        value={field.value} // Ensure blank if invalid
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

              <Box sx={{ float: "left", width: "100%", mt: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: "left",
                    width: "100%",
                    mt: 2,
                    display: "flex",
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
              <Box sx={{ width: "100%" }}>
                <InvoicePurPaymentForm
                  paymentAll={allPaymentType}
                  finalAmount={getValues("grandTotalAmount")}
                  // paymentIsValidFn={handlePaymentValidation}
                  // paymentinfoFn={getPaymentDataFn}
                  roundedStyle={roundedStyle}
                  setValue={setValue} // Pass setValue as a prop
                  darkGreenBorderStyle={darkGreenBorderStyle} // Pass darkGreenBorderStyle as a prop
                />
              </Box>
              <Grid item xs={12} sx={{ ml: 0 }}>
                <TextField
                  fullWidth
                  label="Remarks"
                  sx={{ bgcolor: "white", ...darkGreenBorderStyle }}
                  {...register("remarks")}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Box sx={{ width: "20rem", display: "flex", gap: "0.5rem" }}>
                  <Typography
                    variant="h6"
                    sx={{ textAlign: "center", width: "13rem" }}
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
                        value={field.value} // Ensure blank if invalid
                        sx={{
                          input: {
                            textAlign: "center", // Centers the value text
                            background: "white",
                          },
                          ...darkGreenBorderStyle,
                        }}
                      />
                    )}
                  />
                </Box>
              </Grid>
              <Grid container spacing={1} sx={{ pl: 2, mt: 2 }}>
                <Grid item xs={4} sm={4}>
                  <FormControl
                    fullWidth
                    error={!!errors.checkedBy}
                    sx={greenBorderStyle}
                  >
                    <InputLabel sx={{ color: "green" }}>Checked By:</InputLabel>
                    <Controller
                      name="checkedBy"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          sx={{
                            backgroundColor: "white",
                            ...greenBorderStyle,
                          }}
                          label="Checked By:"
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
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
                    <InputLabel sx={{ color: "green" }}>
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
                    <InputLabel sx={{ color: "green" }}>
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
                sx={{ display: "flex", justifyContent: "center" }}
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
                  Generate Invoice
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
        {/* {triggerPrint &&
          row &&
          typeof row === "object" &&
          pdfTriggerCount < 5 && (
            <BlobProvider document={<InvoicePurCreatepdf {...row} />}>
              {({ url, loading }) => {
                if (url && !loading) {
                  // open and reset trigger only once
                  window.open(url, "_blank");
                  setTriggerPrint(false);
                  setPdfTriggerCount(1); // Ensure only one PDF is generated
                }
                return null; // no UI needed here
              }}
            </BlobProvider>
          )} */}
        {triggerPrint &&
          row &&
          typeof row === "object" &&
          pdfTriggerCount < 1 &&
          !pdfBlockRef.current && (
            <BlobProvider document={<InvoicePurCreatepdf {...row} />}>
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
      </FormProvider>
      <LoadingComp loading={loading} />
    </Box>
  );
}
