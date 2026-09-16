import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  SwapVerticalCircleTwoTone,
  Person,
  Numbers,
  Email,
  ContactPhone,
  AccountBalance,
  AccountBox,
  CreditCard,
  AccountBalanceWallet,
  LocationOn,
  Phone,
  Home,
  LocationCity,
  PinDrop,
  Badge,
  CreditScore,
  Business as BusinessIcon,
} from "@mui/icons-material";
import Cookies from "js-cookie";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery } from "@tanstack/react-query";
import { stateMasterApiFn } from "../../../../api/commonApi";

const schema = yup.object().shape({
  DoctorName: yup.string().required("Doctor Name is required"),
  Gender: yup.string().required("Gender is required"),
  DateOfBirth: yup.string().required("Date of Birth is required"),
  Qualification: yup.string().nullable(),
  Specialization: yup.string().nullable(),
  Email: yup.string().email("Invalid email").nullable(),
  PhoneNumber: yup.string().nullable(),
  AlternatePhoneNumber: yup.string().nullable(),
  AddressLine1: yup.string().nullable(),
  AddressLine2: yup.string().nullable(),
  Pincode: yup.string().nullable(),
  RegistrationNumber: yup.string().nullable(),
  ExperienceInYears: yup.number().nullable(),
});

const ViewMode = ({ dealer, stateList, districtList, cityList }) => (
  <Grid container spacing={4}>
    <Grid item xs={6}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h6">Doctor Details</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Person color="success" />
          <Typography>Doctor Name: {dealer.DoctorName || "--"}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Badge color="success" />
          <Typography>Gender: {dealer.Gender || "--"}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Numbers color="success" />
          <Typography>Date of Birth: {dealer.DateOfBirth || "--"}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AccountBox color="success" />
          <Typography>Qualification: {dealer.Qualification || "--"}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <BusinessIcon color="success" />
          <Typography>
            Specialization: {dealer.Specialization || "--"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Email color="success" />
          <Typography>Email: {dealer.Email || "--"}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ContactPhone color="success" />
          <Typography>Phone: {dealer.PhoneNumber || "--"}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ContactPhone color="success" />
          <Typography>
            Alternate Phone: {dealer.AlternatePhoneNumber || "--"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CreditCard color="success" />
          <Typography>
            Registration No: {dealer.RegistrationNumber || "--"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CreditScore color="success" />
          <Typography>
            Experience (Years): {dealer.ExperienceInYears || "--"}
          </Typography>
        </Box>
      </Box>
    </Grid>
    <Grid item xs={6}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h6">Contact & Address</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Home color="success" />
          <Typography>Address 1: {dealer.AddressLine1 || "--"}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Home color="success" />
          <Typography>Address 2: {dealer.AddressLine2 || "--"}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PinDrop color="success" />
          <Typography>Pincode: {dealer.Pincode || "--"}</Typography>
        </Box>
        {/* Optionally add state/district/city if needed */}
      </Box>
    </Grid>
  </Grid>
);

const EditMode = ({
  editedDealer,
  handleChange,
  stateList,
  districtList,
  cityList,
  handleStateChange,
  handleDistrictChange,
  handleCityChange,
  selectState,
  selectDistrict,
  selectCity,
  register,
  control,
  errors,
  setValue,
}) => (
  <Grid container spacing={4}>
    <Grid item xs={6}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h6">Doctor Details</Typography>
        <TextField
          label="Doctor Name"
          {...register("DoctorName")}
          error={!!errors.DoctorName}
          helperText={errors.DoctorName?.message}
          value={editedDealer.DoctorName || ""}
          onChange={(e) => {
            handleChange("DoctorName")(e);
            setValue("DoctorName", e.target.value);
          }}
          InputProps={{
            startAdornment: <Person color="success" sx={{ mr: 1 }} />,
          }}
        />
        <TextField
          label="Gender"
          {...register("Gender")}
          error={!!errors.Gender}
          helperText={errors.Gender?.message}
          value={editedDealer.Gender || ""}
          onChange={(e) => {
            handleChange("Gender")(e);
            setValue("Gender", e.target.value);
          }}
          InputProps={{
            startAdornment: <Badge color="success" sx={{ mr: 1 }} />,
          }}
        />
        <TextField
          label="Date of Birth"
          type="date"
          {...register("DateOfBirth")}
          error={!!errors.DateOfBirth}
          helperText={errors.DateOfBirth?.message}
          value={editedDealer.DateOfBirth || ""}
          onChange={(e) => {
            handleChange("DateOfBirth")(e);
            setValue("DateOfBirth", e.target.value);
          }}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: <Numbers color="success" sx={{ mr: 1 }} />,
          }}
        />
        <TextField
          label="Qualification"
          {...register("Qualification")}
          error={!!errors.Qualification}
          helperText={errors.Qualification?.message}
          value={editedDealer.Qualification || ""}
          onChange={(e) => {
            handleChange("Qualification")(e);
            setValue("Qualification", e.target.value);
          }}
          InputProps={{
            startAdornment: <AccountBox color="success" sx={{ mr: 1 }} />,
          }}
        />
        <TextField
          label="Specialization"
          {...register("Specialization")}
          error={!!errors.Specialization}
          helperText={errors.Specialization?.message}
          value={editedDealer.Specialization || ""}
          onChange={(e) => {
            handleChange("Specialization")(e);
            setValue("Specialization", e.target.value);
          }}
          InputProps={{
            startAdornment: <BusinessIcon color="success" sx={{ mr: 1 }} />,
          }}
        />
        <TextField
          label="Email"
          {...register("Email")}
          error={!!errors.Email}
          helperText={errors.Email?.message}
          value={editedDealer.Email || ""}
          onChange={(e) => {
            handleChange("Email")(e);
            setValue("Email", e.target.value);
          }}
          InputProps={{
            startAdornment: <Email color="success" sx={{ mr: 1 }} />,
          }}
        />
        <TextField
          label="Phone"
          {...register("PhoneNumber")}
          error={!!errors.PhoneNumber}
          helperText={errors.PhoneNumber?.message}
          value={editedDealer.PhoneNumber || ""}
          onChange={(e) => {
            handleChange("PhoneNumber")(e);
            setValue("PhoneNumber", e.target.value);
          }}
          InputProps={{
            startAdornment: <ContactPhone color="success" sx={{ mr: 1 }} />,
          }}
        />
        <TextField
          label="Alternate Phone"
          {...register("AlternatePhoneNumber")}
          error={!!errors.AlternatePhoneNumber}
          helperText={errors.AlternatePhoneNumber?.message}
          value={editedDealer.AlternatePhoneNumber || ""}
          onChange={(e) => {
            handleChange("AlternatePhoneNumber")(e);
            setValue("AlternatePhoneNumber", e.target.value);
          }}
          InputProps={{
            startAdornment: <ContactPhone color="success" sx={{ mr: 1 }} />,
          }}
        />
        <TextField
          label="Registration Number"
          {...register("RegistrationNumber")}
          error={!!errors.RegistrationNumber}
          helperText={errors.RegistrationNumber?.message}
          value={editedDealer.RegistrationNumber || ""}
          onChange={(e) => {
            handleChange("RegistrationNumber")(e);
            setValue("RegistrationNumber", e.target.value);
          }}
          InputProps={{
            startAdornment: <CreditCard color="success" sx={{ mr: 1 }} />,
          }}
        />
        <TextField
          label="Experience (Years)"
          type="number"
          {...register("ExperienceInYears")}
          error={!!errors.ExperienceInYears}
          helperText={errors.ExperienceInYears?.message}
          value={editedDealer.ExperienceInYears || ""}
          onChange={(e) => {
            handleChange("ExperienceInYears")(e);
            setValue("ExperienceInYears", e.target.value);
          }}
          InputProps={{
            startAdornment: <CreditScore color="success" sx={{ mr: 1 }} />,
          }}
        />
      </Box>
    </Grid>
    <Grid item xs={6}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h6">Contact & Address</Typography>
        <TextField
          label="Address 1"
          {...register("AddressLine1")}
          error={!!errors.AddressLine1}
          helperText={errors.AddressLine1?.message}
          value={editedDealer.AddressLine1 || ""}
          onChange={(e) => {
            handleChange("AddressLine1")(e);
            setValue("AddressLine1", e.target.value);
          }}
          InputProps={{
            startAdornment: <Home color="success" sx={{ mr: 1 }} />,
          }}
        />
        <TextField
          label="Address 2"
          {...register("AddressLine2")}
          error={!!errors.AddressLine2}
          helperText={errors.AddressLine2?.message}
          value={editedDealer.AddressLine2 || ""}
          onChange={(e) => {
            handleChange("AddressLine2")(e);
            setValue("AddressLine2", e.target.value);
          }}
          InputProps={{
            startAdornment: <Home color="success" sx={{ mr: 1 }} />,
          }}
        />
        <TextField
          label="Pincode"
          {...register("Pincode")}
          error={!!errors.Pincode}
          helperText={errors.Pincode?.message}
          value={editedDealer.Pincode || ""}
          onChange={(e) => {
            handleChange("Pincode")(e);
            setValue("Pincode", e.target.value);
          }}
          InputProps={{
            startAdornment: <PinDrop color="success" sx={{ mr: 1 }} />,
          }}
        />
        {/* Optionally add state/district/city if needed */}
      </Box>
    </Grid>
  </Grid>
);

const DealerViewDialog = ({ open, onClose, dealer, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDealer, setEditedDealer] = useState({});
  const [changedFields, setChangedFields] = useState({});
  // const [stateList, setStateList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [selectState, setSelectState] = useState(null);
  const [selectDistrict, setSelectDistrict] = useState(null);
  const [selectCity, setSelectCity] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: dealer || {},
  });

  useEffect(() => {
    if (!open) {
      setIsEditing(false);
    }
  }, [open]);

  useEffect(() => {
    if (dealer) {
      setEditedDealer(dealer);

      const stateId = dealer.StateMasterID || dealer.State || null;
      const districtId = dealer.DistrictMasterID || dealer.District || null;
      const cityId = dealer.CityMasterID || dealer.City || null;

      setSelectState(stateId);
      setSelectDistrict(districtId);
      setSelectCity(cityId);
      reset(dealer);
    }
  }, [dealer, reset]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["stateMasterApi"],
    queryFn: stateMasterApiFn,
    staleTime: Infinity,
  });
  const stateList = data?.data;

  useEffect(() => {
    if (!selectState) {
      setDistrictList([]);
      return;
    }
    const fetchDistricts = async () => {
      try {
        const token = Cookies.get("token");
        const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;
        const res = await axios.get(
          `${process.env.REACT_APP_URL}/api/districts/${selectState}`,
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
  }, [selectState]);

  useEffect(() => {
    if (!selectDistrict) {
      setCityList([]);
      return;
    }
    const fetchCities = async () => {
      try {
        const token = Cookies.get("token");
        const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;
        const res = await axios.get(
          `${process.env.REACT_APP_URL}/api/cities/${selectDistrict}`,
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
  }, [selectDistrict]);

  useEffect(() => {
    if (isEditing && selectState) {
      const fetchDistricts = async () => {
        try {
          const token = Cookies.get("token");
          const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;
          const res = await axios.get(
            `${process.env.REACT_APP_URL}/api/districts/${selectState}`,
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
    }
  }, [isEditing, selectState]);

  useEffect(() => {
    if (isEditing && selectDistrict) {
      const fetchCities = async () => {
        try {
          const token = Cookies.get("token");
          const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;
          const res = await axios.get(
            `${process.env.REACT_APP_URL}/api/cities/${selectDistrict}`,
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
    }
  }, [isEditing, selectDistrict]);

  if (!dealer) return null;

  const handleChange = (field) => (event) => {
    const newValue = event.target.value;

    if (dealer[field] !== newValue) {
      setChangedFields((prev) => ({
        ...prev,
        [field]: true,
      }));
    } else {
      const updatedFields = { ...changedFields };
      delete updatedFields[field];
      setChangedFields(updatedFields);
    }

    setEditedDealer((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  };

  const handleStateChange = (e) => {
    const value = e.target.value;
    setSelectState(value);
    setEditedDealer((prev) => ({ ...prev, State: value }));
    setDistrictList([]);
    setCityList([]);
    setSelectDistrict(null);
    setSelectCity(null);
    setChangedFields((prev) => ({ ...prev, State: true }));
  };

  const handleDistrictChange = (e) => {
    const value = e.target.value;
    setSelectDistrict(value);
    setEditedDealer((prev) => ({ ...prev, District: value }));
    setCityList([]);
    setSelectCity(null);
    setChangedFields((prev) => ({ ...prev, District: true }));
  };

  const handleCityChange = (e) => {
    const value = e.target.value;
    setSelectCity(value);
    setEditedDealer((prev) => ({ ...prev, City: value }));
    setChangedFields((prev) => ({ ...prev, City: true }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedDealer({ ...dealer });

    setSelectState(dealer.StateMasterID || dealer.State || null);
    setSelectDistrict(dealer.DistrictMasterID || dealer.District || null);
    setSelectCity(dealer.CityMasterID || dealer.City || null);

    setChangedFields({});
  };

  const handleSave = async (data) => {
    const token = Cookies.get("token");
    const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

    // Build payload as per required JSON format for doctor
    const updatePayload = {
      DoctorName: data.DoctorName,
      Gender: data.Gender,
      DateOfBirth: data.DateOfBirth || null,
      Qualification: data.Qualification || null,
      Specialization: data.Specialization || null,
      Email: data.Email || null,
      PhoneNumber: data.PhoneNumber || null,
      AlternatePhoneNumber: data.AlternatePhoneNumber || null,
      AddressLine1: data.AddressLine1 || null,
      AddressLine2: data.AddressLine2 || null,
      Pincode: data.Pincode || null,
      RegistrationNumber: data.RegistrationNumber || null,
      ExperienceInYears: data.ExperienceInYears || null,
    };

    if (
      Object.keys(changedFields).length === 0 &&
      selectState === dealer.State &&
      selectDistrict === dealer.District &&
      selectCity === dealer.City
    ) {
      setSnackbarMsg("No changes were made");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_URL}/api/UpdateDoctors/${dealer.ID || dealer.ID}`,
        updatePayload,
        {
          headers: {
            Authorization: sanctumToken,
          },
        }
      );

      if (response.status === 200) {
        const updatedDealer = response.data;
        setIsEditing(false);
        setChangedFields({});
        if (onUpdate) onUpdate(); // Refresh subdealer list after update
        setSnackbarMsg("Dealer updated successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        setSnackbarMsg("Failed to update dealer");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMsg(`Update failed: ${error.message}`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async () => {
    const token = Cookies.get("token");
    const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

    console.log("Delete button clicked");
    console.log("dealer:", dealer);
    console.log("dealer.ID:", dealer?.ID);

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_URL}/api/DeleteDoctor/${dealer.ID}`,
        {},
        {
          headers: {
            Authorization: sanctumToken,
          },
        }
      );

      console.log("Delete API response:", response);

      if (response.status === 200) {
        if (onUpdate) onUpdate(); // Refresh subdealer list after delete
        onClose();
        setSnackbarMsg("Dealer deleted successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        setSnackbarMsg("Failed to delete dealer");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.log("Delete API error:", error);
      setSnackbarMsg("An error occurred while deleting the dealer");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedDealer(dealer);
    setChangedFields({});
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
        <DialogTitle
          sx={{
            color: "white",
            py: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BusinessIcon />
            <Typography sx={{ color: "white" }}>
              {dealer.DoctorName || "Doctor Details"}
            </Typography>
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
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
                editedDealer={editedDealer}
                handleChange={handleChange}
                stateList={stateList}
                districtList={districtList}
                cityList={cityList}
                handleStateChange={handleStateChange}
                handleDistrictChange={handleDistrictChange}
                handleCityChange={handleCityChange}
                selectState={selectState}
                selectDistrict={selectDistrict}
                selectCity={selectCity}
                register={register}
                control={control}
                errors={errors}
                setValue={setValue}
              />
              <DialogActions
                sx={{
                  px: 4,
                  py: 2,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                }}
              >
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<SwapVerticalCircleTwoTone />}
                  type="submit"
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  startIcon={<CloseIcon />}
                  onClick={handleCancel}
                  sx={{
                    backgroundColor: "#808080",
                    "&:hover": { backgroundColor: "#666666" },
                  }}
                >
                  Cancel
                </Button>
              </DialogActions>
            </form>
          ) : (
            <ViewMode
              dealer={dealer}
              stateList={stateList}
              districtList={districtList}
              cityList={cityList}
            />
          )}
        </DialogContent>
        {!isEditing && (
          <DialogActions
            sx={{
              px: 4,
              py: 2,
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              sx={{
                mr: "auto",
                backgroundColor: "red",
                color: "red",
                "&:hover": { backgroundColor: "#b71c1c" },
              }}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{
                backgroundColor: "#1B5E20",
                "&:hover": { backgroundColor: "#2E7D32" },
              }}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              startIcon={<CloseIcon />}
              onClick={onClose}
              sx={{
                backgroundColor: "#1B5E20",
                "&:hover": { backgroundColor: "#2E7D32" },
              }}
            >
              Close
            </Button>
          </DialogActions>
        )}
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
              backgroundColor: "#43a047",
              color: "#fff",
            }),
            ...(snackbarSeverity === "error" && {
              backgroundColor: "#d32f2f",
              color: "#fff",
            }),
            ...(snackbarSeverity === "warning" && {
              backgroundColor: "#ffa000",
              color: "#fff",
            }),
          }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DealerViewDialog;
