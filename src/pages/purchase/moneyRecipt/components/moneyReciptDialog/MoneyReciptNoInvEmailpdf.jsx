// File: InvoicePDF.jsx

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// Style
const styles = StyleSheet.create({
  page: {
    padding: 0, // removed padding from page
    paddingBottom: 24, // add bottom padding for every page
    paddingTop: 24, // add top padding for every page
    fontSize: 9,
    fontFamily: "Helvetica",
    backgroundColor: "#fff",
    // border removed from here
  },
  pageBorder: {
    margin: 20, // margin to simulate padding inside border
    padding: 0,
    minHeight: "100%",
    // borderWidth: 1, // thicker border for visibility
    // borderColor: "#000",
    // borderStyle: "solid",
  },
  section: {
    marginBottom: 7, // reduced spacing between sections
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 7,
  },
  sectionCol: {
    flex: 1,
    marginRight: 10,
  },
  sectionColLast: {
    flex: 1,
    marginRight: 0,
    marginLeft: 10,
  },
  header: {
    textAlign: "center",
    marginBottom: 7,
  },
  headerTitle: {
    fontSize: 18, // bigger font for Purchase Order
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2, // reduced gap between headerRow and horizontal line
    width: "100%",
  },
  headerLeft: {
    fontSize: 10,
    textAlign: "left",
    flex: 1,
  },
  headerRight: {
    fontSize: 10,
    textAlign: "right",
    flex: 1,
  },
  table: {
    display: "table",
    width: "auto",
  },
  tableRow: {
    flexDirection: "row",
    marginBottom: 0.2, // reduced line spacing
  },
  tableRowLast: {
    flexDirection: "row",
    marginBottom: 0.2, // reduced line spacing
    borderBottomWidth: 1, // add bottom border only to last row
    borderColor: "#000",
  },
  tableCol: {
    borderRightWidth: 1, // vertical line on right of each column
    borderColor: "#000",
    padding: 2, // reduced padding
    textAlign: "center", // center align table data
  },
  tableColFirst: {
    borderLeftWidth: 1, // vertical line on left of first column
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 2,
    textAlign: "center", // center align first column data
  },
  tableHeader: {
    backgroundColor: "#eee",
    fontWeight: "bold",
    textAlign: "center",
    borderTopWidth: 1, // add top border to heading
    borderBottomWidth: 1, // add bottom border to heading
    borderColor: "#000",
  },
  horizontalLine: {
    borderBottomWidth: 1,
    borderColor: "#000",
    marginVertical: 6,
    width: "100%",
  },
  productDetailsLabel: {
    fontSize: 13, // increased font size for Product Details
    fontWeight: "bold",
    marginBottom: 8, // added margin bottom
  },
});

const safe = (val) =>
  val === null || val === undefined || val === "null" ? "" : val;

