import React, { useState } from "react";
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
  Grid2,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import NumbersIcon from "@mui/icons-material/Numbers";
import HomeIcon from "@mui/icons-material/Home";

const fieldsArr = [
  {
    title: "Company Details",
    icon: (
      <BusinessIcon sx={{ color: "#00509E", fontSize: 24, marginRight: 1 }} />
    ),
    fields: [
      {
        section: "companyDetails",
        label: "Company Name",
        field: "companyName",
      },
      {
        section: "companyDetails",
        label: "Phone No 1",
        field: "phone1",
      },
      {
        section: "companyDetails",
        label: "Phone No 2",
        field: "phone2",
      },
      {
        section: "companyDetails",
        label: "Company Email",
        field: "email",
      },
      {
        section: "companyDetails",
        label: "GST Number",
        field: "gstNumber",
      },
    ],
  },
  {
    title: "Bank Details",
    icon: (
      <AccountBalanceIcon
        sx={{ color: "#00509E", fontSize: 24, marginRight: 1 }}
      />
    ),
    fields: [
      {
        section: "bankDetails",
        label: "Bank Name",
        field: "bankName",
      },
      {
        section: "bankDetails",
        label: "Account Holder Name",
        field: "accountHolder",
      },
      {
        section: "bankDetails",
        label: "Account Number",
        field: "accountNumber",
      },
      { section: "bankDetails", label: "Branch", field: "branch" },
      {
        section: "bankDetails",
        label: "IFSC Code",
        field: "ifscCode",
      },
    ],
  },
  {
    title: "Address Details",
    icon: (
      <LocationOnIcon sx={{ color: "#00509E", fontSize: 24, marginRight: 1 }} />
    ),
    fields: [
      {
        section: "addressDetails",
        label: "Address Line 1",
        field: "addressLine1",
      },
      {
        section: "addressDetails",
        label: "Address Line 2",
        field: "addressLine2",
      },

      { section: "addressDetails", label: "State", field: "state" },

      {
        section: "addressDetails",
        label: "Statecode",
        field: "statecode",
        type: "address",
      },
      {
        section: "addressDetails",
        label: "District",
        field: "district",
        type: "address",
      },

      {
        section: "addressDetails",
        label: "City",
        field: "city",
        type: "address",
      },

      {
        section: "addressDetails",
        label: "PIN Code",
        field: "pinCode",
      },
      {
        section: "addressDetails",
        label: "TIN Code",
        field: "tinCode",
      },
    ],
  },
];

// Yup validation schema
const validationSchema = Yup.object().shape({
  companyDetails: Yup.object().shape({
    companyName: Yup.string().required("Company Name is required"),
    phone1: Yup.string().required("Phone No 1 is required"),
    phone2: Yup.string(),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    gstNumber: Yup.string().required("GST Number is required"),
  }),
  bankDetails: Yup.object().shape({
    bankName: Yup.string().required("Bank Name is required"),
    accountHolder: Yup.string().required("Account Holder Name is required"),
    accountNumber: Yup.string().required("Account Number is required"),
    branch: Yup.string().required("Branch is required"),
    ifscCode: Yup.string().required("IFSC Code is required"),
  }),
  addressDetails: Yup.object().shape({
    addressLine1: Yup.string().required("Address Line 1 is required"),
    addressLine2: Yup.string(),
    state: Yup.string().required("State is required"),
    district: Yup.string().required("District is required"),
    statecode: Yup.string().required("Statecode is required"),
    city: Yup.string().required("City is required"),
    pinCode: Yup.string().required("PIN Code is required"),
    tinCode: Yup.string().required("TIN Code is required"),
  }),
});

const CompnayManageEdit = ({ displayPageFn }) => {
  const [isEditable, setIsEditable] = useState(true); // Default to edit mode

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      companyDetails: {
        companyName: "",
        phone1: "",
        phone2: "",
        email: "",
        gstNumber: "",
      },
      bankDetails: {
        bankName: "",
        accountHolder: "",
        accountNumber: "",
        branch: "",
        ifscCode: "",
      },
      addressDetails: {
        addressLine1: "",
        addressLine2: "",
        state: "",
        district: "",
        statecode: "",
        city: "",
        pinCode: "",
        tinCode: "",
      },
    },
  });

  const handleSaveClick = () => {
    setIsEditable(false);
    console.log("Saved Data:", control.getValues());
  };

  const handleClearClick = () => {
    reset();
  };

  const onSubmit = (data) => {
    console.log("Form Data Submitted:", data);
  };

  return (
    <>
      <Divider />
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ color: "#00509E", fontWeight: "bold", marginY: 3 }}
      >
        Edit Company Credentials
      </Typography>

      <Box
        sx={{
          padding: "20px",
          backgroundColor: "#f0f8ff",
          minHeight: "100vh",
        }}
      >
        <Grid container spacing={3}>
          {/* Upload Sections */}
          {["Company Logo", "Header Image", "Slogan Image"].map(
            (label, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box
                  sx={{
                    border: "1px solid #ccc",
                    padding: "20px",
                    borderRadius: "12px",
                    backgroundColor: "#ffffff",
                    textAlign: "center",
                  }}
                >
                  <Box
                    sx={{
                      height: "150px",
                      backgroundColor: "#e3f2fd",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontWeight: "bold",
                      color: "#00509E",
                    }}
                  >
                    {label}
                  </Box>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      marginTop: 2,
                      fontWeight: "bold",
                      backgroundColor: "#00509E",
                      "&:hover": { backgroundColor: "#004080" },
                    }}
                  >
                    Upload {label.split(" ")[0]}
                  </Button>
                </Box>
              </Grid>
            )
          )}

          {/* Form Sections */}
          <Grid
            item
            xs={12}
            // md={4}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              p: 3,
              // bgcolor: "red",
            }}
          >
            {fieldsArr.map((section, index) => (
              <>
                <Box sx={{ bgcolor: "#fff", borderRadius: "20px", p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      // justifyContent: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 5,
                        color: "#00509E",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {section.icon}
                      {section.title}
                    </Typography>
                  </Box>
                  <Grid
                    container
                    key={index}
                    sx={{
                      border: "1px solid #ccc",
                      padding: "20px",
                      borderRadius: "12px",
                    }}
                    spacing={2}
                  >
                    {section.fields.map((field, idx) => (
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <Controller
                          key={idx}
                          control={control}
                          name={`${field.section}.${field.field}`}
                          render={({ field: controllerField }) => (
                            <TextField
                              {...controllerField}
                              label={field.label}
                              fullWidth
                              error={!!errors?.[field.section]?.[field.field]}
                              helperText={
                                errors?.[field.section]?.[field.field]?.message
                              }
                              sx={{ mb: 2 }}
                            />
                          )}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </>
            ))}
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Button
            variant="contained"
            sx={{
              mx: 2,
              px: 3,
              py: 1,
              backgroundColor: "#00509E",
              "&:hover": { backgroundColor: "#004080" },
            }}
            onClick={handleSubmit(onSubmit)}
          >
            Submit
          </Button>
          <Button
            variant="contained"
            sx={{
              mx: 2,
              px: 3,
              py: 1,
              backgroundColor: "#ff9800",
              "&:hover": { backgroundColor: "#f57c00" },
            }}
            onClick={handleClearClick}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            sx={{
              mx: 2,
              px: 3,
              py: 1,
              backgroundColor: "red",
              // "&:hover": { backgroundColor: "#f57c00" },
            }}
            onClick={() => displayPageFn(1)}
          >
            cancel
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default CompnayManageEdit;
