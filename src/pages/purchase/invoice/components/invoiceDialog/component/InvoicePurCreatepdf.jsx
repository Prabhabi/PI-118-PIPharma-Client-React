// File: InvoicePDF.jsx

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";

// Styles matching the exact design
const styles = StyleSheet.create({
  page: {
    // padding: 1,
    paddingBottom: 24,
    // paddingTop: 1,
    fontSize: 9,
    fontFamily: "Helvetica",
    backgroundColor: "#fff",
  },
  pageBorder: {
    margin: 1,
    padding: 2,
    minHeight: "100%",
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
  },

  // Header Section Styles
  headerContainer: {
    // padding: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  logoSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  logoContainer: {
    width: 60,
    height: 60,
    marginRight: 15,
    backgroundColor: "#4A90E2", // Blue background for 'G' logo
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
  },
  companyInfo: {
    flex: 2,
  },
  invoiceTitle: {
    fontSize: 12,
    fontWeight: "bold",
    // textAlign: "center",
    marginTop: -30,
    mr:1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 3,
  },
  companySubInfo: {
    fontSize: 8,
    marginBottom: 1,
    color: "#333",
  },
  taglineContainer: {
    marginTop: 1,
  },
  tagline: {
    fontSize: 10,
    color: "#4A90E2",
    fontWeight: "bold",
  },
  licenseNumbers: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 1,
    fontSize: 8,
  },

  // Patient Details Section
  patientSection: {
    padding: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  patientDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 10,
  },
  patientLeft: {
    flex: 1,
  },
  patientRight: {
    flex: 1,
    textAlign: "right",
  },
  detailRow: {
    marginBottom: 0.2,
  },

  // Table Styles
  table: {
    display: "table",
    width: "auto",
    margin: 0,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  tableHeader: {
    backgroundColor: "#E8F4FD",
    fontWeight: "bold",
    fontSize: 8,
    textAlign: "center",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  tableCell: {
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 0.5,
    textAlign: "center",
    fontSize: 8,
    justifyContent: "center",
  },
  tableCellFirst: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 0.5,
    textAlign: "center",
    fontSize: 8,
    justifyContent: "center",
  },

  // Summary Section Styles
  summarySection: {
    padding: 1,
    borderTopWidth: 2,
    borderTopColor: "#000",
  },
  summaryGrid: {
    flexDirection: "row",
    marginBottom: 8,
  },
  summaryBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#000",
    padding: .1,
    marginRight: 2,
    backgroundColor: "#F8F9FA",
  },
  summaryBoxLast: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#000",
    padding: .1,
    marginRight: 0,
    backgroundColor: "#F8F9FA",
  },
  summaryLabel: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 10,
    fontWeight: "bold",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 2,
    paddingTop: 1,
    paddingRight: 10,
  },
  totalText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#4A90E2", // Blue color
  },
});

const safe = (val) =>
  val === null || val === undefined || val === "null" ? "" : val;

