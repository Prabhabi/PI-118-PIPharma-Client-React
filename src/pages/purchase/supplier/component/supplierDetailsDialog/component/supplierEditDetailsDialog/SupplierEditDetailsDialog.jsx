import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Cookies from "js-cookie"; // Import Cookies

import {
  TextField,
  Grid,
  Button,
  Paper,
  Typography,
  Box,
  Select,
  MenuItem,
  FormHelperText,
  InputLabel,
  FormControl,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import LoadingComp from "../../../../../../../components/loadingComp/LoadingComp";

// Define Yup schema for validation
const schema = yup.object().shape({
  supplierName: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value))
    .matches(/^[a-zA-Z0-9\s]+$/, "No special characters allowed")
    .required("Supplier Name is required"),
  supplierType: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value))
    .required("Supplier Type is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .nullable(true)
    .notRequired(),
  website: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value)),
  gstNumber: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value))
    .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, {
      message: "GST Number must be a valid 15-character GSTIN",
      excludeEmptyString: true,
    }),
  panNumber: yup.string().nullable(),

  bankName: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value)),
  branchAddress: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value)),
  accountHolderName: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value)),
  accountNumber: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value)),
  ifscCode: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value)),
  upiId: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value)),
  contactPerson: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value)),
  whatsappNo: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value))
    .matches(/^\d{0,10}$/, "WhatsApp No must be 10 digits"),
  mobileNo1: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value))
    .matches(/^\d{0,10}$/, "Mobile No. 1 must be 10 digits"),
  mobileNo2: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value))
    .matches(/^\d{0,10}$/, "Mobile No. 2 must be 10 digits"),
  addressLine1: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value)),
  addressLine2: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value)),
  pinCode: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value))
    .matches(/^\d{0,6}$/, "PIN Code must be 6 digits"),
  stateMasterID: yup.string().nullable(true).notRequired(),
  districtMasterID: yup.string().nullable(true).notRequired(),
  cityMasterID: yup.string().nullable(true).notRequired(),
});

const inputLabelProps = {
  sx: {
    backgroundColor: "white", // Prevents label overlap
    color: "darkgreen", // Change label color to darkgreen
    "&.Mui-focused": {
      color: "darkgreen", // Keep the label darkgreen when focused
    },
  },
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "white",
    borderRadius: "4px",
    "& fieldset": {
      border: "1px solid darkgreen", // Applies the darkgreen border
    },
    "&:hover fieldset": {
      border: "1px solid darkdarkgreen", // Dark darkgreen on hover (optional)
    },
    "&.Mui-focused fieldset": {
      border: "2px solid darkgreen", // Thicker border when focused
    },
  },
};

