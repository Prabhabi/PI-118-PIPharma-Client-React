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
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  MenuItem,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Stack,
} from "@mui/material";
import {
  Add,
  Delete as DeleteIcon,
  LibraryAdd as LibraryAddIcon,
  Category as CategoryIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import axios from "axios";
import {
  AccountCircleRounded as AccountIcon,
  LocalPhoneRounded as PhoneIcon,
  HomeRounded as HomeIcon,
  ApartmentRounded as CompanyIcon,
  PostAddRounded as PostAddIcon,
  AssuredWorkload as BankIcon,
  HomeWork as HomeWorkIcon,
  Groups3 as Groups3Icon,
  Person4 as Person4Icon,
} from "@mui/icons-material";
import SelectComponent from "react-select";
import ProductCreateForm from "../../../../purchase/productPage/component/ProductCreateForm";
import CustomerMaster from "../../../../sales/customers/components/AddCustomer";
import DelerEditDetailsDialog from "../../../../purchase/subDeler/component/DelerEditDetailsDialog";
import LoadingComp from "../../../../../components/loadingComp/LoadingComp";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import advncedORderPdf from "./AdvncedORderPdf";
import _ from "lodash";
import Cookies from "js-cookie";
import EmailSendDialog from "./../../../../purchase/quotation/components/QuotationForm/component/emailSendDialog/EmailSendDialog";
import QuotationEmail from "./../../../../purchase/quotation/components/QuotationForm/component/quotationEmail/QuotationEmail";
import AdvncedORderEmailPdfInner from "./AdvncedORderEmailPdfInner";
import QuotationEmailDirectForm from "../../../../purchase/quotation/components/QuotationForm/component/quotationEmail/QuotationEmailDirectForm";
import WarningComp from "../../../../../components/warningComp/WarningComp";
import { useQueryClient } from "@tanstack/react-query";

const calculateSubTotal = (items) =>
  items.reduce((total, item) => total + (item.Amount || 0), 0);
const calculateDiscountedAmount = (subTotal, discount) =>
  parseFloat((subTotal - subTotal * (discount / 100)).toFixed(2));
const calculateNetTotalAmount = (discountedAmount, sgst, cgst) =>
  parseFloat(
    (
      discountedAmount +
      discountedAmount * (sgst / 100) +
      discountedAmount * (cgst / 100)
    ).toFixed(2)
  );
const calculateGrandTotalAmount = (amount) => Math.round(amount);
const round = (value, decimals) =>
  Number(Math.round(value + "e" + decimals) + "e-" + decimals);

export default function QuotationFormOld({
  customerList,
  allItems,
  companyList,
  subdealerList,
  signatoryList,
  fetchCusomer,
  fetchallSubDealer,
  handleAddCustomerClose,
  fetchAdvaceOrder,
}) {
  const [customerSelect, setCustomerSelect] = useState(null);
  const [companySelect, setCompanySelect] = useState(null);
  const [itemSelect, setItemSelect] = useState([]);
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [openCustomerDialog, setOpenCustomerDialog] = useState(false);
  const [openSubdealerDialog, setOpenSubdealerDialog] = useState(false);
  const [consumerType, setConsumerType] = useState("customer");
  const [subdealerSelect, setSubdealerSelect] = useState(null); // Define subdealerSelect
  const [loading, setLoading] = useState(false);
  const [rowsToAdd, setRowsToAdd] = useState(1);
  const [shakeWarning, setShakeWarning] = useState(false);

  const schema = yup.object().shape({
    CompanyId: yup.string().required("Company is required"),
    items: yup.array().of(
      yup.object().shape({
        ProductModelID: yup.string().required("Product is required"),
        UnitQuantity: yup.string().required("Unit Quantity is required"),
        Color: yup.string().required("Color is required"),
        Price: yup
          .number()
          .typeError("Price must be a number")
          .required("Price is required")
          .min(0, "Price must be at least 0"),
        Quantity: yup
          .number()
          .required("Quantity is required")
          .typeError("Quantity must be a number")
          .min(1, "Quantity must be at least 1"),
      })
    ),
    discount: yup
      .number()
      .typeError("Discount must be a number")
      .required("Discount is required")
      .min(0, "Discount must be at least 0"),
    SGSTP: yup
      .number()
      .typeError("SGST Percentage must be a number")
      .required("SGST Percentage is required")
      .min(0, "SGST Percentage must be at least 0"),
    CGSTP: yup
      .number()
      .typeError("CGST Percentage must be a number")
      .required("CGST Percentage is required")
      .min(0, "CGST Percentage must be at least 0"),
    CustomerId:
      consumerType == "customer" &&
      yup.string().required("Customer is required"),
    SubdealerId:
      consumerType == "subdealer" &&
      yup.string().required("Subdealer is required"),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    getValues,
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
          DueDays: "",
        },
      ],
      dateTime: new Date().toISOString().slice(0, 10),
      remarks: "",
    },
  });

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
        borderColor: "green",
      },
      "&:hover fieldset": {
        borderColor: "green",
      },
      "&.Mui-focused fieldset": {
        borderColor: "green",
      },
      height: "50px", // Set height for all fields
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
      height: "50px", // Set height for all fields
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

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const customerOptions = customerList.map((customer) => ({
    label: `${customer.FirstName} ${customer.LastName}`,
    id: customer.CustomerID,
    name: `${customer.FirstName} ${customer.LastName}`,
    contactPerson: customer.FirstName,
    MobileNo1: customer.MobileNumber,
    address: `${customer.AddressLine1} ${customer.AddressLine2}`,
    company: customer.CompanyName,
    bank: `${customer.PANCard}`,
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
    label: `${item.ModelNumber}`,
    name: `${item.BrandName} ${item.ModelNumber}`,
    availableQuantity: item.AvailableQuantity, // Ensure available quantity is included
  }));

  const subdealerOptions = subdealerList.map((subdealer) => ({
    label: subdealer.DealerName,
    id: subdealer.SubDealerID,
    name: subdealer.ContactPerson,
    MobileNo1: subdealer.MobileNo1,
    address: `${subdealer.AddressLine1} ${subdealer.AddressLine2}`,
    company: subdealer.DealerName,
    bank: `${subdealer.BankName} ${subdealer.AccountNumber} Ifsc: ${subdealer.IFSCCode}`,
  }));

  const subTotal = calculateSubTotal(getValues("items"));
  const discountedAmount = calculateDiscountedAmount(
    subTotal,
    getValues("discount")
  );
  const netTotalAmount = calculateNetTotalAmount(
    discountedAmount,
    getValues("SGSTP"),
    getValues("CGSTP")
  );
  const grandTotalAmount = calculateGrandTotalAmount(netTotalAmount);
  // ===============================================for email  section===========================================
  // ===============================================for email section ===========================================
  const [openEmailButton, setOpenEmailButton] = React.useState(false);
  const [openEmail, setOpenEmail] = React.useState(false);
  const [emailFormData, setEmailFormData] = React.useState({});
  const [emailmsz, setEmailMsz] = React.useState(false);
  const [status, setStatus] = React.useState(null);
  const [openDia, setOpenDia] = React.useState(false);
  const [data, setFormData] = React.useState(null);
  const [resData, setResData] = useState(null);

  const successFunction = (data) => {
    // setSuccessMsz(data);
    console.log("Success function called with data:", data); // Debug log
    if (data) {
      setStatus(2); // Update status to 2 when email is sent successfully
    }
  };

  const emailMszFn = (data) => {
    console.log("emailMszFn called with data:", data); // Debug log
    setEmailMsz(data); // Ensure this is called with the correct value
    console.log("Updated emailmsz state:", data); // Verify state update
  };

  const handleEmaildata = (data) => {
    setEmailFormData(data);
  };

  const handleClickOpenEmail = () => {
    isValid && setOpenEmail(true);
  };

  const handleCloseEmail = () => {
    setOpenEmail(false);
  };
  const queryClient = useQueryClient();

  //  =======================================quotation warning section ======================================
  const [warningStatus, setWarningStatus] = useState(false);
  const [warningData, setWarningData] = useState(null);
  const warningDataFn = async (data1) => {
    setWarningStatus(false);
    if (data1) {
      setLoading(true);

      let entityType, entityId;
      if (consumerType === "customer") {
        if (!customerSelect) {
          console.error("Customer not selected");
          return;
        }
        entityType = "CUST";
        entityId = +customerSelect.id;
      } else {
        if (!subdealerSelect) {
          console.error("Subdealer not selected");
          return;
        }
        entityType = "SUBD";
        entityId = +subdealerSelect.id;
      }

      if (!companySelect) {
        console.error("Company not selected");
        return;
      }

      // Define missing variables
      const subTotal = getValues("totalAmountBD");
      const discount = getValues("discount");
      const discountedAmount = getValues("totalAmountAD");

      const cgst = round(getValues("CGSTP"), 2); // Round to 2 decimal places
      const sgst = round(getValues("SGSTP"), 2); // Round to 2 decimal places
      const netTotalAmount = getValues("grandTotalAmount");

      const finalData = {
        EntityType: entityType,
        EntityID: entityId,
        BillCode: "ADVB",
        BillEntityType: "COMP",
        BillEntityID: +companySelect.id,
        Source: "O",
        QuotationDate: data.dateTime,
        QABRemarks: data.remarks,
        TotalAmountBD: subTotal,
        Discount: data.discount,
        DiscountAmount: subTotal - discountedAmount,
        TotalAmountAD: discountedAmount,
        CGSTP: +cgst,
        CGSTAmount: round(discountedAmount * (cgst / 100), 2),
        SGSTP: +sgst,
        SGSTAmount: round(discountedAmount * (sgst / 100), 2),
        GrandTotalAmount: netTotalAmount,
        RoundOffAmount: 0,
        NetTotalAmount: netTotalAmount,
        AuthorizedSignatoryByID: data.AuthorizedSignatoryByID,
        ModelMappingData: data.items.map((item, index) => {
          const selectedItem = itemSelect[index];
          const colorOption = selectedItem.ColorListJson
            ? JSON.parse(selectedItem.ColorListJson).find(
                (color) => color.Color === item.Color
              )
            : null;
          return {
            ProductModelID: +item.ProductModelID,
            ColorMasterID: colorOption ? colorOption.ColorMasterID : 1,
            HSNMasterID: 1,
            BrandMasterID: +selectedItem.BrandMasterID,
            Quantity: +item.Quantity,
            UnitQuantity: item.UnitQuantity,
            Price: item.Price ? +item.Price : null,
            Amount: item.result ? +item.result : null,
            DueInDays: item.DueDays ? +item.DueDays : null,
            QtyPerBox: item.QtyPerBox ? +item.QtyPerBox : null, // Add QtyPerBox here
            AvailableQuantity: item.AvailableQuantity
              ? +item.AvailableQuantity
              : null, // Add QtyPerBox here
          };
        }),
      };
      console.log("Final data:", finalData);

      try {
        const token = Cookies.get("token"); // Get token from cookies
        const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

        const response = await axios.post(
          `${process.env.REACT_APP_URL}/api/postquotationbooking`,
          finalData,
          {
            headers: {
              Authorization: sanctumToken,
            },
          }
        );
        const responseData = Array.isArray(response.data)
          ? response.data[0]
          : response.data;
        if (responseData && responseData.ModelMappingData) {
          // console.log("responseData", responseData);
          // // advncedORderPdf(responseData);
          // openEmail || advncedORderPdf(responseData);
          // openEmail &&
          //   AdvncedORderEmailPdfInner(
          //     responseData,
          //     emailFormData,
          //     successFunction
          //   );
          openEmailButton || advncedORderPdf(responseData); // <-- Await here
          openEmailButton && setResData(responseData); // <-- Await here
          openEmailButton && setOpenEmail(true); // <-- Await here

          openEmailButton && setOpenEmail(true); // Open the dialog after form submission
          openEmailButton && setEmailMsz(false); // Reset email message state

          fetchAdvaceOrder();
          openEmailButton || handleAddCustomerClose();
          setLoading(false);
        } else {
          console.error("Invalid response data structure:", response.data);
        }
        const queryKeys = [
          ["advbSalesCustGraphApi"],
          ["advbSalesSubdGraphApi"],
          ["advbSalesYearGraphApi"],
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
        console.error("Error posting data:", error);
        setLoading(false);
      }
    }
  };

  // ===========================================================================================================

  const onSubmit = async (data) => {
    setWarningStatus(true);
    setFormData(data);
  };
  const handleProductDialogOpen = () => setOpenProductDialog(true);
  const handleProductDialogClose = () => setOpenProductDialog(false);
  const handleCustomerDialogOpen = () => setOpenCustomerDialog(true);
  const handleCustomerDialogClose = () => setOpenCustomerDialog(false);
  const handleSubdealerDialogOpen = () => setOpenSubdealerDialog(true);
  const handleSubdealerDialogClose = () => setOpenSubdealerDialog(false);

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
      return [];
    }
  };

  const updateResult = useCallback(
    _.debounce((index) => {
      const row = getValues(`items.${index}`);
      if (!row) return;
      const { Price, Quantity, discount } = row;
      const baseResult = (Number(Price) || 0) * (Number(Quantity) || 0);
      const finalResult =
        baseResult - (baseResult * (Number(discount) || 0)) / 100;
      setValue(`items.${index}.result`, round(finalResult, 2));
      const items = getValues("items");
      const totalResult = items?.reduce(
        (acc, item) =>
          acc +
          ((Number(item.Price) || 0) * (Number(item.Quantity) || 0) -
            ((Number(item.Price) || 0) *
              (Number(item.Quantity) || 0) *
              (Number(item.discount) || 0)) /
              100),
        0
      );
      const totalAmountBd = round(totalResult, 2);
      setValue("totalAmountBD", totalAmountBd);
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
      const grandTotalAmount = round(totalAmountAD + sgstValue + cgstValue, 2);
      setValue("grandTotalAmount", grandTotalAmount);
    }, 300),
    [getValues, setValue]
  );

  const updateGrandResult = _.debounce(() => {
    const items = getValues("items");
    const totalResult = items?.reduce(
      (acc, item) =>
        acc +
        ((Number(item.Price) || 0) * (Number(item.Quantity) || 0) -
          ((Number(item.Price) || 0) *
            (Number(item.Quantity) || 0) *
            (Number(item.discount) || 0)) /
            100),
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
    const grandTotalAmount = round(totalAmountAD + sgstValue + cgstValue, 2);
    setValue("grandTotalAmount", grandTotalAmount);
  }, 300);

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

  const handleConsumerTypeChange = (event, newType) => {
    setConsumerType(newType);
    setCustomerSelect(null);
    setSubdealerSelect(null);
  };

  const consumerTypeOptions = [
    { value: "customer", label: "Customer" },
    { value: "subdealer", label: "Subdealer" },
  ];

  const ControlledSelectComponent = ({
    value,
    onChange,
    options,
    placeholder,
  }) => (
    <SelectComponent
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      isSearchable
      styles={{
        control: (base) => ({
          ...base,
          backgroundColor: "#fff",
          color: "#235c35",
          borderColor: "#235c35",
          boxShadow: "none",
          minHeight: "50px",
          width: "100%",
          "&:hover": { borderColor: "darkgreen" },
          "&.Mui-focused": { borderColor: "darkgreen" },
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: "#fff",
          boxShadow: "none",
          zIndex: 100,
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused ? "#235c35" : "#fff",
          color: state.isFocused ? "#fff" : "#000",
          padding: "10px",
        }),
        singleValue: (base) => ({ ...base, color: "#235c35" }),
        placeholder: (base) => ({ ...base, color: "#235c35" }),
      }}
    />
  );

  const renderConsumerDetails = (
    select,
    options,
    handleDialogOpen,
    dialogContent
  ) => (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          // bgcolor: "#e8f5e9",
          borderRadius: "10px",
          pt: "-5rem",
          pr: 2,
          pb: 2,
        }}
      >
        <Grid item xs={12} sm={12} lg={6} sx={{ marginTop: { lg: "1rem" } }}>
          <Typography
            variant="h6"
            sx={{
              display: "flex",
              gap: ".5rem",
              alignItems: "center",
              color: "#1d7d1d",
            }}
          >
            <HomeWorkIcon /> Company Details:
          </Typography>
          <ControlledSelectComponent
            value={companySelect}
            onChange={(selectedOption) => {
              setValue("CompanyId", selectedOption ? selectedOption.id : "");
              setCompanySelect(selectedOption);
            }}
            options={companyOptions}
            placeholder="Select Company"
          />
          <Typography color="error" sx={{ ml: 2 }}>
            {errors.CompanyId?.message}
          </Typography>
        </Grid>
        {/* Customer or Subdealer Details Section */}
        <Grid item xs={12} sm={12} lg={6} sx={{ marginTop: { lg: "1rem" } }}>
          <Typography
            variant="h6"
            sx={{
              display: "flex",
              gap: ".5rem",
              alignItems: "center",
              color: "#1d7d1d",
            }}
          >
            {consumerType === "customer" ? <Person4Icon /> : <Groups3Icon />}{" "}
            {consumerType === "customer" ? "Customer" : "Subdealer"} Details:
          </Typography>
          <ControlledSelectComponent
            value={select}
            onChange={(selectedOption) => {
              setValue(
                consumerType === "customer" ? "CustomerId" : "SubdealerId",
                selectedOption ? selectedOption.id : ""
              );
              consumerType === "customer"
                ? setCustomerSelect(selectedOption)
                : setSubdealerSelect(selectedOption);
            }}
            options={options}
            placeholder={`Select ${consumerType === "customer" ? "Customer" : "Subdealer"}`}
          />
          <Typography color="error" sx={{ ml: 2 }}>
            {errors.CustomerId?.message || errors.SubdealerId?.message}
          </Typography>
        </Grid>
        {/* Company Details Section */}

        {/* Display Selected Customer or Subdealer Details */}
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
          }}
        >
          {select?.name && (
            <Grid item>
              <Typography
                variant="body1"
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#1d7d1d",
                }}
              >
                <AccountIcon
                  sx={{ fontSize: { xs: 30 }, mr: 1, color: "#1d7d1d" }}
                />{" "}
                {select.name}
              </Typography>
            </Grid>
          )}
          {select?.MobileNo1 && (
            <Grid item>
              <Typography
                variant="body1"
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#1d7d1d",
                }}
              >
                <PhoneIcon
                  sx={{ fontSize: { xs: 30 }, mr: 1, color: "#1d7d1d" }}
                />{" "}
                {select.MobileNo1} ({select.contactPerson})
              </Typography>
            </Grid>
          )}
          {select?.address && (
            <Grid item>
              <Typography
                variant="body1"
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#1d7d1d",
                }}
              >
                <HomeIcon
                  sx={{ fontSize: { xs: 30 }, mr: 1, color: "#1d7d1d" }}
                />{" "}
                {select.address}
              </Typography>
            </Grid>
          )}
          {select?.bank && (
            <Grid item>
              <Typography
                variant="body1"
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#1d7d1d",
                }}
              >
                <BankIcon
                  sx={{ fontSize: { xs: 30 }, mr: 1, color: "#1d7d1d" }}
                />{" "}
                {select.bank}
              </Typography>
            </Grid>
          )}
          {select?.company && (
            <Grid item>
              <Typography
                variant="body1"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#1d7d1d",
                }}
              >
                <CompanyIcon
                  sx={{ fontSize: { xs: 30 }, mr: 1, color: "#1d7d1d" }}
                />{" "}
                {select.company}
              </Typography>
            </Grid>
          )}
        </Grid>
        <Stack
          direction="row"
          sx={{ justifyContent: "flex-end", width: "100%" }}
        >
          <Button
            variant="contained"
            onClick={handleDialogOpen}
            // sx={{
            //   color: "#fff",
            //   textTransform: "none",
            //   fontWeight: "bold",
            //   width: "180px", // Added fixed width
            //   height: "40px", // Added fixed height
            //   mb: 1,
            //   mr: 2,
            // }}
          >
            + New {consumerType === "customer" ? "Customer" : "Subdealer"}
          </Button>
        </Stack>
      </Grid>
      <Dialog
        open={
          consumerType === "customer" ? openCustomerDialog : openSubdealerDialog
        }
        onClose={
          consumerType === "customer"
            ? handleCustomerDialogClose
            : handleSubdealerDialogClose
        }
        fullWidth
        maxWidth="md"
      >
        <DialogContent>{dialogContent}</DialogContent>
        <DialogActions>
          <Button
            onClick={
              consumerType === "customer"
                ? handleCustomerDialogClose
                : handleSubdealerDialogClose
            }
            color="primary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );

  return (
    <Box padding={1} sx={{ borderRadius: "10px" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            mb: 5,
            // backgroundColor: "#e8f5e9",
          }}
        >
          <Box sx={{ width: "10rem" }}>
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
                      "& fieldset": { borderColor: "#1d7d1d" },
                      "&:hover fieldset": { borderColor: "#1d7d1d" },
                      "&.Mui-focused fieldset": { borderColor: "#1d7d1d" },
                    },
                  }}
                  error={!!errors.dateTime}
                  helperText={errors.dateTime?.message}
                />
              )}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              mr: "1rem",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{ display: "flex", mr: "1rem", alignItems: "center", gap: 1 }}
            >
              <Groups3Icon sx={{ color: "#1d7d1d", fontSize: "2rem" }} />
            </Typography>
            <FormControl>
              <RadioGroup
                row
                value={consumerType}
                onChange={(e) => setConsumerType(e.target.value)}
              >
                <FormControlLabel
                  value="customer"
                  control={
                    <Radio
                      sx={{
                        color: "#1d7d1d",
                        "&.Mui-checked": {
                          color: "#1d7d1d",
                        },
                      }}
                    />
                  }
                  label="Customer"
                />
                <FormControlLabel
                  value="subdealer"
                  control={
                    <Radio
                      sx={{
                        color: "#1d7d1d",
                        "&.Mui-checked": {
                          color: "#1d7d1d",
                        },
                      }}
                    />
                  }
                  label="Subdealer"
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </Box>
        {consumerType === "customer"
          ? renderConsumerDetails(
              customerSelect,
              customerOptions,
              handleCustomerDialogOpen,
              <CustomerMaster fetchAllCustomer={fetchCusomer} />
            )
          : renderConsumerDetails(
              subdealerSelect,
              subdealerOptions,
              handleSubdealerDialogOpen,
              <DelerEditDetailsDialog
                fetchallSubDealer={fetchallSubDealer}
                type="invoice"
              />
            )}
        <Grid container spacing={2}>
          <Box
            sx={{
              width: "100%",
              padding: "2rem",
              // backgroundColor: "#e8f5e9",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                // backgroundColor: "#e8f5e9",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  display: "flex",
                  gap: ".5rem",
                  alignItems: "center",
                  color: "#1d7d1d",
                  mb: 1,
                }}
              >
                <PostAddIcon /> Item Details:
              </Typography>
              <Button
                variant="contained"
                onClick={handleProductDialogOpen}
                // sx={{
                //   color: "#fff",
                //   textTransform: "none",
                //   backgroundColor: "#1d7d1d",
                //   fontWeight: "bold",
                //   width: "180px", // Added fixed width
                //   height: "40px", // Added fixed height
                //   mb: 1,
                // }}
              >
                + New Product
              </Button>
            </Box>

            <Grid container spacing={2}>
              {fields.map((field, index) => (
                <React.Fragment key={field.id}>
                  {index > 0 && (
                    <Grid item xs={12} sx={{ mt: 2 }}>
                      <Divider />
                    </Grid>
                  )}
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Typography sx={{ mt: "1rem" }}>{index + 1}.</Typography>

                      <Grid item xs={2.4}>
                        <Controller
                          name={`items.${index}.ProductModelID`}
                          control={control}
                          defaultValue=""
                          render={({ field }) =>
                            renderSelectComponent(
                              index,
                              {
                                ...field,
                                value:
                                  itemOptions.find(
                                    (option) => option.value === field.value
                                  ) || null,
                              },
                              itemOptions,
                              "Search Product",
                              (selectedOption) => {
                                const selectedItem = allItems.find(
                                  (item) =>
                                    item.ProductModelID === selectedOption.value
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
                                setValue(
                                  `items.${index}.result`,
                                  selectedItem.Price *
                                    watch(`items.${index}.Quantity`)
                                );
                                setValue(
                                  `items.${index}.AvailableQuantity`,
                                  selectedItem.AvailableQuantity
                                ); // Set available quantity
                                setValue(`items.${index}.Color`, "Standard");
                                setValue(
                                  `items.${index}.AvailableQuantity`,
                                  selectedItem.AvailableQuantity
                                ); // Set available quantity

                                const newItemSelect = [...itemSelect];
                                newItemSelect[index] = selectedItem;
                                setItemSelect(newItemSelect);
                                updateGrandResult();
                              }
                            )
                          }
                        />
                        <Typography color="error">
                          {errors.items?.[index]?.ProductModelID?.message}
                        </Typography>
                      </Grid>
                      <Grid item xs={1.2}>
                        <FormControl
                          fullWidth
                          sx={fieldStyles}
                          error={!!errors.items?.[index]?.Color}
                        >
                          <InputLabel
                            sx={{
                              color: "#1d7d1d",
                              "&.Mui-focused": { color: "darkgreen" },
                            }}
                          >
                            Color
                          </InputLabel>
                          <Controller
                            name={`items.${index}.Color`}
                            control={control}
                            render={({ field }) => {
                              const colorOptions = parseColorOptions(
                                itemSelect[index]?.ColorListJson || "[]"
                              );
                              return (
                                <Select
                                  {...field}
                                  label=" Color"
                                  sx={{
                                    height: "50px",
                                    backgroundColor: "white",
                                    "& .MuiOutlinedInput-root": {
                                      "& fieldset": { borderWidth: "2px" },
                                    },
                                  }}
                                >
                                  {colorOptions.map((option) => (
                                    <MuiMenuItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </MuiMenuItem>
                                  ))}
                                </Select>
                              );
                            }}
                          />
                          <FormHelperText>
                            {errors.items?.[index]?.Color?.message}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={1.2}>
                        <FormControl
                          fullWidth
                          sx={fieldStyles}
                          error={!!errors.items?.[index]?.Price}
                        >
                          <Controller
                            name={`items.${index}.Price`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="Price"
                                InputLabelProps={{
                                  sx: {
                                    color: "#1d7d1d",
                                    "&.Mui-focused": { color: "darkgreen" },
                                  },
                                }}
                                InputProps={{
                                  sx: {
                                    height: "50px",
                                    padding: "0",
                                    fontSize: "14px",
                                    background: "white",
                                  },
                                }}
                                error={!!errors.items?.[index]?.Price}
                                defaultValue="0"
                                helperText={
                                  errors.items?.[index]?.Price?.message
                                }
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                  updateResult(index);
                                }}
                              />
                            )}
                          />
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={5}
                        sm={1.4}
                        sx={{ height: "3.2rem", mt: -2 }}
                      >
                        <Controller
                          name={`items.${index}.Quantity`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Quantity"
                              sx={{ background: "white", ...greenBorderStyle }}
                              InputProps={{
                                sx: {
                                  height: "50px",
                                  padding: "0",
                                  fontSize: "14px",
                                  background: "white",
                                },
                              }}
                              error={!!errors.items?.[index]?.Quantity}
                              helperText={
                                errors.items?.[index]?.Quantity?.message
                              }
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                updateResult(index);
                              }}
                            />
                          )}
                        />
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ mt: 1, textAlign: "center" }}
                        >
                          Available:{" "}
                          {watch(`items.${index}.AvailableQuantity`) || 0}
                        </Typography>
                        {showOutOfStockWarning(index, getValues)}
                      </Grid>
                      <Grid item xs={1.25}>
                        <FormControl
                          fullWidth
                          sx={fieldStyles}
                          error={!!errors.items?.[index]?.UnitQuantity}
                        >
                          <InputLabel
                            sx={{
                              color: "#1d7d1d",
                              "&.Mui-focused": { color: "darkgreen" },
                            }}
                          >
                            Unit
                          </InputLabel>
                          <Select
                            {...register(`items.${index}.UnitQuantity`)}
                            label="UnitQuantity"
                            sx={{
                              height: "50px",
                              backgroundColor: "white",
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderWidth: "40px" },
                              },
                            }}
                            defaultValue="Box"
                          >
                            <MenuItem value="Box">Box</MenuItem>
                            <MenuItem value="Piece">Piece</MenuItem>
                            <MenuItem value="Dozen">Dozen</MenuItem>
                            <MenuItem value="Pair">Pair</MenuItem>
                          </Select>
                          <FormHelperText>
                            {errors.items?.[index]?.UnitQuantity?.message}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={1}>
                        <FormControl
                          fullWidth
                          sx={fieldStyles}
                          error={!!errors.items?.[index]?.QtyPerBox}
                        >
                          <Controller
                            name={`items.${index}.QtyPerBox`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="Qty /Unit"
                                InputLabelProps={{
                                  shrink: true,
                                  sx: {
                                    color: "#1d7d1d",
                                    "&.Mui-focused": { color: "darkgreen" },
                                  },
                                }}
                                InputProps={{
                                  sx: {
                                    height: "50px",
                                    padding: "0",
                                    fontSize: "14px",
                                    background: "white",
                                  },
                                }}
                                error={!!errors.items?.[index]?.QtyPerBox}
                                helperText={
                                  errors.items?.[index]?.QtyPerBox?.message
                                }
                                onInput={(e) => handleInput(e.target)}
                              />
                            )}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={1.8}>
                        <Controller
                          name={`items.${index}.result`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              sx={{
                                background: "white",
                                "& .MuiOutlinedInput-root": {
                                  "& fieldset": { borderColor: "darkgreen" },
                                  "&:hover fieldset": {
                                    borderColor: "darkgreen",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "darkgreen",
                                  },
                                },
                              }}
                              label="Total"
                              variant="outlined"
                              size="small"
                              fullWidth
                              InputLabelProps={{
                                shrink: true,
                                style: { color: "#1d7d1d" },
                              }}
                              InputProps={{
                                readOnly: true,
                                sx: {
                                  height: "50px",
                                  padding: "0",
                                  fontSize: "14px",
                                  background: "white",
                                },
                              }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={1}>
                        <FormControl
                          fullWidth
                          sx={fieldStyles}
                          error={!!errors.items?.[index]?.DueDays}
                        >
                          <Controller
                            name={`items.${index}.DueDays`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                defaultValue={0}
                                label="DueDays"
                                InputLabelProps={{
                                  sx: {
                                    color: "#1d7d1d",
                                    "&.Mui-focused": { color: "darkgreen" },
                                  },
                                }}
                                InputProps={{
                                  sx: {
                                    height: "50px",
                                    padding: "0",
                                    background: "white",
                                  },
                                }}
                                error={!!errors.items?.[index]?.DueDays}
                                helperText={
                                  errors.items?.[index]?.DueDays?.message
                                }
                                onInput={(e) => handleInput(e.target)}
                              />
                            )}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={0.5}>
                        <IconButton onClick={() => removeFn(index)}>
                          <DeleteIcon style={{ color: "red" }} />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Grid>
                </React.Fragment>
              ))}
              <Grid
                container
                spacing={2}
                alignItems="center"
                justifyContent="flex-end"
              >
                <Grid item sx={{ mt: 2, ml: "auto" }}>
                  <FormControl fullWidth sx={fieldStyles}>
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
                </Grid>
                <Grid item>
                  <Button
                    variant="text"
                    onClick={() => {
                      for (let i = 0; i < rowsToAdd; i++) {
                        append({
                          ProductModelID: "",
                          Quantity: 1,
                          UnitQuantity: "Box",
                          BrandName: "",
                          Color: "",
                          Price: 0,
                          Amount: 0,
                          DueDays: "",
                        });
                      }
                    }}
                    sx={{
                      height: "2rem",
                      mt: 2,
                      ml: -2,
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
              </Grid>
            </Grid>
            <Divider sx={{ marginY: 2 }} />
            <Grid container spacing={2} sx={{ marginTop: 4, mb: 3 }}>
              <Grid item xs={6} sm={4}>
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
                      error={!!errors.discount}
                      helperText={errors.discount?.message}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        updateGrandResult();
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <Controller
                  name="SGSTP"
                  control={control}
                  defaultValue="9"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="SGST Percentage"
                      sx={{ ...roundedStyle(), ...greenBorderStyle }}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        updateGrandResult();
                      }}
                      fullWidth
                      type="number"
                      InputProps={{ inputProps: { min: 0 } }}
                      error={!!errors.SGSTP}
                      helperText={errors.SGSTP?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <Controller
                  name="CGSTP"
                  control={control}
                  defaultValue={9}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="CGST percentage"
                      sx={{ ...roundedStyle(), ...greenBorderStyle }}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        updateGrandResult();
                      }}
                      fullWidth
                      type="number"
                      InputProps={{ inputProps: { min: 0 } }}
                      error={!!errors.CGSTP}
                      helperText={errors.CGSTP?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Table
              sx={{
                width: "100%",
                borderCollapse: "collapse",
                backgroundColor: "#fff",
              }}
            >
              <TableBody>
                <TableRow
                  sx={{
                    borderBottom: "1px solid #ddd",
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                  }}
                >
                  <TableCell
                    sx={{
                      textAlign: "center",
                      padding: "10px",
                      fontSize: "14px",
                      fontWeight: "400",
                      color: "#000",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
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
                            style: { color: "black" },
                          }}
                          InputProps={{ readOnly: true }}
                          sx={{
                            input: { textAlign: "center", background: "white" },
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": { borderColor: "black" },
                              "&:hover fieldset": { borderColor: "black" },
                              "&.Mui-focused fieldset": {
                                borderColor: "black",
                              },
                            },
                          }}
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      padding: "10px",
                      fontSize: "14px",
                      fontWeight: "400",
                      color: "#000",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
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
                            style: { color: "black" },
                          }}
                          InputProps={{ readOnly: true }}
                          sx={{
                            input: { textAlign: "center", background: "white" },
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": { borderColor: "black" },
                              "&:hover fieldset": { borderColor: "black" },
                              "&.Mui-focused fieldset": {
                                borderColor: "black",
                              },
                            },
                          }}
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      padding: "10px",
                      fontSize: "14px",
                      fontWeight: "400",
                      color: "#000",
                      borderBottom: "1px solid #ddd",
                      display: "flex",
                      gap: "1rem",
                    }}
                  >
                    <Controller
                      name="sgstValue"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="sgst"
                          variant="outlined"
                          size="small"
                          fullWidth
                          InputLabelProps={{
                            shrink: true,
                            style: { color: "black" },
                          }}
                          InputProps={{ readOnly: true }}
                          sx={{
                            input: { textAlign: "center", background: "white" },
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": { borderColor: "black" },
                              "&:hover fieldset": { borderColor: "black" },
                              "&.Mui-focused fieldset": {
                                borderColor: "black",
                              },
                            },
                          }}
                        />
                      )}
                    />
                    <Controller
                      name="cgstValue"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="cgst"
                          variant="outlined"
                          size="small"
                          fullWidth
                          InputLabelProps={{
                            shrink: true,
                            style: { color: "black" },
                          }}
                          InputProps={{ readOnly: true }}
                          sx={{
                            input: { textAlign: "center", background: "white" },
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": { borderColor: "black" },
                              "&:hover fieldset": { borderColor: "black" },
                              "&.Mui-focused fieldset": {
                                borderColor: "black",
                              },
                            },
                          }}
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      padding: "10px",
                      fontSize: "14px",
                      fontWeight: "400",
                      color: "#000",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
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
                            style: { color: "black" },
                          }}
                          InputProps={{ readOnly: true }}
                          sx={{
                            input: { textAlign: "center", background: "white" },
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": { borderColor: "black" },
                              "&:hover fieldset": { borderColor: "black" },
                              "&.Mui-focused fieldset": {
                                borderColor: "black",
                              },
                            },
                          }}
                        />
                      )}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Grid container spacing={2} sx={{ marginTop: 0 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Remarks"
                  {...register("remarks")}
                  sx={{
                    ...fieldStyles,
                    "& .MuiInputLabel-root": { color: "#1d7d1d" },
                  }}
                  InputProps={{
                    sx: { height: "50px", padding: "0", fontSize: "14px" },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl
                  fullWidth
                  sx={{
                    ...fieldStyles,
                    "& .MuiInputLabel-root": { color: "#1d7d1d" },
                  }}
                >
                  <InputLabel>Authorized By</InputLabel>
                  <Select
                    {...register("AuthorizedSignatoryByID")}
                    label="Authorized By"
                    defaultValue={signatoryList[0]?.ID}
                    sx={{ height: "50px" }}
                  >
                    {signatoryList &&
                      signatoryList.map((signatory) => (
                        <MenuItem key={signatory.ID} value={signatory.ID}>
                          {signatory.Name}
                        </MenuItem>
                      ))}
                  </Select>
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
      </form>
      <Dialog
        open={openProductDialog}
        onClose={handleProductDialogClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            backgroundColor: "#1b5e20",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CategoryIcon />
            Add New Product
          </Box>
          <IconButton
            onClick={handleProductDialogClose}
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <ProductCreateForm />
        </DialogContent>
      </Dialog>
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
          type="ADVB"
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
    </Box>
  );
}

const renderSelectComponent = (
  index,
  field,
  options,
  placeholder,
  onChange
) => (
  <SelectComponent
    {...field}
    options={options}
    placeholder={placeholder}
    onChange={onChange}
    styles={{
      control: (base) => ({
        ...base,
        backgroundColor: "#fff",
        color: "#235c35",
        borderColor: "darkgreen",
        boxShadow: "none",
        minHeight: "50px",
        width: "100%",
        "&:hover": { borderColor: "darkgreen" },
        "&.Mui-focused": { borderColor: "darkgreen" },
      }),
      menu: (base) => ({
        ...base,
        backgroundColor: "#fff",
        boxShadow: "none",
        zIndex: 100,
      }),
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused ? "darkgreen" : "#fff",
        color: state.isFocused ? "#fff" : "#000",
        padding: "10px",
      }),
      singleValue: (base) => ({ ...base, color: "#235c35" }),
      placeholder: (base) => ({ ...base, color: "#235c35" }),
    }}
  />
);

const fieldStyles = {
  backgroundColor: "#fff",
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#1d7d1d" },
    "&:hover fieldset": { borderColor: "#1d7d1d" },
    "&.Mui-focused fieldset": { borderColor: "#1d7d1d" },
  },
};

