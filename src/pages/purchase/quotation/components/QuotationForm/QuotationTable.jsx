import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Stack,
  Tooltip,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import QuotationDetailsDialog from "../QuotationDetailsDialog";
import quotationTablePdf from "./QuotationTablePdf";
import PictureAsPdf from "@mui/icons-material/PictureAsPdf";
import TableViewIcon from "@mui/icons-material/TableView";
import { generateExcelFromQuotations } from "./QuotationTablePdf";
import quotationPdf from "./QuotationPdf";
import EmailIcon from "@mui/icons-material/Email";
import QuotationEmailDirectForm from "./component/quotationEmail/QuotationEmailDirectForm";
import { BlobProvider } from "@react-pdf/renderer";
import AdvncedORderPdf from "../../../../sales/AdvncedORder/components/AdvanceORderForm/AdvncedORderPdf";

const generateAllQuotationsPdf = (quotations) => {
  quotationTablePdf(quotations);
};

export default function QuotationTable({
  filteredQuotationList,
  supplierList,
  allItems,
  companyList,
  signatoryList,
  fetchQuotationsFn,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectdQuo, setSeletedQuo] = useState({});
  const [open, setOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedEmailQuo, setSelectedEmailQuo] = useState({});

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

  const handleDownloadExcel = () => {
    generateExcelFromQuotations(filteredQuotationList);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpen = (row) => {
    setSeletedQuo(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEmailClick = (row) => {
    // console.log("Opening email dialog for:", row); // Debug log
    setSelectedEmailQuo(row);
    setEmailDialogOpen(true);
  };

  const handleEmailDialogClose = () => {
    // console.log("Closing email dialog"); // Debug log
    setEmailDialogOpen(false);
  };

  return (
    <Paper sx={{ mt: 2 }}>
      <TableContainer>
        <Table
          size={isMobile ? "small" : "medium"}
          sx={{
            "& .MuiTableCell-root": {
              padding: isMobile ? "8px 4px" : "16px",
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell
                style={{
                  color: "white",
                  width: isMobile ? "20%" : "auto",
                  padding: isMobile ? "8px 4px" : "16px",
                }}
              >
                Sl No
              </TableCell>
              <TableCell
                style={{
                  color: "white",
                  width: isMobile ? "20%" : "auto",
                  padding: isMobile ? "8px 4px" : "16px",
                }}
              >
                Quotation Date
              </TableCell>
              {!isMobile && (
                <TableCell
                  style={{
                    color: "white",
                    padding: isMobile ? "8px 4px" : "16px",
                  }}
                >
                  Quotation No
                </TableCell>
              )}
              <TableCell
                style={{
                  color: "white",
                  width: isMobile ? "20%" : "auto",
                  padding: isMobile ? "8px 4px" : "16px",
                }}
              >
                Grand Total
              </TableCell>
              {!isMobile && (
                <TableCell
                  style={{
                    color: "white",
                    padding: isMobile ? "8px 4px" : "16px",
                  }}
                >
                  Name
                </TableCell>
              )}
              <TableCell
                style={{
                  color: "white",
                  width: isMobile ? "20%" : "auto",
                  padding: isMobile ? "8px 4px" : "16px",
                }}
              >
                Company Name
              </TableCell>
              <TableCell
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
                  onClick={() =>
                    generateAllQuotationsPdf(filteredQuotationList)
                  }
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
                  onClick={handleDownloadExcel}
                >
                  <TableViewIcon
                    sx={{
                      fontSize: isMobile ? "1.2rem" : "1.5rem",
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredQuotationList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                // console.log(row);
                return (
                  <TableRow key={row.QuotationBookingMasterID}>
                    <TableCell
                      onClick={() => handleOpen(row)}
                      sx={{
                        cursor: "pointer",
                        padding: isMobile ? "8px 4px" : "16px",
                      }}
                    >
                      {index + 1 + page * rowsPerPage}
                    </TableCell>
                    <TableCell
                      onClick={() => handleOpen(row)}
                      sx={{
                        cursor: "pointer",
                        padding: isMobile ? "8px 4px" : "16px",
                      }}
                    >
                      {row.QuotationDate}
                    </TableCell>
                    {!isMobile && (
                      <TableCell
                        onClick={() => handleOpen(row)}
                        sx={{
                          cursor: "pointer",
                          padding: isMobile ? "8px 4px" : "16px",
                        }}
                      >
                        {row.QuotationNo}
                      </TableCell>
                    )}
                    <TableCell
                      onClick={() => handleOpen(row)}
                      sx={{
                        cursor: "pointer",
                        padding: isMobile ? "8px 4px" : "16px",
                      }}
                    >
                      {row.GrandTotalAmount}
                    </TableCell>
                    {!isMobile && (
                      <TableCell
                        onClick={() => handleOpen(row)}
                        sx={{
                          cursor: "pointer",
                          padding: isMobile ? "8px 4px" : "16px",
                        }}
                      >
                        {row.Name}
                      </TableCell>
                    )}
                    <TableCell
                      onClick={() => handleOpen(row)}
                      sx={{
                        cursor: "pointer",
                        padding: isMobile ? "8px 4px" : "16px",
                      }}
                    >
                      {row.Bill_CompanyName}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ padding: isMobile ? "8px 4px" : "16px" }}
                    >
                      <Stack
                        direction="row"
                        spacing={isMobile ? 0.5 : 2}
                        sx={{ justifyContent: "center" }}
                      >
                        <BlobProvider
                          document={
                            typeof row === "object" && row !== null ? (
                              <AdvncedORderPdf {...row} />
                            ) : (
                              <AdvncedORderPdf />
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
                              fontSize: isMobile ? "1.2rem" : "1.5rem",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              setOpenEmail(true);
                              setEmailData(row);
                            }}
                          />
                        </Tooltip>
                        {/* <Tooltip title="Edit" placement="top">
                        <EditIcon
                          color="warning"
                          sx={{ fontSize: isMobile ? "1.2rem" : "1.5rem" }}
                        />
                      </Tooltip>
                      <Tooltip title="Delete" placement="top">
                        <DeleteIcon
                          color="error"
                          sx={{ fontSize: isMobile ? "1.2rem" : "1.5rem" }}
                        />
                      </Tooltip> */}
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={filteredQuotationList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <QuotationDetailsDialog
        selectdQuo={selectdQuo}
        open={open}
        onClose={handleClose}
        supplierList={supplierList}
        allItems={allItems}
        companyList={companyList}
        signatoryList={signatoryList}
        fetchQuotationsFn={fetchQuotationsFn}
      />
      {openEmail && (
        <QuotationEmailDirectForm
          openEmail={openEmail}
          handleCloseEmail={handleCloseEmail}
          handleClickOpenEmail={handleClickOpenEmail}
          emailData={emailData}
          type="QUO"
        />
      )}
    </Paper>
  );
}