const numberToWordsInIndian = (num) => {
  const units = [
    "Zero",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  const convertHundreds = (num) => {
    if (num === 0) return "";
    if (num < 20) return units[num];
    if (num < 100)
      return `${tens[Math.floor(num / 10)]}${num % 10 ? " " + units[num % 10] : ""}`;
    return `${units[Math.floor(num / 100)]} Hundred${num % 100 ? " " + convertHundreds(num % 100) : ""}`;
  };
  const convertNumberToWords = (num) => {
    if (num === 0) return "Zero";
    let words = "";
    if (num >= 10000000) {
      words += convertHundreds(Math.floor(num / 10000000)) + " Crore ";
      num %= 10000000;
    }
    if (num >= 100000) {
      words += convertHundreds(Math.floor(num / 100000)) + " Lakh ";
      num %= 100000;
    }
    if (num >= 1000) {
      words += convertHundreds(Math.floor(num / 1000)) + " Thousand ";
      num %= 1000;
    }
    words += convertHundreds(num);
    return words.trim();
  };
  const integerPart = Math.floor(num);
  const fractionPart = Math.round((num - integerPart) * 100);
  let result = convertNumberToWords(integerPart);
  if (fractionPart)
    result += " and " + convertHundreds(fractionPart) + " Paise";
  return result + " Only";
};

// Map numeric InDemand value to demand text
const getDemandText = (val) => {
  switch (String(val)) {
    case "1": return "High Demand";
    case "2": return "Mid Demand";
    case "3": return "Low Demand";
    case "4": return "Rare Demand";
    default: return "";
  }
};

const moneyReciptNoInvEmailpdf = (data) => {
  if (!data || typeof data !== "object") {
    return (
      <Document>
        <Page size="A4" style={styles.page} wrap>
          <Text>No data available</Text>
        </Page>
      </Document>
    );
  }

  // Product details from OrderMappingList
  const items = Array.isArray(data.OrderMappingList) ? data.OrderMappingList : [];

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={[styles.pageBorder, { marginTop: 0, paddingTop: 0 }]}>
          <View style={[styles.header, { marginTop: 0, paddingTop: 0 }]}>
            <Text style={styles.headerTitle}>Booking Order Receipt</Text>
            <View style={styles.headerRow}>
              <Text style={styles.headerLeft}>
                Order No: {safe(data.RequestOrderMasterID)}
              </Text>
              <Text style={styles.headerRight}>
                Date:{" "}
                {data.RequestOrderDate
                  ? new Date(data.RequestOrderDate).toLocaleDateString("en-GB")
                  : ""}
              </Text>
            </View>
            <View style={styles.horizontalLine} />
          </View>

          {/* From and To section */}
          <View style={styles.sectionRow}>
            <View style={styles.sectionCol}>
              <Text>From: Company</Text>
              {/* Add company info if available */}
            </View>
            <View style={styles.sectionColLast}>
              <Text>To: {safe(data.CustomerName)}</Text>
              <Text>Mobile: {safe(data.CustomerMobile)}</Text>
              {/* Add more customer info if available */}
            </View>
          </View>
          <View style={styles.horizontalLine} />

          <View style={styles.section}>
            <Text style={styles.productDetailsLabel}>Item Details:</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableColFirst, { width: "6%" }]}>No</Text>
                <Text style={[styles.tableCol, { width: "24%" }]}>Model Number</Text>
                <Text style={[styles.tableCol, { width: "10%" }]}>Quantity</Text>
                <Text style={[styles.tableCol, { width: "12%" }]}>Price</Text>
                <Text style={[styles.tableCol, { width: "12%" }]}>Total</Text>
                <Text style={[styles.tableCol, { width: "12%" }]}>In Demand</Text>
                <Text style={[styles.tableCol, { width: "24%" }]}>Expected Delivery</Text>
              </View>
              {items.map((item, idx) => (
                <View
                  style={
                    idx === items.length - 1
                      ? styles.tableRowLast
                      : styles.tableRow
                  }
                  key={idx}
                >
                  <Text style={[styles.tableColFirst, { width: "6%" }]}>{idx + 1}</Text>
                  <Text style={[styles.tableCol, { width: "24%" }]}>{safe(item.ModelNumber)}</Text>
                  <Text style={[styles.tableCol, { width: "10%" }]}>{safe(item.Quantity)}</Text>
                  <Text style={[styles.tableCol, { width: "12%" }]}>₹{safe(item.Price)}</Text>
                  <Text style={[styles.tableCol, { width: "12%" }]}>₹{safe(item.Total)}</Text>
                  <Text style={[styles.tableCol, { width: "12%" }]}>
                    {getDemandText(item.InDemand)}
                  </Text>
                  <Text style={[styles.tableCol, { width: "24%" }]}>
                    {item.ExpectedDeliveryDateTime
                      ? new Date(item.ExpectedDeliveryDateTime).toLocaleString("en-GB")
                      : ""}
                  </Text>
                </View>
              ))}
            </View>
            {/* Overall Delivery Date & Time below table */}
            <Text style={{ marginTop: 8 }}>
              Overall Delivery Date & Time: {data.OverallDeliveryDateTime
                ? new Date(data.OverallDeliveryDateTime).toLocaleString("en-GB")
                : ""}
            </Text>  5
          </View>

          {/* Summary Section */}
          <View style={styles.section}>
            <Text>Advance Amount: ₹{safe(data.AdvanceAmount)}</Text>
            <Text>Approx Bill Amount: ₹{safe(data.ApproxBillAmount)}</Text>
            <Text>Due Amount: ₹{safe(data.DueAmount)}</Text>

            <Text>
              In Words: {numberToWordsInIndian(Number(safe(data.ApproxBillAmount)))}
            </Text>
          </View>

          <View style={styles.section}>
            <Text>Remarks: {safe(data.Remarks)}</Text>
            {/* Add more info if needed */}
          </View>

          <View
            style={[
              styles.section,
              { flexDirection: "row", justifyContent: "space-between" },
            ]}
          >
            <Text>Checked By: {safe(data.CheckedByName)}</Text>
            <Text>Prepared By: {safe(data.PreparedByName)}</Text>
            <Text>Authorized By: {safe(data.AuthorizedSignatoryName)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default moneyReciptNoInvEmailpdf;

// Usage example (in your parent component):
// import InvoicePDF from './moneyReciptNoInvEmailpdf';
// import { PDFDownloadLink } from '@react-pdf/renderer';
// ...
// <PDFDownloadLink document={<InvoicePDF {...data} />} fileName="invoice.pdf">
//   {({ loading }) => loading ? "Generating PDF..." : "Download PDF"}
// </PDFDownloadLink>
