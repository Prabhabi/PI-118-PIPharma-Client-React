import React, { useState, useEffect, createContext, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Box,
} from "@mui/material";
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Category as CategoryIcon,
  Numbers as NumbersIcon,
  Straighten as StraightenIcon,
  ColorLens as ColorLensIcon,
  Description as DescriptionIcon,
  LocalOffer as LocalOfferIcon,
} from "@mui/icons-material";
import axios from "axios";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import ProductDetails from "./productDetails/ProductDetails";
import ProductEdit from "./productEdt/ProductEdit";
import WarningComp from "../../../../components/warningComp/WarningComp";
import { set } from "lodash";
import LoadingComp from "../../../../components/loadingComp/LoadingComp";

export const FormContext = createContext();

const ProductDetailsDialog = ({ data, open, handleClose, fetchProduct }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isEditing, setIsEditing] = useState(false);
  const [localData, setLocalData] = useState(data);
  const images = [data.Image1, data.Image2, data.Image3];
  const [loading, setLoading] = useState(false);
  const [dropdownData, setDropdownData] = useState({
    brandList: [],
    productTypeList: [],
    categoryList: [],
    subCategoryList: [],
    hsnList: [],
    colorList: [],
  });

  const token = Cookies.get("token");
  const sanctumToken = token ? `Bearer ${token.replace(/"/g, "")}` : "";
  const apiUrl = process.env.REACT_APP_URL || "";

  const defaultColorMasterIDs = useMemo(() => {
    try {
      const colorList = JSON.parse(data?.ColorListJson || "[]");
      if (Array.isArray(colorList)) {
        return colorList.map((color) => color?.Color);
      }
      return [];
    } catch (error) {
      return [];
    }
  }, [data.ColorListJson]);

  const { control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      ...data,
      Length: data.Length !== "null" ? String(data.Length) : 0,
      Width: data.Width !== "null" ? String(data.Width) : 0,
      Height: data.Height !== "null" ? String(data.Height) : 0,
      BrandMasterID: data.BrandMasterID ? String(data.BrandMasterID) : "",
      ProductTypeID: data.ProductTypeID ? String(data.ProductTypeID) : "",
      ProductCategoryID: data.ProductCategoryID
        ? String(data.ProductCategoryID)
        : "",
      ProductSubCategoryID: data.ProductSubCategoryID
        ? String(data.ProductSubCategoryID)
        : "",
      HSNMasterID: data.HSNMasterID ? String(data.HSNMasterID) : "",
      ColorMasterID: defaultColorMasterIDs,
      Description: data?.Description, // Ensure Description is not undefined
    },
  });
  //  =======================================quotation warning ======================================
  const [warningStatus, setWarningStatus] = useState(false);
  const [warningData, serWarningData] = useState(null);
  const warningDataFn = (data) => {
    serWarningData(data);
    setWarningStatus(false);
    data && handleDeleteClick();
  };

  //  =============================================================================

  useEffect(() => {
    if (open && data) {
      reset({
        ...data,
        Length: data.Length !== "null" ? String(data.Length) : 0,
        Width: data.Width !== "null" ? String(data.Width) : 0,
        Height: data.Height !== "null" ? String(data.Height) : 0,
        BrandMasterID: data.BrandMasterID ? String(data.BrandMasterID) : "",
        ProductTypeID: data.ProductTypeID ? String(data.ProductTypeID) : "",
        ProductCategoryID: data.ProductCategoryID
          ? String(data.ProductCategoryID)
          : "",
        ProductSubCategoryID: data.ProductSubCategoryID
          ? String(data.ProductSubCategoryID)
          : "",
        HSNMasterID: data.HSNMasterID ? String(data.HSNMasterID) : "",
        ColorMasterID: defaultColorMasterIDs,
        Description: data.Description == "undefined" ? "" : "", // Ensure Description is not undefined
      });
      setLocalData(data);
      setIsEditing(false);
    }
  }, [open, data, reset]);

  useEffect(() => {
    if (open) {
      axios
        .get(`${apiUrl}/api/brands`, {
          headers: { ...(sanctumToken && { Authorization: sanctumToken }) },
        })
        .then((res) =>
          setDropdownData((prev) => ({
            ...prev,
            brandList: res.data.data || res.data,
          }))
        );
      axios
        .get(`${apiUrl}/api/colormaster`, {
          headers: { ...(sanctumToken && { Authorization: sanctumToken }) },
        })
        .then((res) =>
          setDropdownData((prev) => ({
            ...prev,
            colorList: res.data.data || res.data,
          }))
        );
      axios
        .get(`${apiUrl}/api/getHSN`, {
          headers: { ...(sanctumToken && { Authorization: sanctumToken }) },
        })
        .then((res) =>
          setDropdownData((prev) => ({
            ...prev,
            hsnList: res.data.data || res.data,
          }))
        );
    }
  }, [open, apiUrl, sanctumToken]);

  const brandId = watch("BrandMasterID");
  const typeId = watch("ProductTypeID");
  const catId = watch("ProductCategoryID");

  useEffect(() => {
    if (brandId) {
      axios
        .get(`${apiUrl}/api/product-types/${brandId}`, {
          headers: { ...(sanctumToken && { Authorization: sanctumToken }) },
        })
        .then((res) =>
          setDropdownData((prev) => ({
            ...prev,
            productTypeList: res.data.data || res.data,
          }))
        );
    }
  }, [brandId, apiUrl, sanctumToken]);

  useEffect(() => {
    if (typeId) {
      axios
        .get(`${apiUrl}/api/categories/${typeId}`, {
          headers: { ...(sanctumToken && { Authorization: sanctumToken }) },
        })
        .then((res) =>
          setDropdownData((prev) => ({
            ...prev,
            categoryList: res.data.data || res.data,
          }))
        );
    }
  }, [typeId, apiUrl, sanctumToken]);

  useEffect(() => {
    if (catId) {
      axios
        .get(`${apiUrl}/api/subCategories/${catId}`, {
          headers: { ...(sanctumToken && { Authorization: sanctumToken }) },
        })
        .then((res) =>
          setDropdownData((prev) => ({
            ...prev,
            subCategoryList: res.data.data || res.data,
          }))
        );
    }
  }, [catId, apiUrl, sanctumToken]);
  // ====================================onsubmit ===================================
  // const onSubmit = async (formData) => {
  //   try {
  //     const payload = {
  //       ...formData,
  //       BrandMasterID: Number(formData.BrandMasterID) || "",
  //       ProductTypeID: Number(formData.ProductTypeID) || "",
  //       ProductCategoryID: Number(formData.ProductCategoryID) || "",
  //       ProductSubCategoryID: Number(formData.ProductSubCategoryID) || "",
  //       HSNMasterID: Number(formData.HSNMasterID) || "",
  //       Length: Number(formData.Length) || "",
  //       Width: Number(formData.Width) || "",
  //       Height: Number(formData.Height) || "",
  //       Price: Number(formData.Price) || "",
  //       QtyPerBox: Number(formData.QtyPerBox) || "",
  //       ColorMasterID: Array.isArray(formData.ColorMasterID)
  //         ? formData.ColorMasterID.map(Number) // Ensure values are numbers
  //         : [],
  //     };
  //     const res = await axios.patch(
  //       `${apiUrl}/api/updateProductModel/${Number(formData.ProductModelID)}`,
  //       payload,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           ...(sanctumToken && { Authorization: sanctumToken }),
  //         },
  //       }
  //     );
  //     if (res.status === 200 || res.status === 201) {
  //       setIsEditing(false);
  //       setLocalData({ ...localData, ...formData });
  //       handleClose();
  //     } else {
  //       alert("Failed to update product.");
  //     }
  //   } catch (error) {
  //     alert("Failed to update product.");
  //   }
  // };

  const handleDeleteClick = async () => {
    setLoading(true);
    try {
      const res = await axios.put(
        `${apiUrl}/api/deleteProductModel/${Number(localData.ProductModelID)}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            ...(sanctumToken && { Authorization: sanctumToken }),
          },
        }
      );
      if (res.status === 200 || res.status === 201) {
        handleClose();
        fetchProduct();
        setLoading(false);
      } else {
        alert("Failed to delete product.");
        setLoading(false);
      }
    } catch (error) {
      alert("Failed to delete product.");
      setLoading(false);
    }
  };

  const handleCloseWrapper = () => {
    setIsEditing(false);
    handleClose();
  };

  const classicStyles = {
    dialog: {
      "& .MuiPaper-root": {
        border: "1px solid #1a472a",
        borderRadius: "8px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        backgroundColor: "#fff",
      },
    },
    title: {
      color: "#fff",
      fontFamily: '"Crimson Text", serif',
      padding: "8px 24px", // reduced from 16px to 8px
      fontSize: isMobile ? "1.5rem" : "2rem",
      textAlign: "left",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      minHeight: "48px", // add minimum height for consistency
    },
    content: {
      padding: isMobile ? "16px" : "24px",
      backgroundColor: "#fff",
    },
    actions: {
      padding: "16px",
      borderTop: "1px solid #e0e0e0",
      backgroundColor: "#fff",
    },
    editButton: {
      borderColor: "#1a472a",
      color: "#1a472a",
      "&:hover": {
        borderColor: "#0d2415",
        color: "#0d2415",
        backgroundColor: "rgba(26, 71, 42, 0.04)",
      },
    },
    saveButton: {
      backgroundColor: "#1a472a",
      color: "#fff",
      "&:hover": {
        backgroundColor: "#0d2415",
      },
    },
    closeButton: {
      backgroundColor: "#1a472a",
      color: "#fff",
      "&:hover": {
        backgroundColor: "#0d2415",
      },
    },
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseWrapper}
      fullWidth
      maxWidth="md"
      sx={classicStyles.dialog}
      fullScreen={isMobile}
    >
      <DialogTitle sx={classicStyles.title}>
        <CategoryIcon /> Product Details
        <IconButton
          onClick={handleCloseWrapper}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "#fff",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ mt: 1, ...classicStyles.content }}>
        {isEditing ? (
          <FormContext.Provider
            value={{ control, handleSubmit, reset, watch, setValue }}
          >
            <ProductEdit
              dropdownData={dropdownData}
              handleDeleteClick={handleDeleteClick}
              handleCloseWrapper={handleCloseWrapper}
              classicStyles={classicStyles}
              productData={localData}
              reset={reset} // Pass reset function
              handleClose={handleClose}
              setValue={setValue} // Pass setValue function
              fetchProduct={fetchProduct}
            />
          </FormContext.Provider>
        ) : (
          <>
            <ProductDetails data={localData} fetchProduct={fetchProduct} />
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Product Images
              </Typography>
              <Grid container spacing={2}>
                {images.map((image, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    {image ? (
                      <Box
                        sx={{
                          position: "relative",
                          width: "100%",
                          height: "200px",
                          borderRadius: "8px",
                          overflow: "hidden",
                          border: "1px solid #1a472a",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            background: "rgba(255, 255, 255, 0.8)",
                            padding: "4px 8px",
                            borderRadius: "12px",
                            zIndex: 1,
                          }}
                        >
                          Image {index + 1}
                        </Typography>
                        <img
                          src={`${apiUrl}/storage/${image}`}
                          alt={`Product Image ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          width: "100%",
                          height: "200px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px dashed #1a472a",
                          borderRadius: "8px",
                          backgroundColor: "#f5f5f5",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          No Image {index + 1}
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                ))}
              </Grid>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions sx={classicStyles.actions}>
        <Button
          variant="outlined"
          color="error"
          onClick={() => setWarningStatus(true)}
          sx={{
            borderColor: "#b71c1c",
            color: "#b71c1c",
            "&:hover": {
              borderColor: "#7f0000",
              color: "#7f0000",
              backgroundColor: "rgba(183,28,28,0.04)",
            },
          }}
        >
          Delete
        </Button>
        {isEditing || (
          <Button
            variant="outlined"
            onClick={() => setIsEditing(true)}
            startIcon={<EditIcon />}
            sx={classicStyles.editButton}
          >
            Edit
          </Button>
        )}
        {warningStatus && (
          <WarningComp
            warningStatus={warningStatus}
            warningDataFn={warningDataFn}
            message="Are you sure you want to delete this product?"
          />
        )}
        {isEditing ? (
          <Button
            variant="contained"
            // onClick={handleCloseWrapper}
            onClick={() => setIsEditing(false)}
            sx={classicStyles.closeButton}
          >
            Cancel
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleCloseWrapper}
            sx={classicStyles.closeButton}
          >
            Close
          </Button>
        )}
      </DialogActions>
      <LoadingComp loading={loading} />
    </Dialog>
  );
};

export default ProductDetailsDialog;
