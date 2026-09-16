import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  Button,
  Grid,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Stack,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Chip from "@mui/material/Chip";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";
import LoadingComp from "./../../../../components/loadingComp/LoadingComp";
import { entries, set } from "lodash";
import Cookies from "js-cookie"; // Import Cookies
import CreatableSelect from "react-select/creatable";
import WarningComp from "../../../../components/warningComp/WarningComp";
import SelectCreate from "../../../../api/ui/selectCreateComponent/SelectCreate";
import { categoryMasterApiFn, deaseseApiFn } from "../../../../api/commonApi";
import { useQueries } from "@tanstack/react-query";

const validationSchema = Yup.object({
  // Brand: Yup.number().required("Select a brand"),
  // ProductTypeID: Yup.number().required("Select a product type"),
  // CategoryID: Yup.number().required("Select a category"),
  ModelNumber: Yup.string().required("Enter Brand Name"),
  ProductSubCategoryID: Yup.number()
    .typeError("Select a product sub-category")
    .required("Select a product sub-category"),
  // HSNMasterID: Yup.number().nullable(),
  Dimension: Yup.string().nullable(),

  // QtyPerBox: Yup.number().required("Enter quantity per box"),
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const inputStyles = {
  backgroundColor: "white",
  "& .MuiInputLabel-root": {
    color: "darkgreen",
    "&.Mui-focused": {
      color: "darkgreen",
    },
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "darkgreen",
    },
    "&:hover fieldset": {
      borderColor: "darkgreen",
    },
    "&.Mui-focused fieldset": {
      borderColor: "darkgreen",
    },
  },
  // Styles for all dropdown sections
  "& .MuiSelect-root": {
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#385637",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#385637",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#385637",
    },
    "& .MuiInputBase-input": {
      color: "#000", // Change text color to black for visibility
    },
  },
  "& .MuiSelect-select": {
    color: "#385637", // Change selected option text color to black
  },
  "& .MuiInputLabel-root": {
    color: "darkgreen", // Change label text color to dark green
    "&.Mui-focused": {
      color: "darkgreen", // Ensure label text color remains dark green after focus
    },
  },
};