const updateResult = (index, getValues, setValue) => {
  const price = getValues(`items.${index}.Price`);
  const quantity = getValues(`items.${index}.Quantity`);
  setValue(`items.${index}.result`, price * quantity);
};

const showOutOfStockWarning = (index, getValues) => {
  const availableQuantity = getValues(`items.${index}.AvailableQuantity`);
  if (availableQuantity < 1) {
    return (
      <Typography
        key={`out-of-stock-${index}-${availableQuantity}`} // Unique key to force re-render
        variant="body2"
        color="error"
        sx={{
          mt: 0.2,
          fontWeight: "bold",
          textAlign: "center",
          animation: "shake 1s",
          "@keyframes shake": {
            "0%": { transform: "translateX(0)" },
            "5%": { transform: "translateX(-5px)" },
            "15%": { transform: "translateX(5px)" },
            "25%": { transform: "translateX(-5px)" },
            "35%": { transform: "translateX(5px)" },
            "50%": { transform: "translateX(-5px)" },
            "60%": { transform: "translateX(5px)" },
            "75%": { transform: "translateX(-5px)" },
            "90%": { transform: "translateX(5px)" },
            "100%": { transform: "translateX(0)" },
          },
        }}
      >
        Out of Stock Product
      </Typography>
    );
  }
  return null;
};
