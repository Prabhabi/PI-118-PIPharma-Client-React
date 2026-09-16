import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  Divider,
  InputLabel,
  Select,
  FormControl,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import useLocationState from "./useLocationState";
import axios from "axios";
import LoadingComp from "../../loadingComp/LoadingComp";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Cookies from "js-cookie"; // Import Cookies
import { useQueryClient } from "@tanstack/react-query";

const fieldsArr = [
  {
    title: "Company Details",
    icon: (
      <BusinessIcon sx={{ color: "#2e7d32", fontSize: 24, marginRight: 1 }} />
    ),
    fields: [
      {
        section: "companyDetails",
        label: "Company Name",
        field: "CompanyName",
      },
      {
        section: "companyDetails",
        label: "Phone No 1",
        field: "PhoneNumber1",
      },
      {
        section: "companyDetails",
        label: "Phone No 2",
        field: "PhoneNumber2",
      },
      {
        section: "companyDetails",
        label: "Company Email",
        field: "CompanyEmail",
      },
      {
        section: "companyDetails",
        label: "GST Number",
        field: "GSTNumber",
      },
    ],
  },
  {
    title: "Bank Details",
    icon: (
      <AccountBalanceIcon
        sx={{ color: "#2e7d32", fontSize: 24, marginRight: 1 }}
      />
    ),
    fields: [
      {
        section: "bankDetails",
        label: "Bank Name",
        field: "BankName",
      },
      {
        section: "bankDetails",
        label: "Account Holder Name",
        field: "AccountHolderName",
      },
      {
        section: "bankDetails",
        label: "Account Number",
        field: "AccountNumber",
      },
      {
        section: "bankDetails",
        label: "BranchName",
        field: "BranchName",
      },
      {
        section: "bankDetails",
        label: "IFSC Code",
        field: "IFSCCode",
      },
    ],
  },
  {
    title: "Address Details",
    icon: (
      <LocationOnIcon sx={{ color: "#2e7d32", fontSize: 24, marginRight: 1 }} />
    ),
    fields: [
      {
        section: "addressDetails",
        label: "Address Line 1",
        field: "AddressLine1",
      },
      {
        section: "addressDetails",
        label: "Address Line 2",
        field: "AddressLine2",
      },
      {
        section: "addressDetails",
        label: "State",
        field: "StateMasterID",
        type: "address",
      },
      {
        section: "addressDetails",
        label: "District",
        field: "DistrictMasterID",
        type: "address",
      },
      {
        section: "addressDetails",
        label: "City",
        field: "CityMasterID",
        type: "address",
      },
      {
        section: "addressDetails",
        label: "PIN Code",
        field: "PinCode",
      },
      {
        section: "addressDetails",
        label: "TIN Code",
        field: "TINCode",
      },
    ],
  },
];

// Yup validation schema
const validationSchema = Yup.object().shape({
  CompanyName: Yup.string().required("Company Name is required"),
});

const modernStyles = {
  pageContainer: {
    minHeight: "100vh",
    padding: "1rem",
    // backgroundColor: "#e8f5e9", // Clean, light green background
  },
  sectionCard: {
    backgroundColor: "#ffffff",
    padding: "1.5rem",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(46, 125, 50, 0.08)",
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 8px 30px rgba(46, 125, 50, 0.12)",
    },
  },
  formGrid: {
    backgroundColor: "#ffffff",
    padding: "1rem",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#1b5e20",
    marginBottom: "1rem",
  },
  textField: {
    "& .MuiOutlinedInput-root": {
      height: "3.5rem",
      fontSize: "1.1rem",
      backgroundColor: "#ffffff",
      transition: "all 0.2s",
      "&:hover": {
        backgroundColor: "#f1f8f1",
      },
      "&.Mui-focused": {
        backgroundColor: "#ffffff",
        boxShadow: "0 0 0 2px #2e7d32",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#2e7d32",
      fontSize: "1.1rem",
      fontWeight: 500,
    },
  },
  imageUploadBox: {
    backgroundColor: "#ffffff",
    padding: "1rem",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(46, 125, 50, 0.08)",
  },
  actionButton: {
    minWidth: "150px",
    height: "48px",
    fontSize: "1.1rem",
    fontWeight: 600,
    borderRadius: "8px",
    textTransform: "none",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(46, 125, 50, 0.2)",
  },
  submitButton: {
    backgroundColor: "#2e7d32",
    color: "#ffffff",
    "&:hover": {
      backgroundColor: "#1b5e20",
      boxShadow: "0 6px 16px rgba(46, 125, 50, 0.3)",
      transform: "translateY(-2px)",
    },
  },
  clearButton: {
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
    border: "2px solid #2e7d32",
    "&:hover": {
      backgroundColor: "#c8e6c9",
      borderColor: "#1b5e20",
      color: "#1b5e20",
      transform: "translateY(-2px)",
    },
  },
};