const InvoicePurCreatepdf = (data, type) => {
  // Defensive: handle undefined/null data
  if (!data || typeof data !== "object") {
    return (
      <Document>
        <Page size="A4" style={styles.page} wrap>
          <Text>No data available</Text>
        </Page>
      </Document>
    );
  }

  // Parse ReceiptProductModelList if it's a string
  let items = [];
  if (Array.isArray(data.ReceiptProductModelList)) {
    items = data.ReceiptProductModelList;
  } else if (typeof data.ReceiptProductModelList === "string") {
    try {
      items = JSON.parse(data.ReceiptProductModelList);
    } catch {
      items = [];
    }
  }

  // PaymentDetails: ensure it's always an array, parse if string
  let payments = [];
  if (Array.isArray(data.PaymentDetails)) {
    payments = data.PaymentDetails;
  } else if (typeof data.PaymentDetails === "string") {
    try {
      payments = JSON.parse(data.PaymentDetails);
    } catch {
      payments = [];
    }
  }

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.pageBorder}>
          
          {/* Header Section */}
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <View style={styles.headerTop}>
              <View style={styles.logoSection}>
                <View style={styles.logoContainer}>
                  <Text style={styles.logoText}>G</Text>
                </View>
                <View style={styles.companyInfo}>
                  <Text style={styles.companyName}>  {safe(data.Bill_CompanyName)}</Text>

                  <Text style={[styles.companySubInfo]}>GST No. {safe(data.Bill_GSTNumber)}</Text>

                  <View style={styles.taglineContainer}>
                    <Text style={styles.tagline}>{safe(data.Bill_PhoneNumber1)}</Text>
                    <Text style={styles.companySubInfo}> {safe(data.Bill_AddressLine1)}, {safe(data.Bill_AddressLine2)}</Text>
                    <Text style={[styles.companySubInfo]}>
                      {safe(data.Bill_City)}, {safe(data.Bill_State)}, {safe(data.Bill_Pincode)}
                    </Text>
                  </View>
                </View>
              </View>
              <View>
                <Text style={[styles.invoiceTitle, ]}>PURCHASE INVOICE</Text>
              </View>   
            </View>

          </View>

          {/* Patient Details Section */}
          <View style={styles.patientSection}>
            <View style={styles.patientDetails}>
              <View style={styles.patientLeft}>
                <View style={styles.detailRow}>
                  <Text><Text style={{fontWeight: 'bold'}}>Patient Name:</Text> {safe(data.Bill_CompanyName)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text><Text style={{fontWeight: 'bold'}}>Mobile:</Text> {safe(data.Bill_PhoneNumber1)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text><Text style={{fontWeight: 'bold'}}>Doctor Name:</Text> {safe(data.DoctorName)}</Text>
                </View>
              </View>
              <View style={styles.patientRight}>
                <View style={styles.detailRow}>
                  <Text><Text style={{fontWeight: 'bold'}}>Bill No:</Text> {safe(data.ReceiptNumber)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text><Text style={{fontWeight: 'bold'}}>Date:</Text> {data.ReceiptDate ? new Date(data.ReceiptDate).toLocaleDateString("en-GB") : ""}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Table Section */}
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCellFirst, { width: "5%" }]}>Sr No</Text>
              <Text style={[styles.tableCell, { width: "30%" }]}>Name of Drug</Text>
              <Text style={[styles.tableCell, { width: "9%" }]}>B. No.</Text>
              <Text style={[styles.tableCell, { width: "9%" }]}>Exp.</Text>
              <Text style={[styles.tableCell, { width: "7%" }]}>MRP</Text>
              <Text style={[styles.tableCell, { width: "6%" }]}>Qty</Text>
              <Text style={[styles.tableCell, { width: "7%" }]}>Rate</Text>
              <Text style={[styles.tableCell, { width: "7%" }]}>SGST</Text>
              <Text style={[styles.tableCell, { width: "7%" }]}>CGST</Text>
              <Text style={[styles.tableCell, { width: "7%" }]}>Discount</Text>
              <Text style={[styles.tableCell, { width: "6%" }]}>Amount</Text>
            </View>

            {items.map((item, idx) => (
              <View style={styles.tableRow} key={idx}>
                <Text style={[styles.tableCellFirst, { width: "5%" }]}>{idx + 1}</Text>
                <Text style={[styles.tableCell, { width: "30%" }]}>
                  {safe(item.ProductModelName)}
                </Text>
                <Text style={[styles.tableCell, { width: "9%" }]}>
                  {safe(item.BatchNo)}
                </Text>
                <Text style={[styles.tableCell, { width: "9%" }]}>
                  {safe(item.ExpiryDate)}
                </Text>
                <Text style={[styles.tableCell, { width: "7%" }]}>
                  {safe(item.MRP)}
                </Text>
                <Text style={[styles.tableCell, { width: "6%" }]}>
                  {safe(item.Quantity)}
                </Text>
                <Text style={[styles.tableCell, { width: "7%" }]}>
                  {safe(item.Rate)}
                </Text>
                <Text style={[styles.tableCell, { width: "7%" }]}>
                  {safe(item.SGSTP)}
                </Text>
                <Text style={[styles.tableCell, { width: "7%" }]}>
                  {safe(item.CGSTP)}
                </Text>
                <Text style={[styles.tableCell, { width: "7%" }]}>
                  0.00
                </Text>
                <Text style={[styles.tableCell, { width: "6%" }]}>
                  {safe(item.Amount)}
                </Text>
              </View>
            ))}
            
            {/* Summary rows attached to table */}
            <View style={styles.tableRow}>
             
               <Text style={[styles.tableCellFirst, { width: "33.33%", fontWeight: 'bold', backgroundColor: '#F8F9FA' }]}>
                Total Saving Amount: {safe(data.TotalSaving)}
              </Text>

              <Text style={[styles.tableCell, { width: "33.33%", fontWeight: 'bold', backgroundColor: '#F8F9FA' }]}>
                Discount: 0.00
              </Text>
                             <Text style={[styles.tableCellFirst, { width: "33.33%", fontWeight: 'bold', backgroundColor: '#F8F9FA' }]}>
                Total MRP Amount: ₹{safe(data.GrandTotalAmount)}
              </Text>
            </View>
            
            <View style={styles.tableRow}>

              <Text style={[styles.tableCell, { width: "33.33%", fontWeight: 'bold', backgroundColor: '#F8F9FA' }]}>
                GST IN: {safe(data.GSTNumber)}
              </Text>
              <Text style={[styles.tableCell, { width: "33.33%", fontWeight: 'bold', backgroundColor: '#F8F9FA' }]}>
                Pharmacist Name: {safe(data.PreparedByName)}
              </Text>
              <Text style={[styles.tableCell, { width: "33.33%", fontWeight: 'bold', backgroundColor: '#F8F9FA' }]}>
                Pharmacist Signature: 
              </Text>

            </View>
          </View>

          {/* Total Section - separate from table */}
          {/* <View style={styles.totalRow}>
            <Text style={styles.totalText}>
              Total: ₹{safe(data.GrandTotalAmount)}
            </Text>
          </View> */}
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePurCreatepdf;  