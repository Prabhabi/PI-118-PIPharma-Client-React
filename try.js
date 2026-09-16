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
  TableRow,
  TableCell,
  TableBody,
  Radio,
  RadioGroup,
  FormLabel,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import { Add, Delete as DeleteIcon } from "@mui/icons-material";
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
// import { dummyQuotation } from "../../../../../data";
import { formatDateTime } from "../../../../../functionforAll";
import * as Yup from "yup";
// import generatePdfInvoice from "./component/generatePdfInvoice";
import { yupResolver } from "@hookform/resolvers/yup";
import invoiceSaleCreatepdf from "./component/invoiceSaleCreatepdfNew";
import LoadingComp from "./../../../../../components/loadingComp/LoadingComp";
import _, { round } from "lodash";
import InvoiceSalesPaymentForm from "./component/InvoiceSalesPaymentForm";
import axios, { all } from "axios";
import Cookies from "js-cookie";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import EmailSendDialog from "../../../../purchase/quotation/components/QuotationForm/component/emailSendDialog/EmailSendDialog";
import QuotationEmail from "../../../../purchase/quotation/components/QuotationForm/component/quotationEmail/QuotationEmail";
import invoiceSaleCreatepdfDirect from "./component/invoiceSaleCreatepdfDirect";
import QuotationEmailDirectForm from "../../../../purchase/quotation/components/QuotationForm/component/quotationEmail/QuotationEmailDirectForm";
import WarningComp from "../../../../../components/warningComp/WarningComp";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import SelectCreate from "../../../../../api/ui/selectCreateComponent/SelectCreate";
import {
  moneyReciptListApiFn,
  subDealerListApiFn,
} from "../../../../../api/salesApi";
import { InvoiceRow } from "./component/InvoiceRow";
import { greenBorderStyle } from "../../../../../functionforAll";
import { BlobProvider } from "@react-pdf/renderer";
import InvoicePurCreatepdf from "../../../../purchase/invoice/components/invoiceDialog/component/InvoicePurCreatepdf";
import InvoiceSalesCreatepdfNew from "./component/invoiceSaleCreatepdfNew";

