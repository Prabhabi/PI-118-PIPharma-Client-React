import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Button, Stack, Tooltip, TextField, Box } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import MoneyReciptDetailsDialog from "./MoneyReciptDetailsDialog";
import { formatDate } from "../../../../functionforAll";
import generatePdfMoneyRecipt from "./generatePdfMoneyRecipt";
import moneyReciptNoInvpdf from "./MoneyReciptNoInvpdf";
import moneyReciptInvpdf from "./MoneyReciptInvpdf copy";
import TableViewIcon from "@mui/icons-material/TableView";
import InvoiceDetailsDialog from "../../../sales/invoice/components/InvoiceDetailsDialog";
import EmailIcon from "@mui/icons-material/Email";
import QuotationEmailDirectForm from "../../quotation/components/QuotationForm/component/quotationEmail/QuotationEmailDirectForm";
import { set } from "react-hook-form";
import { PDFDownloadLink, BlobProvider } from "@react-pdf/renderer";

const columns = [
  { id: "slNo", label: "Sl No.", minWidth: 40, align: "center" },
  { id: "slNo", label: "Req No.", minWidth: 40, align: "center" },

  { id: "CustomerName", label: "Customer", minWidth: 140, align: "center" },
  {
    id: "RequestOrderDate",
    label: "Request Order Date",
    minWidth: 120,
    align: "center",
  },
  { id: "DueAmount", label: "Due Amount", minWidth: 100, align: "center" },
  {
    id: "OverallDeliveryDateTime",
    label: "Overall Delivery Date",
    minWidth: 150,
    align: "center",
  },
  { id: "actions", label: "", minWidth: 60, align: "center" },
];

function createData(name, code, population, size) {
  const density = population / size;
  return { name, code, population, size };
}

export default function MoneyReciptTable({
  moneyReciptList,
  selectSearchType,
}) {
  const [details, setDetails] = React.useState({});
  const [searchText, setSearchText] = React.useState(""); // Define searchText and setSearchText here

  const [openModal, setOpenModal] = React.useState(false);
  const [openModal1, setOpenModal1] = React.useState(false);
  const [typeInv, setTypeInv] = React.useState("");
  // ========================================for email ====================================
  const [openEmail, setOpenEmail] = React.useState(false);
  const [emailData, setEmailData] = React.useState({});

  const handleClickOpenEmail = () => {
    setOpenEmail(true);
  };

  const handleCloseEmail = () => {
    setOpenEmail(false);
    setEmailData({});
  };

  // =====================================================================

  const handleOpenModal = (details) => {
    setDetails(details);
    setOpenModal(true);
  };
  const handleOpenModal1 = (details) => {
    console.log("details", details);
    setDetails(details);
    setOpenModal1(true);
  };
  const handleCloseModal1 = () => setOpenModal1(false);
  const handleCloseModal = () => setOpenModal(false);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const afterFilter = moneyReciptList?.filter((item) => {
    if (searchText) {
      const customerName = `${item.CustomerName ?? ""}`.toLowerCase();
      return (
        customerName.includes(searchText.toLowerCase()) ||
        (item.RequestOrderDate ?? "")
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        (item.DueAmount?.toString() ?? "")
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        (item.OverallDeliveryDateTime ?? "")
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );
    }
    return true;
  });
  console.log("afterFilter", afterFilter);

  return (
    <Paper sx={{ width: "98%", overflow: "hidden", margin: "auto", mt: 3 }}>
      <Box sx={{ px: 1, mb: 2 }}>
        <TextField
          placeholder="Search Money Recipt"
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
      </Box>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    minWidth: column.minWidth,
                    color: "white",
                    fontSize: "1rem",
                  }}
                >
                  <strong> {column.label}</strong>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {afterFilter
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    <TableCell
                      sx={{
                        minWidth: "50px",
                        textAlign: "center",
                      }}
                      align="center"
                    >
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell
                      sx={{
                        minWidth: "50px",
                        textAlign: "center",
                      }}
                      align="center"
                    >
                      {row?.RequestOrderNo}
                    </TableCell>
                    <TableCell
                      sx={{
                        minWidth: "170px",
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                      align="center"
                      onClick={() => handleOpenModal1(row)}
                    >
                      {row.CustomerName}
                    </TableCell>
                    <TableCell
                      sx={{
                        minWidth: "120px",
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                      align="center"
                      onClick={() => handleOpenModal1(row)}
                    >
                      {row.RequestOrderDate
                        ? new Date(row.RequestOrderDate).toLocaleString()
                        : ""}
                    </TableCell>
                    <TableCell
                      sx={{
                        minWidth: "100px",
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                      align="center"
                      onClick={() => handleOpenModal1(row)}
                    >
                      ₹{row.DueAmount}
                    </TableCell>
                    <TableCell
                      sx={{
                        minWidth: "150px",
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                      align="center"
                      onClick={() => handleOpenModal1(row)}
                    >
                      {row.OverallDeliveryDateTime
                        ? new Date(row.OverallDeliveryDateTime).toLocaleString()
                        : ""}
                    </TableCell>
                    <TableCell
                      sx={{
                        minWidth: "60px",
                        textAlign: "center",
                      }}
                      align="center"
                    >
                      <Stack
                        direction="row"
                        spacing={2}
                        sx={{ justifyContent: "center", cursor: "pointer" }}
                      >
                        <BlobProvider document={moneyReciptNoInvpdf(row)}>
                          {({ url, loading }) => (
                            <Tooltip title="Reprint" placement="top">
                              <span>
                                <Button
                                  disabled={
                                    loading ||
                                    !url ||
                                    !row ||
                                    typeof row !== "object"
                                  }
                                  onClick={() => {
                                    if (url) window.open(url, "_blank");
                                  }}
                                  sx={{ minWidth: 0, p: 0.5 }}
                                >
                                  <PrintIcon
                                    color="secondary"
                                    sx={{ opacity: loading ? 0.5 : 1 }}
                                  />
                                </Button>
                              </span>
                            </Tooltip>
                          )}
                        </BlobProvider>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "1rem",
        }}
      >
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={afterFilter?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
      <MoneyReciptDetailsDialog
        openModal={openModal1}
        handleCloseModal={handleCloseModal1}
        row={details}
      />
      {openEmail && (
        <QuotationEmailDirectForm
          openEmail={openEmail}
          handleCloseEmail={handleCloseEmail}
          handleClickOpenEmail={handleClickOpenEmail}
          emailData={emailData}
          type={typeInv}
        />
      )}
    </Paper>
  );
}
