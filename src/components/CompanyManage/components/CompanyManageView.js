import React from "react";
import { Box, Grid, Typography, Button } from "@mui/material";

const CompanyManageView = ({ onEdit, companyData, displayPageFn, index }) => {
  const noImage = "placeholder.png";
  const itemData = [
    {
      img: companyData.Image1
        ? `${process.env.REACT_APP_URL}/storage/${companyData.Image1}`
        : noImage,
      title: "Company Logo",
    },
    {
      img: companyData.Image2
        ? `${process.env.REACT_APP_URL}/storage/${companyData.Image2}`
        : noImage,
      title: "Header Image",
    },
    {
      img: companyData.Image3
        ? `${process.env.REACT_APP_URL}/storage/${companyData.Image3}`
        : noImage,
      title: "Slogan Image",
    },
  ];

  return (
    <Box
      sx={{
        padding: "40px",
        background: "#fff",
        borderRadius: "12px",
        position: "relative",
        my: 2,
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)", // Deeper shadow
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: "#2e7d32",
          mb: 2,
          fontWeight: "bold",
        }}
      >
        Company {companyData.CompanyName} Details
        <Button
          variant="contained"
          sx={{
            position: "absolute",
            top: 20,
            right: 15,
            // bgcolor: "#2e7d32",
            // "&:hover": { bgcolor: "#1b5e20" },
          }}
          onClick={() => displayPageFn(3)}
        >
          Edit
        </Button>
      </Typography>

      <Grid
        container
        spacing={2}
        sx={{
          mr: 1,
          // ml: 1,
          // bgcolor: "#e4f8e6", // Removed green background
          p: 2,
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.15)", // Deeper shadow
        }}
      >
        {/* Left side - Images */}
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 1 }}>
            <Box
              sx={{
                width: "100%",
                height: "200px",
                bgcolor: "#e0e0e0",
                borderRadius: "8px",
                mb: 2,
                overflow: "hidden",
              }}
            >
              <img
                src={itemData[0]?.img && itemData[0]?.img}
                // alt="Main"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "placeholder.png";
                }}
              />
            </Box>
            <Grid container spacing={2}>
              {itemData.slice(1).map((item, i) => (
                <Grid item xs={6} key={i}>
                  <Box
                    sx={{
                      width: "100%",
                      height: "100px",
                      // bgcolor: "#e0e0e0",
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "placeholder.png";
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>

        {/* Right side - Details */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {/* Company Details */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  bgcolor: "white",
                  borderRadius: "8px",
                  p: 2,
                  boxShadow: "0 4px 6px rgba(0,0,0,0.12)", // Deeper shadow
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 3,
                    fontWeight: "bold",
                    // color: "#1b5e20",
                    borderBottom: "2px solid #2e7d32",
                    display: "inline-block",
                    paddingBottom: "4px",
                  }}
                >
                  Company Details
                </Typography>
                {Object.entries({
                  "Company Name": companyData.CompanyName,
                  "Phone no": companyData.PhoneNumber1,
                  "Company Email": companyData.CompanyEmail,
                  "GST no": companyData.GSTNumber,
                }).map(([label, value]) => (
                  <Typography key={label} sx={{ mb: 2 }}>
                    <span style={{ color: "#000", fontWeight: "600" }}>
                      {label}:
                    </span>
                    <span style={{ color: "#000" }}>{value}</span>
                  </Typography>
                ))}
              </Box>
            </Grid>

            {/* Bank Details */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  bgcolor: "white",
                  borderRadius: "8px",
                  p: 2,
                  boxShadow: "0 4px 6px rgba(0,0,0,0.12)", // Deeper shadow
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 3,
                    fontWeight: "bold",
                    // color: "#1b5e20",
                    borderBottom: "2px solid #2e7d32",
                    display: "inline-block",
                    paddingBottom: "4px",
                  }}
                >
                  Bank Details
                </Typography>
                {Object.entries({
                  "Bank Name": companyData.BankName,
                  "Account Holder Name": companyData.AccountHolderName,
                  "Account no": companyData.AccountNumber,
                  Branch: companyData.Branch,
                  "IFSC Code": companyData.IFSCCode,
                }).map(([label, value]) => (
                  <Typography key={label} sx={{ mb: 2 }}>
                    <span style={{ color: "#000", fontWeight: "600" }}>
                      {label}:
                    </span>
                    <span style={{ color: "#000" }}>{value}</span>
                  </Typography>
                ))}
              </Box>
            </Grid>

            {/* Address Details */}
            <Grid item xs={12}>
              <Box
                sx={{
                  bgcolor: "white",
                  borderRadius: "8px",
                  p: 2,
                  mt: 1,
                  boxShadow: "0 4px 6px rgba(0,0,0,0.12)", // Deeper shadow
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 2,
                    fontWeight: "bold",
                    // color: "#1b5e20",
                    borderBottom: "2px solid #2e7d32",
                    display: "inline-block",
                    paddingBottom: "4px",
                  }}
                >
                  Address Details
                </Typography>
                <Grid container spacing={2}>
                  {Object.entries({
                    "Address Line 1": companyData.AddressLine1,
                    "Address Line 2": companyData.AddressLine2,
                    "State ID": companyData.StateID,
                    "District ID": companyData.DistrictID,
                    "City ID": companyData.CityID,
                    "PIN Code": companyData.PinCode,
                    "TIN Code": companyData.TINCode,
                  }).map(([label, value]) => (
                    <Grid item xs={12} sm={6} key={label}>
                      <Typography sx={{ mb: 1 }}>
                        <span style={{ color: "#000", fontWeight: "600" }}>
                          {label}:
                        </span>
                        <span style={{ color: "#000" }}>{value}</span>
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CompanyManageView;
