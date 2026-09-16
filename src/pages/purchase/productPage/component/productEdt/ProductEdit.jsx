import React, { useContext, useMemo, useState } from "react";
import {
  Grid,
  Box,
  Typography,
  TextField,
  MenuItem,
  Chip,
  Button,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { Controller } from "react-hook-form";
import CategoryIcon from "@mui/icons-material/Category";
import NumbersIcon from "@mui/icons-material/Numbers";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import StraightenIcon from "@mui/icons-material/Straighten";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import DescriptionIcon from "@mui/icons-material/Description";
import SaveIcon from "@mui/icons-material/Save";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { FormContext } from "../ProductDetailsDialog";
import axios from "axios"; // Ensure axios is imported
import Cookies from "js-cookie"; // Import Cookies
import { useQueries } from "@tanstack/react-query";
import {
  categoryMasterApiFn,
  deaseseApiFn,
} from "../../../../../api/commonApi";
import Stack from "@mui/material/Stack"; // Add Stack import
import CloseIcon from "@mui/icons-material/Close"; // Add CloseIcon import

const shapeList = [
  { ID: "Square", Color: "Square" },
  { ID: "Oval", Color: "Oval" },
  { ID: "Circle", Color: "Circle" },
];
const unitList = [
  { ID: "mm", Color: "mm" },
  { ID: "inch", Color: "inch" },
  { ID: "foot", Color: "foot" },
];

const inputStyles = {
  backgroundColor: "#f9f9f9",
  borderRadius: "4px",
};

const ProductEdit = ({
  dropdownData,
  handleClose,
  handleDeleteClick,
  handleCloseWrapper,
  classicStyles,
  productData = {}, // Provide a default empty object for productData
  apiUrl,
  fetchProduct,
  setIsEditing,
  setLocalData,
}) => {
  const { control, handleSubmit, setValue } = useContext(FormContext);
  // ========================================react query ===================================?
  const results = useQueries({
    queries: [
      {
        queryKey: ["deaseseApiFn"],
        queryFn: deaseseApiFn,
      },
      {
        queryKey: ["categoryMasterApi"],
        queryFn: categoryMasterApiFn,
      },
    ],
  });

  // Destructure the responses
  const [diseaseQuery, categoryQuery] = results;

  const isError = diseaseQuery.isError || categoryQuery.isError;
  const diseaseData = diseaseQuery.data?.data?.data || [];
  const categoryData = categoryQuery.data?.data || [];
  // console.log("categoryData", categoryData);
  // ++++++=============================================================================

  // Set initial value for Description
  React.useEffect(() => {
    if (productData.Description) {
      setValue("Description", productData.Description);
    }
  }, [productData, setValue]);

  const [images, setImages] = useState([
    productData.Image1 || null,
    productData.Image2 || null,
    productData.Image3 || null,
  ]);

  const handleImageUpload = (index) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const updatedImages = [...images];
        updatedImages[index] = file; // Store the File object directly
        setImages(updatedImages);
      }
    };
    input.click();
  };
  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;
  const onSubmit = async (formData) => {
    const form = new FormData();

    // Add _method for PUT request
    form.append("_method", "PUT");

    // Basic fields
    form.append("ProductModelID", formData.ProductModelID);
    form.append("ModelNumber", formData.ModelNumber || "");
    form.append("BrandMasterID", formData.BrandMasterID || "");
    form.append("ProductTypeID", formData.ProductTypeID || "");
    form.append("ProductCategoryID", formData.ProductCategoryID || "");
    form.append("ProductSubCategoryID", formData.ProductSubCategoryID || "");
    form.append("HSNMasterID", formData.HSNMasterID || "");
    form.append("Dimension", formData.Dimension || "");
    form.append("Length", formData.Length || "");
    form.append("Width", formData.Width || "");
    form.append("Height", formData.Height || "");
    form.append("Unit", formData.Unit || "");
    form.append("Price", formData.Price || "");
    form.append("Description", formData.Description || "");
    form.append("SizeMasterID", formData.SizeMasterID || "");
    form.append("Shape", formData.Shape || "");
    form.append("Source", "O");
    form.append("QtyPerBox", formData.QtyPerBox || "");
    form.append("DiseaseMasterID", +formData?.DiseaseMasterID);
    form.append("StripQty", +formData?.StripQty || 0);
    form.append("StripOf", +formData?.StripOf || 0);

    // Prepare ColorListJson as array of objects
    const selectedColors = formData.ColorMasterID
      ? (Array.isArray(formData.ColorMasterID)
          ? formData.ColorMasterID
          : [formData.ColorMasterID]
        )
          .map((colorId) => {
            const colorObj =
              typeof colorId === "object"
                ? colorId
                : dropdownData.colorList?.find((c) => c.ID === colorId) || {
                    ID: colorId,
                    Color: "",
                  };
            return {
              ColorMasterID: parseInt(colorObj.ID),
              Color: colorObj.Color || "",
            };
          })
          .filter((color) => !isNaN(color.ColorMasterID))
      : [];

    // Append ColorListJson as a JSON string (never null)
    form.append("ColorListJson", JSON.stringify(selectedColors));

    // Append images
    // images.forEach((image, index) => {
    //   const fieldName = `Image${index + 1}`;
    //   if (image) {
    //     if (image instanceof File) {
    //       form.append(fieldName, image);
    //     } else if (typeof image === "string") {
    //       // Only append the filename, not the full URL
    //       const imagePath = image.replace(
    //         `${process.env.REACT_APP_URL}/storage/`,
    //         ""
    //       );
    //       form.append(fieldName, imagePath);
    //     }
    //   } else {
    //     form.append(fieldName, "");
    //   }
    // });

    try {
      // Log FormData key-value pairs
      for (let pair of form.entries()) {
        console.log(pair[0], pair[1]);
      }
      console.log(
        "ure",
        `${process.env.REACT_APP_URL}/api/updateProductModel/${formData.ProductModelID}`
      );

      const res = await axios({
        method: "post",
        url: `${process.env.REACT_APP_URL}/api/updateProductModel/${formData.ProductModelID}`,
        data: form,
        headers: {
          Authorization: sanctumToken,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Product updated successfully:", res.data);
      handleClose();
      fetchProduct();
    } catch (error) {
      console.log(error);
    }
  };

  // Update initialization of colors with better parsing
  const [initialColorList, setInitialColorList] = useState(() => {
    if (productData.ColorListJson) {
      try {
        const parsed = JSON.parse(productData.ColorListJson);
        return Array.isArray(parsed)
          ? parsed.map((color) => color.ColorMasterID.toString())
          : [];
      } catch (e) {
        // Fallback to ColorList if ColorListJson fails
        if (productData.ColorList) {
          const colors = productData.ColorList.split(":");
          return [colors[0]]; // Take the first ID
        }
        // console.error("Error parsing ColorListJson:", e);
        return [];
      }
    }
    return [];
  });

  // Add useEffect to properly set initial colors
  React.useEffect(() => {
    if (initialColorList.length > 0) {
      setValue("ColorMasterID", initialColorList);
    }
  }, [initialColorList, setValue]);

  const renderSelect = (
    name,
    label,
    options,
    startAdornment,
    multiple = false,
    onReset = null // Add onReset callback
  ) => (
    <Controller
      name={name}
      control={control}
      defaultValue={name === "ColorMasterID" ? initialColorList : ""}
      render={({ field }) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            select
            fullWidth
            label={label}
            {...field}
            value={field.value || (multiple ? [] : "")} // Ensure default value is handled
            onChange={(event) => {
              const value = event.target.value;
              field.onChange(value);
            }}
            SelectProps={{
              multiple: multiple,
              renderValue: (selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {(Array.isArray(selected) ? selected : [selected]).map(
                    (value) => (
                      <Chip
                        key={value}
                        label={
                          options?.find((option) => option.ID === value)
                            ?.Color || value
                        }
                        sx={{
                          backgroundColor: "blue", // Green background
                          color: "#fff", // White text
                        }}
                      />
                    )
                  )}
                </Box>
              ),
            }}
          >
            {(options || []).map((option) => (
              <MenuItem key={option.ID} value={option.ID}>
                {option.Color}
              </MenuItem>
            ))}
          </TextField>
          {onReset && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                onReset();
                field.onChange([]);
              }}
              sx={{ minWidth: "fit-content", padding: "4px 8px" }}
            >
              Reset
            </Button>
          )}
        </Box>
      )}
    />
  );

  // Add imagea and imageError state
  const [imagea, setImagea] = useState([null, null, null]);
  const [imageError, setImageError] = useState(["", "", ""]);

  // Add handleImageChange1 function
  const handleImageChange1 = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedImages = [...imagea];
      updatedImages[index] = file;
      setImagea(updatedImages);
      // Clear error for this index
      const updatedErrors = [...imageError];
      updatedErrors[index] = "";
      setImageError(updatedErrors);
    }
  };

  // Add handleImageRemove function
  const handleImageRemove = (index) => {
    const updatedImages = [...imagea];
    updatedImages[index] = null;
    setImagea(updatedImages);
    // Clear error for this index
    const updatedErrors = [...imageError];
    updatedErrors[index] = "";
    setImageError(updatedErrors);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* <Typography variant="h6">Product Information</Typography> */}
            {/* <Controller
              name="BrandMasterID"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  fullWidth
                  label="Brand"
                  {...field}
                  InputProps={{
                    startAdornment: (
                      <CategoryIcon sx={{ color: "#1a472a", mr: 1 }} />
                    ),
                  }}
                >
                  {(dropdownData.brandList || []).map((brand) => (
                    <MenuItem key={brand.ID} value={brand.ID}>
                      {brand.BrandName}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            /> */}
            {/* <Controller
              name="ProductTypeID"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  fullWidth
                  label="Product Type"
                  {...field}
                  InputProps={{
                    startAdornment: (
                      <CategoryIcon sx={{ color: "#1a472a", mr: 1 }} />
                    ),
                  }}
                >
                  {(dropdownData.productTypeList || []).map((type) => (
                    <MenuItem key={type.ID} value={type.ID}>
                      {type.ProductTypeName}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            /> */}
            <Controller
              name="ProductCategoryID"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  fullWidth
                  label="Category"
                  {...field}
                  InputProps={{
                    startAdornment: (
                      <CategoryIcon sx={{ color: "#1a472a", mr: 1 }} />
                    ),
                  }}
                >
                  {(dropdownData.categoryList || []).map((category) => (
                    <MenuItem key={category.ID} value={category.ID}>
                      {category.ProductCategoryName}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              name="ProductSubCategoryID"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  fullWidth
                  label="Manufacturer"
                  {...field}
                  InputProps={{
                    startAdornment: (
                      <CategoryIcon sx={{ color: "#1a472a", mr: 1 }} />
                    ),
                  }}
                >
                  {(dropdownData.subCategoryList || []).map((subCategory) => (
                    <MenuItem key={subCategory.ID} value={subCategory.ID}>
                      {subCategory.ProductSubCategoryName}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              name="DiseaseMasterID"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  fullWidth
                  label="Disese"
                  {...field}
                  InputProps={{
                    startAdornment: (
                      <CategoryIcon sx={{ color: "#1a472a", mr: 1 }} />
                    ),
                  }}
                >
                  {(diseaseData || []).map((subCategory, index) => (
                    <MenuItem key={index} value={subCategory.ID}>
                      {subCategory.DiseaseName}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            {/* <Controller
              name="HSNMasterID"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  fullWidth
                  label="HSN Code"
                  {...field}
                  InputProps={{
                    startAdornment: (
                      <NumbersIcon sx={{ color: "#1a472a", mr: 1 }} />
                    ),
                  }}
                >
                  {(dropdownData.hsnList || []).map((hsn) => (
                    <MenuItem key={hsn.ID} value={hsn.ID}>
                      {hsn.HSNCode}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            /> */}
            <Controller
              name="ModelNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Medicine Name"
                  {...field}
                  InputProps={{
                    startAdornment: (
                      <NumbersIcon sx={{ color: "#1a472a", mr: 1 }} />
                    ),
                  }}
                />
              )}
            />

            {/* {renderSelect(
              "ColorMasterID",
              "Colors",
              dropdownData.colorList,
              null,
              true,
              () => setValue("ColorMasterID", []) // Use setValue to reset colors
            )} */}
            <Controller
              name="Length"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Strength Value"
                  type="number"
                  sx={{ mb: 2, mr: 1.5, width: "100%", ...inputStyles }} // Changed width to 30%
                />
              )}
            />
            <Controller
              name="Dimension"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="strength-power-unit-label">
                    StrengthPowertUnit
                  </InputLabel>
                  <Select
                    {...field}
                    labelId="strength-power-unit-label"
                    id="strength-power-unit-select"
                    label="StrengthPowertUnit"
                    sx={inputStyles}
                  >
                    <MenuItem value="mg">mg</MenuItem>
                    <MenuItem value="mcg">mcg</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6} sx={{ mt: 2 }}>
          <Controller
            name="QtyPerBox"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Qty / Box"
                fullWidth
                // type="number"
                // error={!!errors.QtyPerBox}
                // helperText={errors.QtyPerBox?.message}
                sx={{
                  mb: 2,
                  ...inputStyles,
                  "& .MuiFormHelperText-root": {
                    width: "100%",
                    ml: 0,
                    mt: 0,
                  },
                }}
              />
            )}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="StripOf"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Strip Of"
                    fullWidth
                    // type="number"
                    // error={!!errors.QtyPerBox}
                    // helperText={errors.QtyPerBox?.message}
                    sx={{
                      mb: 2,
                      ...inputStyles,
                      "& .MuiFormHelperText-root": {
                        width: "100%",
                        ml: 0,
                        mt: 0,
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="StripQty"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Strip Qty"
                    fullWidth
                    // type="number"
                    // error={!!errors.QtyPerBox}
                    // helperText={errors.QtyPerBox?.message}
                    sx={{
                      mb: 2,
                      ...inputStyles,
                      "& .MuiFormHelperText-root": {
                        width: "100%",
                        ml: 0,
                        mt: 0,
                      },
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
          {/* <Stack
                   direction="row"
                   sx={{
                     gap: "1rem",
                     alignItems: "center",
                     justifyContent: "space-between",
                   }}
                 >
                   <Typography variant="body1" sx={{ color: "darkgreen", mb: 2 }}>
                     Dimensions
                   </Typography>
                   <Controller
                     name="Dimension"
                     control={control}
                     defaultValue={1}
                     render={({ field }) => (
                       <RadioGroup row {...field} sx={{ mb: 2 }}>
                         {["1D", "2D", "3D"]?.map((dim, index) => (
                           <FormControlLabel
                             key={dim}
                             value={+index + 1}
                             control={<Radio />}
                             label={dim}
                             onChange={(e) => field.onChange(e)}
                           />
                         ))}
                       </RadioGroup>
                     )}
                   />
                 </Stack> */}
          <Stack sx={{ direction: "row" }}>
            <Controller
              name="Source"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Block"
                  sx={{ mb: 2, ...inputStyles }} // Changed width to 30%
                />
              )}
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <Box sx={{ width: "50%" }}>
              {renderSelect("Unit", "UOM", [
                { ID: "mm", Color: "Tab" },
                { ID: "inch", Color: "Bottol" },
                { ID: "foot", Color: "Capsul" },
                { ID: "foot", Color: "Box" },
              ])}
            </Box>
            {/* {renderSelect("Shape", "Shape", [
                     { ID: "Square", Color: "Square" },
                     { ID: "Oval", Color: "Oval" },
                     { ID: "Circle", Color: "Circle" },
                   ])} */}
            <Controller
              name="Price"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="MRP"
                  fullWidth
                  // error={!!errors.Price}
                  // helperText={errors.Price?.message}
                  sx={{ mb: 2, width: "50%", ...inputStyles }}
                  defaultValue={0}
                />
              )}
            />
          </Stack>
          <Controller
            name="Description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                fullWidth
                // error={!!errors.Description}
                // helperText={errors.Description?.message}
                sx={{ mt: 2, ...inputStyles }}
                multiline
                rows={3}
              />
            )}
          />
        </Grid>
      </Grid>
      <Box
        sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 2, mt: 2 }}
      >
        {images.map((image, index) => (
          <Box
            key={index}
            sx={{
              position: "relative",
              width: 300,
              height: 200,
              border: "1px solid #ccc",
              borderRadius: "8px",
              overflow: "hidden",
              cursor: "pointer",
            }}
            onClick={() => handleImageUpload(index)}
          >
            {images[index] ? (
              <img
                src={
                  images[index] instanceof File
                    ? URL.createObjectURL(images[index])
                    : `${process.env.REACT_APP_URL}/storage/${images[index]}`
                }
                alt={`Product Image ${index + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: "#aaa",
                }}
              >
                <AddPhotoAlternateIcon />
              </Box>
            )}
          </Box>
        ))}
      </Box>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "center",
          ...classicStyles.actions,
        }}
      >
        {/* <Button
          variant="outlined"
          color="error"
          onClick={handleDeleteClick}
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
        </Button> */}
        <Button
          type="submit"
          variant="contained"
          startIcon={<SaveIcon />}
          sx={{ width: "rem", height: "3rem", ...classicStyles.saveButton }}
        >
          Save
        </Button>
      </DialogActions>
    </form>
  );
};

export default ProductEdit;
