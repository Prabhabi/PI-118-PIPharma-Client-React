import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Button,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  TextField,
  Box,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Home as HomeIcon,
  LocationOn as LocationOnIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Cake as CakeIcon,
  Map as MapIcon,
  LocationCity as LocationCityIcon,
  PinDrop as PinDropIcon,
  Fingerprint as FingerprintIcon,
  CreditCard as CreditCardIcon,
  Wc as WcIcon,
  WhatsApp as WhatsAppIcon,
  NotInterested as NotInterestedIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import axios from "axios";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import { stateMasterApiFn } from "../../../../api/commonApi";

const ViewMode = ({ customer, stateList, districtList, cityList }) => {
  // Find names by ID
  const stateName =
    stateList.find((s) => s.ID === customer?.StateMasterID)?.StateName || "--";
  const districtName =
    districtList.find((d) => d.ID === customer?.DistrictMasterID)
      ?.DistrictName || "--";
  const cityName =
    cityList.find((c) => c.ID === customer?.CityMasterID)?.CityName || "--";

  return (
    <Grid container spacing={4}>
      <Grid item xs={6}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h6">Basic Details</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FingerprintIcon sx={{ color: "#1a472a" }} />
            <Typography>Customer ID: {customer?.CustomerID || "--"}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <HomeIcon sx={{ color: "#1a472a" }} />
            <Typography>
              Company Name: {customer?.CompanyName || "--"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CreditCardIcon sx={{ color: "#1a472a" }} />
            <Typography>GST Number: {customer?.GSTNumber || "--"}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <NotInterestedIcon sx={{ color: "#1a472a" }} />
            <Typography>
              Customer Type: {customer?.CustomerType || "--"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <WcIcon sx={{ color: "#1a472a" }} />
            <Typography>First Name: {customer?.FirstName || "--"}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <WcIcon sx={{ color: "#1a472a" }} />
            <Typography>Last Name: {customer?.LastName || "--"}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PhoneIcon sx={{ color: "#1a472a" }} />
            <Typography>
              Mobile Number: {customer?.MobileNumber || "--"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <EmailIcon sx={{ color: "#1a472a" }} />
            <Typography>Email: {customer?.Email || "--"}</Typography>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h6">Address Details</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocationOnIcon sx={{ color: "#1a472a" }} />
            <Typography>State: {stateName}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <MapIcon sx={{ color: "#1a472a" }} />
            <Typography>District: {districtName}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocationCityIcon sx={{ color: "#1a472a" }} />
            <Typography>City: {cityName}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PinDropIcon sx={{ color: "#1a472a" }} />
            <Typography>Pin Code: {customer?.PinCode || "--"}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FingerprintIcon sx={{ color: "#1a472a" }} />
            <Typography>Aadhar Number: {customer?.AadharNo || "--"}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CreditCardIcon sx={{ color: "#1a472a" }} />
            <Typography>PAN Card: {customer?.PANCard || "--"}</Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

const EditMode = ({
  editableCustomer,
  handleInputChange,
  stateList,
  districtList,
  cityList,
  handleStateChange,
  handleDistrictChange,
  handleCityChange,
}) => (
  <Grid container spacing={4}>
    <Grid item xs={6}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h6">Basic Details</Typography>
        <TextField
          label="Company Name"
          value={editableCustomer?.CompanyName || ""}
          onChange={handleInputChange("CompanyName")}
          InputProps={{
            startAdornment: <HomeIcon sx={{ color: "#1a472a", mr: 1 }} />,
          }}
        />
        <TextField
          label="GST Number"
          value={editableCustomer?.GSTNumber || ""}
          onChange={handleInputChange("GSTNumber")}
          InputProps={{
            startAdornment: <CreditCardIcon sx={{ color: "#1a472a", mr: 1 }} />,
          }}
        />
        <TextField
          select
          label="Customer Type"
          value={editableCustomer?.CustomerType || ""}
          onChange={handleInputChange("CustomerType")}
          InputProps={{
            startAdornment: (
              <NotInterestedIcon sx={{ color: "#1a472a", mr: 1 }} />
            ),
          }}
        >
          <MenuItem value="individual">individual</MenuItem>
          <MenuItem value="business">business</MenuItem>
        </TextField>
        <TextField
          label="First Name"
          value={editableCustomer?.FirstName || ""}
          onChange={handleInputChange("FirstName")}
          InputProps={{
            startAdornment: <WcIcon sx={{ color: "#1a472a", mr: 1 }} />,
          }}
        />
        <TextField
          label="Last Name"
          value={editableCustomer?.LastName || ""}
          onChange={handleInputChange("LastName")}
          InputProps={{
            startAdornment: <WcIcon sx={{ color: "#1a472a", mr: 1 }} />,
          }}
        />
        <TextField
          label="Mobile Number"
          value={editableCustomer?.MobileNumber || ""}
          onChange={handleInputChange("MobileNumber")}
          InputProps={{
            startAdornment: <PhoneIcon sx={{ color: "#1a472a", mr: 1 }} />,
          }}
        />
        <TextField
          label="Email"
          value={editableCustomer?.Email || ""}
          onChange={handleInputChange("Email")}
          InputProps={{
            startAdornment: <EmailIcon sx={{ color: "#1a472a", mr: 1 }} />,
          }}
        />
      </Box>
    </Grid>
    <Grid item xs={6}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h6">Address Details</Typography>
        <TextField
          select
          label="State"
          value={editableCustomer?.StateMasterID || ""}
          onChange={handleStateChange}
          InputProps={{
            startAdornment: <LocationOnIcon sx={{ color: "#1a472a", mr: 1 }} />,
          }}
        >
          {stateList.map((option) => (
            <MenuItem key={option.ID} value={option.ID}>
              {option.StateName}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="District"
          value={editableCustomer?.DistrictMasterID || ""}
          onChange={handleDistrictChange}
          InputProps={{
            startAdornment: <MapIcon sx={{ color: "#1a472a", mr: 1 }} />,
          }}
        >
          {districtList.map((option) => (
            <MenuItem key={option.ID} value={option.ID}>
              {option.DistrictName}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="City"
          value={editableCustomer?.CityMasterID || ""}
          onChange={handleCityChange}
          InputProps={{
            startAdornment: (
              <LocationCityIcon sx={{ color: "#1a472a", mr: 1 }} />
            ),
          }}
        >
          {cityList.map((option) => (
            <MenuItem key={option.ID} value={option.ID}>
              {option.CityName}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Pin Code"
          value={editableCustomer?.PinCode || ""}
          onChange={handleInputChange("PinCode")}
          InputProps={{
            startAdornment: <PinDropIcon sx={{ color: "#1a472a", mr: 1 }} />,
          }}
        />
        <TextField
          label="Aadhar Number"
          value={editableCustomer?.AadharNo || ""}
          onChange={handleInputChange("AadharNo")}
          InputProps={{
            startAdornment: (
              <FingerprintIcon sx={{ color: "#1a472a", mr: 1 }} />
            ),
          }}
        />
        <TextField
          label="PAN Card"
          value={editableCustomer?.PANCard || ""}
          onChange={handleInputChange("PANCard")}
          InputProps={{
            startAdornment: <CreditCardIcon sx={{ color: "#1a472a", mr: 1 }} />,
          }}
        />
      </Box>
    </Grid>
  </Grid>
);

const CustomerViewDialog = ({ open, onClose, customer, fetchCustomer }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isEditing, setIsEditing] = useState(false);
  const [editableCustomer, setEditableCustomer] = useState({});

  // const [stateList, setStateList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [selectState, setSelectState] = useState(null);
  const [selectDistrict, setSelectDistrict] = useState(null);
  const [selectCity, setSelectCity] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

  // Update editableCustomer and dropdown selections when customer prop changes
  useEffect(() => {
    if (customer) {
      setEditableCustomer({ ...customer });
      setSelectState(customer.StateMasterID || null);
      setSelectDistrict(customer.DistrictMasterID || null);
      setSelectCity(customer.CityMasterID || null);
    }
  }, [customer]);

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

  // useEffect(() => {
  //   fetchStates();
  // }, []);

  useEffect(() => {
    if (selectState) fetchDistricts(selectState);
  }, [selectState]);

  useEffect(() => {
    if (selectDistrict) fetchCities(selectDistrict);
  }, [selectDistrict]);

  const handleStateChange = (e) => {
    const value = e.target.value;
    setSelectState(value);
    setEditableCustomer((prev) => ({ ...prev, StateMasterID: value }));
    setDistrictList([]);
    setCityList([]);
    setSelectDistrict(null);
    setSelectCity(null);
  };

  const handleDistrictChange = (e) => {
    const value = e.target.value;
    setSelectDistrict(value);
    setEditableCustomer((prev) => ({ ...prev, DistrictMasterID: value }));
    setCityList([]);
    setSelectCity(null);
  };

  const handleCityChange = (e) => {
    const value = e.target.value;
    setSelectCity(value);
    setEditableCustomer((prev) => ({ ...prev, CityMasterID: value }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (field) => (event) => {
    const { value } = event.target;
    setEditableCustomer((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveClick = async () => {
    try {
      // Prepare the data to be sent to the API
      const allFields = {
        ...customer,
        ...editableCustomer,
        StateMasterID:
          selectState !== null ? selectState : customer.StateMasterID,
        DistrictMasterID:
          selectDistrict !== null ? selectDistrict : customer.DistrictMasterID,
        CityMasterID: selectCity !== null ? selectCity : customer.CityMasterID,
      };

      const response = await axios.put(
        `${process.env.REACT_APP_URL}/api/UpdateCustomers/${customer.CustomerID}`,
        allFields,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: sanctumToken,
          },
        }
      );

      console.log("Customer updated successfully:", response.data);
      console.log("Updated customer data:", response.data.data);

      setSnackbarMsg("Customer updated successfully.");
      setSnackbarSeverity("warning"); // dark yellow for update
      setSnackbarOpen(true);
      setIsEditing(false);
      if (fetchCustomer) fetchCustomer(); // Refresh customer list after update
      onClose();
    } catch (error) {
      console.error("Error updating customer:", error);

      setSnackbarMsg("Failed to update customer. Please try again.");
      setSnackbarSeverity("error"); // red for error
      setSnackbarOpen(true);
      console.log(
        "Error details:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleDeleteClick = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_URL}/api/DeleteCustomer/${customer.CustomerID}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: sanctumToken,
          },
        }
      );

      console.log("Customer deleted successfully:", response.data);
      setSnackbarMsg("Customer deleted successfully.");
      setSnackbarSeverity("success"); // green for success delete
      setSnackbarOpen(true);
      if (fetchCustomer) fetchCustomer(); // Refresh customer list after delete
      onClose();
    } catch (error) {
      console.error("Error deleting customer:", error);
      console.log(
        "Error details:",
        error.response ? error.response.data : error.message
      );

      // Show specific message for 403 Forbidden
      if (error?.response?.status === 403) {
        setSnackbarMsg(
          "Customer has already generated invoice or quotation, unable to delete"
        );
        setSnackbarSeverity("warning"); // orange for already registered
      } else if (
        error?.response?.data?.message &&
        error.response.data.message.toLowerCase().includes("already")
      ) {
        setSnackbarMsg(
          "Customer has already generated invoice or quotation, unable to delete"
        );
        setSnackbarSeverity("warning"); // orange for already registered
      } else {
        setSnackbarMsg("Failed to delete customer.");
        setSnackbarSeverity("error"); // red for other errors
      }
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Reset edit mode when dialog is closed or opened
  useEffect(() => {
    if (!open) {
      setIsEditing(false);
    }
  }, [open]);

  // Wrap onClose to always reset edit mode
  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  const classicStyles = {
    dialog: {
      "& .MuiPaper-root": {
        border: "1px solid #1a472a",
        borderRadius: "8px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      },
    },
    title: {
      color: "#fff",
      fontFamily: '"Crimson Text", serif',
      padding: "16px 24px",
      fontSize: isMobile ? "1.5rem" : "2rem",
      textAlign: "center",
    },
    content: {
      padding: isMobile ? "8px" : "24px",
      maxHeight: "80vh",
      overflowY: "auto",
    },
    infoContainer: {
      backgroundColor: "#fff",
      border: "1px solid #1a472a",
      borderRadius: "4px",
      padding: isMobile ? "12px" : "20px",
      margin: "10px 0",
    },
    infoRow: {
      display: "flex",
      alignItems: "flex-start",
      marginBottom: isMobile ? "8px" : "12px",
      gap: "8px",
      flexDirection: "row",
      flexWrap: "nowrap",
    },
    label: {
      color: "#1a472a",
      fontFamily: '"Crimson Text", serif',
      fontWeight: 600,
      fontSize: isMobile ? "0.85rem" : "1.1rem",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      minWidth: isMobile ? "110px" : "180px",
      whiteSpace: "nowrap",
    },
    labelIcon: {
      fontSize: isMobile ? "16px" : "20px",
      color: "#1a472a",
      flexShrink: 0,
    },
    value: {
      color: "#333",
      fontSize: isMobile ? "0.85rem" : "1rem",
      flex: 1,
      wordBreak: "break-word",
      paddingTop: "2px",
    },
    closeButton: {
      color: "#fff",
    },
    actions: {
      padding: "16px",
      borderTop: "1px solid #1a472a",
    },
  };

  const InfoRow = ({
    icon: Icon,
    label,
    value,
    field,
    isDropdown,
    options,
    onChange,
  }) => (
    <div style={classicStyles.infoRow}>
      <Typography sx={classicStyles.label}>
        <Icon sx={classicStyles.labelIcon} />
        {label}:
      </Typography>
      {isEditing ? (
        isDropdown ? (
          <select
            value={value || ""}
            onChange={onChange}
            sx={{
              fontFamily: '"Crimson Text", serif',
              textTransform: "none",
              fontSize: "1rem",
              padding: "8px 24px",
            }}
          >
            <option value="" disabled>
              Select {label}
            </option>
            {options.map((option) => (
              <option key={option.ID} value={option.ID}>
                {option.StateName || option.DistrictName || option.CityName}
              </option>
            ))}
          </select>
        ) : (
          <TextField
            value={value || ""}
            onChange={handleInputChange(field)}
            variant="outlined"
            size="small"
            fullWidth
            sx={{
              flex: 1,
              fontSize: isMobile ? "0.85rem" : "1rem",
            }}
          />
        )
      ) : (
        <Typography sx={classicStyles.value}>{value || "____"}</Typography>
      )}
    </div>
  );

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        sx={classicStyles.dialog}
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ color: "#fff" }}>
          <Typography variant="h6" sx={{ color: "#fff" }}>
            {" "}
            {`${editableCustomer?.FirstName} ${editableCustomer?.LastName}`}{" "}
          </Typography>
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              ...classicStyles.closeButton,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={classicStyles.content}>
          {isEditing ? (
            <EditMode
              editableCustomer={editableCustomer}
              handleInputChange={handleInputChange}
              stateList={stateList}
              districtList={districtList}
              cityList={cityList}
              handleStateChange={handleStateChange}
              handleDistrictChange={handleDistrictChange}
              handleCityChange={handleCityChange}
            />
          ) : (
            <ViewMode
              customer={customer}
              stateList={stateList}
              districtList={districtList}
              cityList={cityList}
            />
          )}
        </DialogContent>
        <DialogActions sx={classicStyles.actions}>
          <Button
            variant="contained"
            onClick={handleDeleteClick}
            sx={{
              bgcolor: "#d32f2f",
              "&:hover": {
                bbgcolor: "#9a0007",
              },
              mr: "auto",
            }}
          >
            <DeleteIcon />
            Delete
          </Button>
          {isEditing ? (
            <Button
              variant="contained"
              onClick={handleSaveClick}
              sx={{
                fontFamily: '"Crimson Text", serif',
                textTransform: "none",
                fontSize: "1rem",
                padding: "8px 24px",
              }}
            >
              Save
            </Button>
          ) : (
            <Button
              variant="outlined"
              onClick={handleEditClick}
              sx={{
                borderColor: "#1a472a",
                color: "#1a472a",
                "&:hover": {
                  borderColor: "#0d2415",
                  color: "#0d2415",
                },
                fontFamily: '"Crimson Text", serif',
                textTransform: "none",
                fontSize: "1rem",
                padding: "8px 24px",
              }}
            >
              <EditIcon sx={{ mr: 1 }} />
              Edit
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleClose}
            sx={{
              "&:hover": {},
              fontFamily: '"Crimson Text", serif',
              textTransform: "none",
              fontSize: "1rem",
              padding: "8px 24px",
            }}
          >
            <CloseIcon sx={{ mr: 1 }} />
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{
            width: "100%",
            ...(snackbarSeverity === "success" && {
              color: "#fff",
            }), // green
            ...(snackbarSeverity === "error" && {
              backgroundColor: "#d32f2f",
              color: "#fff",
            }), // red
            ...(snackbarSeverity === "warning" && {
              color: "#fff",
            }), // orange/dark yellow
          }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CustomerViewDialog;