const CompanyCreateForm = ({ displayPageFn }) => {
  const [isEditable, setIsEditable] = useState(true); // Default to edit mode
  const [stateCode, setStateCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    companyDetails: {},
    bankDetails: {},
    addressDetails: {},
  });
  const [images, setImages] = useState({
    companyLogo: null,
    headerImage: null,
    sloganImage: null,
  });
  const [imagesfile, setImagesFile] = useState({
    companyLogo: null,
    headerImage: null,
    sloganImage: null,
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    register,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleSaveClick = () => {
    setIsEditable(false);
    console.log("Saved Data:", control.getValues());
  };

  const handleClearClick = () => {
    reset();
  };

  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;
  // ====================================================================submit ================
  const queryClient = useQueryClient();

  const onSubmit = async (data) => {
    setLoading(true);

    const finalArr = new FormData(); // Initialize FormData

    // Add all other fields to FormData
    for (const key in data) {
      if (data[key] instanceof FileList) {
        // Handle file uploads
        Array.from(data[key]).forEach((file) => finalArr.append(key, file));
      } else {
        // Add other data
        finalArr.append(key, data[key]);
      }
    }

    // Add additional keys explicitly
    finalArr.append("StateMasterID", +data.StateMasterID);
    finalArr.append("DistrictMasterID", +data.DistrictMasterID);
    finalArr.append("CityMasterID", +data.CityMasterID);
    finalArr.append("StateCodeID", +data.StateMasterID);
    finalArr.append("Active", 1);

    // Handle custom images if available
    if (imagesfile?.companyLogo) {
      finalArr.append("Image1", imagesfile.companyLogo);
    }
    if (images?.headerImage) {
      finalArr.append("Image2", imagesfile.headerImage);
    }
    if (images?.sloganImage) {
      finalArr.append("Image3", imagesfile.sloganImage);
    }

    console.log([...finalArr]); // Log the final data

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_URL}/api/postCompany`,
        finalArr,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Ensure proper content type
            Authorization: sanctumToken,
          },
        }
      );
      console.log(res.data); // Debug: Logs the response data
      setSnackbarMessage(res.data.message || "Company added successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setLoading(false);
      const queryKeys = [
        ["companyMasterApi"],

        // ==========================================
      ];

      const delay = 10; // milliseconds delay between each query

      queryKeys.forEach((key, index) => {
        setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: key,
            refetchType: "active",
          });
        }, index * delay);
      });
    } catch (err) {
      console.error(err.response?.data || err.message); // Handle errors
      setSnackbarMessage(err.response?.data?.message || "Error adding company");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const { state, dispatch, fetchDistricts, fetchCities } = useLocationState();

  const handleStateChange = (e) => {
    const newState = e.target.value;
    if (newState !== state.selectedState) {
      dispatch({ type: "SET_SELECTED_STATE", payload: newState });
      const stateData = state.stateList.find((i) => {
        return i.ID == newState;
      });
      setStateCode(stateCode?.StateCode);
    }
  };

  const handleDistrictChange = (e) => {
    const newDistrict = e.target.value;
    if (newDistrict !== state.selectedDistrict) {
      dispatch({ type: "SET_SELECTED_DISTRICT", payload: newDistrict });
    }
  };

  useEffect(() => {
    if (state.selectedState) {
      fetchDistricts(state.selectedState);
    }
  }, [state.selectedState]);

  useEffect(() => {
    if (state.selectedDistrict) {
      fetchCities(state.selectedDistrict);
    }
  }, [state.selectedDistrict]);
  console.log(errors);

  // ==============================================image ===================================
  // const handleInputChange = (section, field, value) => {
  //   setData((prevState) => ({
  //     ...prevState,
  //     [section]: {
  //       ...prevState[section],
  //       [field]: value,
  //     },
  //   }));
  // };

  const handleImageChange = (imageType, file) => {
    const reader = new FileReader();
    setImagesFile((p) => ({ ...p, [imageType]: file }));
    reader.onload = () => {
      setImages((prevImages) => ({
        ...prevImages,
        [imageType]: reader.result, // Store base64 encoded image
      }));
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleImageDrop = (imageType, e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) handleImageChange(imageType, file);
  };

  const handleImageClick = (imageType) => {
    document.getElementById(`file-input-${imageType}`).click();
  };

  return (
    <Box sx={modernStyles.pageContainer}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          color: "#1b5e20",
          fontWeight: 700,
          marginY: 4,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: "-10px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "60px",
            height: "4px",
            backgroundColor: "#2e7d32",
            borderRadius: "2px",
          },
        }}
      >
        Add New Company
      </Typography>

      <Box sx={modernStyles.pageContainer}>
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            {fieldsArr.map((section, index) => (
              <Box key={index} sx={modernStyles.sectionCard}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    color: "#1b5e20",
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {section.icon}
                  {section.title}
                </Typography>

                <Grid container spacing={2}>
                  {section.fields.map((fielda, idx) => (
                    <Grid item xs={12} sm={12} md={6} lg={4} key={idx}>
                      {fielda.type === "address" ? (
                        <>
                          <Controller
                            name={fielda.field}
                            control={control}
                            render={({ field }) => (
                              <FormControl
                                fullWidth
                                error={!!errors?.[field.field]}
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                      borderColor: "#2e7d32",
                                    },
                                    "&:hover fieldset": {
                                      borderColor: "#1b5e20",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "#2e7d32",
                                    },
                                  },
                                  "& .MuiInputLabel-root": {
                                    color: "#2e7d32",
                                    "&.Mui-focused": {
                                      color: "#2e7d32",
                                    },
                                  },
                                  "& .MuiSelect-icon": {
                                    color: "#2e7d32",
                                  },
                                }}
                              >
                                <InputLabel htmlFor={`${field.name}-select`}>
                                  {fielda.label}
                                </InputLabel>
                                <Select
                                  error={!!errors?.[fielda.field]}
                                  {...field}
                                  id={`${field.name}-select`}
                                  label={fielda.label}
                                  onChange={(event) => {
                                    field.onChange(event); // Notify React Hook Form about the change
                                    fielda.label === "State" &&
                                      handleStateChange(event); // Call your custom handler
                                    fielda.label === "District" &&
                                      handleDistrictChange(event); // Call your custom handler
                                  }}
                                  value={field.value || ""} // Ensure the value is controlled
                                >
                                  {fielda.label === "State" &&
                                    state.stateList.map((item, index) => (
                                      <MenuItem key={index} value={item?.ID}>
                                        {item.StateName}
                                      </MenuItem>
                                    ))}
                                  {fielda.label === "District" &&
                                    state.districtList.map((item, index) => (
                                      <MenuItem key={index} value={item?.ID}>
                                        {item.DistrictName}
                                      </MenuItem>
                                    ))}
                                  {fielda.label === "City" &&
                                    state.cityList.map((item, index) => (
                                      <MenuItem
                                        sx={{ color: "red" }}
                                        key={index}
                                        value={item?.ID}
                                      >
                                        {item.CityName}
                                      </MenuItem>
                                    ))}
                                </Select>
                                {
                                  <FormHelperText sx={{ color: "red" }}>
                                    {errors?.[fielda.field]?.message}{" "}
                                  </FormHelperText>
                                }
                              </FormControl>
                            )}
                          />
                        </>
                      ) : (
                        <Controller
                          key={idx}
                          control={control}
                          name={fielda.field}
                          render={({ field: controllerField }) => (
                            <TextField
                              {...controllerField}
                              label={fielda.label}
                              fullWidth
                              error={!!errors?.[fielda.field]}
                              helperText={errors?.[fielda.field]?.message}
                              sx={{
                                mb: 2,
                                "& .MuiOutlinedInput-root": {
                                  "& fieldset": {
                                    borderColor: "#2e7d32",
                                  },
                                  "&:hover fieldset": {
                                    borderColor: "#1b5e20",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#2e7d32",
                                  },
                                },
                                "& .MuiInputLabel-root": {
                                  color: "#2e7d32",
                                  "&.Mui-focused": {
                                    color: "#2e7d32",
                                  },
                                },
                                "& .MuiSelect-icon": {
                                  color: "#2e7d32",
                                },
                              }}
                            />
                          )}
                        />
                      )}
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </Grid>
        </Grid>
        <Grid container spacing={3} sx={{ mt: 4 }}>
          {/* Image upload sections */}
          <Grid item xs={12} md={4}>
            <Box
              sx={modernStyles.imageUploadBox}
              onClick={() => handleImageClick("companyLogo")}
              onDrop={(e) => handleImageDrop("companyLogo", e)}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={(e) => e.preventDefault()}
              style={{ cursor: "pointer" }}
            >
              <Typography sx={{ fontWeight: "bold", mb: 2 }}>
                Company Logo
              </Typography>
              <Box
                sx={{
                  height: "150px",
                  backgroundColor: "#eaf4fc",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  border: "2px dashed #2e7d32",
                  cursor: "pointer",
                  mb: 1,
                }}
              >
                <input
                  id="file-input-companyLogo"
                  type="file"
                  {...register("Image1")}
                  hidden
                  accept="image/jpeg, image/png, image/jpg, image/gif"
                  onChange={(e) =>
                    handleImageChange("companyLogo", e.target.files[0])
                  }
                />
                {images.companyLogo ? (
                  <img
                    src={images.companyLogo}
                    alt="Company Logo"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Typography
                    color="textSecondary"
                    sx={{ textAlign: "center" }}
                  >
                    Click or Drag & Drop to upload
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={modernStyles.imageUploadBox}
              onClick={() => handleImageClick("headerImage")}
              onDrop={(e) => handleImageDrop("headerImage", e)}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={(e) => e.preventDefault()}
              style={{ cursor: "pointer" }}
            >
              <Typography sx={{ fontWeight: "bold", mb: 2 }}>
                Header Image
              </Typography>
              <Box
                sx={{
                  height: "150px",
                  backgroundColor: "#eaf4fc",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  border: "2px dashed #2e7d32",
                  cursor: "pointer",
                  mb: 1,
                }}
              >
                <input
                  id="file-input-headerImage"
                  type="file"
                  {...register("Image2")}
                  hidden
                  accept="image/*"
                  onChange={(e) =>
                    handleImageChange("headerImage", e.target.files[0])
                  }
                />
                {images.headerImage ? (
                  <img
                    src={images.headerImage}
                    alt="Header Image"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Typography
                    color="textSecondary"
                    sx={{ textAlign: "center" }}
                  >
                    Click or Drag & Drop to upload
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={modernStyles.imageUploadBox}
              onClick={() => handleImageClick("sloganImage")}
              onDrop={(e) => handleImageDrop("sloganImage", e)}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={(e) => e.preventDefault()}
              style={{ cursor: "pointer" }}
            >
              <Typography sx={{ fontWeight: "bold", mb: 2 }}>
                Slogan Image
              </Typography>
              <Box
                sx={{
                  height: "150px",
                  backgroundColor: "#eaf4fc",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  border: "2px dashed #2e7d32",
                  cursor: "pointer",
                  mb: 1,
                }}
              >
                <input
                  id="file-input-sloganImage"
                  type="file"
                  {...register("Image3")}
                  hidden
                  accept="image/*"
                  onChange={(e) =>
                    handleImageChange("sloganImage", e.target.files[0])
                  }
                />
                {images.sloganImage ? (
                  <img
                    src={images.sloganImage}
                    alt="Slogan Image"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Typography
                    color="textSecondary"
                    sx={{ textAlign: "center" }}
                  >
                    Click or Drag & Drop to upload
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box
          sx={{
            mt: 6,
            mb: 4,
            display: "flex",
            justifyContent: "center",
            gap: 3,
          }}
        >
          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            sx={{ ...modernStyles.actionButton, ...modernStyles.submitButton }}
          >
            Submit
          </Button>
          <Button
            variant="outlined"
            onClick={handleClearClick}
            sx={{ ...modernStyles.actionButton, ...modernStyles.clearButton }}
          >
            Clear
          </Button>
        </Box>
      </Box>

      <LoadingComp loading={loading} />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CompanyCreateForm;
