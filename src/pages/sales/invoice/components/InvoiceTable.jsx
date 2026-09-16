import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";
import {
  Button,
  Stack,
  Tooltip,
  TextField,
  Box,
  useMediaQuery,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";
import InvoiceDetailsDialog from "./InvoiceDetailsDialog";
import EmailIcon from "@mui/icons-material/Email";
import * as XLSX from "xlsx"; // Add XLSX import
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile"; // Excel icon
import { PDFDownloadLink, BlobProvider } from "@react-pdf/renderer";

import {
  convertDatetoString,
  formatDate,
  formatDateTime,
} from "../../../../functionforAll";
import InvoiceEditSales from "./invoiceEditS/InvoiceEditDialogSales";
import InvoiceEditDialogSales from "./invoiceEditS/InvoiceEditDialogSales";
import { useSelector } from "react-redux";
import QuotationEmailDirectForm from "../../../purchase/quotation/components/QuotationForm/component/quotationEmail/QuotationEmailDirectForm";
import invoiceSaleCreatepdf from "./invoiceDialog/component/invoiceSaleCreatepdfNew";
import InvoiceSaleCreatePdf from "./invoiceDialog/component/invoiceSaleCreatepdfNew";
import InvoicePurCreatepdf from "../../../purchase/invoice/components/invoiceDialog/component/InvoicePurCreatepdf";
import InvoiceSalesCreatepdfNew from "./invoiceDialog/component/invoiceSaleCreatepdfNew";
import { round } from "lodash";

const columns = [
  // { id: "slNo", label: "SL No.", minWidth: 50, align: "center" },
  { id: "Name", label: "Name", minWidth: 50, align: "center" },
  { id: "ReceiptDate", label: "Receipt Date", minWidth: 100, align: "center" },
  { id: "InvoicNo", label: "Invoice No", minWidth: 100, align: "center" },
  {
    id: "TotalAmountBD",
    label: "Total Amt",
    minWidth: 100,
    align: "center",
  },
  { id: "NetPaidAmount", label: "Paid Amt", minWidth: 100, align: "center" },
  { id: "NetDueAmount", label: "Due Amt", minWidth: 100, align: "center" },
  {
    id: "PaymentStatus",
    label: "Pmt Status",
    minWidth: 100,
    align: "center",
  },
  { id: "Actions", label: "Actions", minWidth: 100, align: "center" },
];

export default function InvoiceTable({
  allInvoice,
  searchText,
  setSearchText,
  allHsn,
  allItems,
  signatoryDetails,
  allPaymentType,
  fetchAllInvoice,
}) {
  const [details, setDetails] = React.useState({});
  const [openModal, setOpenModal] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // ========================================for email ====================================
  const [openEmail, setOpenEmail] = React.useState(false);
  const [emailData, setEmailData] = useState({});

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
  const user = useSelector((i) => i?.auth?.user?.name);

  const handleCloseModal = () => setOpenModal(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Excel export function
  const exportToExcel = () => {
    const filteredData = allInvoice.map(
      ({ ReceiptProductModelList, ...rest }) => rest
    );
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");
    XLSX.writeFile(workbook, "Invoices.xlsx");
  };

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "visible",
        margin: "auto",
        mt: 3,
        background: "inerit",
      }}
    >
      <TableContainer sx={{ maxHeight: "none" }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column, idx) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    minWidth: column.minWidth,
                    fontSize: "1rem",
                    color: "#ffffff",
                  }}
                >
                  <strong>{column.label}</strong>
                  {/* Add Excel icon button at the last column */}
                  {idx === columns.length - 1 && (
                    <Tooltip title="Export to Excel">
                      <Button
                        onClick={exportToExcel}
                        sx={{
                          minWidth: 0,
                          ml: 1,
                          p: 0.5,
                          color: "white",
                          background: "transparent",
                          "&:hover": { background: "rgba(77,121,91,0.1)" },
                        }}
                      >
                        <InsertDriveFileIcon
                          sx={{ color: "#fff", fontSize: 22 }}
                        />
                      </Button>
                    </Tooltip>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {allInvoice
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    {/* <TableCell
                      onClick={() => handleOpenModal(row)}
                      align="center"
                      sx={{ cursor: "pointer" }}
                    >
                      {page * rowsPerPage + index + 1}
                    </TableCell> */}
                    <TableCell
                      onClick={() => handleOpenModal(row)}
                      align="center"
                      sx={{ cursor: "pointer" }}
                    >
                      {row.Name}
                      {row.EntityType == "SUBD" ? "(Sub Dealer)" : "(Customer)"}
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenModal(row)}
                      align="center"
                      sx={{ cursor: "pointer" }}
                    >
                      {formatDate(row.ReceiptDate)}
                    </TableCell>
                    <TableCell
                      sx={{ cursor: "pointer" }}
                      align="center"
                      onClick={() => handleOpenModal(row)}
                    >
                      {row.ReceiptNumber}
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenModal(row)}
                      align="center"
                      sx={{ cursor: "pointer" }}
                    >
                      {Math.round(row.GrandTotalAmount)}
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenModal(row)}
                      align="center"
                      sx={{ color: "green", cursor: "pointer" }}
                    >
                      {round(row.NetPaidAmount)}
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenModal(row)}
                      align="center"
                      sx={{ color: "red", cursor: "pointer" }}
                    >
                      {Math.round(
                        Number(row.PDueDueAmount) + Number(row.RoundOffAmount)
                      )}
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpenModal(row)}
                      align="center"
                      sx={{ cursor: "pointer" }}
                    >
                      {row.PaymentStatus}
                    </TableCell>
                    <TableCell align="center" sx={{ cursor: "pointer" }}>
                      <Stack
                        direction="row"
                        spacing={2}
                        sx={{ justifyContent: "center", cursor: "pointer" }}
                      >
                        {user == "SuperAdmin" && row.NetDueAmount <= 0 ? (
                          <InvoiceEditDialogSales
                            style={{ width: "1.5rem" }}
                            invoiceDetails={row}
                            allItems={allItems}
                            allHsn={allHsn}
                            signatoryDetails={signatoryDetails}
                            allPaymentType={allPaymentType}
                            fetchAllInvoice={fetchAllInvoice}
                          />
                        ) : (
                          <Box style={{ width: "1.5rem" }}></Box>
                        )}
                        <BlobProvider
                          document={
                            typeof row === "object" && row !== null ? (
                              <InvoiceSaleCreatePdf {...row} />
                            ) : (
                              <InvoiceSaleCreatePdf {...row} />
                            )
                          }
                        >
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
                        <Tooltip title="Email" placement="top">
                          <EmailIcon
                            color="secondary"
                            sx={{
                              fontSize: "1.5rem",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              setOpenEmail(true);
                              setEmailData(row);
                            }}
                          />
                        </Tooltip>
                        {/* <Tooltip title="Delete" placement="top">
                          <DeleteIcon color="error" />
                        </Tooltip> */}
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
          count={allInvoice.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
      <InvoiceDetailsDialog
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        row={details}
        // fetchCustomers={fetchCustomers}
      />
      {openEmail && (
        <QuotationEmailDirectForm
          openEmail={openEmail}
          handleCloseEmail={handleCloseEmail}
          handleClickOpenEmail={handleClickOpenEmail}
          emailData={emailData}
          type="INVS"
        />
      )}
    </Paper>
  );
}
