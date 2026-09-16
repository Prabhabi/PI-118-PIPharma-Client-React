import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  TablePagination,
  Stack,
  Grid,
} from "@mui/material";
import Select from "react-select";
import ReactSelect from "react-select";

import ProductDetailsDialog from "./ProductDetailsDialog";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import Cookies from "js-cookie"; // Import Cookies

export default function ProductModelTable({ data, fetchProduct, diseaseData }) {
  // const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [detailsData, setDetilsData] = useState({});
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [diseaseSelect, setDiseaseSelect] = useState(null);

  // for item =========================================================
  const option1 = {
    value: "All",
    label: "All",
    // name: `${item.ModelNumber}`,
    // date: item?.SupplierDetails?.SupplierEntryTimeStamp,
  };
  // const diseaseOptions = [
  //   option1,
  //   ...diseaseData.map((item) => ({
  //     value: item.ProductModelID,
  //     label: item.DiseaseName ? `${item.DiseaseName}` : "",
  //     // name: `${item.ModelNumber}`,
  //     // date: item?.SupplierDetails?.SupplierEntryTimeStamp,
  //   })),
  // ];
  const diseaseOptions = [
    { value: "all", label: "All" }, // ✅ added value
    ...diseaseData.map((item) => ({
      value: item.ID || item.DiseaseName, // fallback if no ProductModelID
      label: item.DiseaseName || "Unknown",
    })),
  ];

  const handleClose = () => setOpen(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // console.log(data);
  console.log("diseaseSelect state:", diseaseSelect);
  console.log(
    "value passed to ReactSelect:",
    diseaseOptions.find((opt) => opt.value === diseaseSelect) ||
      diseaseSelect ||
      null
  );

  useEffect(() => {
    // Filter data based on search query
    setFilteredData(
      data?.filter((item) =>
        `${item.ModelNumber} ${item.ProductSubCategoryName} ${item.ProductCategoryName} ${item.ProductTypeName} ${item.BrandName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, data]);

  console.log(filteredData);
  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;
  // =================================feching for product by disease========================================
  const fetchProductByDisease = async (selectedOption) => {
    try {
      const response =
        selectedOption.value === "all" ||
        (await axios.get(
          `${process.env.REACT_APP_URL}/api/getProductModelsFromDisease?DiseaseMasterID=${selectedOption.value}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: sanctumToken,
            },
          }
        ));
      console.log("data", selectedOption.value);
      console.log("Response data:", response.data.data);
      selectedOption.value == "all" || setFilteredData(response.data.data);
      // latestProductModels = response.data;
      // setLoading(false);
    } catch (error) {
      // console.error("Error fetching product models:", error);
      // setLoading(false);
    }
    selectedOption.value == "all" && setFilteredData(data);
  };
  console.log("filteredData after fetch:", filteredData);
  // =========================================================================

  return (
    <div>
      {/* <div style={{ marginBottom: "1rem" }}> */}
      <Grid
        container
        // justifyContent="center"
        alignItems="center"
        spacing={2}
        sx={{
          width: "100%", // full width
          px: 0, // remove left/right padding
          mb: 2, // margin-bottom
        }}
      >
        {/* 1 part */}

        {/* <Grid item xs={2}>
          <Select
            value={
              diseaseOptions.find((opt) => opt.value === diseaseSelect) || null
            }
            options={diseaseOptions}
            placeholder="Select Disease"
            onChange={(selectedOption) =>
              setDiseaseSelect(selectedOption?.value)
            }
            isSearchable={true}
            styles={{
              control: (provided, state) => ({
                ...provided,
                minHeight: "3.2rem",
                // minWidth: "500px", // <-- Added here
                border: state.isFocused
                  ? "1px solid #4caf50"
                  : "1px solid #c4c4c4",
                boxShadow: state.isFocused ? "0 0 0 1px #4caf50" : "none",
                "&:hover": {
                  border: "1px solid #4caf50",
                },
                backgroundColor: "#fff",
              }),
              menu: (provided) => ({
                ...provided,
                zIndex: 9999,
              }),
            }}
          />
        </Grid> */}
        <Grid item xs={3}>
          <ReactSelect
            name="selectOrderRequest"
            options={diseaseOptions}
            value={diseaseSelect} // must be single object or null
            onChange={(selectedOption) => {
              setDiseaseSelect(selectedOption);
              fetchProductByDisease(selectedOption);
            }}
            isClearable
            isMulti={false} // 👈 force single select
            placeholder="Select Order Request"
            styles={{
              control: (provided, state) => ({
                ...provided,
                minHeight: "3.2rem",
                // minWidth: "500px", // <-- Added here
                border: state.isFocused
                  ? "1px solid #4caf50"
                  : "1px solid #c4c4c4",
                boxShadow: state.isFocused ? "0 0 0 1px #4caf50" : "none",
                "&:hover": {
                  border: "1px solid #4caf50",
                },
                backgroundColor: "#fff",
              }),
              menu: (provided) => ({
                ...provided,
                zIndex: 9999,
              }),
            }}
          />
        </Grid>

        {/* 4 parts */}
        <Grid item xs={9}>
          <TextField
            placeholder="Search...Products"
            variant="outlined"
            fullWidth
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: "#006400", mr: 1, color: "blue" }} />
              ),
              sx: { height: "56px" },
            }}
            sx={{
              width: { xs: "100%", md: "100%" },
              mr: { xs: 0, md: 2 },
              "& .MuiOutlinedInput-root": {
                borderRadius: "22px",
                backgroundColor: "white",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "blue !important", // 🔵 Force blue border
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "blue !important", // 🔵 Hover
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "blue !important", // 🔵 Focus
                },
              },
              "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                color: "red !important", // 🔴 Force red icon (wrapper + svg)
              },
            }}
          />
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="product models table">
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#4D795B",
              }}
            >
              {/* <TableCell sx={{ color: "white" }} align="center">SL No.</TableCell> */}
              {/* <TableCell sx={{ color: "white" }} align="center">
                product
              </TableCell> */}
              <TableCell sx={{ color: "white" }} align="center">
                Generic Name
              </TableCell>
              <TableCell sx={{ color: "white" }} align="center">
                Strength Power
              </TableCell>
              <TableCell sx={{ color: "white" }} align="center">
                UOM
              </TableCell>
              <TableCell sx={{ color: "white" }} align="center">
                Disease
              </TableCell>
              {/* <TableCell sx={{ color: "white" }} align="center">Type</TableCell>
              <TableCell sx={{ color: "white" }} align="center">Brand</TableCell> */}
              {/* <TableCell sx={{ color: "white" }} align="center">Dimensions (L×W×H)</TableCell> */}
              {/* <TableCell sx={{ color: "white" }} align="center">
                {" "}
                Action
              </TableCell> */}
              {/* <TableCell sx={{ color: "white" }} align="center"> Action</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item, index) => (
                <TableRow
                  key={item.ProductModelID}
                  onClick={() => {
                    setOpen(true);
                    setDetilsData(item);
                  }}
                  sx={{ cursor: "pointer" }}
                >
                  {/* <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell> */}
                  {/* <TableCell align="center">
                    {item.Image1 ? (
                      <img
                        src={`${process.env.REACT_APP_URL}/storage/${item.Image1}`}
                        alt="Product"
                        style={{ width: "4rem", marginTop: "8px" }}
                      />
                    ) : (
                      "N/A"
                    )}
                  </TableCell> */}
                  <TableCell align="center">
                    {item.ModelNumber == null ? "-" : item.ModelNumber}
                  </TableCell>
                  <TableCell align="center">
                    {item.Length == "null" || item.Length == ""
                      ? "-"
                      : item.Length}
                  </TableCell>
                  <TableCell align="center">
                    {item.Unit == null ? "-" : item.Unit}
                  </TableCell>
                  <TableCell align="center">
                    {item.DiseaseName == null ? "-" : item.DiseaseName}
                  </TableCell>

                  {/* <TableCell align="center">-</TableCell> */}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 40]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <ProductDetailsDialog
        data={detailsData}
        open={open}
        handleClose={handleClose}
        fetchProduct={fetchProduct}
      />
    </div>
  );
}