const CustomSelect = styled(Select)(({ theme }) => ({
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "darkgreen",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "darkgreen",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "darkgreen",
  },
  "& .MuiInputBase-input": {
    color: "#000", // Change text color to black for visibility
  },
  "& .MuiSelect-select": {
    color: "#385637", // Change selected option text color to black
  },
  "& .MuiInputLabel-root": {
    color: "darkgreen", // Change label text color to dark green
    "&.Mui-focused": {
      color: "darkgreen", // Ensure label text color remains dark green after focus
    },
  },
}));

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ProductCreateForm({ fetchProduct }) {
  const [selectBrand, setSelectBrand] = useState("");
  const [brandList, setBrandList] = useState([]);
  const [productTypeList, setProductTypeList] = useState([]);
  const [catagoryList, setCatagoryList] = useState([]);
  const [selectdCatagory, setSelectedCatagory] = useState(null);
  const [subCatagoryList, setSubCatagoryList] = useState([]);
  const [selecctedProductType, setSelectedProductType] = useState(null);
  const [heightWidthArr, setHeightWidthArr] = useState([]);
  const [colorList, setColorList] = useState([]);
  const [hsnList, setHsnList] = useState([]);
  const [imagea, setImagea] = useState([null, null, null]);
  const [imageError, setImageError] = useState([null, null, null]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingProductModels, setExistingProductModels] = useState([]);
  const [selectedfetchData, setSelectedfetchData] = useState(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [typeFn, setTypeFn] = useState("");
  const [postDone, setPostDone] = useState(false);

  const [selectedSubCategoryOption, setSelectedSubCategoryOption] =
    useState(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue, // <-- add setValue here
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      ModelNumber: "",
      ProductSubCategoryID: "",
      HSNMasterID: "",
      Dimension: "",
      Length: "",
      Width: "",
      Height: "",
      Unit: "",
      Price: 0,
      SizeMasterID: "",
      Shape: "",
      StrengthPowertUnit: "", // <-- add this line
    },
  });
  console.log(errors);
  const selectComponentStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#ffffff",
      borderColor: state.isFocused ? "blue" : base.borderColor,
      boxShadow: "none",
      minHeight: "50px",
      "&:hover": {
        borderColor: "blue",
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#ffffff",
      boxShadow: "none",
      zIndex: 100,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "blue" : "#ffffff",
      color: state.isFocused ? "#fff" : "#000",
      padding: "10px",
      "&:hover": {
        color: "#fff",
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: "blue",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "blue",
      color: "#fff",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#fff",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#fff",
      "&:hover": {
        backgroundColor: "blue",
        color: "#fff",
      },
    }),
  };

  const watchDimension = watch("Dimension");

  // useEffect(() => {
  //   setHeightWidthArr([ "Strength Value", "Height"]);
  // }, [watchDimension]);

  const handleImageChange1 = (event, index) => {
    const file = event.target.files[0];
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (file && !validTypes.includes(file.type)) {
      const newErrors = [...imageError];
      newErrors[index] =
        "Invalid file type. Only PNG, JPG, and JPEG are allowed.";
      setImageError(newErrors);
      return;
    }
    const newImg = [...imagea];
    newImg[index] = file;
    setImagea(newImg);

    const newErrors = [...imageError];
    newErrors[index] = null;
    setImageError(newErrors);
  };

  const handleImageRemove = (index) => {
    const newImg = [...imagea];
    newImg[index] = null;
    setImagea(newImg);
  };

  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

  const fetchData = async (url, setter, label) => {
    // setLoading(true);
    try {
      const res = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: sanctumToken,
        },
      });
      // console.log("res", res?.data);
      // console.log(label);
      // label === "Subcategories" &&
      //   setValue("ProductSubCategoryID", Number(res?.data?.inserted_ids?.[0])); // <-- setValue from react-hook-form

      setter(res.data.data || res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(
      `${process.env.REACT_APP_URL}/api/brands`,
      setBrandList,
      "Brands"
    );
    fetchData(
      `${process.env.REACT_APP_URL}/api/colormaster`,
      setColorList,
      "Colors"
    );
    fetchData(`${process.env.REACT_APP_URL}/api/getHSN`, setHsnList, "HSN");
  }, []);

  // useEffect(() => {
  //   if (selectBrand) {
  //     setProductTypeList([]);
  //     fetchData(
  //       `${process.env.REACT_APP_URL}/api/product-types/${selectBrand}`,
  //       setProductTypeList,
  //       "Product Types"
  //     );
  //   }
  // }, [selectBrand]);

  useEffect(() => {
    fetchData(
      `${process.env.REACT_APP_URL}/api/categories/1`,
      setCatagoryList,
      "Categories"
    );
  }, []);

  useEffect(() => {
    if (selectdCatagory)
      fetchData(
        `${process.env.REACT_APP_URL}/api/subCategories/${selectdCatagory}`,
        setSubCatagoryList,
        "Subcategories"
      );
  }, [selectdCatagory]);
  // console.log(errors);

  useEffect(() => {
    const fetchProductModels = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/api/getProductModels`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: sanctumToken,
            },
          }
        );
        setExistingProductModels(response.data);
      } catch (error) {
        // console.error("Error fetching product models:", error);
      }
    };

    fetchProductModels();
  }, []);
  //  =======================================quotation warning section ======================================
  const [warningStatus, setWarningStatus] = useState(false);
  const [warningData, setWarningData] = useState(null);
  const [formData, setFormData] = React.useState(null);

  const warningDataFn = async (data1) => {
    setPostDone(false);
    setWarningStatus(false);
    data1 && setLoading(true);

    let subCategoryName = formData;
    let pscShortName = "";

    // Split logic based on "*#"
    if (formData.includes("*#")) {
      const parts = formData.split("*#");
      subCategoryName = parts[0].trim();
      pscShortName = parts[1]?.trim() || "";
    }

    const finalData =
      typeFn === "company"
        ? {
            ProductSubCategoryList: [
              {
                ProductSubCategoryName: subCategoryName,
                ProductCategoryID: watch("CategoryID"),
                PSCShortName: pscShortName,
              },
            ],
          }
        : {
            DiseaseName: formData,
            DiseaseCode: "I10",
            DiseaseCategory: "Cardiovascular",
            Symptoms: "Headache, dizziness",
            Description: "Chronic high blood pressure.",
            Remarks: "Monitor regularly",
          };

    console.log("Final data to be sent:", finalData);

    const url =
      typeFn === "company"
        ? `${process.env.REACT_APP_URL}/api/postProductSubCategories`
        : `${process.env.REACT_APP_URL}/api/PostDisease`;

    try {
      const res = await axios.post(url, finalData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: sanctumToken,
        },
      });

      console.log("Response data:", res);
      diseaseQuery.refetch();
      setLoading(false);

      fetchData(
        `${process.env.REACT_APP_URL}/api/subCategories/${selectdCatagory}`,
        setSubCatagoryList,
        "Subcategories"
      );

      fetchData(
        `${process.env.REACT_APP_URL}/api/subCategories/${selectdCatagory}`,
        (data) => {
          setSubCatagoryList(data);
          setLoading(false);
        },
        "Subcategories"
      );
    } catch (error) {
      console.error("Error creating product sub-category:", error);
      setLoading(false);
    }
  };

  //  =======================================quotation warning section ======================================
  const onCreateCompany = async (data) => {
    setWarningStatus(true);
    setFormData(data);
    setTypeFn("company");
  };
  const onCreateDisease = async (data) => {
    setWarningStatus(true);
    setFormData(data);
    setTypeFn("disease");
  };

  //  =============================================================================

  const renderSelect = (name, label, list, setter, multiple = false) => (
    <FormControl
      fullWidth
      sx={{ mb: 2 }}
      variant="outlined"
      error={!!errors[name]}
    >
      <InputLabel
        id={`${name}-label`}
        sx={{ color: "darkgreen", "&.Mui-focused": { color: "darkgreen" } }}
      >
        {label}
      </InputLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <CustomSelect
            {...field}
            labelId={`${name}-label`}
            id={`${name}-select`}
            label={label}
            multiple={multiple}
            value={field.value || []}
            onChange={(e) => {
              field.onChange(e);
              setter && setter(e.target.value);
            }}
            input={
              multiple ? (
                <OutlinedInput id="select-multiple-chip" label={label} />
              ) : undefined
            }
            renderValue={
              multiple
                ? (selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected?.map((value) => (
                        <Chip
                          key={value}
                          label={
                            colorList.find((color) => color.ID === value)
                              ?.Color || value
                          }
                        />
                      ))}
                    </Box>
                  )
                : undefined
            }
            MenuProps={MenuProps}
            sx={inputStyles} // Styles for all dropdown sections
          >
            {list?.map((item) => (
              <MenuItem key={item.ID} value={item.ID}>
                {name === "ProductTypeID"
                  ? item.ProductTypeName
                  : name === "CategoryID"
                    ? item.ProductCategoryName
                    : name === "ProductSubCategoryID"
                      ? item.ProductSubCategoryName
                      : item.BrandName || item.HSNCode || item.Color}
              </MenuItem>
            ))}
          </CustomSelect>
        )}
      />
      {errors[name] && (
        <Typography color="error" variant="caption">
          {errors[name]?.message}
        </Typography>
      )}
    </FormControl>
  );

  const logFormData = (formData) => {
    console.log("Final data:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    // Fetch latest product models before validation
    let latestProductModels = [];
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_URL}/api/getProductModels`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: sanctumToken,
          },
        }
      );
      latestProductModels = response.data;
      setLoading(false);
    } catch (error) {
      // console.error("Error fetching product models:", error);
      setLoading(false);
    }

    const modelNumberExists = latestProductModels.some(
      (product) => product.ModelNumber === data.ModelNumber
    );

    if (modelNumberExists) {
      setSnackbarMessage("Model number already exists");
      setOpenSnackbar(true);
      setSnackbarSeverity("error"); // Set snackbar severity to error
      return;
    }

    const qtypBox = Number(data.QtyPerBox) || 0;
    // console.log(qtypBox);
    const formData = new FormData();
    formData.append("ModelNumber", data.ModelNumber);
    formData.append("BrandMasterID", 1);
    formData.append("ProductTypeID", 1);
    formData.append("ProductCategoryID", data.CategoryID);
    formData.append("ProductSubCategoryID", data.ProductSubCategoryID);
    formData.append("HSNMasterID", data.HSNMasterID);
    formData.append("Dimension", data.Dimension);
    formData.append("Length", data.Length || null);
    formData.append("Width", data.Width || null);
    formData.append("Height", data.Height || null);
    formData.append("Unit", data.Unit);
    formData.append("Price", +data.Price || 0);
    formData.append("Description", data.Description);
    formData.append("SizeMasterID", 6);
    formData.append("Shape", data.Shape);
    formData.append("Source", "O");
    formData.append("QtyPerBox", qtypBox);
    formData.append("DiseaseMasterID", +data?.DiseaseMasterID);
    formData.append("StripQty", +data?.StripQty || 0);
    formData.append("StripOf", +data?.StripOf || 0);

    if (data.ColorMasterID && data.ColorMasterID.length > 0) {
      formData.append(
        "ColorListJson",
        JSON.stringify(
          data.ColorMasterID.map((color) => ({ ColorMasterID: color }))
        )
      );
    } else {
      formData.append("ColorListJson", JSON.stringify([]));
    }

    if (imagea[0]) formData.append("Image1", imagea[0]);
    if (imagea[1]) formData.append("Image2", imagea[1]);
    if (imagea[2]) formData.append("Image3", imagea[2]);

    logFormData(formData);

    // console.log(Object.fromEntries(formData.entries()));
    console.log("formData", formData);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_URL}/api/products`,
        formData,
        {
          headers: {
            Authorization: sanctumToken,
          },
        }
      );
      // console.log("Response data:", res.data);
      setSnackbarMessage("Product model inserted successfully");
      setOpenSnackbar(true);
      setSnackbarSeverity("success"); // Set snackbar severity to success
      reset((formValues) => ({
        ModelNumber: "",
        ProductSubCategoryID: "",
        HSNMasterID: "",
        Dimension: "",
        Length: "",
        Width: "",
        Height: "",
        Unit: "",
        Price: 0,
        SizeMasterID: "",
        Shape: "",
        Description: "",
        QtyPerBox: "",
        // Preserve Brand, ProductTypeID, CategoryID
        Brand: formValues.Brand,
        ProductTypeID: formValues.ProductTypeID,
        CategoryID: formValues.CategoryID,
      }));
      setImagea([null, null, null]); // Clear images after submitting
      fetchProduct();
      setLoading(false);
    } catch (err) {
      // console.log("Error response data:", err.response.data);
      setLoading(false);
      console.log("Error:", err);
    }
  };
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

  const isLoading =
    diseaseQuery.isLoading || categoryQuery.isLoading || loading;

  const isError = diseaseQuery.isError || categoryQuery.isError;
  const diseaseData = diseaseQuery.data?.data?.data || [];
  const categoryData = categoryQuery.data?.data || [];
  // console.log("categoryData", categoryData);
  // ++++++=============================================================================

  // Prepare options for CreatableSelect
  const subCategoryOptions =
    subCatagoryList?.map((item) => ({
      value: item.ID,
      label: item.ProductSubCategoryName,
    })) || [];
  const deaseseOptions =
    diseaseData?.map((item) => ({
      value: item.ID,
      label: item.DiseaseName,
    })) || [];
  // console.log("diseaseData", diseaseData);
  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ p: 3, mx: "auto" }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {/* {renderSelect("Brand", "Brand", brandList, setSelectBrand)} */}
          {/* {renderSelect(
            "ProductTypeID",
            "Product Type",
            productTypeList,
            setSelectedProductType
          )} */}
          {renderSelect(
            "CategoryID",
            "Category",
            catagoryList,
            setSelectedCatagory
          )}
          {/* Use SelectCreate component for ProductSubCategoryID ------------------------------- */}
          <SelectCreate
            control={control}
            options={subCategoryOptions}
            onCreateFn={onCreateCompany}
            selectedOption={selectedSubCategoryOption}
            // warningDataFn={onCreateCompany}
            selectedfetchData={selectedfetchData}
            name="ProductSubCategoryID"
            label="Menufactrer"
            postDone={postDone}
          />
          {errors.ProductSubCategoryID && (
            <Typography color="error" variant="caption">
              {errors.ProductSubCategoryID?.message}
            </Typography>
          )}
          {/* Use SelectCreate component for ProductSubCategoryID ------------------------------- */}
          <SelectCreate
            control={control}
            options={deaseseOptions}
            onCreateFn={onCreateDisease}
            selectedOption={selectedSubCategoryOption}
            // warningDataFn={onCreateCompany}
            selectedfetchData={selectedfetchData}
            name="DiseaseMasterID"
            label="Disease"
            postDone={postDone}
          />
          {errors.ProductSubCategoryID && (
            <Typography color="error" variant="caption">
              {errors.ProductSubCategoryID?.message}
            </Typography>
          )}
          {/* ======================================================================= */}
          <Controller
            name="ModelNumber"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Medicine Name"
                fullWidth
                error={!!errors.ModelNumber}
                helperText={
                  errors.ModelNumber ? `${errors.ModelNumber.message}` : ""
                }
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
          {/* {renderSelect("ColorMasterID", "Color", colorList, null, true)} */}
          {/* {renderSelect("HSNMasterID", "HSN no", hsnList)} */}

          {/* <Grid item xs={12} sm={12}> */}
          <Controller
            name="length"
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
          {/* </Grid>{" "} */}
        </Grid>
        <Grid item xs={12} md={6}>
          {/* <Controller
            name="QtyPerBox"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Qty / Box"
                fullWidth
                // type="number"
                error={!!errors.QtyPerBox}
                helperText={errors.QtyPerBox?.message}
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
          /> */}
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
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <Controller
                name="StripQty"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Strip Qty"
                    fullWidth
                    // type="number"
                    error={!!errors.QtyPerBox}
                    helperText={errors.QtyPerBox?.message}
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
            </Grid> */}
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

          <Stack direction="row" spacing={2}>
            {renderSelect("Unit", "UOM", [
              { ID: "Tablet", Color: "Tablet" },
              { ID: "Bottle", Color: "Bottle" },
              { ID: "Capsule", Color: "Capsule" },
              { ID: "Drop", Color: "Drop" },
            ])}
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
                  error={!!errors.Price}
                  helperText={errors.Price?.message}
                  sx={{ mb: 2, ...inputStyles }}
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
                error={!!errors.Description}
                helperText={errors.Description?.message}
                sx={{ mt: 2, ...inputStyles }}
                multiline
                rows={3}
              />
            )}
          />
          <Typography
            variant="body1"
            sx={{ mt: 1.5, mb: 0.1, color: "darkgreen" }}
          >
            Add Images
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            {[0, 1, 2].map((index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  // alignItems: "center",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  flexDirection: "column", // Add this line to stack input and image vertically
                }}
              >
                <input
                  type="file"
                  id={`image-${index}`}
                  accept="image/jpeg, image/png, image/jpg, image/gif"
                  onChange={(e) => handleImageChange1(e, index)}
                  key={imagea[index] ? imagea[index].name : `empty-${index}`}
                  style={{
                    width: "5.5rem",
                    marginBottom: "0.5rem", // Add spacing between input and image
                  }}
                />
                {imagea[index] && (
                  <>
                    <Typography variant="caption" sx={{ mb: 1 }}>
                      {imagea[index].name}
                    </Typography>
                    <Box
                      sx={{
                        position: "relative",
                        width: "80px",
                        height: "80px",
                      }}
                    >
                      <img
                        src={URL.createObjectURL(imagea[index])}
                        alt={`Preview ${index}`}
                        style={{
                          width: "50%",
                          height: "50%",
                        }}
                      />
                      <CloseIcon
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          cursor: "pointer",
                          backgroundColor: "white",
                          borderRadius: "50%",
                          transform: "translate(30%, -30%)",
                        }}
                        onClick={() => handleImageRemove(index)}
                      />
                    </Box>
                    {imageError[index] && (
                      <Typography color="error" variant="caption">
                        {imageError[index]}
                      </Typography>
                    )}
                  </>
                )}
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          type="submit"
          variant="contained"
          sx={{
            mt: 3,
            bgcolor: "darkgreen",
            height: "3rem",
            width: "10rem",
          }}
        >
          Add product
        </Button>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <LoadingComp loading={loading} />
      {warningStatus && (
        <WarningComp
          warningStatus={warningStatus}
          warningDataFn={warningDataFn}
          message="Are you sure you want to Add this?"
        />
      )}
    </Box>
  );
}
