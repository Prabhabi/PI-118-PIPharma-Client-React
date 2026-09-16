import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingComp from "./../../loadingComp/LoadingComp";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  ThemeProvider,
  createTheme,
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BusinessIcon from "@mui/icons-material/Business";
import ErrorComp from "../../error/ErrorComp";
import Cookies from "js-cookie"; // Import Cookies
const theme = createTheme({
  palette: {
    primary: {
      main: "#87CEEB",
    },
  },
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#0078cf", // changed from green
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: "#0078cf", // changed from green
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#0078cf", // changed from green
          },
        },
      },
    },
  },
});

const ToggleInputForm = ({ handleClose }) => {
  const [selectedField, setSelectedField] = useState("district");
  const [loading, setLoading] = useState(false);
  const [errora, setErrora] = useState(false);
  const [formData, setFormData] = useState({
    state: "",
    district: "",
    city: "",
  });

  const [selectedIds, setSelectedIds] = useState({
    stateId: "",
    districtId: "",
  });

  const [options, setOptions] = useState({
    state: [],
    district: [],
    city: [],
  });

  const [cities, setCities] = useState([]);

  const [additionalData, setAdditionalData] = useState({
    stateCode: "",
    tinNumber: "",
  });

  const [error, setError] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

  useEffect(() => {
    setLoading(true);
    // console.log("useEffect");

    const fetchData = async () => {
      try {
        const stateResponse = await axios.get(
          `${process.env.REACT_APP_URL}/api/state-master`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: sanctumToken,
            },
          }
        );
        setOptions((prevOptions) => ({
          ...prevOptions,
          state: stateResponse.data,
        }));

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
        setErrora(true);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (selectedIds.stateId) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_URL}/api/districts/${selectedIds.stateId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: sanctumToken,
              },
            }
          );
          setOptions((prevOptions) => ({
            ...prevOptions,
            district: response.data.data,
          }));
        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      }
    };

    fetchDistricts();
  }, [selectedIds.stateId]);

  useEffect(() => {
    setLoading(true);
    // console.log("useEffect2");

    const fetchCities = async () => {
      if (selectedIds.districtId) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_URL}/api/cities/${selectedIds.districtId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: sanctumToken,
              },
            }
          );
          // console.log(
          //   `${process.env.REACT_APP_URL}/api/cities/${selectedIds.districtId}`
          // );
          setOptions((prevOptions) => ({
            ...prevOptions,
            city: response.data.data,
          }));
          setLoading(false);
        } catch (error) {
          console.error("Error fetching cities:", error);
          setLoading(false);
        }
      }
    };

    fetchCities();
    setLoading(false);
  }, [selectedIds.districtId]);
  // console.log(selectedIds);

  const handleRadioChange = (event) => {
    setSelectedField(event.target.value);
    setError("");
    setIsSubmitDisabled(false);
  };
  const handleChangeAdd = (field) => (event) => {
    const value = event.target.value;
    setFormData({ ...formData, [field]: value });
    setError("");
    setIsSubmitDisabled(false);

    if (field === "state") {
      const selectedState = options.state.find(
        (option) => option.StateName.toLowerCase() === value.toLowerCase()
      );
      if (selectedState) {
        setSelectedIds({ ...selectedIds, stateId: selectedState.ID });
        setError("State name already exists");
        setIsSubmitDisabled(true);
      } else {
        setError("");
        setIsSubmitDisabled(false);
      }
    } else if (field === "district") {
      const selectedDistrict = options.district.find(
        (option) => option.DistrictName.toLowerCase() === value.toLowerCase()
      );
      if (selectedDistrict) {
        setSelectedIds({ ...selectedIds, districtId: selectedDistrict.ID });
        setError("District name already exists");
        setIsSubmitDisabled(true);
        setLoading(false); // Stop loading after matching district
      } else {
        setError("");
        setIsSubmitDisabled(false);
      }
    } else if (field === "city") {
      const selectedCity = options.city.find(
        (option) => option.CityName.toLowerCase() === value.toLowerCase()
      );
      if (selectedCity) {
        setSelectedIds({ ...selectedIds, cityId: selectedCity.ID });
        setError("City name already exists");
        setIsSubmitDisabled(true);
      } else {
        setError("");
        setIsSubmitDisabled(false);
      }
    }
  };
  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData({ ...formData, [field]: value });
    setError("");
    setIsSubmitDisabled(false);

    if (field === "state") {
      const selectedState = options.state.find(
        (option) => option.StateName.toLowerCase() === value.toLowerCase()
      );
      if (selectedState) {
        setSelectedIds({ ...selectedIds, stateId: selectedState.ID });
        // setError("State name already exists");
        // setIsSubmitDisabled(true);
      } else {
        setError("");
        setIsSubmitDisabled(false);
      }
    } else if (field === "district") {
      const selectedDistrict = options.district.find(
        (option) => option.DistrictName.toLowerCase() === value.toLowerCase()
      );
      if (selectedDistrict) {
        setSelectedIds({ ...selectedIds, districtId: selectedDistrict.ID });
        // setError("District name already exists");
        // setIsSubmitDisabled(true);
      } else {
        setError("");
        setIsSubmitDisabled(false);
      }
    } else if (field === "city") {
      const selectedCity = options.city.find(
        (option) => option.CityName.toLowerCase() === value.toLowerCase()
      );
      if (selectedCity) {
        setSelectedIds({ ...selectedIds, cityId: selectedCity.ID });
        // setError("City name already exists");
        // setIsSubmitDisabled(true);
      } else {
        setError("");
        setIsSubmitDisabled(false);
      }
    }
  };

  const handleAdditionalChange = (field) => (event) => {
    setAdditionalData({ ...additionalData, [field]: event.target.value });
  };

  const handleSubmit = () => {
    if (selectedField === "district" && !selectedIds.stateId) {
      setError("Please select a state before adding a district.");
      setIsSubmitDisabled(true);
      setError(true); // Add this line
      return;
    } else if (
      selectedField === "city" &&
      (!selectedIds.stateId || !selectedIds.districtId)
    ) {
      setError("Please select both state and district before adding a city.");
      setIsSubmitDisabled(true);
      setError(true); // Add this line
      return;
    }
    setLoading(true);
    // console.log("handleSubmit");
    const postData = async () => {
      try {
        if (selectedField === "district") {
          const finalData = {
            DistrictName: formData.district,
            StateMasterID: selectedIds.stateId,
          };
          // console.log(finalData);
          await axios.post(
            `${process.env.REACT_APP_URL}/api/postDistrictMaster`,
            finalData,
            {
              headers: {
                Authorization: sanctumToken,
              },
            }
          );
          setLoading(false); // Stop loading after district post request
        } else if (selectedField === "city") {
          const finalData = {
            CityName: formData.city,
            DistrictMasterID: selectedIds.districtId,
          };

          // console.log(finalData);
          await axios.post(
            `${process.env.REACT_APP_URL}/api/postCityMaster`,
            finalData,
            {
              headers: {
                Authorization: sanctumToken,
              },
            }
          );
          setLoading(false);
        }
        // console.log("Data submitted successfully");
        setLoading(false);
        setSnackbarOpen(true); // Show success message
        // Clear all ID values
        setSelectedIds({
          stateId: "",
          districtId: "",
        });
        setFormData({
          state: "",
          district: "",
          city: "",
        });
        setLoading(false);
      } catch (error) {
        console.error("Error submitting data:", error);
        setLoading(false); // Ensure loading is set to false in case of error
      }
    };

    postData();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const isDisabled = (field) => {
    if (selectedField === "district")
      return field !== "state" && field !== "district";
    return false;
  };
  // console.log(options);
  return (
    <ThemeProvider theme={theme}>
      <DialogTitle
        sx={{
          backgroundColor: "#0078cf", // changed from "#1b5e20"
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <BusinessIcon sx={{ color: "white" }} />
          Add Address Dependences
        </Box>
        <Box
          onClick={handleClose}
          sx={{
            cursor: "pointer",
            color: "white",
            "&:hover": { opacity: 0.8 },
          }}
        >
          ✕
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            textAlign: "left",
            position: "relative",
            // backgroundColor: "#e4f4ea",
          }}
        >
          <Box sx={{ p: 3, textAlign: "center", p: 10 }}>
            <FormControl component="fieldset">
              <RadioGroup
                row
                value={selectedField}
                onChange={handleRadioChange}
              >
                <FormControlLabel
                  value="district"
                  control={
                    <Radio
                      sx={{
                        "&.Mui-checked": {
                          color: "#0078cf", // changed from #2d4a37/green
                        },
                      }}
                    />
                  }
                  label="District"
                />
                <FormControlLabel
                  value="city"
                  control={
                    <Radio
                      sx={{
                        "&.Mui-checked": {
                          color: "#0078cf", // changed from #2d4a37/green
                        },
                      }}
                    />
                  }
                  label="City"
                />
              </RadioGroup>
            </FormControl>

            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              {Object.keys(formData).map((field) =>
                field === selectedField ? (
                  <TextField
                    key={field}
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={formData[field]}
                    onChange={handleChangeAdd(field)}
                    fullWidth
                    InputLabelProps={{
                      style: { color: "#0078cf" }, // changed from green
                    }}
                  />
                ) : (
                  <FormControl
                    fullWidth
                    key={field}
                    disabled={isDisabled(field)}
                  >
                    <InputLabel style={{ color: "#0078cf" }}>
                      {" "}
                      {/* changed from green */}
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </InputLabel>
                    <Select
                      value={formData[field]}
                      onChange={handleChange(field)}
                      label={field.charAt(0).toUpperCase() + field.slice(1)}
                      sx={{
                        textAlign: "left",
                        "& .MuiSelect-select": {
                          textAlign: "left",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#0078cf", // changed from green
                        },
                        ...(isDisabled(field) && {
                          bgcolor: "rgba(0, 0, 0, 0.1)",
                        }),
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            textAlign: "left",
                          },
                        },
                      }}
                    >
                      {options[field]?.map((option) => (
                        <MenuItem
                          key={option.ID}
                          value={
                            option.StateName ||
                            option.DistrictName ||
                            option.CityName
                          }
                        >
                          {option.StateName ||
                            option.DistrictName ||
                            option.CityName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )
              )}
            </Box>

            <Box
              sx={{ width: "100%", display: "flex", justifyContent: "center" }}
            >
              <Button
                variant="contained"
                sx={{
                  mt: 3,
                  bgcolor: "#0078cf", // changed from green
                  color: "white",
                  height: "50px",
                  width: "100px",
                }}
                onClick={handleSubmit}
                disabled={
                  isSubmitDisabled ||
                  (selectedField === "district" && !selectedIds.stateId) ||
                  (selectedField === "city" &&
                    (!selectedIds.stateId || !selectedIds.districtId))
                }
              >
                Submit
              </Button>
            </Box>
            {error && <Typography color="error">{error}</Typography>}
          </Box>
        </Box>
      </DialogContent>
      <LoadingComp loading={loading} />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Data submitted successfully!
        </Alert>
      </Snackbar>
      <ErrorComp error={errora} />
    </ThemeProvider>
  );
};

export default ToggleInputForm;
