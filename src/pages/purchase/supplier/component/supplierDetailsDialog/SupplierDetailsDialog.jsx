import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Button,
  Typography,
  Box,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  MenuItem,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Person,
  Business,
  Email,
  Phone,
  WhatsApp,
  Language,
  Home,
  LocationCity,
  PinDrop,
  CreditCard,
  AccountBalance,
  AccountBox,
  AccountBalanceWallet,
  Business as BusinessIcon,
} from "@mui/icons-material";
import axios from "axios";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Block all console methods (log, warn, error, info, debug, trace)
// if (typeof window !== "undefined" && typeof window.console !== "undefined") {
//   for (const method of ["log", "warn", "error", "info", "debug", "trace"]) {
//     window.console[method] = () => {};
//   }
// }

const schema = yup.object().shape({
  supplierName: yup.string().required("Supplier Name is required"),
  supplierType: yup.string().required("Supplier Type is required"),
  email: yup.string().email(),
  website: yup.string(),
  gstNumber: yup.string(),
  panNumber: yup.string(),
  bankName: yup.string(),
  branchAddress: yup.string(),
  accountHolderName: yup.string(),
  accountNumber: yup.string(),
  ifscCode: yup.string(),
  upiId: yup.string(),
  contactPerson: yup.string(),
  whatsappNo: yup
    .string()
    .nullable()
    .matches(/^\d{10}$/, "WhatsApp No must be a 10-digit number")
    .transform((value) => (value === "" ? null : value)),
  mobileNo1: yup
    .string()
    .nullable()
    .matches(/^\d{10}$/, "Mobile No. 1 must be a 10-digit number")
    .transform((value) => (value === "" ? null : value)),
  mobileNo2: yup
    .string()
    .nullable()
    .matches(/^\d{10}$/, "Mobile No. 2 must be a 10-digit number")
    .transform((value) => (value === "" ? null : value)),
  addressLine1: yup.string(),
  addressLine2: yup.string(),
  pinCode: yup.string(),
  stateMasterID: yup.string(),
  districtMasterID: yup.string(),
  cityMasterID: yup.string(),
});