const SupplierEditDetailsDialog = ({
  fetchSuppliers,
  handleClose,
  fetchAllSupplier,
  initialValues, // Receive initialValues as a prop
}) => {
  const [stateList, setStateList] = useState([]);
  const [selectState, setSelectState] = useState(null);
  const [districtList, setDistrictList] = useState([]);
  const [selectdiscrict, setSelectDiscrict] = useState(null);
  const [cityList, setCityList] = useState([]);
  const [selectCity, setSelectCity] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const action = (
    <Button color="secondary" size="small" onClick={handleSnackbarClose}>
      UNDO
    </Button>
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    register,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      supplierName: "",
      supplierType: "",
      email: "",
      website: "",
      gstNumber: "",
      panNumber: "",
      bankName: "",
      branchName: "",
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "",
      upiId: "",
      contactPerson: "",
      whatsappNo: "",
      mobileNo1: "",
      mobileNo2: "",
      addressLine1: "",
      addressLine2: "",
      pinCode: "",
      stateMasterID: initialValues?.stateMasterID ?? "", // Ensure default to empty string
      cityMasterID: initialValues?.cityMasterID ?? "", // Ensure default to empty string
    },
  });

  // Handle form submission
  const onSubmit = async (data) => {
    if (Object.keys(errors).length > 0) {
      const requiredFields = Object.keys(errors)
        .map((key) => errors[key].message)
        .join(", ");
      setSnackbarMessage(
        `You need to fill the following fields before submitting: ${requiredFields}`
      );
      setOpenSnackbar(true);
      return;
    }
    setLoading(true);

    const token = Cookies.get("token"); // Get token from cookies
    const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;
    const finalData = {
      // branchName: data.branchAddress,
      ...data,
      stateID: selectState, // Add default values as required
      districtID: selectdiscrict,
      cityID: selectCity,
      active: 1,
      entryTimeStamp: "2024-12-06T14:30:00",
      orderByNo: 1,
      branchName: data.branchAddress,
    };

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_URL}/api/postSupplier`,
        finalData,

        {
          headers: {
            Authorization: sanctumToken,
          },
        }
      );
      reset(); // Reset the form
      fetchSuppliers && fetchSuppliers();
      fetchAllSupplier && fetchAllSupplier();
      setSnackbarMessage("Supplier details saved successfully");
      setOpenSnackbar(true); // Open Snackbar on success
      setLoading(false);
    } catch (error) {
      // console.error("Error submitting data:", error);
    }
  };
  const fetchStateFn = async () => {
    const token = Cookies.get("token"); // Get token from cookies
    const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

    const res = await axios.get(
      `${process.env.REACT_APP_URL}/api/state-master`,
      {
        headers: {
          Authorization: sanctumToken,
        },
      }
    );
    setStateList(res.data);
  };

  useEffect(() => {
    fetchStateFn();
  }, []);
  const fetchDistricts = async (state) => {
    const token = Cookies.get("token"); // Get token from cookies
    const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_URL}/api/districts/${state}`,
        {
          headers: {
            Authorization: sanctumToken,
          },
        }
      );
      setDistrictList(res.data.data);
    } catch (error) {
      // console.error("Error fetching districts:", error);
    }
  };

  const fetchCities = async (district) => {
    const token = Cookies.get("token"); // Get token from cookies
    const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_URL}/api/cities/${district}`,
        {
          headers: {
            Authorization: sanctumToken,
          },
        }
      );
      setCityList(res.data.data);
    } catch (error) {
      // console.error("Error fetching cities:", error);
    }
  };

  useEffect(() => {
    if (selectState) {
      fetchDistricts(selectState);
    }
  }, [selectState]);

  useEffect(() => {
    if (selectdiscrict) {
      fetchCities(selectdiscrict);
    }
  }, [selectdiscrict]);
  // console.log(selectdiscrict);

  const handleStateChange = (e) => {
    const newState = e.target.value;
    if (newState !== selectState) {
      setSelectState(newState);
    }
  };

  const handleDistrictChange = (e) => {
    const newDistrict = e.target.value;
    if (newDistrict !== selectdiscrict) {
      setSelectDiscrict(newDistrict);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper
          sx={{
            padding: 3,
            marginBottom: 3,
            backgroundColor: (theme) => theme.palette.background.main,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            Supplier Details
          </Typography>
          <Grid container spacing={2}>
            {/* <Grid item xs={12} sm={6}>
              <Controller
                name="supplierName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Supplier Name"
                    fullWidth
                    error={!!errors.supplierName}
                    helperText={errors.supplierName?.message}
                    sx={{
                      backgroundColor: "white",
                      border: "1px solid darkgreen",
                      borderRadius: "4px",
                    }}
                  />
                )}
              />
            </Grid> */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="supplierName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Supplier Name"
                    fullWidth
                    error={!!errors.supplierName}
                    helperText={errors.supplierName?.message}
                    InputLabelProps={inputLabelProps}
                    sx={inputSx}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                error={!!errors.supplierType}
                variant="outlined" // Ensure proper styling for the Select box
                sx={inputSx} // Apply inputSx here
              >
                <InputLabel id="supplier-type-label" sx={inputLabelProps.sx}>
                  Supplier Type
                </InputLabel>
                <Controller
                  name="supplierType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="supplier-type-label"
                      label="Supplier Type" // Important for proper layout
                      sx={inputSx} // Apply inputSx here
                    >
                      <MenuItem value="Company">Company</MenuItem>
                      <MenuItem value="Individual">Individual</MenuItem>
                    </Select>
                  )}
                />
                {errors.supplierType && (
                  <FormHelperText>{errors.supplierType.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    InputLabelProps={inputLabelProps}
                    sx={inputSx}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="website"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Website"
                    fullWidth
                    error={!!errors.website}
                    helperText={errors.website?.message}
                    InputLabelProps={inputLabelProps}
                    sx={inputSx}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="gstNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="GST Number"
                    fullWidth
                    error={!!errors.gstNumber}
                    helperText={errors.gstNumber?.message}
                    InputLabelProps={inputLabelProps}
                    sx={inputSx}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="panNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="License Number"
                    fullWidth
                    error={!!errors.panNumber}
                    helperText={errors.panNumber?.message}
                    InputLabelProps={inputLabelProps}
                    sx={inputSx}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper
          sx={{
            padding: 3,
            marginBottom: 3,
            backgroundColor: (theme) => theme.palette.background.main,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            Bank Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="bankName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Bank Name"
                    fullWidth
                    error={!!errors.bankName}
                    helperText={errors.bankName?.message}
                    InputLabelProps={inputLabelProps}
                    sx={inputSx}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="branchAddress"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Branch Address"
                    fullWidth
                    error={!!errors.branchAddress}
                    helperText={errors.branchAddress?.message}
                    InputLabelProps={inputLabelProps}
                    sx={inputSx}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="accountHolderName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Account Holder Name"
                    fullWidth
                    error={!!errors.accountHolderName}
                    helperText={errors.accountHolderName?.message}
                    InputLabelProps={inputLabelProps}
                    sx={inputSx}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="accountNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Account Number"
                    fullWidth
                    error={!!errors.accountNumber}
                    helperText={errors.accountNumber?.message}
                    InputLabelProps={inputLabelProps}
                    sx={inputSx}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="ifscCode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="IFSC Code"
                    fullWidth
                    error={!!errors.ifscCode}
                    helperText={errors.ifscCode?.message}
                    InputLabelProps={inputLabelProps}
                    sx={inputSx}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="upiId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="UPI ID"
                    fullWidth
                    error={!!errors.upiId}
                    helperText={errors.upiId?.message}
                    InputLabelProps={inputLabelProps}
                    sx={inputSx}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper
          sx={{
            padding: 3,
            marginBottom: 3,
            backgroundColor: (theme) => theme.palette.background.main,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            Communication Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="contactPerson"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Contact Person"
                    fullWidth
                    error={!!errors.contactPerson}
                    helperText={errors.contactPerson?.message}
                    InputLabelProps={inputLabelProps}
                    sx={inputSx}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="whatsappNo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="WhatsApp No"
                    fullWidth
                    error={!!errors.whatsappNo}
                    helperText={errors.whatsappNo?.message}
                    InputLabelProps={inputLabelProps}
                    sx={inputSx}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="mobileNo1"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Mobile No. 1"
                    fullWidth
                    error={!!errors.mobileNo1}
                    helperText={errors.mobileNo1?.message}
                    InputLabelProps={inputLabelProps}
                    sx={inputSx}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="mobileNo2"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Mobile No. 2"
                    fullWidth
                    error={!!errors.mobileNo2}
                    helperText={errors.mobileNo2?.message}
                    InputLabelProps={inputLabelProps}
                    sx={inputSx}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="addressLine1"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Address Line 1"
                    fullWidth
                    error={!!errors.addressLine1}
                    helperText={errors.addressLine1?.message}
                    InputLabelProps={inputLabelProps}
                    sx={inputSx}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="addressLine2"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Address Line 2"
                    fullWidth
                    error={!!errors.addressLine2}
                    helperText={errors.addressLine2?.message}
                    InputLabelProps={inputLabelProps}
                    sx={inputSx}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="stateMasterID"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    error={!!errors.stateID}
                    sx={inputSx} // Apply inputSx here
                  >
                    {" "}
                    <InputLabel sx={inputLabelProps.sx}>State</InputLabel>
                    <Select
                      {...field}
                      label="State"
                      onChange={(event) => {
                        field.onChange(event); // Notify React Hook Form about the change
                        handleStateChange(event); // Call your custom handler
                      }}
                      value={field.value} // Ensure the value is controlled
                      sx={inputSx} // Apply inputSx here
                    >
                      {stateList.map((item, index) => (
                        <MenuItem key={index} value={item?.ID}>
                          {item.StateName}
                        </MenuItem>
                      ))}
                    </Select>
                    {/* {errors.stateMasterID && (
                    <FormHelperText>{errors..message}</FormHelperText>
                  )} */}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="districtMasterID"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    error={!!errors.districtID}
                    sx={inputSx} // Apply inputSx here
                  >
                    <InputLabel sx={inputLabelProps.sx}>District</InputLabel>
                    <Select
                      {...field}
                      label="district"
                      value={field.value || ""} // Ensure the value is correctly handled
                      onChange={(e) => {
                        field.onChange(e); // Update the form state
                        setSelectDiscrict(e.target.value); // Set your custom state
                      }}
                      sx={inputSx} // Apply inputSx here
                    >
                      {districtList?.map((item) => (
                        <MenuItem key={item?.ID} value={item?.ID}>
                          {item?.DistrictName}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.districtID && (
                      <FormHelperText>
                        {errors.districtID.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="cityMasterID"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    error={!!errors.cityID}
                    sx={inputSx} // Apply inputSx here
                  >
                    <InputLabel sx={inputLabelProps.sx}>City</InputLabel>
                    <Select
                      {...field}
                      label="City"
                      onChange={(e) => {
                        field.onChange(e); // Update the form state
                        setSelectCity(e.target.value); // Update the custom state
                      }}
                      sx={inputSx} // Apply inputSx here
                    >
                      {cityList?.map((item) => (
                        <MenuItem key={item.ID} value={item.ID}>
                          {item.CityName}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.cityID && (
                      <FormHelperText>{errors.cityID.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="pinCode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="PIN Code"
                    fullWidth
                    error={!!errors.pinCode}
                    helperText={errors.pinCode?.message}
                    InputLabelProps={inputLabelProps}
                    sx={inputSx}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Paper>

        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
          <Button
            variant="contained"
            type="submit"
            sx={{ height: "50px", width: "150px" }}
          >
            Submit
          </Button>
        </Box>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        action={action}
      />
      <LoadingComp loading={loading} />
    </>
  );
};

export default SupplierEditDetailsDialog;
