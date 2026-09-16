import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useForm,
  useFieldArray,
  Controller,
  FormProvider,
} from "react-hook-form";
import axios from "axios";
import SelectComponent from "react-select";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import Cookies from "js-cookie";
import { red } from "@mui/material/colors";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import DamagePayment from "./DamagePaymentSale";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";
import FormHelperText from "@mui/material/FormHelperText";
import DamagePdf from "./DamagePdfSale";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import LoadingComp from "../../../../components/loadingComp/LoadingComp";
import { useQueryClient } from "@tanstack/react-query";
import { BlobProvider } from "@react-pdf/renderer";
import DamagePdfSalePDF from "./DamagePdfSalePDF";
import { formatDateTime } from "../../../../functionforAll";
import { set } from "lodash";

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  backgroundColor: "#f5f5f5",
  "& .MuiToggleButton-root": {
    padding: "4px 15px",
    fontSize: "0.875rem",
    borderRadius: "4px !important",
    border: "1px solid darkblue",
    color: "darkblue",
    "&.Mui-selected": {
      backgroundColor: "darkblue",
      color: "white",
      "&:hover": {
        backgroundColor: "darkblue",
        opacity: 0.9,
      },
    },
    "&:hover": {
      backgroundColor: "#e8f5e9",
    },
    "&:not(:first-of-type)": {
      marginLeft: "8px",
    },
  },
}));

// Update the StyledRadioGroup styling
const StyledRadioGroup = styled(RadioGroup)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
  backgroundColor: "#fff",
  padding: "3px",
  borderRadius: "4px",
  border: "1px solid darkblue",
  width: "fit-content",
  "& .MuiFormControlLabel-root": {
    margin: 0,
    padding: "4px 12px",
    transition: "all 0.3s ease",
    "&:first-of-type": {
      borderRadius: "4px 0 0 4px",
      borderRight: "1px solid darkblue",
    },
    "&:last-of-type": {
      borderRadius: "0 4px 4px 0",
    },
    "&:hover": {
      backgroundColor: "#e8f5e9",
    },
    "&.Mui-checked": {
      backgroundColor: "darkblue",
      color: "white",
    },
  },
  "& .MuiFormControlLabel-label": {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "darkblue",
  },
  "& .MuiRadio-root": {
    display: "none",
  },
  "& .Mui-checked + .MuiFormControlLabel-label": {
    color: "#fff",
  },
  "& .MuiFormControlLabel-root:has(.Mui-checked)": {
    backgroundColor: "darkblue",
  },
}));

// Custom green radio
const GreenRadio = (props) => (
  <Radio
    {...props}
    icon={<RadioButtonUncheckedIcon sx={{ color: "darkblue" }} />}
    checkedIcon={<RadioButtonCheckedIcon sx={{ color: "darkblue" }} />}
  />
);

// Custom green checkbox (square)
const GreenCheckbox = (props) => (
  <Checkbox
    {...props}
    icon={<CheckBoxOutlineBlankIcon sx={{ color: "darkblue" }} />}
    checkedIcon={<CheckBoxIcon sx={{ color: "darkblue" }} />}
    sx={{
      color: "darkblue",
      "&.Mui-checked": { color: "darkblue" },
    }}
  />
);

