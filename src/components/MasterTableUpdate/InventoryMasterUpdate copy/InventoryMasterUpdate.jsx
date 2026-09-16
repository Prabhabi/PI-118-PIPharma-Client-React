import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  IconButton,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import React, { useEffect, useState } from "react";
import axios from "axios";
import WifiChannelIcon from "@mui/icons-material/WifiChannel";
import * as yup from "yup";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import SelectComponent from "react-select";
import CategoryIcon from "@mui/icons-material/Category";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { yupResolver } from "@hookform/resolvers/yup";
import Cookies from "js-cookie";
import { EditLocation, EditNotifications } from "@mui/icons-material";
import { ColorLens } from "@mui/icons-material";

// Validation schema
const schema = yup.object().shape({
  products: yup.array().of(
    yup.object().shape({
      product: yup.object().required("Required"),
      minimum: yup
        .number()
        .required(" Required")
        .min(0, "Minimum must be at least 0"),
      maximum: yup
        .number()
        .required("Required")
        .min(0, "Maximum must be at least 0"),
    })
  ),
});

export default function InventoryMasterUpdate({
  handleInventoryMasterUpdateClose,
}) {
  const [customerSelect, setCustomerSelect] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allProduct, setAllProducct] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [inventoryData, setInventoryData] = useState([]);
  const [page, setPage] = useState(0); // Add pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5); // Add pagination state
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      products: [{ product: null, maximum: 0, minimum: 0 }],
    },
    resolver: yupResolver(schema),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

  const selectComponentStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#ffffff",
      borderColor: state.isFocused ? "#1b5e20" : base.borderColor,
      boxShadow: "none",
      minHeight: "50px",
      minWidth: "12rem",
      "&:hover": {
        borderColor: "#1b5e20",
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
      backgroundColor: state.isFocused ? "#1b5e20" : "#ffffff",
      color: state.isFocused ? "#fff" : "#000",
      padding: "10px",
      "&:hover": {
        backgroundColor: "#1b5e20",
        color: "#fff",
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: "#1b5e20",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#1b5e20",
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
        backgroundColor: "#1b5e20",
        color: "#fff",
      },
    }),
  };

  const fetchMinMax = async (productId, index) => {
    console.log(index);
    try {
      const url = `${process.env.REACT_APP_URL}/api/inventoryByID/${productId}`;

      console.log(url);
      const res = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: sanctumToken,
        },
      });
      if (res.data.data) {
        setValue(`products[${index}].minimum`, res.data.data[0].MinStockLevel);
        setValue(`products[${index}].maximum`, res.data.data[0].MaxStockLevel);
      }
      console.log(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchProduct = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_URL}/api/getProductModels`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: sanctumToken,
          },
        }
      );
      setAllProducct(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchInventoryData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_URL}/api/inventory`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: sanctumToken,
          },
        }
      );
      setInventoryData(
        Array.isArray(res.data) ? res.data : res.data.data || []
      );
    } catch (error) {
      console.error("Error fetching inventory data:", error);
      setInventoryData([]);
    }
  };

  const handleDeleteInventory = async (inventoryId) => {
    if (!window.confirm("Are you sure you want to delete this inventory item?"))
      return;
    try {
      await axios.put(
        `${process.env.REACT_APP_URL}/api/DeleteInventory/${inventoryId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: sanctumToken,
          },
        }
      );
      fetchProduct();
      setOpenSnackbar(true);
    } catch (error) {
      alert("Unable to delete inventory item.");
      console.error("Error deleting inventory:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  console.log(errors);

  useEffect(() => {
    fetchProduct();
    fetchInventoryData();
  }, []);

  console.log(allProduct);

  const produceOptions = allProduct?.map((product, index) => {
    return {
      label: product.ModelNumber,
      name: product.ProductModelID,
    };
  });

  const onSubmit = async (data) => {
    console.log(data);
    const transformedData = data.products.map((product) => ({
      ProductModelID: product.product.name,
      MinStockLevel: product.minimum,
      MaxStockLevel: product.maximum,
    }));
    console.log(transformedData);
    const res = await axios.patch(
      `${process.env.REACT_APP_URL}/api/updateInventoryStock`,
      transformedData,
      {
        headers: {
          Authorization: sanctumToken,
        },
      }
    );
    console.log(res.data);
    setOpenSnackbar(true);
  };

  return (
    <Box sx={{ textAlign: "left", position: "relative", bgcolor: "#e4f4ea" }}>
      <DialogTitle
        sx={{
          backgroundColor: "#0078cf",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EditNotifications sx={{ color: "white" }} />
          <Typography
            variant="h5"
            sx={{ color: "white !important", fontWeight: "bold" }}
          >
            Inventory Dependences
          </Typography>
        </Box>
        <IconButton
          sx={{ color: "white" }}
          onClick={handleInventoryMasterUpdateClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography
          variant="h5"
          sx={{
            mb: 2,
            mt: 5,
            textAlign: "left",
            color: "darkgreen",
            fontWeight: "bold",
          }}
        >
          <Inventory2Icon />
          Inventory Table
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: "darkgreen" }}>
              <TableRow>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  S.No
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Details
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Quantity
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Min Stock Level
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Max Stock Level
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(Array.isArray(inventoryData) ? inventoryData : [])
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product, index) => (
                  <TableRow key={product.ID}>
                    <TableCell>{index + 1 || "--"}</TableCell>
                    <TableCell>
                      {`${product.ModelNumber} / ${product.BrandName} / ${product.ProductSubCategoryName}` ||
                        "--"}
                    </TableCell>
                    <TableCell>
                      {product.Quantity !== undefined ? product.Quantity : "--"}
                    </TableCell>
                    <TableCell>
                      {product.MinStockLevel !== undefined
                        ? product.MinStockLevel
                        : "--"}
                    </TableCell>
                    <TableCell>{product.MaxStockLevel || "--"}</TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteInventory(product.ID)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={inventoryData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              ".MuiTablePagination-select": {
                color: "darkgreen",
              },
              ".MuiTablePagination-displayedRows": {
                color: "darkgreen",
              },
            }}
          />
        </TableContainer>
      </DialogContent>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={
          <b style={{ color: "darkgreen" }}>Inventory updated successfully</b>
        }
      />
    </Box>
  );
}
