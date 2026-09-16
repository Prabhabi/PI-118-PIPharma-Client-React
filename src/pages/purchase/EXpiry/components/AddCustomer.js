import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  Grid,
  InputLabel,
  FormControl,
  Paper,
  FormHelperText,
  Snackbar,
  IconButton,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import LoadingComp from "../../../../components/loadingComp/LoadingComp";
import Cookies from "js-cookie";
import { stateMasterApiFn } from "../../../../api/commonApi";
import { useQuery } from "@tanstack/react-query";

const fields = {
  basic: ["addharCard", "panCard", "companyName", "gstNumber"],
  contact: ["firstName", "lastName", "phoneNo", "whatsappNo", "email"],
  address: [
    "addressLine1",
    "addressLine2",
    "cityID",
    "districtID",
    "stateID",
    "pinCode",
  ],
};

const customerTypes = ["individual", "business"];
const genders = ["male", "female", "other"];

const validationSchema = yup.object().shape({
  addharCard: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value))
    .matches(/^\d{0,16}$/, "Aadhar Card must be up to 16 digits"),
  panCard: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value))
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, {
      message: "Invalid PAN format",
      excludeEmptyString: true,
    }),
  companyName: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value))
    .matches(/^[a-zA-Z0-9\s\-\.,]*$/, "No special characters allowed"),
  gstNumber: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value))
    .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, {
      message: "GST Number must be a valid 15-character GSTIN",
      excludeEmptyString: true,
    }),
  customerType: yup.string().nullable(true).notRequired(),
  firstName: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value))
    .matches(/^[a-zA-Z0-9\s\-\.,]+$/, "No special characters allowed")
    .required("First Name is required"),
  lastName: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value))
    .matches(/^[a-zA-Z0-9\s\-\.,]+$/, "No special characters allowed")
    .required("Last Name is required"),
  phoneNo: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value))
    .matches(/^\d{0,10}$/, "Phone No must be 10 digits"),
  whatsappNo: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value))
    .matches(/^\d{0,10}$/, "WhatsApp No must be 10 digits"),
  email: yup
    .string()
    .email("Invalid email format")
    .nullable(true)
    .notRequired(),
  addressLine1: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value))
    .matches(/^[a-zA-Z0-9\s\-\.,]*$/, "No special characters allowed"),
  addressLine2: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value))
    .matches(/^[a-zA-Z0-9\s\-\.,]*$/, "No special characters allowed"),
  cityID: yup.string().nullable(true).notRequired(),
  districtID: yup.string().nullable(true).notRequired(),
  stateID: yup.string().nullable(true).notRequired(),
  pinCode: yup
    .string()
    .nullable()
    .transform((value) => (value === null ? "" : value))
    .matches(/^\d{0,6}$/, "PIN Code must be 6 digits"),
  dateOfBirth: yup.string().nullable(true).notRequired(),
  gender: yup.string().nullable(true).notRequired(),
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
    "& input": {
      color: "#000", // Change text color to black
    },
  },
  "& .MuiInputLabel-root": {
    color: "darkgreen",
    "&.Mui-focused": {
      color: "darkgreen",
    },
  },
  "& .MuiFormLabel-root": {
    color: "darkgreen",
    "&.Mui-focused": {
      color: "darkgreen",
    },
  },
  "& .MuiInputBase-input": {
    color: "#000", // Ensure text color is black
  },
  "& .Mui-focused .MuiInputLabel-root": {
    color: "darkgreen", // Ensure label color is correct when focused
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "darkgreen", // Ensure border color is correct when focused
  },
  // Styles for all dropdown sections
  "& .MuiSelect-root": {
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "darkgreen",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "darkgreen",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "darkgreen",
    },
    "& .MuiInputBase-input": {
      color: "#000", // Change text color to black for visibility
    },
  },
  "& .MuiSelect-select": {
    color: "darkgreen", // Change selected option text color to black
  },
};

