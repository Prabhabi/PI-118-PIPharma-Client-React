// Import necessary components and hooks
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  Divider,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const ManageEdit = ({ displayPageFn }) => {
  const [isEditable, setIsEditable] = useState(true); // Default to edit mode
  const [dummyData, setDummyData] = useState({
    companyDetails: {
      companyName: "Example Company",
      phone1: "123-456-7890",
      phone2: "987-654-3210",
      email: "example@company.com",
      gstNumber: "GST12345678",
    },
    bankDetails: {
      bankName: "Sample Bank",
      accountHolder: "John Doe",
      accountNumber: "1234567890",
      branch: "Main Branch",
      ifscCode: "IFSC0001234",
    },
    addressDetails: {
      addressLine1: "123 Main Street",
      addressLine2: "Suite 456",
      state: "California",
      district: "California",
      statecode: "01",
      city: "Los Angeles",
      pinCode: "90001",
      tinCode: "123456",
    },
  });

  const handleInputChange = (section, field, value) => {
    setDummyData((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [field]: value,
      },
    }));
  };

  const handleSaveClick = () => {
    setIsEditable(false);
    console.log("Saved Data:", dummyData);
  };

  const handleClearClick = () => {
    setIsEditable(false);
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
                    color="success"
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
          {[
            {
              title: "Company Details",
              icon: (
                <BusinessIcon
                  sx={{ color: "#00509E", fontSize: 24, marginRight: 1 }}
                />
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
                <LocationOnIcon
                  sx={{ color: "#00509E", fontSize: 24, marginRight: 1 }}
                />
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
                  label: "District",
                  field: "district",
                },

                {
                  section: "addressDetails",
                  label: "Statecode",
                  field: "statecode",
                },

                { section: "addressDetails", label: "City", field: "city" },

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
          ].map((section, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box
                sx={{
                  border: "1px solid #ccc",
                  padding: "20px",
                  borderRadius: "12px",
                  backgroundColor: "#ffffff",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    color: "#00509E",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {section.icon}
                  {section.title}
                </Typography>
                {section.fields.map((field, idx) => (
                  <TextField
                    key={idx}
                    label={field.label}
                    value={dummyData[field.section][field.field]}
                    onChange={(e) =>
                      handleInputChange(
                        field.section,
                        field.field,
                        e.target.value
                      )
                    }
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Button
            variant="contained"
            sx={{
              mx: 2,
              px: 3,
              py: 1,
              fontWeight: "bold",
              backgroundColor: "#4caf50",
            }}
            onClick={handleSaveClick}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            color="error"
            sx={{ mx: 2, px: 3, py: 1, fontWeight: "bold" }}
            onClick={displayPageFn(1)}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default ManageEdit;
