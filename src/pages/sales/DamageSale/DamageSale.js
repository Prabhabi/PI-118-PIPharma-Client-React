import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Pagination,
  ToggleButton,
  ToggleButtonGroup,
  styled,
  keyframes,
  IconButton,
  Tooltip,
} from "@mui/material";
import CreateDamage from "./Component/CreateDamageSale"; // Ensure this path is correct
import SearchIcon from "@mui/icons-material/Search";
import DamageIcon from "@mui/icons-material/BrokenImage"; // Import damage icon
import CloseIcon from "@mui/icons-material/Close"; // Import Close icon
import InfoIcon from "@mui/icons-material/Info"; // For detail dialog
import EmailIcon from "@mui/icons-material/Email"; // For email icon
// import DamagePdfSale from "./Component/DamagePdfSale";
import DamagePdfSalePDF from "./Component/DamagePdfSalePDF";
import { pdf } from "@react-pdf/renderer";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import { damageListSalesApiFn } from "../../../api/salesApi";
import PrintIcon from "@mui/icons-material/Print";

import LoadingComp from "../../../components/loadingComp/LoadingComp";
import { useTheme } from "@emotion/react";

// Remove Butterfly and flyAnimation

export default function DamagePurchase() {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  // Remove selectedModule state
  // const [selectedModule, setSelectedModule] = useState("purchase");
  const [tableData, setTableData] = useState([]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);
  // Remove PDF dialog state
  const [page, setPage] = useState(1);
  const rowsPerPage = 9;

  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

  // Fetch table data, always use BillCode=INVSR
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const billCode = "INVSR"; // Always sales
  //     try {
  //       const res = await fetch(
  //         `${process.env.REACT_APP_URL}/api/getDamageReturn?BillCode=${billCode}&Source=O&ReceiptID=0`,
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: sanctumToken,
  //           },
  //         }
  //       );
  //       const data = await res.json();
  //       // If the response is an array, map and parse fields; if it's an object, wrap in array
  //       let rows = [];
  //       if (Array.isArray(data)) {
  //         rows = data;
  //       } else if (data && typeof data === "object") {
  //         rows = [data];
  //       }
  //       // Parse ReceiptProductModelList and PaymentDetails for each row
  //       const parsedRows = rows.map((row) => ({
  //         ...row,
  //         ReceiptProductModelList: (() => {
  //           try {
  //             if (typeof row.ReceiptProductModelList === "string") {
  //               return JSON.parse(row.ReceiptProductModelList);
  //             }
  //             return Array.isArray(row.ReceiptProductModelList)
  //               ? row.ReceiptProductModelList
  //               : [];
  //           } catch {
  //             return [];
  //           }
  //         })(),
  //         PaymentDetails: (() => {
  //           try {
  //             if (typeof row.PaymentDetails === "string") {
  //               return JSON.parse(row.PaymentDetails);
  //             }
  //             return Array.isArray(row.PaymentDetails)
  //               ? row.PaymentDetails
  //               : [];
  //           } catch {
  //             return [];
  //           }
  //         })(),
  //       }));
  //       setTableData(parsedRows);
  //     } catch (err) {
  //       setTableData([]);
  //     }
  //   };
  //   fetchData();
  // }, [sanctumToken]); // Remove selectedModule from dependency

  // =======================================================================
  const { data, isLoading, refetch, isError } = useQuery({
    queryKey: ["damageListSalesApi"],
    queryFn: damageListSalesApiFn,
    refetchOnWindowFocus: false, // disable refetch on window focus
    refetchOnReconnect: false, // disable refetch on network reconnect
    refetchInterval: false, // disable background polling
    staleTime: Infinity,
  });

  useEffect(() => {
    // If the response is an array, map and parse fields; if it's an object, wrap in array
    let rows = [];
    if (Array.isArray(data?.data)) {
      rows = data.data;
    } else if (Array.isArray(data)) {
      rows = data;
    } else if (data && typeof data === "object" && Array.isArray(data.data)) {
      rows = data.data;
    } else if (data && typeof data === "object") {
      rows = [data];
    }
    // Parse ReceiptProductModelList and PaymentDetails for each row
    const parsedRows = rows.map((row) => ({
      ...row,
      ReceiptProductModelList: (() => {
        try {
          if (typeof row.ReceiptProductModelList === "string") {
            return JSON.parse(row.ReceiptProductModelList);
          }
          return Array.isArray(row.ReceiptProductModelList)
            ? row.ReceiptProductModelList
            : [];
        } catch {
          return [];
        }
      })(),
      PaymentDetails: (() => {
        try {
          if (typeof row.PaymentDetails === "string") {
            return JSON.parse(row.PaymentDetails);
          }
          return Array.isArray(row.PaymentDetails) ? row.PaymentDetails : [];
        } catch {
          return [];
        }
      })(),
    }));
    setTableData(parsedRows);
  }, [data]);
  // =======================================================================

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Filter tableData by searchText if needed (optional)
  const filteredTableData = tableData.filter(
    (row) =>
      !searchText ||
      (row.ReceiptNumber &&
        row.ReceiptNumber.toLowerCase().includes(searchText.toLowerCase()))
  );

  // When a row is clicked, show its details in the dialog
  const handleRowClick = (row) => {
    setDetailData(row);
    setDetailOpen(true);
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
    setDetailData(null);
  };

  // Add this handler
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // Replace the FormControl RadioGroup with this
  // Remove handleModuleChange

  // Handler for PrintIcon click: open PDF in new tab
  const handleEmailIconClick = async (event, row) => {
    console.log(row);
    event.stopPropagation();
    const blob = await pdf(<DamagePdfSalePDF responseData={row} />).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    // Optionally, revokeObjectURL after some time
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  // Calculate paginated data
  const paginatedData = filteredTableData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  const theme = useTheme();
  return (
    <Box sx={{ m: 1.5, bgcolor: theme.palette.background.main }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
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
            mb: 2,
            mt: 2,
            color: "blue",
          }}
        >
          <DamageIcon style={{ fontSize: "2.2rem", color: "blue" }} /> Return
          Management
        </Typography>
      </Box>

      {/* Replace toggle with static Sale text */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          mb: 3,
          ml: 2,
          position: "relative",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#28542b",
            fontWeight: "bold",
            fontSize: "1.2rem",
            pl: 1,
            pt: 0.5,
          }}
        ></Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <TextField
          placeholder="Search...Damage"
          variant="outlined"
          fullWidth
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ color: "#006400", mr: 1, color: "blue" }} />
            ),
          }}
          sx={{
            width: { xs: "100%", md: "100%" },
            mr: { xs: 0, md: 2 },
            "& .MuiOutlinedInput-root": {
              borderRadius: "22px",
              backgroundColor: "white",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "blue !important", // 🔵 Force default
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "blue !important", // 🔵 Force hover
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "blue !important", // 🔵 Force active/focused
              },
            },
          }}
        />

        <Button
          variant="contained"
          sx={{
            borderRadius: "15px",
            backgroundColor: "#4D795B",
            height: "50px",
            fontWeight: "bold",
            width: "20rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
          onClick={handleClickOpen}
        >
          <DamageIcon /> Add Damage
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          border: "1px solid #28542b",
          borderRadius: "8px",
          mb: 2,
          "& .MuiTable-root": {
            borderCollapse: "separate",
            borderSpacing: "0",
          },
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Serial No</TableCell>
              <TableCell>Invoice Number</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, idx) => (
              <TableRow
                key={idx}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => handleRowClick(row)}
              >
                <TableCell>{(page - 1) * rowsPerPage + idx + 1}</TableCell>
                <TableCell>{row.ReceiptNumber}</TableCell>
                <TableCell>{row.EntityType}</TableCell>
                <TableCell>{row.Name}</TableCell>
                <TableCell>
                  {/* <InfoIcon color="success" /> */}

                  <Tooltip
                    title="Reprint"
                    placement="top"
                    onClick={(event) => handleEmailIconClick(event, row)}
                  >
                    <PrintIcon color="secondary" sx={{ fontSize: "1.5rem" }} />
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 4 }}>
        <Pagination
          count={Math.ceil(filteredTableData.length / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {/* Detail Dialog */}
      <Dialog
        open={detailOpen}
        onClose={handleDetailClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(40, 84, 43, 0.15)",
            background: "linear-gradient(to bottom, #ffffff, #f8faf8)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.5rem",
            color: "white",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "2px solid #e8f5e9",
            padding: "16px 24px",
            position: "relative", // add for absolute positioning
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <DamageIcon /> Damage/Return Details
          </Box>
          {/* Close icon in top right corner */}
          <IconButton
            onClick={handleDetailClose}
            size="small"
            sx={{
              color: "white",
              position: "absolute",
              top: 8,
              right: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            minHeight: "60vh",
            px: 3,
            py: 2,
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#4D795B80",
              borderRadius: "4px",
            },
          }}
        >
          {detailData ? (
            <Box>
              {/* Summary Section */}
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  color: "#28542b",
                  borderBottom: "2px solid #e8f5e9",
                  pb: 1,
                }}
              >
                Summary Information
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 2,
                  mb: 3,
                  "& > div": {
                    p: 1.5,
                    borderRadius: "8px",
                    background: "linear-gradient(145deg, #ffffff, #f8faf8)",
                    boxShadow: "0 2px 8px rgba(40, 84, 43, 0.08)",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "translateY(-2px)",
                    },
                  },
                }}
              >
                <Box>
                  <Typography
                    component="span"
                    sx={{ fontWeight: "600", color: "#28542b" }}
                  >
                    Receipt:
                  </Typography>{" "}
                  {detailData.ReceiptNumber}
                </Box>
                <Box>
                  <Typography
                    component="span"
                    sx={{ fontWeight: "600", color: "#28542b" }}
                  >
                    Date:
                  </Typography>{" "}
                  {detailData.ReceiptDate}
                </Box>
                <Box>
                  <Typography
                    component="span"
                    sx={{ fontWeight: "600", color: "#28542b" }}
                  >
                    Type:
                  </Typography>{" "}
                  {detailData.EntityType}
                </Box>
                <Box>
                  <Typography
                    component="span"
                    sx={{ fontWeight: "600", color: "#28542b" }}
                  >
                    Name:
                  </Typography>{" "}
                  {detailData.Name}
                </Box>
                <Box>
                  <Typography
                    component="span"
                    sx={{ fontWeight: "600", color: "#28542b" }}
                  >
                    Phone:
                  </Typography>{" "}
                  {detailData.PhoneNumber1}
                </Box>
                <Box>
                  <Typography
                    component="span"
                    sx={{ fontWeight: "600", color: "#28542b" }}
                  >
                    Payment Status:
                  </Typography>{" "}
                  {detailData.PaymentStatus}
                </Box>
                <Box>
                  <Typography
                    component="span"
                    sx={{ fontWeight: "600", color: "#28542b" }}
                  >
                    Total Amount:
                  </Typography>{" "}
                  ₹{detailData.TotalAmountBD}
                </Box>
                <Box>
                  <Typography
                    component="span"
                    sx={{ fontWeight: "600", color: "#28542b" }}
                  >
                    Net Paid:
                  </Typography>{" "}
                  ₹{detailData.NetPaidAmount}
                </Box>
                <Box>
                  <Typography
                    component="span"
                    sx={{ fontWeight: "600", color: "#28542b" }}
                  >
                    Due:
                  </Typography>{" "}
                  ₹{detailData.NetDueAmount}
                </Box>
              </Box>

              {/* Address Section */}
              <Typography variant="subtitle1" sx={{ color: "#28542b", mb: 1 }}>
                Address
              </Typography>
              <Box sx={{ mb: 2 }}>
                {detailData.AddressLine1}{" "}
                {detailData.AddressLine2 && `, ${detailData.AddressLine2}`}
                <br />
                {detailData.City} {detailData.District} {detailData.State}{" "}
                {detailData.PinCode}
              </Box>

              {/* Discount & Tax */}
              <Box sx={{ mb: 2 }}>
                <b>Discount:</b> {detailData.Discount} {detailData.DiscountUnit}{" "}
                ({detailData.DiscountDesc})
                <br />
                <b>CGST:</b> {detailData.CGSTP}% = ₹{detailData.CGSTAmount}{" "}
                &nbsp;
                <b>SGST:</b> {detailData.SGSTP}% = ₹{detailData.SGSTAmount}
              </Box>

              {/* Remarks */}
              {detailData.Remarks && (
                <Box sx={{ mb: 2 }}>
                  <b>Remarks:</b> {detailData.Remarks}
                </Box>
              )}

              {/* Product List */}
              <Typography
                variant="h6"
                sx={{
                  mt: 3,
                  mb: 2,
                  color: "#28542b",
                  borderBottom: "2px solid #e8f5e9",
                  pb: 1,
                }}
              >
                Products List
              </Typography>
              <TableContainer
                component={Paper}
                sx={{
                  mb: 3,
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(40, 84, 43, 0.08)",
                  "& .MuiTableHead-root": {
                    bgcolor: "#28542b",
                    "& .MuiTableCell-head": {
                      color: "white",
                      fontWeight: "600",
                    },
                  },
                  "& .MuiTableBody-root .MuiTableRow-root:hover": {
                    bgcolor: "#e8f5e9",
                  },
                }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Model</TableCell>
                      <TableCell>Brand</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Qty</TableCell>
                      <TableCell>Unit</TableCell>
                      <TableCell>Rate</TableCell>
                      <TableCell>Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {detailData.ReceiptProductModelList?.map((prod, i) => {
                      // Parse ModelStatusData
                      let msd = [];
                      try {
                        msd =
                          typeof prod.ModelStatusData === "string"
                            ? JSON.parse(prod.ModelStatusData)
                            : Array.isArray(prod.ModelStatusData)
                              ? prod.ModelStatusData
                              : [];
                      } catch {
                        msd = [];
                      }
                      // Sum quantities by status
                      const getQty = (status) =>
                        msd
                          .filter((m) =>
                            (m.ProductModelStatus || "")
                              .trim()
                              .toUpperCase()
                              .startsWith(status)
                          )
                          .reduce((sum, m) => sum + Number(m.Quantity || 0), 0);

                      const damagedQty = getQty("D");
                      const returnedQty = getQty("R");
                      const existingQty = getQty("E");

                      return (
                        <TableRow key={i}>
                          <TableCell>{prod.ModelNumber}</TableCell>
                          <TableCell>{prod.BrandName}</TableCell>
                          <TableCell>{prod.ProductTypeName}</TableCell>
                          <TableCell>{prod.ProductCategoryName}</TableCell>
                          <TableCell>
                            Damaged: {damagedQty} | Returned: {returnedQty} |
                            Existing: {existingQty}
                          </TableCell>
                          <TableCell>{prod.UnitQuantity}</TableCell>
                          <TableCell>{prod.Rate}</TableCell>
                          <TableCell>{prod.Amount}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Payment Details */}
              <Typography variant="subtitle1" sx={{ color: "#28542b", mb: 1 }}>
                Payment Details
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Mode</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {detailData.PaymentDetails?.map((pay, i) => (
                    <TableRow key={i}>
                      <TableCell>{pay.PaymentModeName}</TableCell>
                      <TableCell>{pay.Amount}</TableCell>
                      <TableCell>{pay.PaymentDate?.split("T")[0]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          ) : (
            <Typography>No details found.</Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "2px solid #e8f5e9" }}>
          <Button
            onClick={handleDetailClose}
            variant="contained"
            sx={{
              bgcolor: "#28542b",
              "&:hover": {
                bgcolor: "#1c3b1e",
              },
              borderRadius: "8px",
              px: 4,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Damage Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(40, 84, 43, 0.15)",
            background: "linear-gradient(to bottom, #ffffff, #f8faf8)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.5rem",
            my: -1.2,
            color: "white",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "2px solid #e8f5e9",
            padding: "16px 24px",
          }}
        >
          Return
          <CloseIcon
            onClick={handleClose}
            sx={{ cursor: "pointer", color: "white" }}
          />
        </DialogTitle>
        <DialogContent sx={{ minHeight: "60vh", px: 3, py: 2 }}>
          <CreateDamage dialogClose={handleClose} damageFetchList={refetch} />
        </DialogContent>
        <DialogActions sx={{ mt: -0.5, p: 2, borderTop: "2px solid #e8f5e9" }}>
          <Button
            onClick={handleClose}
            variant="contained"
            color="success"
            sx={{
              bgcolor: "#28542b",
              "&:hover": {
                bgcolor: "#1c3b1e",
              },
              borderRadius: "8px",
              px: 4,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <LoadingComp loading={isLoading} />
    </Box>
  );
}