export default function InvoiceCreateDialogFormS({
  allItems,
  allHsn,
  dummyQuotation,
  allPaymentType,
  signatoryDetails,
  allCompanyList,
  customerList,
  subDealerList,
  fetchAllCustomer,
  fetchallSubDealer,
  fetchAllInvoice,
  handleAddCustomerClose,
}) {
  const [customerSelect, setCustomerSelect] = useState([]);
  const [allDescription, setAllDescription] = useState([]);
  const [paymentInformation, setPaymentInformation] = useState({});
  const [gstValue, setGstValue] = useState({});
  const [printType, setPrintType] = useState(1);
  const [itemSelect, setItemSelect] = useState([]);
  const [finalAmount, setFinalAmount] = useState(0);
  const paymentIsValid = useRef(false);
  const [, forceRender] = useState(false);
  // const [rowTotal, setRowTotal] = useState([]);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allItemsa, setAllItemsa] = useState([]);
  const [receiptDate, setReceiptDate] = useState(dayjs().format("YYYY-MM-DD"));
  // const [customerList, setCustomerList] = useState([]);
  // const [subDealerList, setSubDealerList] = useState([]);
  const [typeSupplier, setTypeSupplier] = useState("customer");
  const [quoSection, setQuoSection] = useState(false);
  const [resData, setResData] = useState(null);
  const [batchList, setBatchList] = useState([]);
  const [childOptions, setChildOptions] = useState([]);
  const token = Cookies.get("token"); // Get token from cookies
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;
  const [triggerPrint, setTriggerPrint] = useState(false);
  const [pdfTriggerCount, setPdfTriggerCount] = useState(0); // <-- Add counter state
  const [row, setRow] = useState(null);

  // const [addDialogOpen, setAddDialogOpen] = useState(false);
  // const [calculateTrigger, setCalculateTrigger] = useState(false);
  // const [signatorySelect, setSignetorySelect] = useState({
  //   CheckedByID: null,
  //   PreparedByID: null,
  //   AuthorizedSignatoryByID: null,
  // });
  const [rowsToAdd, setRowsToAdd] = useState(1);
  const [showCustomerFields, setShowCustomerFields] = useState(false);
  const [showSubDealerFields, setShowSubDealerFields] = useState(false);
  const [showDoctorFields, setShowDoctorFields] = useState(false);
  const [openDoctorDialog, setOpenDoctorDialog] = useState(false);
  const [doctorForm, setDoctorForm] = useState({
    name: "",
    phone: "",
    specialization: "",
  });

  const schema = Yup.object().shape({
    selectedCustomer: quoSection
      ? Yup.string().nullable()
      : Yup.string().required("This field is required"),

    items: Yup.array().of(
      Yup.object().shape({
        ProductModelID: Yup.string().required("Select Product"),
        // child: Yup.string().required("required"),
        ExpiryDate: Yup.date()
          .nullable()
          .notRequired()
          .typeError("Invalid date")
          .min(new Date(), "Expiry date must be in the future"),

        MRP: Yup.string().required("required"),
        StripeOf: Yup.number()
          .typeError("IInvalid")
          .required("required")
          .min(0, "Min 0"),
        StripeQty: Yup.number()
          .typeError("Invalid")
          .required("required")
          .min(0, "Min 0"),
        discount: Yup.number().typeError("Invalid").required("required"),
        SGSTP: Yup.number().typeError("Invalid").required("required"),
        CGSTP: Yup.number().typeError("Invalid").required("required"),

        Price: Yup.number().typeError("Not valid").required("required"),

        // .required("Qty Per Box is required"),
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
    mode: "onChange", // Change from onSubmit to onChange
    reValidateMode: "onChange", // Change to onChange
    defaultValues: {
      paymentDetails: {},
      items: [
        {
          ProductModelID: null,
          ColorMasterID: null,
          HSNMasterID: null,
          BrandMasterID: null,
          CGSTP: null,
          SGSTP: null,
          Quantity: null,
          Rate: null,
          DISP: null,
          Amount: null,
          UnitQuantity: "",
          QtyPerBox: null,
          ExpiryDate: "",
          MRP: null,
          StripOf: null,
          StripQty: null,
        },
      ],
      company: "",
      checkedBy: signatoryDetails?.CheckedByList?.[0]?.ID || "",
      preparedBy: signatoryDetails?.PreparedByList?.[0]?.ID || "",
      authorizeBy: signatoryDetails?.AuthorizedSignatoryList?.[0]?.ID || "",
    },
    mode: "onSubmit",
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid }, // Ensure isValid is destructured here
    setValue,
    reset,
    getValues,
    trigger,
    watch,
  } = methods;

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  // Fetch doctor list from API
  const [doctorList, setDoctorList] = useState([]);
  useEffect(() => {
    const token = Cookies.get("token");
    fetch("http://192.168.1.10:8000/api/FetchAllDoctors", {
      headers: {
        Authorization: `Bearer ${token?.replace(/"/g, "")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setDoctorList(data.data);
        }
      })
      .catch(() => setDoctorList([]));
  }, []);

  // Add this useEffect to watch for changes in UnitQuantity and update QtyPerBox
  // useEffect(() => {
  //   const subscription = watch((value, { name, type }) => {
  //     if (name && name.includes("UnitQuantity")) {
  //       const index = name.split(".")[1];
  //       const unit = value.items[index].UnitQuantity;
  //       let qtyPerBox = 1;
  //       if (unit === "Pair") qtyPerBox = 2;
  //       else if (unit === "Dozen") qtyPerBox = 12;
  //       setValue(`items.${index}.QtyPerBox`, qtyPerBox);
  //     }
  //   });
  //   return () => subscription.unsubscribe();
  // }, [watch, setValue]);

  const redBorderStyle = { borderColor: "green" };
  const redLabelStyle = { color: "green" };
  const redInputStyle = {
    "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "green" } },
  };
  const queryClient = useQueryClient();

  //  =======================================quotation warning section ======================================
  const [warningStatus, setWarningStatus] = useState(false);
  const [warningData, setWarningData] = useState(null);
  const warningDataFn = async (data1) => {
    setWarningStatus(false);
    data1 && setLoading(true);
    if (data1) {
      const totalAmountPaid = data?.paymentsDetails?.reduce((acc, payment) => {
        return acc + Number(payment.Amount);
      }, 0);

      const isNewEntityDataFilled =
        data.customerFirstName ||
        data.customerLastName ||
        data.customerPhone ||
        data.customerEmail ||
        data.customerAddress ||
        data.customerGST ||
        data.subDealerName ||
        data.subDealerContactPerson ||
        data.subDealerPhone ||
        data.subDealerEmail ||
        data.subDealerAddress ||
        data.subDealerGST;

      const arr = {
        BillCode: "INVS",
        ReceiptDate: `${receiptDate}T00:00:00`,
        PaymentType: data.PaymentType,
        TotalAmountBD: data.totalAmountBD || 0,
        DiscountDesc: data.discountDesc || "",
        DiscountUnit: data.discountUnit || "P",
        Discount: Number(data.discount) || 0,
        DiscountAmount: data.discountValue || 0,
        TotalAmountAD: data.totalAmountAD || 0,
        CGSTP: data.CGSTP || 0,
        CGSTAmount: data.cgstValue || 0,
        SGSTP: data.SGSTP || 0,
        SGSTAmount: data.TotalGst || 0,
        GrandTotalAmount: data.GrandTotalAmount || 0,
        RoundOffAmount: data.roundUpAmount || 0,
        NetTotalAmount: data.NetTotalAmount || 0, // Ensure NetTotalAmount is included and valid
        NetPaidAmount: totalAmountPaid || 0,
        NetDueAmount: data?.dueAmount || 0,
        Remarks: data.remarks,
        ExpectedDueDate: paymentInformation.expectedDueDate
          ? `${paymentInformation.expectedDueDate}T00:00:00`
          : null,
        PaymentStatus: "Partial Due",
        EntityType:
          customerSelect.EntityType ||
          (typeSupplier === "subDealer" ? "SUBD" : "CUST"),
        EntityID: quoSection
          ? customerSelect?.EntityID || null // Get EntityID from the selected quotation
          : data.selectedCustomer || customerSelect?.EntityID || null, // For "Without Quotation"
        BillEntityType: "COMP",
        BillEntityID: quoSection ? customerSelect.BillEntityID : data.company,
        QuotationBookingMasterId: customerSelect?.id || null,
        QuotationNo: customerSelect?.label || null,
        CheckedByID: data.checkedBy || signatoryDetails?.CheckedByList[0]?.ID,
        PreparedByID:
          data.preparedBy || signatoryDetails?.PreparedByList[0]?.ID,
        AuthorizedSignatoryByID:
          data.authorizeBy || signatoryDetails?.AuthorizedSignatoryList[0]?.ID,
        ReceiptProductModelList: data.items.map((item) => ({
          // HSNMasterID: item.HSNMasterID,
          // BrandMasterID: item.BrandMasterID,
          // GSTP: item.GSTP || data.CGSTP,
          // Quantity: item.Quantity,
          // Rate: item.Price,
          // DISP: item.discount,
          // Amount: item.result,
          // UnitQuantity: item.UnitQuantity,
          // ColorMasterID: item.ColorMasterID || null,
          // QtyPerBox: item.QtyPerBox || null,
          // ProductModelStatus: "N",

          // =============================================
          ProductModelID: item.ProductModelID,
          ColorMasterID: null,
          HSNMasterID: null,
          BrandMasterID: null,

          CGSTP: (watch("CGSTP") || 5).toString(),
          SGSTP: (watch("SGSTP") || 5).toString(),
          Unit: null,
          Rate: item.Price,
          DISP: item.discount,
          Amount: item.result,
          UnitQuantity: null,
          QtyPerBox: null,
          ExpiryDate: item.ExpiryDate,
          MRP: item.MRP || 0,
          StripOf: item.StripeOf || 0,
          StripQty: item.StripeQty || 0,
          Quantity:
            Number(item.StripeOf || 0) * Number(item.StripeQty || 0) +
            Number(item.lQty || 0),
        })),
        PaymentDetails: [
          ...(data.paymentsDetails || []).map((payment) => ({
            PaymentModeID: payment.PaymentModeID || "",
            PaymentModeDesc: payment.PaymentModeDesc || "",
            Amount: payment.Amount || 0,
            PaymentDate: payment.PaymentDate
              ? dayjs(payment.PaymentDate).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
              : null,
            transactionNumber: payment.transactionNumber || "",
          })),
          ...(data.advanceOrderAmount > 0
            ? [
                {
                  PaymentModeID: 11,
                  PaymentModeDesc: "Advan",
                  Amount: data.advanceOrderAmount || 0,
                  PaymentDate: data.paymentsDetails?.[0]?.PaymentDate
                    ? dayjs(data.paymentsDetails[0].PaymentDate).format(
                        "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
                      )
                    : null,
                  transactionNumber: "a",
                },
              ]
            : []),
        ],
        ...(isNewEntityDataFilled &&
          !quoSection && {
            NewEntityData: [
              {
                CustFNameOrSDName:
                  data.customerFirstName || data.subDealerName || "",
                CustLNameOrSDCPName:
                  data.customerLastName || data.subDealerContactPerson || "",
                MobileNumber: data.customerPhone || data.subDealerPhone || "",
                Email: data.customerEmail || data.subDealerEmail || "",
                Address: data.customerAddress || data.subDealerAddress || "",
                GSTNumber: data.customerGST || data.subDealerGST || "",
              },
            ],
          }),
      };

      console.log("arr", arr);
      try {
        const token = Cookies.get("token"); // Get token from cookies
        const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

        const res = await axios.post(
          `${process.env.REACT_APP_URL}/api/insertReceiptPayment`,
          arr,
          {
            headers: {
              Authorization: sanctumToken,
            },
          }
        );
        // openEmail || invoiceSaleCreatepdf(res.data.data[0]);
        // openEmail &&
        //   invoiceSaleCreatepdfDirect(
        //     res.data.data[0],
        //     emailFormData,

        //     successFunction
        //   );
        const responseData = res.data.data[0];
        console.log("responseData", responseData);

        if (responseData) {
          openEmailButton || setRow(res.data.data[0]); // this will be passed to PDF
          openEmailButton || (!triggerPrint && setTriggerPrint(true)); // triggerhe PDF opening only if not already triggered

          // openEmailButton || invoiceSaleCreatepdf(responseData); // <-- Await here
          openEmailButton && setResData(responseData); // <-- Await here
          openEmailButton && setOpenEmail(true); // <-- Await here

          openEmailButton && setOpenEmail(true); // Open the dialog after form submission
          openEmailButton && setEmailMsz(false); // Reset email message state

          fetchAllInvoice();
          openEmailButton || handleAddCustomerClose();
        } else {
          console.error("Invalid response data structure:", res.data);
        }
        setLoading(false);
        fetchAllInvoice();
        const queryKeys = [
          ["incoiceSalesYearGraphApi"],
          ["gstSalesGraphApi"],
          ["invoiceSalesCustGraphApi"],
          ["invoiceSalesSubdGraphApi"],
          // ========
          ["inventoryListApi"],
          ["allTransuctionListApi"],
          ["saleTransuctionListApi"],
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
        console.error("Error submitting invoice:", error);
      } finally {
        setLoading(false);
      }
    }
  };
  console.log("error", errors);

  //  =============================================================================
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
        CGSTP = 5,
        SGSTP = 5,
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
      // due amount -------------------------------------------------
      const mrpTotalAmount = items?.reduce((acc, item) => {
        const priceceMrp = Number(item?.MRP || 0) / Number(item?.StripeOf || 1);
        // console.log("priceceMrp", item.MRP);
        // console.log("item.StripeOf", item.StripeOf);
        // console.log("priceceMrp", priceceMrp);
        const itemQty =
          (Number(item.StripeOf) || 0) * (Number(item.StripeQty) || 0) +
          (Number(item.lQty) || 0);
        const itemResult = itemQty * (Number(priceceMrp) || 0);

        return acc + itemResult;
      }, 0);
      // console.log("mrpTotalAmount", mrpTotalAmount);
      setValue(
        "TotalDiscount",
        round(
          Number(
            mrpTotalAmount - round(finalResult + CgstValue + SgstValue, 2)
          ),
          2
        )
      );
      console.log("test", mrpTotalAmount, netTotalAmount);
      // ===========================
      // const discountAmount = items?.reduce((acc, item) => {
      //   const itemQty =
      //     (Number(item.StripeOf) || 0) * (Number(item.StripeQty) || 0) +
      //     (Number(item.lQty) || 0);
      //   const itemResult = itemQty * (Number(item.Price) || 0);
      //   const discountAmount =
      //     (itemResult * (Number(item.discount) || 0)) / 100;

      //   return acc + discountAmount;
      // }, 0);
      const totalGst = items?.reduce((acc, item, index) => {
        const itemQty =
          (Number(item.StripeOf) || 0) * (Number(item.StripeQty) || 0) +
          (Number(item.lQty) || 0);
        const itemResult = itemQty * (Number(item.Price) || 0);
        const discountAmount =
          (itemResult * (Number(item.discount) || 0)) / 100;

        const netTotalAmount = itemResult - discountAmount;

        const sgstValue =
          (round(netTotalAmount) * (Number(item.SGSTP) || 0)) / 100;
        const cgstValue =
          (round(netTotalAmount) * (Number(item.CGSTP) || 0)) / 100;

        return acc + round(Number(sgstValue) + Number(cgstValue), 2);
      }, 0);

      setValue("TotalGst", round(totalGst, 2));

      // =======================
      const gstAndNetTotalAmount = round(totalGst + netTotalAmount, 2);
      const paymentsDetails = getValues("paymentsDetails") || [];
      const totalAmountPaid = paymentsDetails.reduce((sum, payment) => {
        return sum + (payment.Amount ? Number(payment.Amount) : 0);
      }, 0);
      const advanceOrderAmount = getValues("advanceOrderAmount") || 0;

      const decimalValue =
        gstAndNetTotalAmount - Math.floor(gstAndNetTotalAmount);
      if (decimalValue > 0.5) {
        setValue("roundUpAmount", round(1 - decimalValue, 2));
        setValue("GrandTotalAmount", Math.ceil(gstAndNetTotalAmount));

        setValue(
          "dueAmount",
          Math.ceil(gstAndNetTotalAmount) - totalAmountPaid - advanceOrderAmount
        );
      } else {
        setValue("roundUpAmount", -round(decimalValue, 2));
        setValue("GrandTotalAmount", Math.floor(gstAndNetTotalAmount));
        setValue(
          "dueAmount",
          Math.floor(gstAndNetTotalAmount) -
            totalAmountPaid -
            advanceOrderAmount
        );
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
  // ========================================react query ===================================?
  const results = useQueries({
    queries: [
      {
        queryKey: ["subDealerListApi"],
        queryFn: subDealerListApiFn,
      },
      {
        queryKey: ["moneyReciptListApi"],
        queryFn: moneyReciptListApiFn,
      },
    ],
  });

  // Destructure the responses
  const [doctorQuery, moneyReciptQuery] = results;
  const moneyReciptList = moneyReciptQuery?.data?.data?.data || [];

  const doctorData = doctorQuery.data?.data?.data || [];
  // console.log("categoryData", categoryData);
  const doctorOptions =
    doctorData?.map((item) => ({
      value: item.ID,
      label: item.DoctorName,
    })) || [];

  // ==================================fetxh customer, supplier, subdealer=======================

  // const handleOpenAddDialog = () => setAddDialogOpen(true);
  // const handleCloseAddDialog = () => setAddDialogOpen(false);

  useEffect(() => {
    if (customerSelect?.items) {
      reset({
        ...getValues(), // Preserve existing form values
        company: customerSelect?.BillEntityID, // Explicitly set company
        items: customerSelect.items,
        discount: customerSelect.Discount,
        roundUpAmount: customerSelect.RoundedOffAmount,
      });

      // Explicitly set company value separately to ensure it's updated
      setValue("company", customerSelect.BillEntityID || "");

      setItemSelect(
        customerSelect.items.map((item) => ({
          value: JSON.stringify(item.ProductModelID),
          label:
            allItems.find((i) => i.ProductModelID == item.ProductModelID)
              ?.ModelNumber || "",
        }))
      );
      customerSelect.items.forEach((item, index) => {
        setValue(`items.${index}.ProductModelID`, item.ProductModelID);
      });

      // Add a 3-second delay before setting setLoading(false
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 1000);

      // Cleanup timeout on component unmount or dependency change
      return () => clearTimeout(timeout);
    }
  }, [customerSelect, reset, allItems, setValue]);

  const handlePaymentValidation = (isValid) => {
    if (paymentIsValid.current !== isValid) {
      paymentIsValid.current = isValid;
      forceRender((prev) => !prev);
    }
  };
  const getPaymentDataFn = (value) => {
    setPaymentInformation(value);
  };
  // ========================================child row data =========================
  // const watchItems = watch("items");

  // ============================================ submit ==================================
  const onSubmit = async (data) => {
    setWarningStatus(true);
    setFormData(data);
  };
  // ====================================customer select =======================
  useEffect(() => {
    setAllItemsa(customerSelect?.items);

    if (customerSelect?.items) {
      reset({
        company: customerSelect.BillEntityID,
        items: customerSelect.items.map((item) => {
          return {
            HSNMasterID: item.HSNMasterID ? item.HSNMasterID : allHsn[0]?.ID,
            AvailableQuantity: item.AvailableQuantity || 0, // <-- Add this line

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
      setValue("company", customerSelect.BillEntityID || "");

      const timeout = setTimeout(() => {
        setLoading(false);
      }, 1000);

      return () => clearTimeout(timeout);
    }
    customerSelect?.items?.map((items, index) => {
      updateResult(index); // Trigger updateResult for each item with a slight delay
    });
  }, [customerSelect]);
  // =========================================== custmer select useEffect =======================
  useEffect(() => {
    const items = customerSelect?.items;
    // setAllItemsa(items);
    items?.forEach((i, index) => {
      // const row = getValues(`items.${index}`);
      const Price = i.Price;
      const Quantity = i.Quantity;
      const discount = 0;
      const amount = i.Amount || 0;

      // Calculate base result
      // const baseResult = (Number(Price) || 0) * (Number(Quantity) || 0);

      // const finalResult =
      //   baseResult - (baseResult * (Number(discount) || 0)) / 100;
      // console.log("finalResult", finalResult);

      setValue(`items.${index}.result`, round(amount, 2));
    });

    const totalResult = items?.reduce((acc, item) => {
      const itemResult =
        (Number(item.Price) || 0) * (Number(item.Quantity) || 0) -
        ((Number(item.Price) || 0) *
          (Number(item.Quantity) || 0) *
          (Number(item.discount) || 0)) /
          100;
      return acc + itemResult;
    }, 0);
    const totalAmountBd = totalResult ? round(totalResult, 2) : ""; // Ensure blank if invalid
    setValue("totalAmountBD", totalAmountBd);

    // Calculate discount value based on total result
    const discount = customerSelect?.Discount || 0;
    const roundUpAmount = customerSelect?.RoundedOffAmount || 0;

    const discountValue = totalResult
      ? round((totalResult * Number(discount)) / 100, 2)
      : "";
    setValue("discountValue", discountValue);
    const totalAmountAD = totalAmountBd
      ? round(totalAmountBd - discountValue, 2)
      : "";
    setValue("totalAmountAD", totalAmountAD);

    const sgstp = Number(getValues("sgstValue")) || 9;
    const cgstp = getValues("cgstValue") || 9;

    const sgstValue = totalAmountAD
      ? round((totalAmountAD * sgstp) / 100, 2)
      : "";
    const cgstValue = totalAmountAD
      ? round((totalAmountAD * cgstp) / 100, 2)
      : "";
    setValue("sgstValue", sgstValue);
    setValue("cgstValue", cgstValue);
    // const grandTotalAmount = round(
    //   totalAmountAD + sgstValue + cgstValue - roundUpAmount,
    //   2
    // );
    // setValue("grandTotalAmount", grandTotalAmount);
    const netTotalAmount =
      round(Number(totalAmountAD) + Number(sgstValue) + Number(cgstValue), 2) ||
      "";
    const decimalValue = netTotalAmount
      ? netTotalAmount - Math.floor(netTotalAmount)
      : 0;
    if (decimalValue > 0.5) {
      setValue("roundUpAmount", round(1 - decimalValue, 2));
      setValue("grandTotalAmount", Math.ceil(netTotalAmount));
    } else {
      setValue("roundUpAmount", -round(decimalValue, 2));
      setValue("grandTotalAmount", Math.floor(netTotalAmount));
    }
    setValue("netTotalAmount", netTotalAmount);
    trigger([
      "SGSTAmount",
      "CGSTAmount",
      "grandTotalAmount",
      "netTotalAmount",
      "dueAmount",
    ]); // Trigger validation
  }, [customerSelect]);

  // =====================================style ============================

  const selectComponentStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#ffffff",
      borderColor: state.isFocused ? "green" : base.borderColor,
      boxShadow: "none",
      minHeight: "50px",
      "&:hover": {
        borderColor: "green",
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
      backgroundColor: state.isFocused ? "green" : "#ffffff",
      color: state.isFocused ? "#fff" : "#000",
      padding: "10px",
      "&:hover": {
        color: "#fff",
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: "green",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "green",
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
        backgroundColor: "green",
        color: "#fff",
      },
    }),
  };

  //  / ===============================================for email section ===========================================

  const [openEmailButton, setOpenEmailButton] = React.useState(false);
  const [openEmail, setOpenEmail] = React.useState(false);
  const [emailFormData, setEmailFormData] = React.useState({});
  const [emailmsz, setEmailMsz] = React.useState(false);
  const [status, setStatus] = React.useState(null);
  const [openDia, setOpenDia] = React.useState(false);
  const [data, setFormData] = React.useState(null);
  const successFunction = (data) => {
    // setSuccessMsz(data);
    if (data) {
      setStatus(2); // Update status to 2 when email is sent successfully
    }
  };

  const emailMszFn = (data) => {
    console.log("emailMszFn called with data:", data); // Debug log
    setEmailMsz(data); // Ensure this is called with the correct value
    console.log("Updated emailmsz state:", data); // Verify state update
  };
  console.log("email msz", emailmsz);

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

  // ==========================================customer options===========================================
  const customerOptions = dummyQuotation?.map((customer, index) => {
    return {
      label: customer.QuotationNo,
      id: customer.ReceiptID,
      name: customer.Name,
      EntityID: customer.EntityID,
      // contactPerson: customer.ContactPerson,
      MobileNo1: customer.PhoneNumber1,
      address: `${customer.AddressLine1} ${customer.AddressLine2} ${customer.City} ${customer.District} ${customer.State} ${customer.Pincode}`,
      Date: customer.QuotationDate,
      // company: customer.companyName,
      // bank: customer.SupplierDetails.SupplierMobileNo,
      items: customer.ModelMappingData,
      EntityID: customer.EntityID,
      BillEntityID: customer.BillEntityID,
      Discount: customer.Discount,
      RoundedOffAmount: customer.RoundedOffAmount,
      company: customer.BillEntityID,
      DealerName: customer.DealerNam,
      EntityType: customer.EntityType,
      subDealerAdd: `${customer.AddressLine1} ${customer.AddressLine2} ${customer.City} ${customer.District} ${customer.State} ${customer.PinCode}`,
    };
  });
  console.log(customerSelect);

  // for item =========================================================
  const itemOptions = allItems.map((item) => ({
    value: item.ProductModelID,
    label: ` ${item.ModelNumber}`,
    name: `${item.ModelNumber}`,
    // date: item?.SupplierDetails?.SupplierEntryTimeStamp,
    Price: item.Price,
    HSN: item.HSNCode,
    StripOf: item.StripOf,
  }));
  console.log("allitems", allItems);

  const roundedStyle = () => ({
    // borderRadius: "15px",
    // backgroundColor: "#fff",
    // outline: "none",
    // border: "none",
    // "& .MuiOutlinedInput-root": {
    //   "& fieldset": { outline: "none", borderRadius: "15px" },
    //   "&:hover fieldset": { outline: "none", borderRadius: "15px" },
    //   "&.Mui-focused fieldset": { outline: "none", borderRadius: "15px" },
    // },
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

  const handleDoctorDialogOpen = () => setOpenDoctorDialog(true);
  const handleDoctorDialogClose = () => setOpenDoctorDialog(false);

  const handleDoctorFormChange = (field, value) => {
    setDoctorForm((prev) => ({ ...prev, [field]: value }));
  };

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleDoctorFormSubmit = async () => {
    const token = Cookies.get("token"); // Get token from cookies
    const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

    const finalData = {
      DoctorName: doctorForm.name,
      Gender: "",
      DateOfBirth: "",
      Qualification: "",
      Specialization: doctorForm.specialization,
      Email: "",
      PhoneNumber: doctorForm.phone,
      AlternatePhoneNumber: "",
      AddressLine1: "",
      AddressLine2: "",
      Pincode: "",
      RegistrationNumber: "",
      ExperienceInYears: "",
    };

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_URL}/api/InsertDoctor`,
        finalData,
        {
          headers: {
            Authorization: sanctumToken,
          },
        }
      );
      setSnackbarMessage("Doctor added successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      handleDoctorDialogClose();
    } catch (error) {
      setSnackbarMessage("Failed to add doctor. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    if (doctorList.length > 0) {
      setValue("abcOption", doctorList[0]?.ID || ""); // Automatically select the first option
    }
  }, [doctorList, setValue]);

  return (
    <Box padding={3}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
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
              {/* <FormControl component="fieldset" sx={{ float: "right" }}>
                <FormLabel
                  component="legend"
                  sx={{
                    color: "darkgreen",
                    "&.Mui-focused": { color: "darkgreen" },
                  }}
                >
                  Invoice
                </FormLabel>
                <RadioGroup
                  row
                  value={quoSection ? "withQ" : "withoutQ"}
                  onChange={(event) => {
                    setQuoSection(event.target.value === "withQ");
                    if (event.target.value !== "withQ") {
                      reset({
                        company: null,
                        discountDesc: "festival discount",
                        items: [
                          {
                            ProductModelID: null,
                            HSNMasterID: allHsn[0]?.ID || 0,
                            Quantity: 1,
                            UnitQuantity: "Piece",
                            Rate: 0,
                            Amount: 0,
                            discount: 0,
                          },
                        ],
                        SGSTP: 9,
                        CGSTP: 9,
                        discount: 0,
                        roundUpAmount: 0,
                        selectedSupplier: "",
                        quoSection: event.target.value === "withQ",
                      });
                    } else {
                      reset({
                        company: null,
                        discountDesc: "festival discount",
                        items: [],
                        discountUnit: "P",
                        SGSTP: 9,
                        CGSTP: 9,
                        discount: 0,
                        roundUpAmount: 0,
                        selectedSupplier: "",
                        quoSection: event.target.value === "withQ",
                      });
                    }
                    setCustomerSelect([]);
                    setItemSelect([]);
                  }}
                >
                  <FormControlLabel
                    value="withQ"
                    control={
                      <Radio
                        sx={{
                          color: "darkgreen",
                          "&.Mui-checked": { color: "darkgreen" },
                        }}
                      />
                    }
                    label="With Quotation"
                  />
                  <FormControlLabel
                    value="withoutQ"
                    control={
                      <Radio
                        sx={{
                          color: "darkgreen",
                          "&.Mui-checked": { color: "darkgreen" },
                        }}
                      />
                    }
                    label="Without Quotation"
                  />
                </RadioGroup>
              </FormControl> */}
              <Box sx={{ display: "flex", gap: "1rem" }}>
                <Box>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Controller
                      name="receiptDate"
                      control={control}
                      defaultValue={dayjs().format("YYYY-MM-DD")} // Set default value to today's date
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
                <Box sx={{ minWidth: 180 }}>
                  {/* <FormControl fullWidth sx={greenBorderStyle}>
                    <InputLabel id="abc-select-label" sx={{ color: "green" }}>
                      Doctor
                    </InputLabel>
                    <Controller
                      name="abcOption"
                      control={control}
                                            defaultValue={doctorList[0]?.ID || ""} // Automatically select the first option

                      render={({ field }) => (
                        <Select
                          {...field}
                          labelId="abc-select-label"
                          label="Doctor"
                          sx={{ backgroundColor: "white", ...greenBorderStyle }}
                        >
                          {doctorList.map((doc) => (
                            <MenuItem key={doc.ID} value={doc.ID}>
                              {doc.DoctorName}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </FormControl> */}
                  <SelectCreate
                    control={control}
                    options={doctorOptions}
                    onCreateFn={handleDoctorDialogOpen}
                    // selectedOption={selectedSubCategoryOption}
                    // selectedfetchData={selectedfetchData}
                    name="DoctorID"
                    label="Doctor"
                    // postDone={postDone}
                  />
                </Box>
              </Box>
              <Box>
                {!quoSection && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ minWidth: 355 }}>
                      <FormControl
                        fullWidth
                        error={!!errors.selectedCustomer}
                        sx={{
                          background: "white",
                          ...greenBorderStyle,
                          "& .MuiInputBase-root": {
                            height: "3.2rem",
                          },
                        }}
                      >
                        {/* <InputLabel id="demo-simple-select-label">
                        {`Select ${typeSupplier}`}{" "}
                      </InputLabel> */}
                        <Controller
                          name="selectedCustomer"
                          control={control}
                          render={({ field }) => (
                            <SelectComponent
                              {...field}
                              options={
                                typeSupplier === "customer"
                                  ? customerList.map((customer) => ({
                                      value: customer.CustomerID,
                                      label: `${customer.FirstName} ${customer.LastName} - ${customer.MobileNumber || "N/A"}`,
                                    }))
                                  : subDealerList.map((subDealer) => ({
                                      value: subDealer.SubDealerID,
                                      label: `${subDealer.DealerName} - ${subDealer.MobileNo1 || "N/A"}`,
                                    }))
                              }
                              placeholder={
                                <span>
                                  {customerSelect?.CustomerID
                                    ? `${customerSelect.FirstName} ${customerSelect.LastName} - ${customerSelect.MobileNumber || "N/A"}`
                                    : customerSelect?.SubDealerID
                                      ? `${customerSelect.DealerName} - ${customerSelect.MobileNo1 || "N/A"}`
                                      : `Search and select ${typeSupplier}`}
                                </span>
                              }
                              isSearchable
                              style={{
                                background: "white",
                                ...greenBorderStyle,
                                "& .MuiInputBase-root": {
                                  height: "3.2rem",
                                },
                              }}
                              onChange={(selectedOption) => {
                                const selectedCustomer =
                                  typeSupplier === "customer"
                                    ? customerList.find(
                                        (customer) =>
                                          customer.CustomerID ===
                                          selectedOption.value
                                      )
                                    : subDealerList.find(
                                        (subDealer) =>
                                          subDealer.SubDealerID ===
                                          selectedOption.value
                                      );
                                setCustomerSelect(selectedCustomer);
                                field.onChange(selectedOption.value);
                              }}
                            />
                          )}
                        />
                        {errors.selectedCustomer && (
                          <FormHelperText>
                            {errors.selectedCustomer.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                      {/* Display selected customer details */}
                      {typeSupplier === "customer" &&
                        customerSelect?.CustomerID && (
                          <Box sx={{ mt: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "bold", color: "darkgreen" }}
                            >
                              Email: {customerSelect.Email || "--"},
                              AddressLine: {customerSelect.AddressLine1 || "--"}
                              , CustomerType:{" "}
                              {customerSelect.CustomerType || "--"}
                            </Typography>
                          </Box>
                        )}
                      {/* Display selected subdealer details */}
                      {typeSupplier === "subDealer" &&
                        customerSelect?.SubDealerID && (
                          <Box sx={{ mt: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "bold", color: "darkgreen" }}
                            >
                              Email: {customerSelect.Email || "--"},
                              AddressLine: {customerSelect.AddressLine1 || "--"}
                              , ContactPerson:{" "}
                              {customerSelect.ContactPerson || "--"}
                            </Typography>
                          </Box>
                        )}
                    </Box>
                    <Box>
                      {typeSupplier !== "subDealer" && (
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={
                            showCustomerFields ? (
                              <KeyboardDoubleArrowUpIcon />
                            ) : (
                              <KeyboardDoubleArrowDownIcon />
                            )
                          }
                          sx={{
                            borderRadius: "15px",
                            width: "13rem",
                            height: "50px",
                            fontWeight: "bold",
                          }}
                          onClick={() => {
                            setShowCustomerFields((prev) => !prev); // Toggle customer fields
                            if (showSubDealerFields)
                              setShowSubDealerFields(false); // Hide subdealer fields if visible
                          }}
                        >
                          Add Customer
                        </Button>
                      )}
                      {typeSupplier === "subDealer" && (
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={
                            showSubDealerFields ? (
                              <KeyboardDoubleArrowUpIcon />
                            ) : (
                              <KeyboardDoubleArrowDownIcon />
                            )
                          }
                          sx={{
                            borderRadius: "15px",
                            width: "13rem",
                            height: "50px",
                            fontWeight: "bold",
                          }}
                          onClick={() => {
                            setShowSubDealerFields((prev) => !prev); // Toggle subdealer fields
                            if (showCustomerFields)
                              setShowCustomerFields(false); // Hide customer fields if visible
                          }}
                        >
                          Add Subdealer
                        </Button>
                      )}
                    </Box>
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                // justifyContent: "space-between",
                // alignItems: "center",
              }}
            ></Grid>
            {quoSection && (
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  // justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Box sx={{ width: "30%" }}>
                  <SelectComponent
                    value={customerSelect}
                    onChange={(selectedOption) => {
                      setValue(
                        "CustomerId",
                        selectedOption ? selectedOption.id : ""
                      );
                      setCustomerSelect(selectedOption);
                    }}
                    options={customerOptions}
                    placeholder="Select Quotation"
                    isSearchable={true}
                    styles={selectComponentStyles}
                  />
                  <Typography color="error" sx={{ ml: 2 }}>
                    {customerSelect?.length === 0 && "select quotation"}
                  </Typography>
                </Box>
              </Grid>
            )}
            {!quoSection && showCustomerFields && (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="First Name"
                      {...register("customerFirstName")}
                      sx={{ bgcolor: "white", ...greenBorderStyle }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      {...register("customerLastName")}
                      sx={{ bgcolor: "white", ...greenBorderStyle }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      {...register("customerPhone")}
                      sx={{ bgcolor: "white", ...greenBorderStyle }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="GST Number"
                      {...register("customerGST")}
                      sx={{ bgcolor: "white", ...greenBorderStyle }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Email ID"
                      {...register("customerEmail")}
                      sx={{ bgcolor: "white", ...greenBorderStyle }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Address"
                      {...register("customerAddress")}
                      sx={{ bgcolor: "white", ...greenBorderStyle }}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Subdealer Fields */}
            {!quoSection && showSubDealerFields && (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Subdealer Name"
                      {...register("subDealerName")}
                      sx={{ bgcolor: "white", ...greenBorderStyle }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Contact Person Name"
                      {...register("subDealerContactPerson")}
                      sx={{ bgcolor: "white", ...greenBorderStyle }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="GST Number"
                      {...register("subDealerGST")}
                      sx={{ bgcolor: "white", ...greenBorderStyle }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      {...register("subDealerPhone")}
                      sx={{ bgcolor: "white", ...greenBorderStyle }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Email ID"
                      {...register("subDealerEmail")}
                      sx={{ bgcolor: "white", ...greenBorderStyle }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Address"
                      {...register("subDealerAddress")}
                      sx={{ bgcolor: "white", ...greenBorderStyle }}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
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
                padding: ".5rem 1rem",
                // border: "1px solid gray",
                alignItems: "center",
              }}
            >
              {fields.map((field, index) => (
                <Box
                  key={field.id}
                  sx={{ display: "flex", alignItems: "center", width: "100%" }}
                >
                  <InvoiceRow
                    field={field}
                    index={index}
                    control={control}
                    allItems={allItems}
                    itemOptions={itemOptions}
                    setValue={setValue}
                    errors={errors}
                    sanctumToken={sanctumToken}
                    itemSelect={itemSelect}
                    setItemSelect={setItemSelect}
                    watch={watch}
                    getValues={getValues}
                    updateResult={updateResult}
                    onRemove={() => remove(index)}
                  />
                  <IconButton
                    aria-label="delete"
                    color="error"
                    onClick={() => remove(index)}
                    sx={{ ml: 1, mt: 2 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Grid>
            {customerSelect.length == 0 && quoSection && (
              <Box sx={{ width: "100%", textAlign: "center" }}>
                <Typography variant="body1" sx={{ color: "red" }}>
                  Please select the "Quotation" option to view items or proceed
                  to the "Without Quotation" section to add new items.
                </Typography>
              </Box>
            )}
            {(quoSection && customerSelect.length) !== 0 && (
              <Grid
                item
                sx={{
                  mt: 2,
                  ml: "auto",
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                }}
              >
                <FormControl fullWidth>
                  <InputLabel
                    sx={{
                      color: "#1d7d1d",
                      "&.Mui-focused": { color: "darkgreen" },
                    }}
                  >
                    -------
                  </InputLabel>
                  <Select
                    value={rowsToAdd}
                    onChange={(e) => setRowsToAdd(e.target.value)}
                    label="Rows"
                    sx={{
                      height: "2rem",
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
              </Grid>
            )}
            {/* <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}
            ></Box> */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
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
                    name="TotalDiscount"
                    control={control}
                    defaultValue={0}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        id="lumpsum-discount"
                        label="Total Discount"
                        sx={{ ...roundedStyle(), ...greenBorderStyle }}
                        fullWidth
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
              <Box sx={{ float: "left" }}>
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: "left",
                    width: "100%",
                    mt: 2,
                    display: "flex",
                    // gap: ".5rem",
                    alignItems: "center",
                    // mb: 1,
                    ml: 2,
                  }}
                  gutterBottom
                >
                  {" "}
                  <CurrencyRupeeRoundedIcon />
                  Payment section
                </Typography>
              </Box>
              <Box sx={{ width: "100%" }}>
                <InvoiceSalesPaymentForm
                  paymentAll={allPaymentType}
                  finalAmount={getValues("grandTotalAmount")}
                  paymentIsValidFn={handlePaymentValidation}
                  paymentinfoFn={getPaymentDataFn}
                  roundedStyle={roundedStyle}
                  setValue={setValue} // Pass setValue as a prop
                  moneyReciptList={moneyReciptList}
                />
              </Box>
              <Grid item xs={11.9} sx={{ ml: 2 }}>
                <TextField
                  fullWidth
                  label="Remarks"
                  sx={{ bgcolor: "white", ...greenBorderStyle }}
                  {...register("remarks")}
                  gutterBottom
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "flex-end" }}
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
              <Grid container sx={{ ml: 2 }} spacing={2}>
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
                  Generate Invoice
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
                console.log("Updated formData:", emailFormData); // Debug log
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
          </Grid>
        </form>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          severity={snackbarSeverity}
        />
        <LoadingComp loading={loading} />
        {/* <EmailSendDialog
          status={status} // Ensure status is passed correctly
          openDias={openDia}
          onClose={() => {
            setOpenDia(false); // Close the dialog
            setStatus(null); // Reset status when dialog is closed
            handleCloseEmail();
          }}
        /> */}
        {openEmail && (
          <QuotationEmailDirectForm
            openEmail={openEmail}
            handleCloseEmail={handleCloseEmail}
            handleClickOpenEmail={handleClickOpenEmail}
            emailData={resData}
            type="INVS"
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
      </FormProvider>

      {/* Add Doctor Dialog */}
      <Dialog open={openDoctorDialog} onClose={handleDoctorDialogClose}>
        <DialogTitle>Add Doctor</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Doctor Name"
            value={doctorForm.name}
            onChange={(e) => handleDoctorFormChange("name", e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Phone Number"
            value={doctorForm.phone}
            onChange={(e) => handleDoctorFormChange("phone", e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Specialization"
            value={doctorForm.specialization}
            onChange={(e) =>
              handleDoctorFormChange("specialization", e.target.value)
            }
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "16px",
          }}
        >
          <Button
            onClick={handleDoctorDialogClose}
            color="secondary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDoctorFormSubmit}
            color="primary"
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {triggerPrint &&
        row &&
        typeof row === "object" &&
        pdfTriggerCount < 5 && (
          <BlobProvider
            document={<InvoiceSalesCreatepdfNew data={row} type="sales" />}
          >
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
}
