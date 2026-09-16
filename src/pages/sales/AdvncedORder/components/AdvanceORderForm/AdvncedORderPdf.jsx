// File: InvoicePDF.jsx

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Optional: Register a custom font if needed
// Font.register({ family: 'Arial', src: 'path/to/arial.ttf' });

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
    marginBottom: 0, // reduced line spacing to minimum
  },
  tableRowLast: {
    flexDirection: "row",
    marginBottom: 0, // reduced line spacing to minimum
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

const AdvncedORderPdf = (data) => {
  // Defensive: handle undefined/null data
  // console.log("Data received for PDF generation:", data);
  if (!data || typeof data !== "object") {
    return (
      <Document>
        <Page size="A4" style={styles.page} wrap>
          <Text>No data available</Text>
        </Page>
      </Document>
    );
  }

  // Parse ModelMappingData for product details
  let items = [];
  if (Array.isArray(data.ModelMappingData)) {
    items = data.ModelMappingData;
  }

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={[styles.pageBorder, { marginTop: 0, paddingTop: 0 }]}>
          <View style={[styles.header, { marginTop: 0, paddingTop: 0 }]}>
            <Text style={styles.headerTitle}>Quotation</Text>
            <View style={styles.headerRow}>
              <Text style={styles.headerLeft}>
                Quotation No: {safe(data.QuotationNo)}
              </Text>
              <Text style={styles.headerRight}>
                Date:{" "}
                {data.QuotationDate
                  ? new Date(data.QuotationDate).toLocaleDateString("en-GB")
                  : ""}
              </Text>
            </View>
            <View style={styles.horizontalLine} />
          </View>

          {/* From and To section side by side */}
          <View style={styles.sectionRow}>
            <View style={styles.sectionColLast}>
              <Text>From: {safe(data.Bill_CompanyName)}</Text>
              <Text>
                {safe(data.Bill_AddressLine1)}, {safe(data.Bill_AddressLine2)}
              </Text>
              <Text>
                {safe(data.Bill_City)}, {safe(data.Bill_State)} -{" "}
                {safe(data.Bill_PinCode)}
              </Text>
              <Text>
                Phone: {safe(data.Bill_PhoneNumber1)}{" "}
                {safe(data.Bill_PhoneNumber2)}
              </Text>
              <Text>GST No: {safe(data.Bill_GSTNumber)}</Text>
            </View>
            <View style={styles.sectionCol}>
              <Text>To: {safe(data.CompanyName)}</Text>
              <Text>
                {safe(data.AddressLine1)}, {safe(data.AddressLine2)}
              </Text>
              <Text>
                {safe(data.City)}, {safe(data.State)} - {safe(data.PinCode)}
              </Text>
              <Text>
                Phone: {safe(data.PhoneNumber1)} {safe(data.PhoneNumber2)}
              </Text>
              <Text>GST No: {safe(data.GSTNumber)}</Text>
            </View>
          </View>
          <View style={styles.horizontalLine} />

          <View style={styles.section}>
            <Text style={styles.productDetailsLabel}>Product Details:</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableColFirst, { width: "15%" }]}>No</Text>
                <Text style={[styles.tableCol, { width: "55%" }]}>
                  Product Model
                </Text>
                <Text style={[styles.tableCol, { width: "30%" }]}>
                  Strip Qty
                </Text>
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
                  <Text style={[styles.tableColFirst, { width: "15%" }]}>
                    {idx + 1}
                  </Text>
                  <Text style={[styles.tableCol, { width: "55%" }]}>
                    {safe(item.ProductModelName)}
                  </Text>
                  <Text style={[styles.tableCol, { width: "30%" }]}>
                    {safe(item.StripQty)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row", // Ensure row layout
              justifyContent: "space-between", // Push elements to left and right ends
              alignItems: "center", // Align items vertically
              ...styles.section,
            }}
          >
            {" "}
            <View style={{ textAlign: "left", flex: 1 }}>
              <Text>
                In Words:{" "}
                {numberToWordsInIndian(
                  Number(safe(data.GrandTotalAmount)) +
                    Number(safe(data.RoundedOffAmount))
                )}
              </Text>
              <Text>Remarks: {safe(data.QABRemarks)}</Text>
            </View>
            <View style={{ textAlign: "right", flex: 1 }}>
              <Text>Round Off: {safe(data.RoundedOffAmount)}</Text>
              <Text>Net Total: ₹{safe(data.NetTotalAmount)}</Text>
              <Text>Total Gst: ₹{safe(data.SGSTAmount)}</Text>
              <Text>
                Grand Total: ₹
                {Number(safe(data.GrandTotalAmount)) +
                  Number(safe(data.RoundedOffAmount))}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text>Bank Name: {safe(data.Bill_BankName)}</Text>
            <Text>Account Number: {safe(data.Bill_AccountNumber)}</Text>
            <Text>IFSC Code: {safe(data.Bill_IFSCCode)}</Text>
            <Text>Branch: {safe(data.Bill_BranchName)}</Text>
          </View>

          <View
            style={[
              styles.section,
              { flexDirection: "row", justifyContent: "space-between" },
            ]}
          >
            <Text>Authorized By: {safe(data.AuthorizedSignatoryByName)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default AdvncedORderPdf;