const CreateDamage = ({ dialogClose, damageFetchList }) => {
  // const { control, setValue, watch, register } = useForm({
  //   defaultValues: {
  //     tableData: [],
  //   },
  // });

  const [invoiceGroup, setInvoiceGroup] = useState([]);
  const [invoiceSelect, setInvoiceSelect] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedModule, setSelectedModule] = useState("sales");
  const [subdSelect, setSubdSelect] = useState(null);
  const [typeCustomer, setTypeCustomer] = useState("customer");
  const [customerList, setCustomerList] = useState([]);
  const [subDealerList, setSubDealerList] = useState([]);
  const [items, setItems] = useState([]);
  const [searchType, setSearchType] = useState("customer"); // New state for search type
  // const [finalPrice, setFinalPrice] = useState(0); // State to store final price from DamageReturnTableItemForm
  const [paymentDetails, setPaymentDetails] = useState([]); // Add this state at the top of your component
  const [paidAmount, setPaidAmount] = useState(0); // State to store paid amount
  const [totalAmountPaid, setTotalAmountPaid] = useState(0); // State to track total paid amount
  const [loading, setLoading] = useState(false);

  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;
  const [allPaymentType, setAllPaymentType] = useState([]);
  const fetchAllData = async () => {
    try {
      const [paymentsRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_URL}/api/getPaymentModes`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: sanctumToken,
          },
        }),
      ]);

      setAllPaymentType(paymentsRes.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // =======================================  get supp cust stbd =============================
  useEffect(() => {
    fetchAllData();
    setLoading(true);
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
        console.log(`Fetching ${entityType} list...`);
        console.log(response.data);
        if (selectedModule === "SUPP") {
          setSuppliers(Array.isArray(response.data.data) ? response.data : []);
        } else if (entityType === "CUST") {
          setCustomerList(response.data);
        } else if (entityType === "SUBD") {
          setSubDealerList(response.data);
        } else if (selectedModule === "purchase") {
          setSuppliers(response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error(
          `Error fetching ${entityType.toLowerCase()} list:`,
          error
        );
        setLoading(false);
      }
    };

    fetchEntities("CUST");
    fetchEntities("SUBD");
  }, []);
  // ================================================================================
  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      const url = `${process.env.REACT_APP_URL}/api/getInvoiceDamageReturn?Source=O&BillCode=${selectedModule === "purchase" ? "INVP" : "INVS"}&EntityID=${subdSelect?.id}&EntityType=${selectedModule === "purchase" ? "SUPP" : searchType === "customer" ? "CUST" : "SUBD"}`;
      console.log(url);
      try {
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: sanctumToken,
          },
        });
        console.log(response.data);
        if (response.data) {
          setInvoiceGroup(response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching invoices:", error);
        setLoading(false);
      }
    };

    if (subdSelect) {
      fetchInvoices();
    }
  }, [subdSelect, subdSelect]);

  // =============================================style =============================
  const primaryStyles = {
    fontWeight: "bold",
    "& .MuiOutlinedInput-root": {
      fontWeight: "bold",
      "& fieldset": { fontWeight: "bold", borderColor: "darkblue" },
      "&:hover fieldset": { fontWeight: "bold", borderColor: "darkblue" },
      "&.Mui-focused fieldset": {
        fontWeight: "bold",
        borderColor: "darkblue",
      },
    },
    "& .MuiInputBase-input": { fontWeight: "bold", color: "darkblue" },
    "& .MuiInputLabel-root": { fontWeight: "bold", color: "darkblue" },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "darkblue",
      fontWeight: "bold",
    },
    "& .MuiSelect-select": {
      color: "darkblue",
    },
    "& .MuiMenuItem-root": {
      "&:hover": {
        backgroundColor: "darkblue",
        color: "white",
      },
      "&.Mui-selected": {
        backgroundColor: "darkblue",
        color: "white",
        "&:hover": {
          backgroundColor: "darkblue",
        },
      },
    },
  };

  // ========================= select options =================================

  const custOptions = customerList?.map((customer) => ({
    // label: `${customer.Name} ${customer.PhoneNumber1}`,
    label: `${customer.Name}${customer.PhoneNumber1 ? ` - ${customer.PhoneNumber1}` : ""}`,

    id: customer.EntityID,
    name: customer.CustomerID,
  }));

  const subdOptions = subDealerList?.map((subd) => ({
    label: `${subd.Name}${subd.PhoneNumber1 ? ` - ${subd.PhoneNumber1}` : ""}`,
    id: subd.EntityID,
    name: subd.Name,
  }));
  const suppOptions = suppliers?.map((subd) => ({
    label: `${subd.Name}${subd.PhoneNumber1 ? ` - ${subd.PhoneNumber1}` : ""}`,

    id: subd.EntityID,
    name: subd.Name,
  }));
  // =================================================================================

  const columns = [
    {
      field: "ProductModelName",
      headerName: "Model Name",
      width: 390,
      editable: true,
    },
    {
      field: "UnitQuantity",
      headerName: "Unit Type",
      width: 150,
      editable: true,
      type: "singleSelect",
      valueOptions: ["Box", "Pcs"],
    },
    { field: "Quantity", headerName: "QTY", width: 150, editable: true },
    { field: "Rate", headerName: "Rate", width: 150, editable: true },
    { field: "Amount", headerName: "Amount", width: 150, editable: true },
    {
      field: "actions",
      headerName: "Actions",
      width: 70,
      renderCell: (params) => (
        <IconButton onClick={() => remove(params.id)} color="error">
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  // Snackbar state and helpers
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info", // "success" | "error" | "warning" | "info"
  });
  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };
  const queryClient = useQueryClient();

  // =================================================== Submit Event ================================================
  const handleSubmit = async () => {
    if (!invoiceSelect) {
      showSnackbar("Please select an invoice.", "warning");
      return;
    }
    console.log("paymentDetails before mapping:", paymentDetails);

    // Debug: Check paymentDetails before mapping

    // Add this check to alert if empty
    if (!paymentDetails || paymentDetails.length === 0) {
      showSnackbar(
        "Please enter payment details before submitting.",
        "warning"
      );
      return;
    }
    setLoading(true);

    // Set BillCode based on selectedModule
    const billCode = selectedModule === "purchase" ? "INVPR" : "INVSR";

    // Map paymentDetails to required structure
    const mappedPaymentDetails = (paymentDetails || []).map((pd) => ({
      ReceiptID: invoiceSelect.ReceiptID || pd.ReceiptID || null,
      PaymentSource: pd.PaymentModeName || pd.PaymentSource || "",
      PaymentModeID: pd.PaymentModeID || pd.PaymentModeId || null,
      PaymentModeDesc: pd.PaymentModeDesc || "",
      Amount:
        pd.PaymentModeDetails === "Return"
          ? -Number(pd.Amount || 0)
          : Number(pd.Amount || 0),
      PaymentDate: pd.PaymentDate || new Date().toISOString(),
      PaymentStatus: pd.PaymentType || pd.PaymentStatus || "",
    }));

    // Debug: Check mappedPaymentDetails
    console.log("mappedPaymentDetails:", mappedPaymentDetails);

    // Use dynamic values
    const remarks = methods.getValues("remarks");
    // PaymentStatus: use the first paymentDetails PaymentType or fallback to "Cash"
    const paymentStatus =
      (paymentDetails && paymentDetails[0]?.PaymentType) || "Cash";
    // EntityType: use the value used to fetch invoices
    const entityType =
      selectedModule === "purchase"
        ? "SUPP"
        : searchType === "customer"
          ? "CUST"
          : "SUBD";
    // BillEntityType: from invoiceSelect if present
    const billEntityType = invoiceSelect.BillEntityType || "";

    // Get calculated values from replacement section
    const discountAmount = repWatch("discount") || 0;
    const cgstp = repWatch("SGSTP") || 0;
    const cgstAmount = repWatch("cgstValue") || 0;
    const sgstp = repWatch("CGSTP") || 0;
    const sgstAmount = repWatch("sgstValue") || 0;
    const grandTotalAmount = (
      Number(invoiceSelect.GrandTotalAmount) +
      Number(repWatch("grandTotalAmount"))
    ).toFixed(2);
    const totalAmountAD = repWatch("totalAmountAD") || 0;
    const netTotalAmount = grandTotalAmount;
    // Updated due amount calculation
    const netDueAmount = (
      Number(invoiceSelect.NetDueAmount || 0) -
      Number(totalSelectedPrice) +
      Number(repWatch("grandTotalAmount"))
    ).toFixed(2);

    // Calculate NetPaidAmount as Previous Invoice Amount + Newly added item cost
    const netPaidAmount =
      Number(invoiceSelect.GrandTotalAmount) +
      Number(repWatch("grandTotalAmount"));

    const payload = {
      ReceiptID: Number(invoiceSelect.ReceiptID) || 0,
      ReceiptNumber: invoiceSelect.ReceiptNumber,
      BillCode: billCode,
      ReceiptDate: new Date().toISOString(),
      PaymentType: "F",
      TotalAmountBD: 0,
      DiscountDesc: null,
      DiscountUnit: "%",
      Discount: Number(repWatch("discount")) || 0,
      DiscountAmount: Number(discountAmount) || 0,
      TotalAmountAD: 0,
      CGSTP: Number(cgstp) || 0,
      CGSTAmount: Number(cgstAmount) || 0,
      SGSTP: Number(sgstp) || 0,
      SGSTAmount: Number(sgstAmount) || 0,
      GrandTotalAmount: Number(grandTotalAmount) || 0,
      RoundOffAmount: Number(repWatch("roundUpAmount")),
      NetTotalAmount: Number(netTotalAmount) || 0,
      NetPaidAmount: Number(netPaidAmount) || 0, // <-- updated as per requirement
      NetDueAmount: Number(repWatch("NetDueAmount")) || 0,
      Remarks: remarks,
      PaymentStatus: "Pertial Due",
      EntityType: entityType,
      EntityID: Number(subdSelect?.id) || 0,
      BillEntityType: "COMP",
      BillEntityID: Number(invoiceSelect.BillEntityID) || 0,
      CheckedByID: Number(checkedByID) || 0,
      PreparedByID: Number(preparedByID) || 0,
      AuthorizedSignatoryByID: Number(authorizedSignatoryByID) || 0,
      ReceiptProductModelList: [
        ...items.map((item) => {
          // Always use the latest sections from the item (never fallback to [])
          const sections = Array.isArray(item.sections) ? item.sections : [];

          // Build ModelStatusData array from sections
          let modelStatusData = [];
          let totalMarked = 0;

          // Only process if there are sections and at least one R/D quantity > 0
          sections.forEach((section) => {
            // Return
            if (section.returnChecked && Number(section.returnQuantity) > 0) {
              totalMarked += Number(section.returnQuantity);
              modelStatusData.push({
                ReceiptProductModelID: item.ReceiptProductModelID || null,
                ProductModelID: item.ProductModelID,
                ProductModelStatus: "R",
                Quantity: Number(section.returnQuantity),
                OtherReasonRD:
                  section.returnReason === "Other"
                    ? section.returnDescription || "Describe return issue"
                    : null,
                PIAppPropertyID:
                  section.returnReason === "Other"
                    ? null
                    : (section.selectedReturnReason?.id ?? null),
              });
            }
            // Damage
            if (section.damageChecked && Number(section.damageQuantity) > 0) {
              totalMarked += Number(section.damageQuantity);
              modelStatusData.push({
                ReceiptProductModelID: item.ReceiptProductModelID || null,
                ProductModelID: item.ProductModelID,
                ProductModelStatus: "D",
                Quantity: Number(section.damageQuantity),
                OtherReasonRD:
                  section.damageReason === "Other"
                    ? section.damageDescription || "Describe damage issue"
                    : null,
                PIAppPropertyID:
                  section.damageReason === "Other"
                    ? null
                    : (section.selectedDamageReason?.id ?? null),
              });
            }
          });

          // Calculate left quantity (existing)
          const originalQty = Number(item.Quantity || 0);
          const leftQuantity = originalQty - totalMarked;
          if (leftQuantity > 0) {
            modelStatusData.push({
              ReceiptProductModelID: item.ReceiptProductModelID || null,
              ProductModelID: item.ProductModelID,
              ProductModelStatus: "E",
              Quantity: leftQuantity,
              OtherReasonRD: null,
              PIAppPropertyID: null,
            });
          }

          // If nothing was marked, fallback to all existing
          if (modelStatusData.length === 0 && originalQty > 0) {
            modelStatusData.push({
              ReceiptProductModelID: item.ReceiptProductModelID || null,
              ProductModelID: item.ProductModelID,
              ProductModelStatus: "E",
              Quantity: originalQty,
              OtherReasonRD: null,
              PIAppPropertyID: null,
            });
          }

          // Parent ProductModelStatus logic:
          // If any ModelStatusData is "R" or "D", parent is "R"
          // If all are "E", parent is null
          let parentStatus = null;
          if (
            modelStatusData.some(
              (msd) =>
                msd.ProductModelStatus === "R" || msd.ProductModelStatus === "D"
            )
          ) {
            parentStatus = "R";
          }

          // Parent quantity is sum of all ModelStatusData quantities
          const parentQuantity = modelStatusData.reduce(
            (sum, msd) => sum + Number(msd.Quantity || 0),
            0
          );

          return {
            ProductModelID: item.ProductModelID,
            ColorMasterID: item.ColorMasterID,
            HSNMasterID: item.HSNMasterID,
            BrandMasterID: item.BrandMasterID,
            GSTP: item.GSTP,
            Quantity: parentQuantity,
            UnitQuantity: item.UnitQuantity,
            Rate: item.Rate,
            DISP: item.DISP,
            Amount: item.Amount,
            ProductModelStatus: parentStatus,
            ModelStatusData: modelStatusData,
          };
        }),
        // Add replacement items as new products (no ModelStatusData, ProductModelStatus: "N")
        ...replacementItems
          .filter((r) => r.ProductModelID)
          .map((r) => ({
            ProductModelID: Number(r.ProductModelID),
            ColorMasterID: Number(r.ColorMasterID) || null,
            HSNMasterID: Number(r.HSNMasterID) || null,
            BrandMasterID: Number(r.BrandMasterID) || null,
            GSTP: r.GSTP || null,
            Quantity: Number(r.Quantity) || 0,
            UnitQuantity: r.UnitQuantity,
            Rate: Number(r.Price) || 0,
            DISP: 0,
            Amount: Number(r.Amount) || 0,
            ProductModelStatus: "N",
            // No ModelStatusData for new products
          })),
      ],
      // 2. Use paymentDetails state for PaymentDetails
      PaymentDetails: mappedPaymentDetails,
    };

    // Log the payload before posting
    console.log("Posting payload:", JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/api/damageInsert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: sanctumToken,
          },
          body: JSON.stringify(payload),
        }
      );
      console.log("payload", payload);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log(response);

      const result = await response.json();
      // Log the response data after posting
      console.log("Response data after POST:", result);

      showSnackbar("Data submitted successfully!", "success");
      // --- Generate and open PDF automatically ---
      // DamagePdf(
      //   result.data && Array.isArray(result.data) ? result.data[0] : result
      // );
      // -------------------------------------------

      setRow(
        result.data && Array.isArray(result.data) ? result.data[0] : result
      ); // this will be passed to PDF
      if (!triggerPrint) {
        setTriggerPrint(true); // trigger the PDF opening only if not already triggered
      }

      setLoading(false);
      damageFetchList();

      dialogClose();
      const queryKeys = [
        ["inventoryListApi"],
        ["allTransuctionListApi"],
        ["SaleReturnTransuctionListApi"],
        // ==========================================
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
      console.error("Error submitting data:", error);
      showSnackbar("Failed to submit data.", "error");
      setLoading(false);
    }
  };

  // ========== Begin inlined DamageReturnTableItemForm logic ==========

  // For items table and replacement/final settlement
  const [selectedPrices, setSelectedPrices] = useState({});
  const [row, setRow] = useState(null);
  const [childOptions, setChildOptions] = useState([]);

  const [triggerPrint, setTriggerPrint] = useState(false);
  const [pdfTriggerCount, setPdfTriggerCount] = useState(0); // <-- Add counter state
  const [showReplacement, setShowReplacement] = useState(false);
  const [replacementItems, setReplacementItems] = useState([
    {
      ProductModelID: "",
      HSNMasterID: "",
      Quantity: 1,
      UnitQuantity: "Piece",
      Price: 0,
      Amount: 0,
      discount: 0,
      QtyPerBox: 1,
    },
  ]);
  const [allHsn, setAllHsn] = useState([]);
  const [itemOptions, setItemOptions] = useState([]);
  const [rowsToAdd, setRowsToAdd] = useState(1);
  const [itemSelect, setItemSelect] = useState([]);

  // For replacement/final settlement calculations
  const methods = useForm({
    shouldUnregister: true,
    defaultValues: {
      discountDesc: "festival discount",
      SGSTP: 9,
      CGSTP: 9,
      discount: 0,
      roundUpAmount: 0,
      totalAmountBD: "",
      totalAmountAD: "",
      sgstValue: "",
      cgstValue: "",
      grandTotalAmount: "",
    },
    mode: "onSubmit",
  });
  // ==========================================================child opton=================
  // useEffect(() => {
  //   if (!productModelID) {
  //     setChildOptions([]);
  //     setValue(`items.${index}.child`, "");
  //     return;
  //   }
  //   let ignore = false;
  //   console.log(
  //     `${process.env.REACT_APP_URL}/api/getParamsInventory/${productModelID}`
  //   );
  //   axios
  //     .get(
  //       `${process.env.REACT_APP_URL}/api/getParamsInventory/${productModelID}`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: sanctumToken,
  //         },
  //       }
  //     )
  //     .then((res) => {
  //       if (ignore) return;
  //       const data = res.data?.raw_result || [];
  //       console.log("childOptions data", res.data);
  //       setChildOptions(data);
  //       setValue(`items.${index}.child`, "");
  //     })
  //     .catch(() => {
  //       if (ignore) return;
  //       setChildOptions([]);
  //       setValue(`items.${index}.child`, "");
  //     });
  //   return () => {
  //     ignore = true;
  //   };
  // }, []);

  // Add these lines to alias the replacement form methods
  const repWatch = methods.watch;
  const repSetValue = methods.setValue;
  const repControl = methods.control;

  const {
    register,
    control,
    formState: { errors },
    setValue,
    reset,
    getValues,
    trigger,
    watch,
  } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tableData",
  });

  // Watch for changes in replacementItems and calculation fields
  const watchedDiscount = repWatch("discount");
  const watchedSGSTP = repWatch("SGSTP");
  const watchedCGSTP = repWatch("CGSTP");

  // For table rows
  const [tableItems, setTableItems] = useState([]);
  useEffect(() => {
    let list = invoiceSelect?.ReceiptProductModelList;
    if (!list) return setTableItems([]);
    if (typeof list === "string") {
      try {
        list = JSON.parse(list);
      } catch {
        setTableItems([]);
        return;
      }
    }
    if (!Array.isArray(list)) list = [list];
    // For each product, sum all ModelStatusData quantities except R or D
    const itemsArr = list
      .map((item) => {
        let modelStatusData = [];
        if (item.ModelStatusData) {
          try {
            modelStatusData =
              typeof item.ModelStatusData === "string"
                ? JSON.parse(item.ModelStatusData)
                : Array.isArray(item.ModelStatusData)
                  ? item.ModelStatusData
                  : [];
          } catch {
            modelStatusData = [];
          }
        }

        // If ModelStatusData is missing or empty, treat the item as fully existing (E)
        if (!item.ModelStatusData || modelStatusData.length === 0) {
          return {
            ...item,
            Quantity: Number(item.Quantity || 0),
            sections: item.sections || [],
          };
        }

        // --- NEW LOGIC START ---
        // Show if:
        // - Any ModelStatusData has ProductModelStatus = "E"
        // - OR ProductModelStatus (at product level) is "N"
        // - OR Any ModelStatusData has ProductModelStatus = "N"
        const hasE = modelStatusData.some(
          (msd) => (msd.ProductModelStatus || "").trim().toUpperCase() === "E"
        );
        const hasN =
          (item.ProductModelStatus || "").trim().toUpperCase() === "N" ||
          modelStatusData.some(
            (msd) => (msd.ProductModelStatus || "").trim().toUpperCase() === "N"
          );
        if (!hasE && !hasN) return null;
        // --- NEW LOGIC END ---

        // Sum all except R or D
        const leftQty = modelStatusData
          .filter((msd) => {
            const status = (msd.ProductModelStatus || "").trim().toUpperCase();
            return status !== "R" && status !== "D";
          })
          .reduce((sum, msd) => sum + Number(msd.Quantity || 0), 0);

        // For N, if ModelStatusData is empty, use item.Quantity
        let displayQty = leftQty;
        if (displayQty <= 0 && hasN) {
          displayQty = Number(item.Quantity || 0);
        }
        if (displayQty <= 0) return null;

        return {
          ...item,
          Quantity: displayQty,
          sections: item.sections || [],
        };
      })
      .filter(Boolean);
    setTableItems(itemsArr);
    setItems(itemsArr); // keep parent state in sync
  }, [invoiceSelect]);
  console.log("table item", tableItems);

  const totalReplacementAmount = replacementItems.reduce((sum, item) => {
    const sgstVal =
      item.SGSTP !== undefined && item.SGSTP !== "" ? Number(item.SGSTP) : 5;
    const cgstVal =
      item.CGSTP !== undefined && item.CGSTP !== "" ? Number(item.CGSTP) : 5;
    const qty = Number(item.Quantity) || 0;
    const price = Number(item.Price) || 0;
    const discount = Number(item.discount) || 0;
    const baseAmount = qty * price;
    const sgstAmount = (baseAmount * sgstVal) / 100;
    const cgstAmount = (baseAmount * cgstVal) / 100;
    const discountAmount = (baseAmount * discount) / 100;
    const totalAmount = baseAmount + sgstAmount + cgstAmount - discountAmount;
    return sum + totalAmount;
  }, 0);
  console.log("Total Replacement Amount:", totalReplacementAmount);

  // Table row expand/collapse logic
  function useCollapse(initial = false) {
    const [open, setOpen] = useState(initial);
    return [open, () => setOpen((v) => !v)];
  }

  // Table Row component logic (inlined)
  const handleUpdateSelectedPrice = (id, price) =>
    setSelectedPrices((prev) => ({ ...prev, [id]: price }));
  const handleUpdateSections = (id, updatedSections) =>
    setItems((items) =>
      items.map((item) =>
        item.ReceiptProductModelID === id
          ? { ...item, sections: updatedSections || [] }
          : item
      )
    );

  // Replacement item field changes
  const handleReplacementChange = async (idx, field, value) => {
    if (field === "ProductModelID" && value) {
      console.log("id", idx, "value", value);
      const res = await axios.get(
        `${process.env.REACT_APP_URL}/api/getParamsInventory/${value}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: sanctumToken,
          },
        }
      );
      console.log(res?.data?.raw_result);
      const newoption = childOptions;
      newoption[idx] = res?.data?.raw_result || [];
      setChildOptions(newoption);
    }
    setReplacementItems((items) => {
      const updated = [...items];
      if (field === "ProductModelID") {
        // Find the full product object
        const selected = itemOptions.find(
          (i) => String(i.ProductModelID) === String(value)
        );
        if (selected) {
          // Find HSN from allHsn
          const hsnObj = allHsn.find(
            (h) =>
              String(h.ID) === String(selected.HSNMasterID) ||
              String(h.HSNCode) === String(selected.HSNCode)
          );
          updated[idx] = {
            ...updated[idx],
            ProductModelID: selected.ProductModelID,
            ModelNumber: selected.ModelNumber,
            BrandMasterID: selected.BrandMasterID,
            BrandName: selected.BrandName,
            ProductTypeID: selected.ProductTypeID,
            ProductTypeName: selected.ProductTypeName,
            ProductCategoryID: selected.ProductCategoryID,
            ProductCategoryName: selected.ProductCategoryName,
            ProductSubCategoryID: selected.ProductSubCategoryID,
            ProductSubCategoryName: selected.ProductSubCategoryName,
            HSNMasterID: hsnObj ? hsnObj.ID : selected.HSNMasterID,
            HSNCode: hsnObj ? hsnObj.HSNCode : selected.HSNCode,
            Dimension: selected.Dimension,
            Length: selected.Length,
            Width: selected.Width,
            Height: selected.Height,
            Unit: selected.Unit,
            Price: Number(selected.Price) || 0,
            Description: selected.Description,
            Image1: selected.Image1,
            Image2: selected.Image2,
            Image3: selected.Image3,
            SizeMasterID: selected.SizeMasterID,
            Shape: selected.Shape,
            QtyPerBox: Number(selected.QtyPerBox) || 1,
            AvailableQuantity: selected.AvailableQuantity,
            ColorListJson: selected.ColorListJson,
            ColorNames: selected.ColorNames,
            ColorList: selected.ColorList,
            Quantity: 1, // reset to 1 or keep previous if you want
            UnitQuantity: "Piece",
            Amount:
              (Number(selected.Price) || 0) *
                (Number(updated[idx].Quantity) || 1) -
              ((Number(selected.Price) || 0) *
                (Number(updated[idx].Quantity) || 1) *
                (Number(updated[idx].discount) || 0)) /
                100,
            discount: updated[idx].discount || 0,
          };
        } else {
          updated[idx][field] = value;
        }
      } else if (field === "HSNMasterID") {
        // User changed HSN code from dropdown
        const hsnObj = allHsn.find((h) => String(h.ID) === String(value));
        if (hsnObj) {
          updated[idx].HSNMasterID = hsnObj.ID;
          updated[idx].HSNCode = hsnObj.HSNCode;
        }
      } else {
        updated[idx][field] = value;
        // Update Amount if relevant fields change
        if (["Price", "Quantity", "discount"].includes(field)) {
          updated[idx].Amount =
            (Number(updated[idx].Price) || 0) *
              (Number(updated[idx].Quantity) || 0) -
            ((Number(updated[idx].Price) || 0) *
              (Number(updated[idx].Quantity) || 0) *
              (Number(updated[idx].discount) || 0)) /
              100;
        }
      }
      return updated;
    });
  };

  // Add new replacement row(s)
  const addReplacementRows = () => {
    setReplacementItems((items) => [
      ...items,
      ...Array.from({ length: rowsToAdd }).map(() => ({
        ProductModelID: "",
        HSNMasterID: "",
        Quantity: 1,
        UnitQuantity: "Piece",
        Price: 0,
        Amount: 0,
        discount: 0,
        QtyPerBox: 1,
      })),
    ]);
    setChildOptions((prev) => [...prev, []]);
    setItemSelect((sel) => [
      ...sel,
      ...Array.from({ length: rowsToAdd }).map(() => null),
    ]);
  };

  // Remove replacement row
  const removeReplacementRow = (idx) => {
    setReplacementItems((items) => items.filter((_, i) => i !== idx));
    setItemSelect((sel) => sel.filter((_, i) => i !== idx));
    const itemOptions = childOptions;
    childOptions.splice(idx, 1);
    setChildOptions(itemOptions);
  };

  // Fetch HSN and Product dropdown options from APIs
  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("token");
      const sanctumToken = `Bearer ${token?.replace(/"/g, "")}`;
      try {
        // Fetch HSN
        const hsnRes = await axios.get(
          `${process.env.REACT_APP_URL}/api/getHSN`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: sanctumToken,
            },
          }
        );
        const hsnArr = Array.isArray(hsnRes.data?.data)
          ? hsnRes.data.data
          : Array.isArray(hsnRes.data)
            ? hsnRes.data
            : [];
        setAllHsn(
          hsnArr.map((item) => ({
            ID: item.ID,
            HSNCode: item.HSNCode,
          }))
        );
        // Fetch Products
        const prodRes = await axios.get(
          `${process.env.REACT_APP_URL}/api/getProductModels`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: sanctumToken,
            },
          }
        );
        // Store the full product object for each option
        setItemOptions(
          Array.isArray(prodRes.data)
            ? prodRes.data.map((item) => ({
                ...item,
                value: Number(item.ProductModelID),
                label: `${item.BrandName} ${item.ModelNumber}`,
              }))
            : []
        );
      } catch (err) {
        setAllHsn([
          { ID: 1, HSNCode: "HSN001" },
          { ID: 2, HSNCode: "HSN002" },
        ]);
        setItemOptions([
          {
            value: 1,
            label: "BrandA ModelX",
            BrandName: "BrandA",
            ModelNumber: "ModelX",
            Price: 100,
            ProductModelID: 1,
            BrandMasterID: 1,
            HSNMasterID: 1,
            HSNCode: "HSN001",
            QtyPerBox: 1,
          },
          {
            value: 2,
            label: "BrandB ModelY",
            BrandName: "BrandB",
            ModelNumber: "ModelY",
            Price: 200,
            ProductModelID: 2,
            BrandMasterID: 2,
            HSNMasterID: 2,
            HSNCode: "HSN002",
            QtyPerBox: 1,
          },
        ]);
      }
    };
    fetchData();
  }, []);

  // Calculate totals for table
  const totalQuantity = tableItems.reduce(
    (sum, i) => sum + Number(i.Quantity || 0),
    0
  );
  const totalAmount = tableItems.reduce(
    (sum, i) => sum + Number(i.Amount || 0),
    0
  );
  const totalReturnQuantity = tableItems.reduce(
    (sum, i) =>
      sum +
      (i.sections
        ? i.sections.reduce((s, sec) => s + Number(sec.returnQuantity || 0), 0)
        : 0),
    0
  );
  const totalSelectedPrice = Object.entries(selectedPrices).reduce(
    (sum, [id, selectedAmount]) => {
      // Find the item by id to get its Rate, CGSTP, SGSTP, and DISP (discount percentage)
      const item = tableItems.find(
        (i) => String(i.ReceiptProductModelID) === String(id)
      );
      const rate = item ? Number(item.Rate) || 0 : 0;
      const cgstp = item ? Number(item.CGSTP) || 0 : 0;
      const sgstp = item ? Number(item.SGSTP) || 0 : 0;
      const disp = item ? Number(item.DISP) || 0 : 0; // Discount percentage
      console.log("cgsstp", cgstp, "sgstp", sgstp, "disp", disp);
      // selectedAmount is the total for returned/damaged quantity * rate
      const discounted = selectedAmount - (selectedAmount * disp) / 100;
      const cgst = (discounted * cgstp) / 100;
      console.log("discounted", discounted, "cgst", cgst);
      const sgst = (discounted * sgstp) / 100;
      console.log("sgst", sgst);
      return sum + discounted + cgst + sgst;
    },
    0
  );
  // Use the finalPrice state variable instead of redeclaring it here

  // Update parent's finalPrice state
  // useEffect(() => {
  //   setFinalPrice(invoiceSelect.GrandTotalAmount - totalSelectedPrice);
  // }, [invoiceSelect.GrandTotalAmount, totalSelectedPrice]);

  // Notify parent about replacement items
  useEffect(() => {
    setReplacementItems(replacementItems);
  }, [replacementItems]);

  // Replacement/final settlement calculations
  useEffect(() => {
    // Calculate total price before discount
    const totalAmountBD = replacementItems.reduce(
      (sum, item) =>
        sum + (Number(item.Price) || 0) * (Number(item.Quantity) || 0),
      0
    );
    // Calculate discount (percentage)
    const discountPercent = Number(watchedDiscount) || 0;
    const discountAmount = (totalAmountBD * discountPercent) / 100;
    // Total after discount
    const totalAmountAD = totalAmountBD - discountAmount;
    // GST percentages
    const sgstPercent = Number(watchedSGSTP) || 0;
    const cgstPercent = Number(watchedCGSTP) || 0;
    // GST values
    const sgstValue = (totalAmountAD * sgstPercent) / 100;
    const cgstValue = (totalAmountAD * cgstPercent) / 100;
    // Grand total (after GST)
    let grandTotal = totalAmountAD + sgstValue + cgstValue;
    // Round up amount (difference to next integer)
    const roundUpAmount = Math.round(grandTotal) - grandTotal;
    // Final price (rounded)
    // const repFinalPrice = Math.round(grandTotal);
    // Set values in form
    repSetValue("totalAmountBD", totalAmountBD.toFixed(2));
    repSetValue("totalAmountAD", totalAmountAD.toFixed(2));
    repSetValue("sgstValue", sgstValue.toFixed(2));
    repSetValue("cgstValue", cgstValue.toFixed(2));
    repSetValue("roundUpAmount", roundUpAmount.toFixed(2));
    // repSetValue("grandTotalAmount", repFinalPrice.toFixed(2));
  }, [
    replacementItems,
    watchedDiscount,
    watchedSGSTP,
    watchedCGSTP,
    repSetValue,
  ]);

  // ========== End inlined DamageReturnTableItemForm logic ==========

  // Add rowStates and handlers for row expansion and section state (sourced from DamageReturnTableItemForm.jsx)
  const [rowStates, setRowStates] = useState([]);

  // Sync rowStates with tableItems
  useEffect(() => {
    setRowStates(
      tableItems.map((item) => ({
        open: false,
        sections:
          item.sections && item.sections.length > 0
            ? item.sections
            : [{ selectedOption: "return" }],
        returnPrice: 0,
        damagePrice: 0,
      }))
    );
  }, [tableItems]);

  const handleToggleRow = (idx) => {
    setRowStates((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, open: !row.open } : row))
    );
  };

  const handleSectionChange = (rowIdx, sidx, field, value, item) => {
    setRowStates((prev) => {
      const updatedRows = [...prev];
      const updatedSections = [...updatedRows[rowIdx].sections];
      updatedSections[sidx][field] = value;
      updatedRows[rowIdx].sections = updatedSections;
      // Fetch dropdown options if needed
      if (field === "selectedOption") {
        fetchDropdownOptions(value === "return" ? 1 : 2, rowIdx, sidx);
      }
      // Prevent over-quantity
      if (["returnQuantity", "damageQuantity"].includes(field)) {
        const total = updatedSections.reduce(
          (sum, s) =>
            sum + Number(s.returnQuantity || 0) + Number(s.damageQuantity || 0),
          0
        );
        if (total > item.Quantity) {
          alert(`Total cannot exceed ${item.Quantity}`);
          return prev;
        }
      }
      // Calculate prices
      const ret = updatedSections.reduce(
        (sum, s) => sum + Number(s.returnQuantity || 0) * item.Rate,
        0
      );
      const dmg = updatedSections.reduce(
        (sum, s) => sum + Number(s.damageQuantity || 0) * item.Rate,
        0
      );
      updatedRows[rowIdx].returnPrice = ret;
      updatedRows[rowIdx].damagePrice = dmg;
      handleUpdateSelectedPrice(item.ReceiptProductModelID, ret + dmg);
      handleUpdateSections(item.ReceiptProductModelID, updatedSections);
      return updatedRows;
    });
  };

  const handleCheckboxChange = (rowIdx, sidx, field, item) => {
    setRowStates((prev) => {
      const updatedRows = [...prev];
      const updatedSections = [...updatedRows[rowIdx].sections];
      if (item.Quantity === 1) {
        updatedSections[sidx][field + "Checked"] =
          !updatedSections[sidx][field + "Checked"];
        if (updatedSections[sidx][field + "Checked"]) {
          updatedSections[sidx][
            field === "return" ? "damageChecked" : "returnChecked"
          ] = false;
          fetchDropdownOptions(field === "return" ? 1 : 2, rowIdx, sidx);
        }
      } else {
        updatedSections[sidx][field + "Checked"] =
          !updatedSections[sidx][field + "Checked"];
        if (updatedSections[sidx][field + "Checked"])
          fetchDropdownOptions(field === "return" ? 1 : 2, rowIdx, sidx);
      }
      updatedRows[rowIdx].sections = updatedSections;
      return updatedRows;
    });
  };
  console.log("invoice select", invoiceSelect);

  // Fetch dropdown options for reasons
  const fetchDropdownOptions = async (propertyId, rowIdx, sidx) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_URL}/api/property/${propertyId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: sanctumToken,
          },
        }
      );
      const data = await res.json();
      setRowStates((prev) => {
        const updatedRows = [...prev];
        const updatedSections = [...updatedRows[rowIdx].sections];
        if (propertyId === 1)
          updatedSections[sidx].returnDropdownOptions = data;
        else updatedSections[sidx].damageDropdownOptions = data;
        updatedRows[rowIdx].sections = updatedSections;
        return updatedRows;
      });
    } catch {}
  };

  // Add these custom style objects after other style definitions
  const greenThemeStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#ffffff",
      borderColor: "darkblue",
      boxShadow: state.isFocused ? "0 0 0 1px darkblue" : "none",
      "&:hover": { borderColor: "darkblue" },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#ffffff",
      zIndex: 100,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "darkblue" : "#ffffff",
      color: state.isFocused ? "#fff" : "#000",
      "&:hover": {
        backgroundColor: "darkblue",
        color: "white",
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: "darkblue",
    }),
  };

  const menuProps = {
    PaperProps: {
      sx: {
        "& .MuiMenuItem-root": {
          "&:hover": {
            backgroundColor: "darkblue",
            color: "white",
          },
          "&.Mui-selected": {
            backgroundColor: "darkblue",
            color: "white",
            "&:hover": {
              backgroundColor: "darkblue",
            },
          },
        },
      },
    },
  };

  // Update the existing primaryStyles
  const updatedPrimaryStyles = {
    ...primaryStyles,
    "& .MuiSelect-select": {
      color: "darkblue",
    },
    "& .MuiMenuItem-root": {
      "&:hover": {
        backgroundColor: "darkblue",
        color: "white",
      },
      "&.Mui-selected": {
        backgroundColor: "darkblue",
        color: "white",
        "&:hover": {
          backgroundColor: "darkblue",
        },
      },
    },
  };

  // --- Add state for signatory lists and selected values ---
  const [signatoryDetails, setSignatoryDetails] = useState({
    CheckedByList: [],
    PreparedByList: [],
    AuthorizedSignatoryList: [],
  });
  const [checkedByID, setCheckedByID] = useState("");
  const [preparedByID, setPreparedByID] = useState("");
  const [authorizedSignatoryByID, setAuthorizedSignatoryByID] = useState("");

  // --- Fetch signatory lists on mount ---
  useEffect(() => {
    const fetchSignatoryDetails = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_URL}/api/getsignatorydetails`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: sanctumToken,
            },
          }
        );
        // Parse the nested JSON string
        let parsed = {
          CheckedByList: [],
          PreparedByList: [],
          AuthorizedSignatoryList: [],
        };
        if (
          res.data &&
          Array.isArray(res.data.data) &&
          res.data.data.length > 0 &&
          res.data.data[0].SignatoryDetails
        ) {
          try {
            const detailsObj = JSON.parse(res.data.data[0].SignatoryDetails);
            if (detailsObj && detailsObj.SignatoryDetails) {
              parsed = detailsObj.SignatoryDetails;
            }
          } catch (e) {
            // fallback to empty lists
          }
        }
        setSignatoryDetails(parsed);
        setCheckedByID(parsed.CheckedByList?.[0]?.ID || "");
        setPreparedByID(parsed.PreparedByList?.[0]?.ID || "");
        setAuthorizedSignatoryByID(
          parsed.AuthorizedSignatoryList?.[0]?.ID || ""
        );
      } catch (err) {
        setSignatoryDetails({
          CheckedByList: [],
          PreparedByList: [],
          AuthorizedSignatoryList: [],
        });
      }
    };
    fetchSignatoryDetails();
  }, []);

  return (
    <Box sx={{ pt: 4, pb: 2, px: 2, borderRadius: 2, my: -2 }}>
      <Grid container spacing={2} sx={{ justifyContent: "space-between" }}>
        <Grid item xs={12} sm={5}>
          <FormControl>
            <RadioGroup
              value={selectedModule}
              onChange={(e) => {
                const newValue = e.target.value;
                setSelectedModule(newValue);
                setTypeCustomer(
                  newValue === "purchase" ? "supplier" : "customer"
                );
              }}
              component={StyledRadioGroup}
            >
              <FormControlLabel
                value="sales"
                control={<GreenRadio />} // changed to GreenRadio
                label="SALES"
              />
              {/* <FormControlLabel 
                value="purchase"
               control={<GreenRadio />} // changed to GreenRadio
               label="Purchase"
             /> */}
            </RadioGroup>
          </FormControl>
        </Grid>
        {selectedModule === "sales" && (
          <Grid item xs={12} sm={5}>
            <FormControl fullWidth sx={primaryStyles}>
              <InputLabel sx={{ color: "darkblue" }}>Select Type</InputLabel>
              <Select
                value={searchType}
                label="Select Type"
                onChange={(e) => setSearchType(e.target.value)}
                sx={{ backgroundColor: "white", ...primaryStyles }}
              >
                <MenuItem value="customer">Customer</MenuItem>
                <MenuItem value="subDealer">Sub Dealer</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}
        <Grid item xs={12} sm={5}>
          <SelectComponent
            value={subdSelect}
            onChange={(selectedOption) => setSubdSelect(selectedOption)}
            options={
              Array.isArray(
                (selectedModule === "purchase" && suppOptions) ||
                  (searchType === "customer" ? custOptions : subdOptions)
              )
                ? (selectedModule === "purchase" && suppOptions) ||
                  (searchType === "customer" ? custOptions : subdOptions)
                : []
            }
            placeholder={`Search ${
              (selectedModule === "purchase" && "Supplier") ||
              (searchType === "customer" ? "customer" : "Sub Dealer")
            }`}
            isSearchable={true}
            styles={greenThemeStyles}
            sx={{ width: 56 }}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <FormControl fullWidth sx={primaryStyles}>
            <InputLabel sx={{ color: "darkblue" }}>Select Invoice</InputLabel>
            <Select
              value={invoiceSelect}
              label="Select Invoice"
              onChange={(e) => setInvoiceSelect(e.target.value)}
              sx={{ backgroundColor: "white", ...primaryStyles }}
              MenuProps={menuProps}
            >
              {invoiceGroup?.map((i, index) => (
                <MenuItem key={index} value={i}>
                  {i.ReceiptNumber}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid
          item
          xs={12}
          sm={5}
          sx={{ display: "flex", alignItems: "center", gap: ".5rem" }}
        >
          <CurrencyRupeeIcon />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Grand Total:
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 400 }}>
            {invoiceSelect.GrandTotalAmount}
          </Typography>
        </Grid>
      </Grid>

      {/* ========== Begin inlined DamageReturnTableItemForm UI ========== */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Product Model Name</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Rate</TableCell>
              <TableCell align="right">DISP</TableCell>

              <TableCell align="right">CGSTP</TableCell>
              <TableCell align="right">SGSTP</TableCell>

              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(tableItems) &&
              tableItems.map((item, idx) => {
                const rowState = rowStates[idx] || {
                  open: false,
                  sections:
                    item.sections && item.sections.length > 0
                      ? item.sections
                      : [{ selectedOption: "return" }],
                };
                return (
                  <React.Fragment key={item.ReceiptProductModelID}>
                    <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleRow(idx)}
                        >
                          {rowState.open ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )}
                        </IconButton>
                      </TableCell>
                      <TableCell>{item.ProductModelName} </TableCell>
                      <TableCell align="right">{item.Quantity}</TableCell>
                      <TableCell align="right">{item.Rate}</TableCell>
                      <TableCell align="right">{item.DISP || 0}</TableCell>

                      <TableCell align="right">
                        {item.CGSTP || item.CGSTp || 0}
                      </TableCell>
                      <TableCell align="right">
                        {item.SGSTP || item.SGSTp || 0}
                      </TableCell>
                      <TableCell align="right">{item.Amount}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                      >
                        {rowState.open && (
                          <Box
                            sx={{
                              m: 1,
                              display: "flex",
                              flexDirection: "column",
                              gap: 1,
                            }}
                          >
                            {rowState.sections.map((section, sidx) => (
                              <Box
                                key={sidx}
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 1,
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <FormControlLabel
                                    control={
                                      <GreenCheckbox // changed to GreenCheckbox
                                        checked={section.returnChecked || false}
                                        onChange={() =>
                                          handleCheckboxChange(
                                            idx,
                                            sidx,
                                            "return",
                                            item
                                          )
                                        }
                                        disabled={
                                          item.Quantity === 1 &&
                                          section.damageChecked
                                        }
                                      />
                                    }
                                    label="Return"
                                  />
                                  {/* <FormControlLabel
                                    control={
                                      <GreenCheckbox // changed to GreenCheckbox
                                        checked={section.damageChecked || false}
                                        onChange={() =>
                                          handleCheckboxChange(
                                            idx,
                                            sidx,
                                            "damage",
                                            item
                                          )
                                        }
                                        disabled={
                                          item.Quantity === 1 &&
                                          section.returnChecked
                                        }
                                      />
                                    }
                                    label="Damage"
                                  /> */}
                                </Box>
                                {section.returnChecked && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: 1,
                                    }}
                                  >
                                    <Box sx={{ display: "flex", gap: 1 }}>
                                      <TextField
                                        select
                                        label="Select Return Reason"
                                        value={section.returnReason || ""}
                                        onChange={(e) =>
                                          handleSectionChange(
                                            idx,
                                            sidx,
                                            "returnReason",
                                            e.target.value,
                                            item
                                          )
                                        }
                                        sx={{
                                          flex: 1,
                                          "& .MuiOutlinedInput-root": {
                                            "& fieldset": {
                                              borderColor: "darkblue",
                                            },
                                          },
                                          "& .MuiInputLabel-root": {
                                            color: "darkblue",
                                          },
                                        }}
                                        InputLabelProps={{
                                          style: { color: "darkblue" },
                                        }}
                                        SelectProps={{ native: true }}
                                      >
                                        <option value="" />
                                        {(
                                          section.returnDropdownOptions || []
                                        ).map((o, i) => (
                                          <option key={i} value={o.Value}>
                                            {o.Value}
                                          </option>
                                        ))}
                                        <option value="Other">Other</option>
                                      </TextField>
                                      <TextField
                                        label="Return Quantity"
                                        type="text"
                                        value={section.returnQuantity || ""}
                                        onChange={(e) =>
                                          handleSectionChange(
                                            idx,
                                            sidx,
                                            "returnQuantity",
                                            e.target.value,
                                            item
                                          )
                                        }
                                        sx={{
                                          flex: 1,
                                          "& .MuiOutlinedInput-root": {
                                            "& fieldset": {
                                              borderColor: "darkblue",
                                            },
                                          },
                                          "& .MuiInputLabel-root": {
                                            color: "darkblue",
                                          },
                                        }}
                                        InputLabelProps={{
                                          style: { color: "darkblue" },
                                        }}
                                        inputProps={{
                                          max: item.Quantity,
                                          min: 0,
                                        }}
                                      />
                                    </Box>
                                    {section.returnReason === "Other" && (
                                      <TextField
                                        label="Describe Return Issue"
                                        value={section.returnDescription || ""}
                                        onChange={(e) =>
                                          handleSectionChange(
                                            idx,
                                            sidx,
                                            "returnDescription",
                                            e.target.value,
                                            item
                                          )
                                        }
                                        multiline
                                        rows={2}
                                        sx={{
                                          "& .MuiOutlinedInput-root": {
                                            "& fieldset": {
                                              borderColor: "darkblue",
                                            },
                                          },
                                          "& .MuiInputLabel-root": {
                                            color: "darkblue",
                                          },
                                        }}
                                        InputLabelProps={{
                                          style: { color: "darkblue" },
                                        }}
                                      />
                                    )}
                                  </Box>
                                )}
                                {section.damageChecked && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: 1,
                                    }}
                                  >
                                    <Box sx={{ display: "flex", gap: 1 }}>
                                      <TextField
                                        select
                                        label="Select Damage Reason"
                                        value={section.damageReason || ""}
                                        onChange={(e) =>
                                          handleSectionChange(
                                            idx,
                                            sidx,
                                            "damageReason",
                                            e.target.value,
                                            item
                                          )
                                        }
                                        sx={{
                                          flex: 1,
                                          "& .MuiOutlinedInput-root": {
                                            "& fieldset": {
                                              borderColor: "darkblue",
                                            },
                                          },
                                          "& .MuiInputLabel-root": {
                                            color: "darkblue",
                                          },
                                        }}
                                        InputLabelProps={{
                                          style: { color: "darkblue" },
                                        }}
                                        SelectProps={{ native: true }}
                                      >
                                        <option value="" />
                                        {(
                                          section.damageDropdownOptions || []
                                        ).map((o, i) => (
                                          <option key={i} value={o.Value}>
                                            {o.Value}
                                          </option>
                                        ))}
                                        <option value="Other">Other</option>
                                      </TextField>
                                      <TextField
                                        label="Damage Quantity"
                                        type="number"
                                        value={section.damageQuantity || ""}
                                        onChange={(e) =>
                                          handleSectionChange(
                                            idx,
                                            sidx,
                                            "damageQuantity",
                                            e.target.value,
                                            item
                                          )
                                        }
                                        sx={{
                                          flex: 1,
                                          "& .MuiOutlinedInput-root": {
                                            "& fieldset": {
                                              borderColor: "darkblue",
                                            },
                                          },
                                          "& .MuiInputLabel-root": {
                                            color: "darkblue",
                                          },
                                        }}
                                        InputLabelProps={{
                                          style: { color: "darkblue" },
                                        }}
                                        inputProps={{
                                          max: item.Quantity,
                                          min: 0,
                                        }}
                                      />
                                    </Box>
                                    {section.damageReason === "Other" && (
                                      <TextField
                                        label="Describe Damage Issue"
                                        value={section.damageDescription || ""}
                                        onChange={(e) =>
                                          handleSectionChange(
                                            idx,
                                            sidx,
                                            "damageDescription",
                                            e.target.value,
                                            item
                                          )
                                        }
                                        multiline
                                        rows={2}
                                        sx={{
                                          "& .MuiOutlinedInput-root": {
                                            "& fieldset": {
                                              borderColor: "darkblue",
                                            },
                                          },
                                          "& .MuiInputLabel-root": {
                                            color: "darkblue",
                                          },
                                        }}
                                        InputLabelProps={{
                                          style: { color: "darkblue" },
                                        }}
                                      />
                                    )}
                                  </Box>
                                )}
                              </Box>
                            ))}
                          </Box>
                        )}
                      </TableCell>
                      <TableCell align="right"></TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
          </TableBody>
          {/* <TableRow sx={{ borderTop: "2px solid rgba(224, 224, 224, 1)" }}>
            <TableCell colSpan={6} align="right">
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 4 }}>
                <Typography variant="subtitle1" fontWeight="bold" color="gray">
                  Total Quantity: {totalQuantity}
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold" color="gray">
                  Total Amount: {totalAmount.toFixed(2)}
                </Typography>
              </Box>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={6} align="right">
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Grand Total Amount: {invoiceSelect.GrandTotalAmount}
              </Typography>
            </TableCell>
          </TableRow> */}
          <TableRow>
            <TableCell colSpan={6} align="right">
              <Typography variant="subtitle1" fontWeight="bold" color="red">
                Total Return Quantity: {totalReturnQuantity} & Cost ( Return):{" "}
                {totalSelectedPrice.toFixed(2)}
              </Typography>
            </TableCell>
          </TableRow>
          {/* <TableRow>
            <TableCell colSpan={6} align="right">
              <Typography variant="subtitle1" fontWeight="bold" color="green">
                Final Price: {finalPrice.toFixed(2) || "0.00"}
              </Typography>
            </TableCell>
          </TableRow> */}
        </Table>
      </TableContainer>

      {/* Toggle Button for Replacement/Final Section */}
      <Box sx={{ display: "flex", alignItems: "center", mt: 2, mb: 0 }}>
        <IconButton
          onClick={() => setShowReplacement((prev) => !prev)}
          color="primary"
          sx={{ mr: 1 }}
        >
          {showReplacement ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
        <Typography
          variant="h5"
          sx={{
            color: "darkblue",
            fontWeight: 700,
            mb: 0,
            cursor: "pointer",
            userSelect: "none",
          }}
          onClick={() => setShowReplacement((prev) => !prev)}
        >
          Replacement & Final Settlement
        </Typography>
      </Box>

      {/* New Item Section */}
      {showReplacement && (
        <FormProvider {...methods}>
          <>
            <Box sx={{ mt: 2, p: 2, background: "#f5fff5", borderRadius: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: ".5rem",
                    color: "darkblue",
                    fontWeight: 600,
                    mb: 2,
                  }}
                >
                  Add New Item:
                </Typography>
                {replacementItems.map((item, idx) => {
                  // Set default SGSTP and CGSTP to 5 if undefined or empty
                  const sgstVal =
                    item.SGSTP !== undefined && item.SGSTP !== ""
                      ? Number(item.SGSTP)
                      : 5;
                  const cgstVal =
                    item.CGSTP !== undefined && item.CGSTP !== ""
                      ? Number(item.CGSTP)
                      : 5;
                  const qty = Number(item.Quantity) || 0;
                  const price = Number(item.Price) || 0;
                  const discount = Number(item.discount) || 0;
                  // Calculate base amount
                  const baseAmount = qty * price;
                  // Calculate SGST and CGST amounts as percentage
                  const sgstAmount = (baseAmount * sgstVal) / 100;
                  const cgstAmount = (baseAmount * cgstVal) / 100;
                  // Calculate discount amount
                  const discountAmount = (baseAmount * discount) / 100;
                  // Total = base + sgst + cgst - discount
                  const totalAmount =
                    baseAmount + sgstAmount + cgstAmount - discountAmount;
                  return (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                        mb: 2,
                        flexWrap: "wrap",
                        borderRadius: 1,
                        p: 1,
                      }}
                    >
                      {/* Product field as react-select searchable dropdown */}
                      <Box sx={{ minWidth: 200, flex: "0 0 200px" }}>
                        <SelectComponent
                          value={
                            itemOptions.find(
                              (opt) =>
                                String(opt.ProductModelID) ===
                                String(item.ProductModelID)
                            ) || null
                          }
                          onChange={(selectedOption) =>
                            handleReplacementChange(
                              idx,
                              "ProductModelID",
                              selectedOption?.ProductModelID || ""
                            )
                          }
                          options={itemOptions}
                          placeholder="Search Product Model"
                          isSearchable={true}
                          styles={{
                            ...greenThemeStyles,
                            // control: (base, state) => ({
                            //   ...base,
                            //   backgroundColor: "#fff",
                            //   borderColor: "darkblue",
                            //   minHeight: 56,
                            //   maxWidth: 300,
                            //   boxShadow: state.isFocused
                            //     ? "0 0 0 1px darkblue"
                            //     : "none",
                            //   "&:hover": { borderColor: "darkblue" },
                            // }),
                            // singleValue: (base) => ({
                            //   ...base,
                            //   color: "darkblue",
                            // }),
                          }}
                          getOptionLabel={(opt) =>
                            `${opt.BrandName || ""} ${opt.ModelNumber || ""}`
                          }
                          getOptionValue={(opt) => String(opt.ProductModelID)}
                        />
                      </Box>
                      <Box sx={{ minWidth: 100, flex: "0 0 150px" }}>
                        <Controller
                          name="BatchNo"
                          control={control}
                          render={({ field }) => {
                            // const fieldError = errors?.items?.[index]?.child;

                            return (
                              <TextField
                                select
                                label="Batch No"
                                fullWidth
                                {...field}
                                // disabled={!childOptions.length}
                                // error={!!fieldError}
                                // helperText={
                                //   fieldError ? fieldError.message : ""
                                // }
                                // onChange={(e) => {
                                //   field.onChange(e);
                                //   setValue(
                                //     `items.${index}.child`,
                                //     e.target.value
                                //   );
                                //   const selectedChild = childOptions.find(
                                //     (child) => child.BatchNo === e.target.value
                                //   );
                                //   setValue(
                                //     `items.${index}.ExpiryDate`,
                                //     formatDateTime(selectedChild?.ExpiryDate)
                                //   );
                                //   console.log(
                                //     "Child changed at index:",
                                //     index,
                                //     "Value:",
                                //     e.target.value
                                //   );
                                // }}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  handleReplacementChange(
                                    idx,
                                    "BatchNo",
                                    val === "" ? "" : Number(val)
                                  );
                                }}
                              >
                                {childOptions.length > 0 ? (
                                  childOptions?.[idx]?.map((opt, idx) => (
                                    <MenuItem key={idx} value={opt?.BatchNo}>
                                      {opt.BatchNo} -{" "}
                                      {formatDateTime(opt?.ExpiryDate)}-{" "}
                                      {opt?.Quantity}
                                    </MenuItem>
                                  ))
                                ) : (
                                  <MenuItem disabled>No result</MenuItem>
                                )}
                              </TextField>
                            );
                          }}
                        />
                      </Box>

                      <TextField
                        label="Quantity"
                        type="number"
                        value={item.Quantity}
                        onChange={(e) =>
                          handleReplacementChange(
                            idx,
                            "Quantity",
                            e.target.value
                          )
                        }
                        sx={{
                          width: 90,
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "#fff",
                            "& fieldset": { borderColor: "darkblue" },
                            "&:hover fieldset": { borderColor: "darkblue" },
                            "&.Mui-focused fieldset": {
                              borderColor: "darkblue",
                            },
                          },
                          "& .MuiInputLabel-root": { color: "darkblue" },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "darkblue",
                          },
                        }}
                        inputProps={{ min: 1 }}
                      />
                      <TextField
                        label="Sgst"
                        type="number"
                        value={item.SGSTP === undefined ? 5 : item.SGSTP}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleReplacementChange(
                            idx,
                            "SGSTP",
                            val === "" ? "" : Number(val)
                          );
                        }}
                        sx={{
                          width: 80,
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "#fff",
                            "& fieldset": { borderColor: "darkblue" },
                            "&:hover fieldset": { borderColor: "darkblue" },
                            "&.Mui-focused fieldset": {
                              borderColor: "darkblue",
                            },
                          },
                          "& .MuiInputLabel-root": { color: "darkblue" },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "darkblue",
                          },
                        }}
                        inputProps={{ min: 0 }}
                      />
                      <TextField
                        label="Cgst"
                        type="number"
                        value={item.CGSTP === undefined ? 5 : item.CGSTP}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleReplacementChange(
                            idx,
                            "CGSTP",
                            val === "" ? "" : Number(val)
                          );
                        }}
                        sx={{
                          width: 80,
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "#fff",
                            "& fieldset": { borderColor: "darkblue" },
                            "&:hover fieldset": { borderColor: "darkblue" },
                            "&.Mui-focused fieldset": {
                              borderColor: "darkblue",
                            },
                          },
                          "& .MuiInputLabel-root": { color: "darkblue" },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "darkblue",
                          },
                        }}
                        inputProps={{ min: 0 }}
                      />
                      <TextField
                        label="Price"
                        type="number"
                        value={item.Price}
                        onChange={(e) =>
                          handleReplacementChange(idx, "Price", e.target.value)
                        }
                        sx={{
                          width: 90,
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "#fff",
                            "& fieldset": { borderColor: "darkblue" },
                            "&:hover fieldset": { borderColor: "darkblue" },
                            "&.Mui-focused fieldset": {
                              borderColor: "darkblue",
                            },
                          },
                          "& .MuiInputLabel-root": { color: "darkblue" },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "darkblue",
                          },
                        }}
                        inputProps={{ min: 0 }}
                      />
                      <TextField
                        label="Discount %"
                        type="number"
                        value={item.discount}
                        onChange={(e) =>
                          handleReplacementChange(
                            idx,
                            "discount",
                            e.target.value
                          )
                        }
                        sx={{
                          width: 90,
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "#fff",
                            "& fieldset": { borderColor: "darkblue" },
                            "&:hover fieldset": { borderColor: "darkblue" },
                            "&.Mui-focused fieldset": {
                              borderColor: "darkblue",
                            },
                          },
                          "& .MuiInputLabel-root": { color: "darkblue" },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "darkblue",
                          },
                        }}
                        inputProps={{ min: 0 }}
                      />
                      <TextField
                        label="Total"
                        value={totalAmount.toFixed(2)}
                        InputProps={{ readOnly: true }}
                        sx={{
                          width: 110,
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "#fff",
                            "& fieldset": { borderColor: "darkblue" },
                            "&:hover fieldset": { borderColor: "darkblue" },
                            "&.Mui-focused fieldset": {
                              borderColor: "darkblue",
                            },
                          },
                          "& .MuiInputLabel-root": { color: "darkblue" },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "darkblue",
                          },
                        }}
                      />
                      <IconButton
                        color="error"
                        onClick={() => removeReplacementRow(idx)}
                      >
                        <span style={{ fontWeight: "bold", fontSize: 18 }}>
                          ×
                        </span>
                      </IconButton>
                    </Box>
                  );
                })}
                {/* Replacement Add Row Controls */}
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                    pr: 6,
                    gap: 0,
                  }}
                >
                  <FormControl sx={{ width: "50px", ml: 1 }}>
                    <InputLabel
                      sx={{
                        color: "#1d7d1d",
                        "&.Mui-focused": { color: "darkblue" },
                      }}
                    >
                      ----__
                    </InputLabel>
                    <Select
                      value={rowsToAdd}
                      onChange={(e) => setRowsToAdd(Number(e.target.value))}
                      label="Rows"
                      sx={{
                        height: "50px",
                        backgroundColor: "white",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderWidth: "2px" },
                        },
                      }}
                    >
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={2}>2</MenuItem>
                      <MenuItem value={5}>5</MenuItem>
                    </Select>
                  </FormControl>
                  <Button
                    variant="text"
                    onClick={addReplacementRows}
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
                {/* Additional Replacement Calculation Section */}
                // Replacement Calculation section removed as requested
              </Box>
            </Box>

            {/* Final Settlement Section */}
            <Box sx={{ mt: 4, p: 2, background: "#f5f5fa", borderRadius: 2 }}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Typography
                  variant="h5"
                  sx={{ color: "#1d7d1d", fontWeight: 700, mb: 2 }}
                >
                  Previous Invoice Amount:
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: "#000", fontWeight: "bold", mb: 2 }}
                >
                  {invoiceSelect.GrandTotalAmount || 0.0}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  maxWidth: 400,
                }}
              >
                {/* Add Previous Due line */}
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography>Previous Due:</Typography>
                  <Typography fontWeight="bold" color="green">
                    + {Number(invoiceSelect.NetDueAmount || 0).toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography>Refundable Amount:</Typography>
                  <Typography fontWeight="bold" color="red">
                    -{" "}
                    {(() => {
                      const val = Number(totalSelectedPrice);
                      const decimal = val - Math.floor(val);
                      if (decimal > 0.5) {
                        return Math.ceil(val);
                      } else {
                        return Math.floor(val);
                      }
                    })()}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography>Newly Added Item Cost :</Typography>
                  {/* Use Controller to get grandTotalAmount from repControl */}
                  <Controller
                    name="grandTotalAmount"
                    control={repControl}
                    render={({ field }) => {
                      // Calculate total price of all replacement items using the same logic as row total

                      return (
                        <Typography fontWeight="bold" color="green">
                          + {totalReplacementAmount.toFixed(2)}
                        </Typography>
                      );
                    }}
                  />
                </Box>
                {/* Divider line */}
                <Box sx={{ borderBottom: "2px solid green", my: 1 }} />
                {/* Due Amount */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 1,
                  }}
                >
                  <Typography fontWeight="bold" sx={{ pr: 5 }}>
                    Due Amount :
                    <span
                      style={{
                        fontWeight: 400,
                        fontSize: "0.95em",
                        color: "#888",
                        marginLeft: 8,
                      }}
                    >
                      (Previous Due + Newly Added Item Cost - Refundable Amount)
                    </span>
                  </Typography>
                  <Typography fontWeight="bold" color="orange">
                    {(() => {
                      const refundable = Number(totalSelectedPrice);
                      const roundedRefundable =
                        refundable - Math.floor(refundable) > 0.5
                          ? Math.ceil(refundable)
                          : Math.floor(refundable);
                      return (
                        Number(invoiceSelect.NetDueAmount || 0) +
                        Number(totalReplacementAmount) -
                        roundedRefundable
                      ).toFixed(2);
                    })()}
                  </Typography>

                  {/* ======================================
                      {(
                      Number(invoiceSelect.GrandTotalAmount || 0) +
                      totalReplacementAmount -
                      // Refundable amount
                      Number(totalSelectedPrice)
                    ).toFixed(2) || "0.00"} */}
                </Box>
                {/* Updated Final Price */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 1,
                  }}
                >
                  <Typography fontWeight="bold">Updated GT Amount :</Typography>
                  <Typography fontWeight="bold">
                    {(() => {
                      const refundable = Number(totalSelectedPrice);
                      const roundedRefundable =
                        refundable - Math.floor(refundable) > 0.5
                          ? Math.ceil(refundable)
                          : Math.floor(refundable);
                      return (
                        Number(invoiceSelect.GrandTotalAmount || 0) +
                        Number(totalReplacementAmount) -
                        roundedRefundable
                      ).toFixed(2);
                    })()}
                  </Typography>
                  {/* <Typography fontWeight="bold">
                    aa {invoiceSelect.NetDueAmount}aa
                    {totalReplacementAmount}aa
                    {totalSelectedPrice}
                  </Typography> */}
                  {/* ================================================================= */}
                  {/* <Typography fontWeight="bold">
                    {Number(invoiceSelect.GrandTotalAmount || 0).toFixed(2) ||
                      "0.00"}
                  </Typography>
                  <Typography fontWeight="bold">
                    {replacementItems
                      .reduce(
                        // Newly added item cost
                        (sum, item) => sum + (Number(item.Amount) || 0),
                        0
                      )
                      .toFixed(2) || "0.00"}
                  </Typography>
                  <Typography fontWeight="bold">
                    {Number(totalSelectedPrice).toFixed(2) || "0.00"}
                  </Typography> */}
                </Box>
              </Box>
            </Box>

            <Grid container spacing={2} sx={{ mt: 3, ml: 0 }}>
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
                <DamagePayment
                  paymentAll={allPaymentType}
                  finalAmount={getValues("grandTotalAmount")}
                  setValue={setValue}
                  invoiceSelect={invoiceSelect}
                  netDewAmt={invoiceSelect?.NetDueAmount}
                  setPaymentDetails={(details) => {
                    setPaymentDetails(details);
                    // Calculate total paid
                    const paid = Array.isArray(details)
                      ? details.reduce(
                          (sum, d) => sum + Number(d.Amount || 0),
                          0
                        )
                      : 0;
                    setTotalAmountPaid(paid);
                  }}
                  paidAmount={(() => {
                    const refundable = Number(totalSelectedPrice);
                    const roundedRefundable =
                      refundable - Math.floor(refundable) > 0.5
                        ? Math.ceil(refundable)
                        : Math.floor(refundable);
                    return (
                      Number(invoiceSelect.NetDueAmount || 0) +
                      Number(totalReplacementAmount) -
                      roundedRefundable
                    ).toFixed(2);
                  })()}
                />
              </Box>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item>
                    <Controller
                      name="NetDueAmount"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label=" Updated Due Amount"
                          sx={{
                            bgcolor: "white",
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": { borderColor: "darkblue" },
                              "&:hover fieldset": { borderColor: "darkblue" },
                              "&.Mui-focused fieldset": {
                                borderColor: "darkblue",
                              },
                            },
                            "& .MuiInputLabel-root": { color: "darkblue" },
                          }}
                          InputProps={{
                            readOnly: true,
                          }}
                          InputLabelProps={{
                            shrink: true, // 👈 This keeps the label always "shrunk"
                          }}
                          gutterBottom
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={11.5}>
                <TextField
                  fullWidth
                  label="Remarks"
                  sx={{
                    bgcolor: "white",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "darkblue" },
                      "&:hover fieldset": { borderColor: "darkblue" },
                      "&.Mui-focused fieldset": { borderColor: "darkblue" },
                    },
                    "& .MuiInputLabel-root": { color: "darkblue" },
                  }}
                  {...methods.register("remarks")}
                  gutterBottom
                />
              </Grid>
            </Grid>
          </>
        </FormProvider>
      )}
      {/* ========== End inlined DamageReturnTableItemForm UI ========== */}

      <Grid container sx={{ m: 1 }} spacing={1}>
        <Grid item xs={4}>
          <FormControl fullWidth sx={primaryStyles}>
            <InputLabel sx={{ color: "darkblue" }}>Checked By:</InputLabel>
            <Select
              value={checkedByID}
              label="Checked By:"
              onChange={(e) => setCheckedByID(e.target.value)}
              sx={{ backgroundColor: "white", ...primaryStyles }}
            >
              {signatoryDetails?.CheckedByList?.map((item, index) => (
                <MenuItem value={item.ID} key={index}>
                  {item.Name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl fullWidth sx={primaryStyles}>
            <InputLabel sx={{ color: "darkblue" }}>Prepared By:</InputLabel>
            <Select
              value={preparedByID}
              label="Prepared By:"
              onChange={(e) => setPreparedByID(e.target.value)}
              sx={{ backgroundColor: "white", ...primaryStyles }}
            >
              {signatoryDetails?.PreparedByList?.map((item, index) => (
                <MenuItem value={item.ID} key={index}>
                  {item.Name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl fullWidth sx={primaryStyles}>
            <InputLabel sx={{ color: "darkblue" }}>Authorize By:</InputLabel>
            <Select
              value={authorizedSignatoryByID}
              label="Authorize By:"
              onChange={(e) => setAuthorizedSignatoryByID(e.target.value)}
              sx={{ backgroundColor: "white", ...primaryStyles }}
            >
              {signatoryDetails?.AuthorizedSignatoryList?.map((item, index) => (
                <MenuItem value={item.ID} key={index}>
                  {item.Name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 5 }}>
        <Button
          variant="contained"
          color="success"
          sx={{ height: "3rem", width: "6rem" }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Box>
      {/* Snackbar at the bottom */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            bgcolor:
              snackbar.severity === "success"
                ? "#1b5e20"
                : snackbar.severity === "error"
                  ? "#b71c1c"
                  : undefined,
            color:
              snackbar.severity === "success" || snackbar.severity === "error"
                ? "#fff"
                : undefined,
          }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
      <LoadingComp loading={loading} />
      {triggerPrint &&
        row &&
        typeof row === "object" &&
        pdfTriggerCount < 5 && (
          <BlobProvider document={<DamagePdfSalePDF responseData={row} />}>
            {({ url, loading }) => {
              if (url && !loading) {
                // open and reset trigger only once, up to 4 times
                window.open(url, "_blank");
                setTriggerPrint(false);
                setPdfTriggerCount((count) => count + 1); // increment counter
              }
              return null; // no UI needed here
            }}
          </BlobProvider>
        )}
    </Box>
  );
};
export default CreateDamage;