const ViewMode = ({ supplierData }) => (
  <Grid container spacing={4}>
    <Grid item xs={6}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h6">Basic Details</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Business sx={{ color: "#1a472a" }} />
          <Typography>
            Supplier Type: {supplierData?.SupplierType || "--"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Person sx={{ color: "#1a472a" }} />
          <Typography>
            Contact Name: {supplierData?.ContactPerson || "--"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Email sx={{ color: "#1a472a" }} />
          <Typography>Email: {supplierData?.Email || "--"}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Phone sx={{ color: "#1a472a" }} />
          <Typography>
            Mobile Number: {supplierData?.MobileNo1 || "--"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WhatsApp sx={{ color: "#1a472a" }} />
          <Typography>
            WhatsApp Number: {supplierData?.WhatsappNo || "--"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Language sx={{ color: "#1a472a" }} />
          <Typography>Website: {supplierData?.Website || "--"}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Home sx={{ color: "#1a472a" }} />
          <Typography>
            Address: {supplierData?.AddressLine1 || "--"}
            <br />
            {supplierData?.AddressLine2 || ""}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AccountBalance sx={{ color: "#1a472a" }} />
          <Typography>
            Bank Details: {supplierData?.BankName || "--"} -{" "}
            {supplierData?.AccountNumber || "--"}
            <br />
            IFSC: {supplierData?.IFSCCode || "--"}
            <br />
            Branch: {supplierData?.BranchName || "--"}
          </Typography>
        </Box>
      </Box>
    </Grid>
    <Grid item xs={6}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h6">Contact & Address</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LocationCity sx={{ color: "#1a472a" }} />
          <Typography>State: {supplierData?.State || "--"}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LocationCity sx={{ color: "#1a472a" }} />
          <Typography>District: {supplierData?.District || "--"}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LocationCity sx={{ color: "#1a472a" }} />
          <Typography>City: {supplierData?.City || "--"}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PinDrop sx={{ color: "#1a472a" }} />
          <Typography>Pin Code: {supplierData?.PinCode || "--"}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CreditCard sx={{ color: "#1a472a" }} />
          <Typography>GST Number: {supplierData?.GSTNumber || "--"}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AccountBox sx={{ color: "#1a472a" }} />
          <Typography>
            License Number: {supplierData?.PANNumber || "--"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AccountBalanceWallet sx={{ color: "#1a472a" }} />
          <Typography>UPI ID: {supplierData?.UPIID || "--"}</Typography>
        </Box>
      </Box>
    </Grid>
  </Grid>
);

const EditMode = ({
  editedSupplier,
  handleChange,
  stateList,
  districtList,
  cityList,
  handleStateChange,
  handleDistrictChange,
  handleCityChange,
  register,
  errors,
  setValue,
}) => (
  <Grid container spacing={4} sx={{ mb: 2 }}>
    <Grid item xs={6}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h6">Basic Details</Typography>
        <TextField
          label="Supplier Name"
          {...register("supplierName")}
          error={!!errors.supplierName}
          helperText={errors.supplierName?.message}
          value={editedSupplier?.SupplierName || ""}
          onChange={(e) => {
            handleChange("SupplierName")(e);
            setValue("supplierName", e.target.value);
          }}
          InputProps={{
            startAdornment: <Business sx={{ color: "#1a472a", mr: 1 }} />,
          }}
        />
        <TextField
          label="Supplier Type"
          {...register("supplierType")}
          error={!!errors.supplierType}
          helperText={errors.supplierType?.message}
          value={editedSupplier?.SupplierType || ""}
          onChange={(e) => {
            handleChange("SupplierType")(e);
            setValue("supplierType", e.target.value);
          }}
          InputProps={{
            startAdornment: <Business sx={{ color: "#1a472a", mr: 1 }} />,
          }}
        />

        <TextField
          label="Email"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          value={editedSupplier?.Email || ""}
          onChange={(e) => {
            handleChange("Email")(e);
            setValue("email", e.target.value);
          }}
          InputProps={{
            startAdornment: <Email sx={{ color: "#1a472a", mr: 1 }} />,
          }}
        />
        <TextField
          label="Mobile Number"
          {...register("mobileNo1")}
          error={!!errors.mobileNo1}
          helperText={errors.mobileNo1?.message}
          value={editedSupplier?.MobileNo1 || ""}
          onChange={(e) => {
            handleChange("MobileNo1")(e);
            setValue("mobileNo1", e.target.value);
          }}
          InputProps={{
            startAdornment: <Phone sx={{ color: "#1a472a", mr: 1 }} />,
          }}
        />
        <TextField
          label="Alternate Mobile Number"
          {...register("mobileNo2")}
          error={!!errors.mobileNo2}
          helperText={errors.mobileNo2?.message}
          value={editedSupplier?.MobileNo2 || ""}
          onChange={(e) => {
            handleChange("MobileNo2")(e);
            setValue("mobileNo2", e.target.value);
          }}
          InputProps={{
            startAdornment: <Phone sx={{ color: "#1a472a", mr: 1 }} />,
          }}
        />
        <TextField
          label="WhatsApp Number"
          {...register("whatsappNo")}
          error={!!errors.whatsappNo}
          helperText={errors.whatsappNo?.message}
          value={editedSupplier?.WhatsappNo || ""}
          onChange={(e) => {
            handleChange("WhatsappNo")(e);
            setValue("whatsappNo", e.target.value);
          }}
          InputProps={{
            startAdornment: <WhatsApp sx={{ color: "#1a472a", mr: 1 }} />,
          }}
        />

        <TextField
          label="Bank Name"
          {...register("bankName")}
          error={!!errors.bankName}
          helperText={errors.bankName?.message}
          value={editedSupplier?.BankName || ""}
          onChange={(e) => {
            handleChange("BankName")(e);
            setValue("bankName", e.target.value);
          }}
          InputProps={{
            startAdornment: <AccountBalance sx={{ color: "#1a472a", mr: 1 }} />,
          }}
        />
        <TextField
          label="Account Holder Name"
          {...register("accountHolderName")}
          error={!!errors.accountHolderName}
          helperText={errors.accountHolderName?.message}
          value={editedSupplier?.AccountHolderName || ""}
          onChange={(e) => {
            handleChange("AccountHolderName")(e);
            setValue("accountHolderName", e.target.value);
          }}
          InputProps={{
            startAdornment: <AccountBalance sx={{ color: "#1a472a", mr: 1 }} />,
          }}
        />
        <TextField
          label="Account Number"
          {...register("accountNumber")}
          error={!!errors.accountNumber}
          helperText={errors.accountNumber?.message}
          value={editedSupplier?.AccountNumber || ""}
          onChange={(e) => {
            handleChange("AccountNumber")(e);
            setValue("accountNumber", e.target.value);
          }}
          InputProps={{
            startAdornment: <CreditCard sx={{ color: "#1a472a", mr: 1 }} />,
          }}
        />
        <TextField
          label="IFSC Code"
          {...register("ifscCode")}
          error={!!errors.ifscCode}
          helperText={errors.ifscCode?.message}
          value={editedSupplier?.IFSCCode || ""}
          onChange={(e) => {
            handleChange("IFSCCode")(e);
            setValue("ifscCode", e.target.value);
          }}
          InputProps={{
            startAdornment: <CreditCard sx={{ color: "#1a472a", mr: 1 }} />,
          }}
        />
        <TextField
          label="Branch Name"
          {...register("branchAddress")}
          error={!!errors.branchAddress}
          helperText={errors.branchAddress?.message}
          value={editedSupplier?.BranchName || ""}
          onChange={(e) => {
            handleChange("BranchName")(e);
            setValue("branchAddress", e.target.value);
          }}
          InputProps={{
            startAdornment: <AccountBalance sx={{ color: "#1a472a", mr: 1 }} />,
          }}
        />
      </Box>
    </Grid>
    <Grid item xs={6}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h6">Contact & Address</Typography>
        <TextField
          label="Contact Name"
          {...register("contactPerson")}
          error={!!errors.contactPerson}
          helperText={errors.contactPerson?.message}
          value={editedSupplier?.ContactPerson || ""}
          onChange={(e) => {
            handleChange("ContactPerson")(e);
            setValue("contactPerson", e.target.value);
          }}
          InputProps={{
            startAdornment: <Person sx={{ color: "#1a472a", mr: 1 }} />,
          }}
        />
        <TextField
          label="Website"
          {...register("website")}
          error={!!errors.website}
          helperText={errors.website?.message}
          value={editedSupplier?.Website || ""}
          onChange={(e) => {
            handleChange("Website")(e);
            setValue("website", e.target.value);
          }}
          InputProps={{
            startAdornment: <Language sx={{ color: "#1a472a", mr: 1 }} />,
          }}
        />
        <TextField
          label="Address Line 1"
          {...register("addressLine1")}
          error={!!errors.addressLine1}
          helperText={errors.addressLine1?.message}
          value={editedSupplier?.AddressLine1 || ""}
          onChange={(e) => {
            handleChange("AddressLine1")(e);
            setValue("addressLine1", e.target.value);
          }}
          InputProps={{
            startAdornment: <Home sx={{ color: "#1a472a", mr: 1 }} />,
          }}
        />
        <TextField
          label="Address Line 2"
          {...register("addressLine2")}
          error={!!errors.addressLine2}
          helperText={errors.addressLine2?.message}
          value={editedSupplier?.AddressLine2 || ""}
          onChange={(e) => {
            handleChange("AddressLine2")(e);
            setValue("addressLine2", e.target.value);
          }}
          InputProps={{
            startAdornment: <Home sx={{ color: "#1a472a", mr: 1 }} />,
          }}
        />
        <TextField
          select
          label="State"
          {...register("stateMasterID")}
          error={!!errors.stateMasterID}
          helperText={errors.stateMasterID?.message}
          value={editedSupplier?.StateMasterID ?? ""}
          onChange={(e) => {
            handleStateChange(e);
            setValue("stateMasterID", e.target.value);
          }}
          InputProps={{
            startAdornment: <LocationCity sx={{ color: "#1a472a", mr: 1 }} />,
          }}
        >
          <MenuItem value="" disabled>
            Select State
          </MenuItem>
          {stateList.map((option) => (
            <MenuItem key={option.ID} value={option.ID}>
              {option.StateName}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="District"
          {...register("districtMasterID")}
          error={!!errors.districtMasterID}
          helperText={errors.districtMasterID?.message}
          value={editedSupplier?.DistrictMasterID ?? ""}
          onChange={(e) => {
            handleDistrictChange(e);
            setValue("districtMasterID", e.target.value);
          }}
          InputProps={{
            startAdornment: <LocationCity sx={{ color: "#1a472a", mr: 1 }} />,
          }}
        >
          <MenuItem value="" disabled>
            Select District
          </MenuItem>
          {districtList.map((option) => (
            <MenuItem key={option.ID} value={option.ID}>
              {option.DistrictName}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="City"
          {...register("cityMasterID")}
          error={!!errors.cityMasterID}
          helperText={errors.cityMasterID?.message}
          value={editedSupplier?.CityMasterID ?? ""}
          onChange={(e) => {
            handleCityChange(e);
            setValue("cityMasterID", e.target.value);
          }}
          InputProps={{
            startAdornment: <LocationCity sx={{ color: "#1a472a", mr: 1 }} />,
          }}
        >
          <MenuItem value="" disabled>
            Select City
          </MenuItem>
          {cityList.map((option) => (
            <MenuItem key={option.ID} value={option.ID}>
              {option.CityName}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Pin Code"
          {...register("pinCode")}
          error={!!errors.pinCode}
          helperText={errors.pinCode?.message}
          value={editedSupplier?.PinCode || ""}
          onChange={(e) => {
            handleChange("PinCode")(e);
            setValue("pinCode", e.target.value);
          }}
          InputProps={{
            startAdornment: <PinDrop sx={{ color: "#1a472a", mr: 1 }} />,
          }}
        />
        <TextField
          label="GST Number"
          {...register("gstNumber")}
          error={!!errors.gstNumber}
          helperText={errors.gstNumber?.message}
          value={editedSupplier?.GSTNumber || ""}
          onChange={(e) => {
            handleChange("GSTNumber")(e);
            setValue("gstNumber", e.target.value);
          }}
          InputProps={{
            startAdornment: <CreditCard sx={{ color: "#1a472a", mr: 1 }} />,
          }}
        />
        <TextField
          label="License Number"
          {...register("panNumber")}
          error={!!errors.panNumber}
          helperText={errors.panNumber?.message}
          value={editedSupplier?.PANNumber || ""}
          onChange={(e) => {
            handleChange("PANNumber")(e);
            setValue("panNumber", e.target.value);
          }}
          InputProps={{
            startAdornment: <AccountBox sx={{ color: "#1a472a", mr: 1 }} />,
          }}
        />
        <TextField
          label="UPI ID"
          {...register("upiId")}
          error={!!errors.upiId}
          helperText={errors.upiId?.message}
          value={editedSupplier?.UPIID || ""}
          onChange={(e) => {
            handleChange("UPIID")(e);
            setValue("upiId", e.target.value);
          }}
          InputProps={{
            startAdornment: (
              <AccountBalanceWallet sx={{ color: "#1a472a", mr: 1 }} />
            ),
          }}
        />
      </Box>
    </Grid>
  </Grid>
);

export default function SupplierDetailsDialog({
  dialogOpen,
  handleCloseDialog,
  supplierData,
  onUpdate,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSupplier, setEditedSupplier] = useState({});
  const [changedFields, setChangedFields] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
    customColor: "",
  });

  const [stateList, setStateList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [cityList, setCityList] = useState([]);

  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token ? token.replace(/"/g, "") : ""}`;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      supplierName: supplierData?.SupplierName || "",
      supplierType: supplierData?.SupplierType || "",
      email: supplierData?.Email || "",
      website: supplierData?.Website || "",
      gstNumber: supplierData?.GSTNumber || "",
      panNumber: supplierData?.PANNumber || "",
      bankName: supplierData?.BankName || "",
      branchAddress: supplierData?.BranchName || "",
      accountHolderName: supplierData?.AccountHolderName || "",
      accountNumber: supplierData?.AccountNumber || "",
      ifscCode: supplierData?.IFSCCode || "",
      upiId: supplierData?.UPIID || "",
      contactPerson: supplierData?.ContactPerson || "",
      whatsappNo: supplierData?.WhatsappNo || "",
      mobileNo1: supplierData?.MobileNo1 || "",
      mobileNo2: supplierData?.MobileNo2 || "",
      addressLine1: supplierData?.AddressLine1 || "",
      addressLine2: supplierData?.AddressLine2 || "",
      pinCode: supplierData?.PinCode || "",
      stateMasterID: supplierData?.StateMasterID || "",
      districtMasterID: supplierData?.DistrictMasterID || "",
      cityMasterID: supplierData?.CityMasterID || "",
    },
  });

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_URL}/api/state-master`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: sanctumToken,
            },
          }
        );
        setStateList(res.data);
      } catch (error) {
        // console.error("Error fetching states:", error);
      }
    };
    fetchStates();
  }, [sanctumToken]);

  // Fetch districts when StateMasterID changes
  useEffect(() => {
    if (editedSupplier.StateMasterID) {
      const fetchDistricts = async () => {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_URL}/api/districts/${editedSupplier.StateMasterID}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: sanctumToken,
              },
            }
          );
          setDistrictList(res.data.data);
        } catch (error) {
          // console.error("Error fetching districts:", error);
        }
      };
      fetchDistricts();
    } else {
      setDistrictList([]);
    }
  }, [editedSupplier.StateMasterID, sanctumToken]);

  // Reset DistrictMasterID if not in districtList
  useEffect(() => {
    if (
      editedSupplier.DistrictMasterID &&
      !districtList.some(
        (d) => String(d.ID) === String(editedSupplier.DistrictMasterID)
      )
    ) {
      setEditedSupplier((prev) => ({
        ...prev,
        DistrictMasterID: "",
        CityMasterID: "",
      }));
      setValue("districtMasterID", "");
      setValue("cityMasterID", "");
    }
    // eslint-disable-next-line
  }, [districtList]);

  // Fetch cities when DistrictMasterID changes
  useEffect(() => {
    if (editedSupplier.DistrictMasterID) {
      const fetchCities = async () => {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_URL}/api/cities/${editedSupplier.DistrictMasterID}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: sanctumToken,
              },
            }
          );
          setCityList(res.data.data);
        } catch (error) {
          // console.error("Error fetching cities:", error);
        }
      };
      fetchCities();
    } else {
      setCityList([]);
    }
  }, [editedSupplier.DistrictMasterID, sanctumToken]);

  // Reset CityMasterID if not in cityList
  useEffect(() => {
    if (
      editedSupplier.CityMasterID &&
      !cityList.some(
        (c) => String(c.ID) === String(editedSupplier.CityMasterID)
      )
    ) {
      setEditedSupplier((prev) => ({
        ...prev,
        CityMasterID: "",
      }));
      setValue("cityMasterID", "");
    }
    // eslint-disable-next-line
  }, [cityList]);

  useEffect(() => {
    if (supplierData) {
      // Validate district and city IDs against the current lists
      let validDistrict = supplierData?.DistrictMasterID;
      let validCity = supplierData?.CityMasterID;
      // Always reset if the list is empty
      if (districtList.length === 0) {
        validDistrict = "";
        validCity = "";
      } else if (
        validDistrict &&
        !districtList.some((d) => String(d.ID) === String(validDistrict))
      ) {
        validDistrict = "";
        validCity = "";
      }
      if (cityList.length === 0) {
        validCity = "";
      } else if (
        validCity &&
        !cityList.some((c) => String(c.ID) === String(validCity))
      ) {
        validCity = "";
      }
      setEditedSupplier({
        ...supplierData,
        DistrictMasterID: validDistrict,
        CityMasterID: validCity,
      });
      reset({
        supplierName: supplierData?.SupplierName || "",
        supplierType: supplierData?.SupplierType || "",
        email: supplierData?.Email || "",
        website: supplierData?.Website || "",
        gstNumber: supplierData?.GSTNumber || "",
        panNumber: supplierData?.PANNumber || "",
        bankName: supplierData?.BankName || "",
        branchAddress: supplierData?.BranchName || "",
        accountHolderName: supplierData?.AccountHolderName || "",
        accountNumber: supplierData?.AccountNumber || "",
        ifscCode: supplierData?.IFSCCode || "",
        upiId: supplierData?.UPIID || "",
        contactPerson: supplierData?.ContactPerson || "",
        whatsappNo: supplierData?.WhatsappNo || "",
        mobileNo1: supplierData?.MobileNo1 || "",
        mobileNo2: supplierData?.MobileNo2 || "",
        addressLine1: supplierData?.AddressLine1 || "",
        addressLine2: supplierData?.AddressLine2 || "",
        pinCode: supplierData?.PinCode || "",
        stateMasterID: supplierData?.StateMasterID || "",
        districtMasterID: validDistrict || "",
        cityMasterID: validCity || "",
      });
    }
    // eslint-disable-next-line
  }, [supplierData, reset, districtList, cityList]);

  const handleChange = (field) => (event) => {
    const newValue = event.target.value;
    if (supplierData[field] !== newValue) {
      setChangedFields((prev) => ({
        ...prev,
        [field]: true,
      }));
    } else {
      const updatedFields = { ...changedFields };
      delete updatedFields[field];
      setChangedFields(updatedFields);
    }
    setEditedSupplier((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  };

  const handleStateChange = (event) => {
    const value = event.target.value;
    setEditedSupplier((prev) => ({
      ...prev,
      StateMasterID: value,
      DistrictMasterID: "",
      CityMasterID: "",
    }));
    setChangedFields((prev) => ({
      ...prev,
      StateMasterID: true,
      DistrictMasterID: true,
      CityMasterID: true,
    }));
  };

  const handleDistrictChange = (event) => {
    const value = event.target.value;
    setEditedSupplier((prev) => ({
      ...prev,
      DistrictMasterID: value,
      CityMasterID: "",
    }));
    setChangedFields((prev) => ({
      ...prev,
      DistrictMasterID: true,
      CityMasterID: true,
    }));
  };

  const handleCityChange = (event) => {
    const value = event.target.value;
    setEditedSupplier((prev) => ({
      ...prev,
      CityMasterID: value,
    }));
    setChangedFields((prev) => ({
      ...prev,
      CityMasterID: true,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedSupplier({ ...supplierData });
    setChangedFields({});
  };

  const handleSave = async (data) => {
    const updatePayload = {
      SupplierName: data.supplierName,
      SupplierType: data.supplierType,
      ContactPerson: data.contactPerson,
      Email: data.email,
      MobileNo1: data.mobileNo1,
      MobileNo2: data.mobileNo2,
      WhatsappNo: data.whatsappNo,
      Website: data.website,
      AddressLine1: data.addressLine1,
      AddressLine2: data.addressLine2,
      StateMasterID: data.stateMasterID,
      DistrictMasterID: data.districtMasterID,
      CityMasterID: data.cityMasterID,
      PinCode: data.pinCode,
      GSTNumber: data.gstNumber,
      PANNumber: data.panNumber,
      BankName: data.bankName,
      AccountHolderName: data.accountHolderName,
      AccountNumber: data.accountNumber,
      IFSCCode: data.ifscCode,
      BranchName: data.branchAddress,
      UPIID: data.upiId,
    };

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_URL}/api/UpdateSupplier/${supplierData.SupplierID}`,
        updatePayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: sanctumToken,
          },
        }
      );
      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: response.data?.message || "Supplier updated successfully.",
          severity: "success",
          customColor: "#FFD600",
        });
        setIsEditing(false);
        if (onUpdate) onUpdate(); // Refresh supplier list after update
        handleCloseDialog();
      } else {
        setSnackbar({
          open: true,
          message: response.data?.message || "Failed to update supplier.",
          severity: "error",
          customColor: "#D32F2F",
        });
      }
    } catch (error) {
      if (error.response) {
        setSnackbar({
          open: true,
          message: error.response.data?.message || "Failed to update supplier.",
          severity: "error",
          customColor: "#D32F2F",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Failed to update supplier. Please try again.",
          severity: "error",
          customColor: "#D32F2F",
        });
      }
    }
  };

  const handleDelete = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_URL}/api/DeleteSupplier/${supplierData.SupplierID}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: sanctumToken,
          },
        }
      );
      if (onUpdate) onUpdate(); // Refresh supplier list after delete
      handleCloseDialog();
      setSnackbar({
        open: true,
        message: "Supplier deleted successfully.",
        severity: "success",
        customColor: "#388E3C", // green
      });
    } catch (error) {
      if (error.response && error.response.status === 403) {
        // Show dark orange message for already registered supplier
        setSnackbar({
          open: true,
          message:
            "This supplier is already registered with a quotation or invoice.",
          severity: "warning",
          customColor: "#FF6F00", //jjjhjhj
        });
      } else {
        setSnackbar({
          open: true,
          message: "Failed to delete supplier. Please try again.",
          severity: "error",
          customColor: "#D32F2F", // red
        });
      }
    }
  };

  return (
    <>
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          sx: {
            borderRadius: "8px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BusinessIcon />
            <Typography sx={{ color: "white", fontWeight: "bold" }}>
              {supplierData?.SupplierName || "Supplier Details"}
            </Typography>
          </Box>
          <IconButton
            onClick={handleCloseDialog}
            sx={{
              color: "white",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{ p: 3, backgroundColor: isEditing ? "#f5f5f5" : "white" }}
        >
          {isEditing ? (
            <form onSubmit={handleSubmit(handleSave)} noValidate>
              <EditMode
                editedSupplier={editedSupplier}
                handleChange={handleChange}
                stateList={stateList}
                districtList={districtList}
                cityList={cityList}
                handleStateChange={handleStateChange}
                handleDistrictChange={handleDistrictChange}
                handleCityChange={handleCityChange}
                register={register}
                errors={errors}
                setValue={setValue}
              />
              <DialogActions
                sx={{
                  p: 2,
                  backgroundColor: "#f5f5f5",
                  borderTop: "1px solid #1a472a",
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  type="submit"
                  sx={{ backgroundColor: "#1a472a" }}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CloseIcon />}
                  color="error"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </DialogActions>
            </form>
          ) : (
            <ViewMode supplierData={supplierData} />
          )}
        </DialogContent>
        {!isEditing && (
          <DialogActions
            sx={{
              p: 2,
              backgroundColor: "#f5f5f5",
              borderTop: "1px solid #1a472a",
            }}
          >
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              sx={{ mr: "auto" }}
            >
              Delete
            </Button>
            <Button
              variant="outlined"
              color="success"
              startIcon={<EditIcon />}
              onClick={handleEdit}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              startIcon={<CloseIcon />}
              onClick={handleCloseDialog}
            >
              Close
            </Button>
          </DialogActions>
        )}
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={8000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            backgroundColor: snackbar.customColor
              ? snackbar.customColor
              : snackbar.severity === "success"
                ? "#1a472a"
                : snackbar.severity === "error"
                  ? "#D32F2F"
                  : snackbar.severity === "warning"
                    ? "#FF9800"
                    : "#1a472a",
            color: "#fff",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
