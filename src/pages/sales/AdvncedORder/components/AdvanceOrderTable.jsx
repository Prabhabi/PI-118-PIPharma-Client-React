import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TablePagination,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PrintIcon from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import AdvanceOrderDetails from "./AdvanceOrderDetails";
import advncedORderPdf from "./AdvanceORderForm/AdvncedORderPdf";
import { PictureAsPdf } from "@mui/icons-material";
import TableViewIcon from "@mui/icons-material/TableView";
import AdvanceOrderTablePdf, {
  generateExcelFromAdvanceOrders,
} from "./AdvanceOrderTablePdf";
import AdvEditDialog from "./AdvEdit/AdvEditDialog";
import EmailIcon from "@mui/icons-material/Email";
import QuotationEmailDirectForm from "./../../../purchase/quotation/components/QuotationForm/component/quotationEmail/QuotationEmailDirectForm";
import DescriptionIcon from "@mui/icons-material/Description";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.common.white,
}));

export default function AdvanceOrderTable({
  advOrderList,
  signatoryList,
  allItems,
  fetchAdvaceOrder,
}) {
  const theme = useTheme(); // Move this above useMediaQuery
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedData, setSelectedItem] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenModal = (row) => {
    setSelectedItem(row);
    setOpen(true);
  };
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

  const invoicePurCreatepdf = (row, type) => {
    // Define the function logic here
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>SL No.</StyledTableCell>
              <StyledTableCell>Quotation No</StyledTableCell>
              <StyledTableCell>CompanyName</StyledTableCell>
              <StyledTableCell>Consumer Name</StyledTableCell>
              <StyledTableCell>Ph No</StyledTableCell>
              <StyledTableCell>Total Items</StyledTableCell>
              <StyledTableCell>Gross Amount</StyledTableCell>
              <StyledTableCell
                style={{
                  color: "white",
                  width: isMobile ? "20%" : "auto",
                  padding: isMobile ? "8px 4px" : "16px",
                  textAlign: "center",
                }}
              >
                <Tooltip
                  title="Download PDF"
                  placement="top"
                  onClick={() => AdvanceOrderTablePdf(advOrderList)}
                >
                  <PictureAsPdf
                    sx={{
                      fontSize: isMobile ? "1.2rem" : "1.5rem",
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>
                <Tooltip
                  title="Download Excel"
                  placement="top"
                  onClick={() => generateExcelFromAdvanceOrders(advOrderList)}
                >
                  <TableViewIcon
                    sx={{
                      fontSize: isMobile ? "1.2rem" : "1.5rem",
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>
              </StyledTableCell>{" "}
            </TableRow>
          </TableHead>
          <TableBody>
            {advOrderList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order, index) => (
                <TableRow key={order.QuotationBookingMasterID}>
                  <TableCell sx={{ cursor: "pointer" }}>{index + 1}</TableCell>
                  <TableCell
                    onClick={() => {
                      handleOpenModal(order);
                    }}
                    sx={{ cursor: "pointer" }}
                  >
                    {order.QuotationNo || "N/A"}
                  </TableCell>
                  <TableCell
                    onClick={() => {
                      handleOpenModal(order);
                    }}
                    sx={{ cursor: "pointer" }}
                  >
                    {order.CompanyName || "N/A"}
                  </TableCell>
                  <TableCell
                    onClick={() => {
                      handleOpenModal(order);
                    }}
                    sx={{ cursor: "pointer" }}
                  >
                    {order.Name || "N/A"}
                  </TableCell>
                  <TableCell
                    onClick={() => {
                      handleOpenModal(order);
                    }}
                    sx={{ cursor: "pointer" }}
                  >
                    {order.PhoneNumber1 || "N/A"}
                  </TableCell>
                  <TableCell
                    onClick={() => {
                      handleOpenModal(order);
                    }}
                    sx={{ cursor: "pointer" }}
                  >
                    {order.ModelMappingData.length || "N/A"}
                  </TableCell>
                  <TableCell
                    onClick={() => {
                      handleOpenModal(order);
                    }}
                    sx={{ cursor: "pointer" }}
                  >
                    {order.TotalAmountAD || "N/A"}
                  </TableCell>
                  <TableCell align="center" sx={{ cursor: "pointer" }}>
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{ justifyContent: "center", cursor: "pointer" }}
                    >
                      <Tooltip title="Reprint" placement="top">
                        <PrintIcon
                          color="secondary"
                          onClick={() => advncedORderPdf(order)}
                        />
                      </Tooltip>
                      <Tooltip title="Email" placement="top">
                        <EmailIcon
                          color="secondary"
                          sx={{
                            fontSize: isMobile ? "1.2rem" : "1.5rem",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setOpenEmail(true);
                            setEmailData(order);
                          }}
                        />
                      </Tooltip>
                      {/* <Tooltip title="Edit" placement="top">
                        <EditIcon color="warning" />
                      </Tooltip>
                      <Tooltip title="Delete" placement="top">
                        <DeleteIcon color="error" />
                      </Tooltip> */}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[1, 10, 25, 50]}
        component="div"
        count={advOrderList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle
          sx={{
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <DescriptionIcon />
            {selectedData.QuotationNo}
          </div>
          <IconButton onClick={handleClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <AdvanceOrderDetails selectedData={selectedData} />
        </DialogContent>
        <DialogActions>
          <Stack
            direction="row"
            spacing={2}
            sx={{ width: "100%", justifyContent: "space-between", px: 1 }}
          >
            <AdvEditDialog
              selectdQuo={selectedData}
              // supplierList={supplierList}
              allItems={allItems}
              // companyList={companyList}
              signatoryList={signatoryList}
              fetchAdvaceOrder={fetchAdvaceOrder}
              // fetchQuotationsFn={fetchQuotationsFn}
              onClose={handleClose}
            />
            <Button onClick={handleClose} color="success">
              Close
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
      {openEmail && (
        <QuotationEmailDirectForm
          openEmail={openEmail}
          handleCloseEmail={handleCloseEmail}
          handleClickOpenEmail={handleClickOpenEmail}
          emailData={emailData}
          type="ADVB"
        />
      )}
    </>
  );
}
