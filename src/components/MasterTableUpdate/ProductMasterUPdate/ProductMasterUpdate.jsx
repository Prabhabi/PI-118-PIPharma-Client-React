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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { set } from "react-hook-form";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CloseIcon from "@mui/icons-material/Close";
import ErrorComp from "../../error/ErrorComp";
import Cookies from "js-cookie";
import { brandMasterApiFn, categoryMasterApiFn } from "../../../api/commonApi";
import { useQuery } from "@tanstack/react-query";

const theme = createTheme({
  palette: {
    primary: {
      main: "#87CEEB",
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "green",
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: "green",
          "&.Mui-checked": {
            color: "green",
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          color: "green",
        },
      },
    },
  },
});

const ProductMasterUpdate = ({ onClose }) => {
  const [selectedField, setSelectedField] = useState("category");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    // brand: "",
    // productType: "",
    category: "",
    subCategory: "",
  });

  const [selectedIds, setSelectedIds] = useState({
    brandId: "",
    productTypeId: "",
    categoryId: "",
  });

  const [options, setOptions] = useState({
    brand: [],
    productType: [],
    category: [],
    subCategory: [],
  });

  const [subCategories, setSubCategories] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Add error message state

  // =====================================================================
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["categoryMasterApiFn"],
    queryFn: categoryMasterApiFn,
  });
  useEffect(() => {
    if (data) {
      setOptions((prevOptions) => ({
        ...prevOptions,

        category: data.data || [],
      }));
    }
  }, [data]);

  // ===================================================================

  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

  const fetchBrand = async (url, setState, dataType) => {
    setLoading(true);
    try {
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: sanctumToken,
        },
      });
      dataType !== "Categories"
        ? setState(response.data.data)
        : setState(response.data);
      setLoading(false);
    } catch (error) {
      // setError(true);
      setLoading(false);
      // setErrorSnackbarOpen(true);
    }
  };

  const fetchData = async (url, setState, dataType) => {
    setLoading(true);
    try {
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: sanctumToken,
        },
      });
      dataType !== "Categories"
        ? setState(response.data.data)
        : setState(response.data);
      setLoading(false);
    } catch (error) {
      // setError(true);
      setLoading(false);
      // setErrorSnackbarOpen(true);
    }
  };

  const fetchBrands = async () => {
    fetchBrand(
      `${process.env.REACT_APP_URL}/api/brands`,
      (data) => setOptions((prevOptions) => ({ ...prevOptions, brand: data })),
      "Brands"
    );
  };

  // const fetchProductTypes = async (brandId) => {
  //   fetchData(
  //     `${process.env.REACT_APP_URL}/api/product-types/${brandId}`,
  //     (data) =>
  //       setOptions((prevOptions) => ({ ...prevOptions, productType: data })),
  //     "Product Types"
  //   );
  // };

  // const fetchCategories = async (productTypeId) => {
  //   fetchData(
  //     `${process.env.REACT_APP_URL}/api/categories/${productTypeId}`,
  //     (data) =>
  //       setOptions((prevOptions) => ({ ...prevOptions, category: data })),
  //     "Categories"
  //   );
  // };

  const fetchSubCategories = async (categoryId) => {
    fetchData(
      `${process.env.REACT_APP_URL}/api/subCategories/${categoryId}`,
      (data) =>
        setOptions((prevOptions) => ({ ...prevOptions, subCategory: data })),
      "Subcategories"
    );
  };

  const fetchAllSubCategories = async () => {
    fetchData(
      `${process.env.REACT_APP_URL}/api/subCategories`,
      setSubCategories,
      "Subcategories"
    );
  };

  // useEffect(() => {
  //   fetchSubCategories(1);
  // }, []);

  // useEffect(() => {
  //   if (selectedIds.brandId) {
  //     fetchProductTypes(selectedIds.brandId);
  //   }
  // }, [selectedIds.brandId]);

  // useEffect(() => {
  //   if (selectedIds.productTypeId) {
  //     fetchCategories(selectedIds.productTypeId);
  //   }
  // }, [selectedIds.productTypeId]);

  useEffect(() => {
    if (selectedIds.categoryId) {
      fetchSubCategories(selectedIds.categoryId);
    }
  }, [selectedIds.categoryId]);

  const handleRadioChange = (event) => {
    setSelectedField(event.target.value);
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData({ ...formData, [field]: value });

    if (field === "brand") {
      const selectedBrand = options.brand.find(
        (option) => option.BrandName === value
      );
      if (selectedBrand) {
        setSelectedIds({ ...selectedIds, brandId: selectedBrand.ID });
        setOptions((prevOptions) => ({
          ...prevOptions,
          productType: [],
          category: [],
        })); // Clear product types and categories when brand changes
      }
    } else if (field === "productType") {
      const selectedProductType = options.productType.find(
        (option) => option.ProductTypeName === value
      );
      if (selectedProductType) {
        setSelectedIds({
          ...selectedIds,
          productTypeId: selectedProductType.ID,
        });
        setOptions((prevOptions) => ({ ...prevOptions, category: [] })); // Clear categories when product type changes
        fetchData(
          `${process.env.REACT_APP_URL}/api/categories/${selectedProductType.ID}`,
          (data) =>
            setOptions((prevOptions) => ({ ...prevOptions, category: data })),
          "Categories"
        );
      }
    } else if (field === "category") {
      const selectedCategory = options.category.find(
        (option) => option.ProductCategoryName === value
      );
      if (selectedCategory) {
        setSelectedIds({ ...selectedIds, categoryId: selectedCategory.ID });
      }
    }
  };

  // Helper to check for duplicates
  const checkDuplicate = () => {
    // if (selectedField === "brand") {
    //   return options.brand.some(
    //     (option) =>
    //       option.BrandName.trim().toLowerCase() ===
    //       formData.brand.trim().toLowerCase()
    //   );
    // }
    // if (selectedField === "productType") {
    //   return options.productType.some(
    //     (option) =>
    //       option.ProductTypeName.trim().toLowerCase() ===
    //       formData.productType.trim().toLowerCase()
    //   );
    // }
    if (selectedField === "category") {
      return options.category.some(
        (option) =>
          option.ProductCategoryName.trim().toLowerCase() ===
          formData.category.trim().toLowerCase()
      );
    }
    if (selectedField === "subCategory") {
      return options.subCategory.some(
        (option) =>
          option.ProductSubCategoryName.trim().toLowerCase() ===
          formData.subCategory.trim().toLowerCase()
      );
    }
    return false;
  };

  const handleSubmit = () => {
    // Check for duplicate before submit
    if (checkDuplicate()) {
      setErrorMessage(
        `This ${selectedField === "subCategory" ? "Sub Category" : selectedField.charAt(0).toUpperCase() + selectedField.slice(1)} already exists.`
      );
      setErrorSnackbarOpen(true);
      return;
    }
    setLoading(true);

    const postData = async () => {
      try {
        let finalData = {};
        // ========================brand =============
        if (selectedField === "brand") {
          finalData = {
            BrandList: [
              {
                BrandName: 1, // Take value from input
                BNShortName: formData.shortname, // Take value from input
              },
            ],
          };
          await axios.post(
            `${process.env.REACT_APP_URL}/api/postBrands`,
            finalData,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: sanctumToken,
              },
            }
          );
          await fetchBrands(); // fetch updated brands
          await fetchAllSubCategories(); // fetch all subcategories
          // ======================productType =============
        } else if (selectedField === "productType") {
          finalData = {
            producttypes: [
              {
                ProductTypeName: formData.productType,
                BrandMasterID: selectedIds.brandId,
                PTShortName: formData.shortname,
              },
            ],
          };

          await axios.post(
            `${process.env.REACT_APP_URL}/api/postProductTypes`,
            finalData,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: sanctumToken,
              },
            }
          );
          // await fetchProductTypes(selectedIds.brandId);
          await fetchAllSubCategories(); // fetch all subcategories
          // =====================================category =============
        } else if (selectedField === "category") {
          finalData = {
            ProductCategoryList: [
              {
                ProductCategoryName: formData.category,
                ProductTypeID: 1,
                PCShortName: formData.shortname,
              },
            ],
          };

          await axios.post(
            `${process.env.REACT_APP_URL}/api/postProductCategories`,
            finalData,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: sanctumToken,
              },
            }
          );
          refetch();
          // await fetchCategories(selectedIds.productTypeId);
          await fetchAllSubCategories(); // fetch all subcategories
          // ========================subCategory =============
        } else if (selectedField === "subCategory") {
          finalData = {
            ProductSubCategoryList: [
              {
                ProductSubCategoryName: formData.subCategory,
                ProductCategoryID: selectedIds.categoryId,
                PSCShortName: formData.shortname,
              },
            ],
          };

          await axios.post(
            `${process.env.REACT_APP_URL}/api/postProductSubCategories`,
            finalData,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: sanctumToken,
              },
            }
          );
          await fetchSubCategories(selectedIds.categoryId);
          await fetchAllSubCategories(); // fetch all subcategories
        }
        setLoading(false);
        setSnackbarOpen(true);
        if (selectedField === "brand") {
          setFormData({
            brand: "",
            productType: "",
            category: "",
            subCategory: "",
            shortname: "", // Clear shortname
          });
          setSelectedIds({
            brandId: "",
            productTypeId: "",
            categoryId: "",
          });
        } else if (selectedField === "productType") {
          setFormData((p) => ({ ...p, productType: "", shortname: "" })); // Clear shortname
          setSelectedIds((p) => ({ ...p, productTypeId: "" }));
        } else if (selectedField === "category") {
          setFormData((p) => ({ ...p, category: "", shortname: "" })); // Clear shortname
          setSelectedIds((p) => ({ ...p, categoryId: "" }));
        } else if (selectedField === "subCategory") {
          setFormData((p) => ({ ...p, subCategory: "", shortname: "" })); // Clear shortname
          // setSelectedIds((p) => ({ ...p, categoryId: "" }));
        }
      } catch (error) {
        console.error("Error submitting data:", error);
        setLoading(false);
      }
    };

    postData();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleErrorSnackbarClose = () => {
    setErrorSnackbarOpen(false);
    setErrorMessage(""); // Clear error message
  };

  const isDisabled = (field) => {
    if (selectedField === "brand") return field !== "brand";
    if (selectedField === "productType")
      return field !== "brand" && field !== "productType";
    if (selectedField === "category")
      return (
        field !== "brand" && field !== "productType" && field !== "category"
      );
    if (selectedField === "subCategory")
      return (
        field !== "brand" &&
        field !== "productType" &&
        field !== "category" &&
        field !== "subCategory"
      );
    return false;
  };

  const handleClose = () => {
    // Implement the close functionality here
    onClose();
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          textAlign: "left",
          position: "relative",
          borderColor: "green",
          borderWidth: 1,
          borderStyle: "solid",
          // bgcolor: "#e4f4ea", // Removed green background
        }}
      >
        <Box
          sx={{
            backgroundColor: "#0078cf",
            padding: "1rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              color: "white",
            }}
          >
            <Inventory2Icon sx={{ color: "white" }} /> Add Product Dependences
          </Typography>
          <CloseIcon
            onClick={handleClose}
            sx={{
              cursor: "pointer",
              color: "white",
            }}
          />
        </Box>
        <Box
          sx={{
            p: 3,
            textAlign: "center",
            p: 10,
            borderColor: "green",
            borderWidth: 1,
            borderStyle: "solid",
          }}
        >
          <FormControl component="fieldset">
            <RadioGroup row value={selectedField} onChange={handleRadioChange}>
              {/* <FormControlLabel
                value="brand"
                control={<Radio />}
                label="Brand"
              />
              <FormControlLabel
                value="productType"
                control={<Radio />}
                label="Product Type"
              /> */}
              <FormControlLabel
                value="category"
                control={<Radio />}
                label="Category"
              />
              <FormControlLabel
                value="subCategory"
                control={<Radio />}
                label="Manufacturer"
              />
            </RadioGroup>
          </FormControl>

          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            {Object.keys(formData).map((field) =>
              field === "shortname" ? null : field === selectedField ? ( // <-- skip shortname here
                <TextField
                  key={field}
                  label={
                    <span style={{ color: "green" }}>
                      {field !== "subCategory" &&
                        field.charAt(0).toUpperCase() + field.slice(1)}
                      {field == "subCategory" &&
                        "manufacturer".charAt(0).toUpperCase() +
                          "manufacturer".slice(1)}
                    </span>
                  }
                  value={formData[field]}
                  onChange={handleChange(field)}
                  fullWidth
                  sx={{ borderColor: "green" }}
                />
              ) : (
                <FormControl
                  fullWidth
                  key={field}
                  disabled={isDisabled(field)}
                  sx={{ borderColor: "green" }}
                >
                  <InputLabel>
                    <span style={{ color: "green" }}>
                      {field === "subCategory" && isDisabled(field)
                        ? "Manufacturer"
                        : field.charAt(0).toUpperCase() + field.slice(1)}
                    </span>
                  </InputLabel>
                  <Select
                    value={formData[field]}
                    onChange={handleChange(field)}
                    label={
                      <span style={{ color: "green" }}>
                        {field === "subCategory" && isDisabled(field)
                          ? "Manufacturer"
                          : field.charAt(0).toUpperCase() + field.slice(1)}
                      </span>
                    }
                    sx={
                      isDisabled(field)
                        ? {
                            bgcolor: "rgba(0, 0, 0, 0.1)",
                            borderColor: "green",
                          }
                        : { borderColor: "green" }
                    }
                  >
                    {options[field] &&
                      options[field].map((option) => (
                        <MenuItem
                          key={option.ID}
                          value={
                            field === "productType"
                              ? option.ProductTypeName
                              : field === "category"
                                ? option.ProductCategoryName
                                : field === "subCategory"
                                  ? option.SubCategoryName
                                  : option.BrandName
                          }
                        >
                          {field === "productType" && option.ProductTypeName}
                          {field === "category" && option.ProductCategoryName}
                          {field === "subCategory" && option.SubCategoryName}
                          {field === "brand" && option.BrandName}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              )
            )}
            {/* Render shortname field only once, after the mapped fields */}
            <TextField
              key="shortname"
              label={<span style={{ color: "green" }}>Short name</span>}
              value={formData.shortname}
              onChange={handleChange("shortname")}
              fullWidth
              sx={{ borderColor: "green" }}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                bgcolor: "#0078cf",
                height: "45px",
                color: "white",
                "&:hover": { bgcolor: "darkgreen" },
                borderColor: "green",
              }}
            >
              Submit
            </Button>
          </Box>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity="success"
              sx={{ width: "100%", borderColor: "green" }}
            >
              Data submitted successfully!
            </Alert>
          </Snackbar>
          <Snackbar
            open={errorSnackbarOpen}
            autoHideDuration={6000}
            onClose={handleErrorSnackbarClose}
          >
            <Alert
              onClose={handleErrorSnackbarClose}
              severity="error"
              sx={{ width: "100%", borderColor: "green" }}
            >
              {errorMessage || "Something went wrong while fetching data!"}
            </Alert>
          </Snackbar>
          {/* <Box mt={5}>
          <Typography variant="h6">Product MAster List </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Brand</TableCell>
                  <TableCell>Product Type</TableCell>
                  <TableCell>Category </TableCell>
                  <TableCell>Sub Category </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subCategories.map((subCategory) => (
                  <TableRow key={subCategory.ID}>
                    <TableCell>{subCategory.ID}</TableCell>
                    <TableCell>{subCategory.SubCategoryName}</TableCell>
                    <TableCell>{subCategory.CategoryID}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box> */}
        </Box>
      </Box>
      <LoadingComp loading={loading} />
      <ErrorComp error={error} />
    </ThemeProvider>
  );
};

export default ProductMasterUpdate;
