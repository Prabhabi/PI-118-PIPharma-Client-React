import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Typography,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import SupplierList from "./SupplierList";
import BusinessIcon from "@mui/icons-material/Business";
import { useTheme } from "@mui/material/styles";

import LoadingComp from "../../../components/loadingComp/LoadingComp";
import ErrorComp from "../../../components/error/ErrorComp";
import Cookies from "js-cookie"; // Import Cookies
import { useQuery } from "@tanstack/react-query";
import { supplierListApiFn } from "../../../api/purchaseApi";

// Validation schema
const validationSchema = Yup.object({
  supplierName: Yup.string().required("Supplier Name is required."),
  supplierType: Yup.string().required("Supplier Type is required."),
  email: Yup.string().email("Invalid email format").optional(),
  website: Yup.string().optional(),
  gstNumber: Yup.string().optional(),
  panCard: Yup.string().optional(),
  bankName: Yup.string().optional(),
  branchName: Yup.string().optional(),
  accountHolderName: Yup.string().optional(),
  accountNumber: Yup.string().optional(),
  ifscCode: Yup.string().optional(),
  upiId: Yup.string().optional(),
  contactPerson: Yup.string().optional(),
  whatsappNo: Yup.string().optional(),
  mobileNo1: Yup.string()
    .matches(/^\d{10}$/, "Mobile number must be 10 digits")
    .optional(),
  mobileNo2: Yup.string()
    .matches(/^\d{10}$/, "Mobile number must be 10 digits")
    .optional(),
  addressLine1: Yup.string().optional(),
  addressLine2: Yup.string().optional(),
  state: Yup.string().optional(),
  district: Yup.string().optional(),
  city: Yup.string().optional(),
  pinCode: Yup.string()
    .matches(/^\d{6}$/, "Pin Code must be 6 digits")
    .optional(),
});

const Supplier = () => {
  // const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  // const fetchSuppliers = async () => {
  //   setLoading(true);
  //       const token = Cookies.get("token");
  //       const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;
  //   try {
  //     const result = await axios.get(
  //       `${process.env.REACT_APP_URL}/api/getSuppliers`
  //       ,        {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': sanctumToken,
  //         },
  //       }
  //     );
  //     // console.log(result.data);
  //     setSuppliers(result.data.data);
  //     setLoading(false);
  //   } catch (error) {
  //     // console.error("Error fetching suppliers:", error);
  //     setLoading(false);
  //     setError(true);
  //   }
  // };

  // useEffect(() => {
  //   fetchSuppliers();
  // }, []);
  // console.log(suppliers);
  console.log("Query fetched at", new Date().toLocaleTimeString());

  // =======================================================================
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["supplierListApi"],
    queryFn: () => {
      console.log(
        "supplierListApiFn called at",
        new Date().toLocaleTimeString()
      );
      return supplierListApiFn();
    },
    staleTime: Infinity,
    cacheTime: Infinity,
    gcTime: Infinity, // For React Query v5+
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: "never", // <-- Use "never" for v5, not false
    refetchInterval: false,
    refetchIntervalInBackground: false,
    enabled: true,
  });
  const suppliers = data?.data?.data || [];

  // useEffect(() => {
  //   if (dealerLists.length > 0) {
  //     setSuppliers(dealerLists);
  //   }
  // }, [dealerLists]);

  // ===========================================================================

  // const onSubmit = async (data) => {
  //   console.log(data);
  // };

  const renderTextField = (name, label) => (
    <Grid item xs={12} md={6}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={label}
            fullWidth
            variant="outlined"
            error={!!errors[name]}
            helperText={errors[name]?.message}
            sx={{
              "& .MuiInputBase-root": {
                borderRadius: "12px",
                fontSize: { xs: "0.875rem", sm: "1rem" },
              },
              mb: { xs: 1, sm: 2 },
            }}
          />
        )}
      />
    </Grid>
  );

  const renderSelectField = (name, label, options) => (
    <Grid item xs={12} md={6}>
      <FormControl fullWidth sx={{ mb: { xs: 1, sm: 2 } }}>
        <InputLabel sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
          {label}
        </InputLabel>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              label={label}
              variant="outlined"
              sx={{
                borderRadius: "12px",
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              {options.map((option, index) => (
                <MenuItem
                  key={index}
                  value={option}
                  sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                >
                  {option}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </FormControl>
    </Grid>
  );

  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          pt: { xs: 2, sm: 4 },
          bgcolor: theme.palette.background.main,
          minHeight: "100vh",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            marginBottom: 4,
            color: "#4D795B",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            mb: 6,
            fontSize: { xs: "1.8rem", sm: "2.125rem" },
            color: "blue",
          }}
        >
          <BusinessIcon
            sx={{
              mr: 1,
              fontSize: { xs: "2rem", sm: "2.5rem", color: "blue" },
            }}
          />
          Supplier Management
        </Typography>
        <Box
          sx={{
            padding: { xs: 1, sm: 2 },
            "& .MuiGrid-container": {
              spacing: { xs: 1, sm: 2 },
            },
          }}
        >
          <SupplierList fetchSuppliers={refetch} suppliers={suppliers} />
        </Box>
      </Box>
      <LoadingComp loading={isLoading} />
      <ErrorComp error={error} />
    </>
  );
};

export default Supplier;