const CustomerMaster = ({
  fetchAllCustomer,
  handleCloseAddDialog,
  fetchCustomer,
}) => {
  // const [stateList, setStateList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [selectState, setSelectState] = useState(null);
  const [selectDistrict, setSelectDistrict] = useState(null);
  const [selectCity, setSelectCity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      addharCard: "",
      panCard: "",
      companyName: "",
      gstNumber: "",
      firstName: "",
      lastName: "",
      phoneNo: "",
      whatsappNo: "",
      email: "",
      addressLine1: "",
      addressLine2: "",
      cityID: "",
      districtID: "",
      stateID: "",
      pinCode: "",
      customerType: "",
      gender: "",
      dateOfBirth: "",
    },
    resolver: yupResolver(validationSchema),
  });

  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

  // const fetchStates = async () => {
  //   try {
  //     const res = await axios.get(
  //       `${process.env.REACT_APP_URL}/api/state-master`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: sanctumToken,
  //         },
  //       }
  //     );
  //     setStateList(res.data);
  //   } catch (error) {
  //     console.error("Error fetching states:", error);
  //   }
  // };
  const { data, isLoading, error } = useQuery({
    queryKey: ["stateMasterApi"],
    queryFn: stateMasterApiFn,
    staleTime: Infinity,
  });
  const stateList = data?.data;

  const fetchDistricts = async (state) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_URL}/api/districts/${state}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: sanctumToken,
          },
        }
      );
      setDistrictList(res.data.data);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };
  const fetchCities = async (district) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_URL}/api/cities/${district}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: sanctumToken,
          },
        }
      );
      setCityList(res.data.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const renderTextField = (label, name, type = "text") => (
    <Grid item xs={12} sm={6}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={label}
            type={
              ["addharCard", "phoneNo", "whatsappNo", "pinCode"].includes(name)
                ? "number"
                : type
            }
            fullWidth
            error={!!errors[name]}
            helperText={errors[name]?.message}
            onInput={
              ["addharCard", "phoneNo", "whatsappNo", "pinCode"].includes(name)
                ? handleNumberInput
                : undefined
            }
            sx={{
              ...inputStyles,
              ...(["addharCard", "phoneNo", "whatsappNo", "pinCode"].includes(
                name
              )
                ? removeNumberInputArrows
                : {}),
              "& input": {
                color: "#000", // Change text color to black for all input fields
              },
            }}
            InputLabelProps={{
              shrink: true,
            }}
            placeholder={name === "dateOfBirth" ? "dd-mm-yyyy" : ""}
          />
        )}
      />
    </Grid>
  );

  const renderSelectField = (label, name, options) => (
    <Grid item xs={12} sm={6}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors[name]} sx={inputStyles}>
            <InputLabel>{label}</InputLabel>
            <Select {...field} label={label}>
              {options.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors[name]?.message}</FormHelperText>
          </FormControl>
        )}
      />
    </Grid>
  );

  // useEffect(() => {
  //   fetchStates();
  // }, []);

  useEffect(() => {
    if (selectState) fetchDistricts(selectState);
  }, [selectState]);

  useEffect(() => {
    if (selectDistrict) fetchCities(selectDistrict);
  }, [selectDistrict]);

  const handleStateChange = (e) => setSelectState(e.target.value);
  const handleDistrictChange = (e) => setSelectDistrict(e.target.value);
  const handleCityChange = (e) => setSelectCity(e.target.value);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // console.log(token);
      // console.log("Token from cookies:", token); // Debugging step
      // if (!token) {
      //   console.error("Token not found in cookies");
      //   setLoading(false);
      //   return;
      // }
      const token = Cookies.get("token"); // Get token from cookies
      console.log(token);
      const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;
      console.log("Sanctum Token:", sanctumToken);

      // Map form data into the required format for the POST request
      const finalData = {
        FirstName: data.firstName,
        LastName: data.lastName,
        MobileNumber: data.phoneNo,
        Gender: data.gender.charAt(0).toUpperCase() + data.gender.slice(1), // Capitalize gender
        AddressLine1: data.addressLine1,
        AddressLine2: data.addressLine2,
        DistrictMasterID: parseInt(selectDistrict, 10),
        StateMasterID: parseInt(selectState, 10),
        CityMasterID: parseInt(selectCity, 10),
        PinCode: parseInt(data.pinCode, 10),
        CompanyName: data.companyName,
        GSTNumber: data.gstNumber,
        CustomerType:
          data.customerType.charAt(0).toUpperCase() +
          data.customerType.slice(1), // Capitalize customer type
        Email: data.email,
        WhatsappNo: data.whatsappNo,
        DateOfBirth: data.dateOfBirth,
        AadharNo: data.addharCard,
        PANCard: data.panCard,
        OrderByNo: 1, // Fixed value
        Active: 1, // Fixed value
      };
      console.log("Final Data to be sent:", finalData);
      // Send the data to the API
      const res = await axios.post(
        `${process.env.REACT_APP_URL}/api/postCustomers`,
        finalData,
        {
          headers: {
            Authorization: sanctumToken,
          },
        }
      );
      fetchAllCustomer && fetchAllCustomer();
      console.log("Response Data:", res.data);
      setLoading(false);
      // handleCloseAddDialog && handleCloseAddDialog();
      fetchCustomer && fetchCustomer();

      // Show success message
      setSnackbarOpen(true);
      reset(); // Reset form fields after successful submission
    } catch (error) {
      console.error("Error submitting customer data:", error);
      console.error("Error details:", error.response?.data);
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  // Render function remains unchanged
  console.log(errors);

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: "10px",
        minHeight: "100vh",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container sx={{ gap: "1rem" }}>
          {/* Customer Information Section */}

          {/* Customer Details Section */}
          <Grid item xs={12} md={12}>
            <Paper
              sx={{
                padding: "15px",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: "#000",
                  fontWeight: "bold",
                  marginBottom: "15px",
                }}
              >
                Customer Details
              </Typography>
              <Grid container spacing={2}>
                {fields.contact.map((field) =>
                  renderTextField(
                    field.replace(/([A-Z])/g, " $1").toUpperCase(),
                    field,
                    field === "email" ? "email" : "text"
                  )
                )}
                {renderSelectField("Gender", "gender", genders)}
                {renderTextField("Date of Birth", "dateOfBirth", "date", {
                  InputProps: {
                    style: {
                      color: "green", // Changes the text color inside the input field
                      fontSize: "16px", // You can change the font size if you need
                    },
                  },
                })}
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={12}>
            <Paper
              sx={{
                padding: "15px",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: "#000",
                  fontWeight: "bold",
                  marginBottom: "15px",
                }}
              >
                Customer Information
              </Typography>
              <Grid container spacing={2}>
                {fields.basic.map((field) =>
                  renderTextField(
                    field.replace(/([A-Z])/g, " $1").toUpperCase(),
                    field
                  )
                )}
                {renderSelectField(
                  "Customer Type",
                  "customerType",
                  customerTypes
                )}
              </Grid>
            </Paper>
          </Grid>

          {/* Address Section */}
          {/* Address Section */}
          <Grid item xs={12} md={12}>
            <Paper
              sx={{
                padding: "15px",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#000",
                  fontWeight: "bold",
                  marginBottom: "15px",
                }}
              >
                Address Details
              </Typography>
              <Grid container spacing={2}>
                {/* Render Additional Fields */}
                {fields.address.map((field) =>
                  ["addressLine1", "addressLine2"].includes(field)
                    ? renderTextField(
                        field.replace(/([A-Z])/g, " $1").toUpperCase(),
                        field
                      )
                    : null
                )}
                {/* State */}
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="stateID"
                    control={control}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        error={!!errors.stateID}
                        sx={inputStyles}
                      >
                        <InputLabel>State</InputLabel>
                        <Select
                          {...field}
                          value={field.value || ""} // Ensure value is set
                          label="State"
                          onChange={(e) => {
                            field.onChange(e); // React Hook Form updates
                            handleStateChange(e); // Trigger additional updates
                          }}
                        >
                          {stateList?.map((item) => (
                            <MenuItem value={item?.ID} key={item?.ID}>
                              {item?.StateName}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.stateID && (
                          <FormHelperText>
                            {errors.stateID.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>

                {/* District */}
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="districtID"
                    control={control}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        error={!!errors.districtID}
                        sx={inputStyles}
                      >
                        <InputLabel>District</InputLabel>
                        <Select
                          {...field}
                          value={field.value || ""} // Ensure value is set
                          label="District"
                          onChange={(e) => {
                            field.onChange(e); // React Hook Form updates
                            handleDistrictChange(e); // Trigger additional updates
                          }}
                        >
                          {districtList?.map((item) => (
                            <MenuItem value={item?.ID} key={item?.ID}>
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

                {/* City */}
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="cityID"
                    control={control}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        error={!!errors.cityID}
                        sx={inputStyles}
                      >
                        <InputLabel>City</InputLabel>
                        <Select
                          {...field}
                          value={field.value || ""} // Ensure value is set correctly
                          label="City"
                          onChange={(e) => {
                            field.onChange(e); // React Hook Form updates
                            handleCityChange(e); // Trigger additional updates
                          }}
                        >
                          {cityList?.map((item) => (
                            <MenuItem value={item?.ID} key={item?.ID}>
                              {item?.CityName}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.cityID && (
                          <FormHelperText>
                            {errors.cityID.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                {fields.address.map((field) =>
                  ![
                    "addressLine1",
                    "addressLine2",
                    "stateID",
                    "districtID",
                    "cityID",
                  ].includes(field)
                    ? renderTextField(
                        field.replace(/([A-Z])/g, " $1").toUpperCase(),
                        field
                      )
                    : null
                )}
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        {/* Button Panel */}
        <Box sx={{ textAlign: "center", marginTop: "20px" }}>
          <Button
            variant="contained"
            color="primary"
            type="submit" // This triggers the form submission
            startIcon={<AddIcon />}
            sx={{
              height: "3rem",
              textTransform: "none",
            }}
          >
            Add cusomer
          </Button>
          {/* <Button
            variant="contained"
            color="error"
            onClick={() => reset()} // Clears the form fields
            startIcon={<ClearIcon />}
          >
            Clear
          </Button> */}
        </Box>
        <LoadingComp loading={loading} />
      </form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Customer added successfully"
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleSnackbarClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
};

export default CustomerMaster;
