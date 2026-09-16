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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import LoadingComp from "../../../../components/loadingComp/LoadingComp";

const schema = yup.object().shape({
  DoctorName: yup
    .string()
    .required("Contact Person is required")
    .matches(/^[a-zA-Z0-9\s]+$/, "No special characters allowed"),
  GSTNumber: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value)),
  // .matches(
  //   /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  //   "GST Number must be a valid 15-character GSTIN",
  //{ excludeEmptyString: true }
  //),
  AadharNumber: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value))
    .matches(/^\d{0,16}$/, "Mobile No. must be 16 digits"),
  ContactPerson: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value))
    .matches(/^[a-zA-Z0-9\s]*$/, "No special characters allowed"),
  PANNumber: yup.string(),
  Email: yup.string().email("Invalid email"),
  BankName: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value))
    .matches(/^[a-zA-Z0-9\s]*$/, "No special characters allowed"),
  AccountHolderName: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value))
    .matches(/^[a-zA-Z0-9\s]*$/, "No special characters allowed"),
  AccountNumber: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value))
    .matches(/^\d*$/, "Account Number must contain only digits"),
  IFSCCode: yup.string(),
  BranchName: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value))
    .matches(/^[a-zA-Z0-9\s]*$/, "No special characters allowed"),
  UPIID: yup.string(),
  MobileNo1: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value))
    .matches(/^\d{0,10}$/, "Mobile No. must be 10 digits"),
  MobileNo2: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value))
    .matches(/^\d{0,10}$/, "Mobile No. must be 10 digits"),
  AddressLine1: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value))
    .matches(/^[a-zA-Z0-9\s]*$/, "No special characters allowed"),
  AddressLine2: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value))
    .matches(/^[a-zA-Z0-9\s]*$/, "No special characters allowed"),
  StateMasterID: yup.number(),
  DistrictMasterID: yup.number(),
  CityMasterID: yup.number(),
  PinCode: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value))
    .matches(/^\d{0,6}$/, "PIN Code must be 6 digits"),
});

const DelerEditDetailsDialog = ({
  fetchDealers,

  fetchallSubDealer,
  type,
}) => {
  const [stateList, setStateList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [selectState, setSelectState] = useState(null);
  const [selectDistrict, setSelectDistrict] = useState(null);
  const [selectCity, setSelectCity] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
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
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      DoctorName: "",
      Gender: "",
      DateOfBirth: "",
      Qualification: "",
      Specialization: "",
      Email: "",
      PhoneNumber: "",
      AlternatePhoneNumber: "",
      AddressLine1: "",
      AddressLine2: "",
      Pincode: "",
      RegistrationNumber: "",
      ExperienceInYears: "",
    },
  });

  const handleNumberInput = (e) => {
    const value = e.target.value.replace(/-/g, "");
    e.target.value = value;
  };

  const removeNumberInputArrows = {
    "& input[type=number]": {
      "-moz-appearance": "textfield",
    },
    "& input[type=number]::-webkit-outer-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
    "& input[type=number]::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
  };

  const inputStyles = {
    backgroundColor: "#fff",
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
      color: "darkgreen",
      "&.Mui-focused": {
        color: "darkgreen",
      },
    },
  };

  const onSubmit = async (data) => {
    setLoading(true);

    const token = Cookies.get("token"); // Get token from cookies
    const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

    const finalData = {
      ...data,
      DealerID: 0,
      StateMasterID: selectState,
      DistrictMasterID: selectDistrict,
      CityMasterID: selectCity,
      // Active: 1,
      // EntryTimeStamp: "2024-12-06T14:30:00",
      // OrderByNo: 1,
    };

    // Log the payload before posting
    console.log("Payload to be posted:", finalData);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_URL}/api/InsertDoctor`,
        {
          DoctorName: "Dr. Ananya Sen",
          Gender: null,
          DateOfBirth: null,
          Qualification: null,
          Specialization: null,
          Email: null,
          PhoneNumber: null,
          AlternatePhoneNumber: null,
          AddressLine1: null,
          AddressLine2: null,
          Pincode: null,
          RegistrationNumber: null,
          ExperienceInYears: null,
        },
        {
          headers: {
            Authorization: sanctumToken,
          },
        }
      );
      type == "invoice" && fetchallSubDealer();
      type == "main" && fetchDealers();
      setOpenSnackbar(true); // Open Snackbar on success
      reset();
      setLoading(false);
    } catch (error) {
      console.error("Error submitting data:", error);
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
    if (selectDistrict) {
      fetchCities(selectDistrict);
    }
  }, [selectDistrict]);

  const handleStateChange = (e) => setSelectState(e.target.value);
  const handleDistrictChange = (e) => setSelectDistrict(e.target.value);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper sx={{ padding: 3, marginBottom: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            Doctor Identity
          </Typography>
          <Grid container spacing={2}>
            {[
              { name: "DoctorName", label: "Doctor Name" },
              { name: "Gender", label: "Gender" },
              { name: "DateOfBirth", label: "Date of Birth", type: "date" },
              { name: "Qualification", label: "Qualification" },
              { name: "Specialization", label: "Specialization" },
              { name: "Email", label: "E-Mail" },
              { name: "PhoneNumber", label: "Phone Number" },
              { name: "AlternatePhoneNumber", label: "Alternate Phone Number" },
              { name: "RegistrationNumber", label: "Registration Number" },
              {
                name: "ExperienceInYears",
                label: "Experience (Years)",
                type: "number",
              },
            ].map(({ name, label, type }) => (
              <Grid item xs={12} sm={6} key={name}>
                <Controller
                  name={name}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={label}
                      type={type || "text"}
                      fullWidth
                      error={!!errors[name]}
                      helperText={errors[name]?.message}
                      InputLabelProps={
                        type === "date" ? { shrink: true } : undefined
                      }
                      sx={inputStyles}
                    />
                  )}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>

        <Paper sx={{ padding: 3, marginBottom: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            Address Information
          </Typography>
          <Grid container spacing={2}>
            {[
              { name: "AddressLine1", label: "Address Line 1" },
              { name: "AddressLine2", label: "Address Line 2" },
              { name: "Pincode", label: "Pincode" },
            ].map(({ name, label, type }) => (
              <Grid item xs={12} sm={6} key={name}>
                <Controller
                  name={name}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={label}
                      type={type || "text"}
                      fullWidth
                      error={!!errors[name]}
                      helperText={errors[name]?.message}
                      sx={inputStyles}
                    />
                  )}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>

        <Box sx={{ textAlign: "center", marginTop: 3 }}>
          <Button type="submit" variant="contained" sx={{ marginRight: 2 }}>
            Submit
          </Button>
        </Box>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message="Doctor has been successfully created"
          action={action}
        />
      </form>
      <LoadingComp loading={loading} />
    </>
  );
};

export default DelerEditDetailsDialog;
