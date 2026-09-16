import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Helper to display nothing for missing/empty/null values
const displayValue = (val) => {
  if (val === undefined || val === null) return "";
  if (typeof val === "string" && val.trim() === "") return "";
  if (typeof val === "number" && isNaN(val)) return "";
  return val;
};

// Function to convert a number to words in the Indian numbering system
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
      return (
        tens[Math.floor(num / 10)] + (num % 10 ? " " + units[num % 10] : "")
      );
    return (
      units[Math.floor(num / 100)] +
      " Hundred" +
      (num % 100 ? " " + convertHundreds(num % 100) : "")
    );
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
  if (fractionPart) {
    result += " and " + convertHundreds(fractionPart) + " Paise";
  }
  return result + " Only";
};

const formatNumber = (value) => {
  const num = parseFloat(value);
  if (isNaN(num)) return "0";
  // Remove any superscript ¹ or similar characters if present
  let formatted = num === 0 ? "0.00" : num.toFixed(2).replace(/\.?0+$/, "");
  // Remove any superscript ¹ or similar characters
  formatted = formatted.replace(/[¹]/g, "");
  return formatted;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d)) return "";
    return d.toLocaleDateString("en-GB");
  } catch {
    return "";
  }
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    paddingTop: 20, // Top padding for A4
    paddingBottom: 20, // Bottom padding for A4
    paddingLeft: 18, // Left padding for A4
    paddingRight: 18, // Right padding for A4
    color: "#000",
  },
  section: {
    marginBottom: 8,
  },
  header: {
    textAlign: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  infoBlock: {
    width: "48%",
  },
  table: {
    width: "100%",
    display: "table",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: "#000",
    marginBottom: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  tableHeaderCell: {
    fontWeight: "bold",
    padding: 4,
    fontSize: 9,
    borderRightWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    // No row border, only outer border
  },
  tableCell: {
    padding: 4,
    fontSize: 9,
    borderRightWidth: 1,
    borderColor: "#000",
  },
  summary: {
    alignItems: "flex-end",
    marginBottom: 4,
  },
  remarks: {
    marginTop: 8,
    fontSize: 9,
  },
  terms: {
    marginTop: 12,
    fontSize: 8,
  },
  signRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40, // Increased gap before signature row
    fontSize: 9,
  },
});

const getDiscountUnit = (unit) => {
  if (!unit) return "";
  if (unit === "P") return "%";
  if (unit === "A") return "₹";
  return unit;
};

const ProductTable = ({ items }) => (
  <View style={styles.table}>
    <View style={styles.tableHeader}>
      <Text
        style={[styles.tableHeaderCell, { width: "5%", textAlign: "center" }]}
      >
        No.
      </Text>
      <Text
        style={[styles.tableHeaderCell, { width: "27%", textAlign: "center" }]}
      >
        Product Model
      </Text>
      <Text
        style={[styles.tableHeaderCell, { width: "27%", textAlign: "center" }]}
      >
        Qty (Returned | Existing)
      </Text>
      <Text
        style={[styles.tableHeaderCell, { width: "10%", textAlign: "center" }]}
      >
        Unit
      </Text>
      <Text
        style={[styles.tableHeaderCell, { width: "12%", textAlign: "center" }]}
      >
        Rate
      </Text>
      <Text
        style={[styles.tableHeaderCell, { width: "12%", textAlign: "center" }]}
      >
        Amount
      </Text>
      <Text
        style={[
          styles.tableHeaderCell,
          { width: "10%", textAlign: "center", borderRightWidth: 1 },
        ]}
      >
        Status
      </Text>
    </View>
    {items?.map((item, index) => {
      let msd = [];
      try {
        msd =
          typeof item.ModelStatusData === "string"
            ? JSON.parse(item.ModelStatusData)
            : Array.isArray(item.ModelStatusData)
              ? item.ModelStatusData
              : [];
      } catch {
        msd = [];
      }
      const getQty = (status) =>
        msd
          .filter((m) =>
            (m.ProductModelStatus || "").trim().toUpperCase().startsWith(status)
          )
          .reduce((sum, m) => sum + Number(m.Quantity || 0), 0);
      const damagedQty = getQty("D");
      const returnedQty = getQty("R");
      const existingQty = getQty("E");
      let qtyDisplay = "";
      if (item.ProductModelStatus === "R" && msd.length > 0) {
        qtyDisplay = `Returned: ${returnedQty} | Existing: ${existingQty}`;
      } else if (item.ProductModelStatus === "N") {
        qtyDisplay = `Qty: ${displayValue(item.Quantity)}`;
      } else if (msd.length > 0) {
        qtyDisplay = ` Returned: ${returnedQty} | Existing: ${existingQty}`;
      } else {
        qtyDisplay = `Qty: ${displayValue(item.Quantity)}`;
      }
      // For last row, add borderBottomWidth: 1 to all cells
      const isLastRow = index === items.length - 1;
      const cellStyle = (base, isLast) => [
        base,
        isLastRow ? { borderBottomWidth: 1 } : {},
        isLast ? { borderRightWidth: 1 } : {},
      ];
      return (
        <View style={styles.tableRow} key={index}>
          <Text
            style={cellStyle(
              [styles.tableCell, { width: "5%", textAlign: "center" }],
              false
            )}
          >
            {index + 1}
          </Text>
          <Text
            style={cellStyle(
              [styles.tableCell, { width: "27%", textAlign: "center" }],
              false
            )}
          >
            {displayValue(item.ProductModelName)}
          </Text>
          <Text
            style={cellStyle(
              [styles.tableCell, { width: "27%", textAlign: "center" }],
              false
            )}
          >
            {qtyDisplay}
          </Text>
          <Text
            style={cellStyle(
              [styles.tableCell, { width: "10%", textAlign: "center" }],
              false
            )}
          >
            {displayValue(item.UnitQuantity)}
          </Text>
          <Text
            style={cellStyle(
              [styles.tableCell, { width: "12%", textAlign: "center" }],
              false
            )}
          >
            {item.Rate !== undefined && item.Rate !== null && item.Rate !== ""
              ? `₹${displayValue(formatNumber(item.Rate))}`
              : ""}
          </Text>
          <Text
            style={cellStyle(
              [styles.tableCell, { width: "12%", textAlign: "center" }],
              false
            )}
          >
            {item.Amount !== undefined &&
            item.Amount !== null &&
            item.Amount !== ""
              ? `₹${displayValue(formatNumber(item.Amount))}`
              : ""}
          </Text>
          <Text
            style={cellStyle(
              [styles.tableCell, { width: "10%", textAlign: "center" }],
              true
            )}
          >
            {item.ProductModelStatus || ""}
          </Text>
        </View>
      );
    })}
  </View>
);

const PaymentDetailsTable = ({ payments }) => {
  if (!Array.isArray(payments) || payments.length === 0) return null;
  return (
    <View style={{ marginTop: 6 }}>
      <Text style={{ fontWeight: "bold", marginBottom: 6 }}>
        Payment Details:
      </Text>
      <View style={[styles.table, { fontSize: 8 }]}>
        <View style={styles.tableHeader}>
          <Text
            style={[
              styles.tableHeaderCell,
              { width: "25%", textAlign: "center" },
            ]}
          >
            Mode
          </Text>
          <Text
            style={[
              styles.tableHeaderCell,
              { width: "25%", textAlign: "center" },
            ]}
          >
            Desc
          </Text>
          <Text
            style={[
              styles.tableHeaderCell,
              { width: "25%", textAlign: "center" },
            ]}
          >
            Amount
          </Text>
          <Text
            style={[
              styles.tableHeaderCell,
              { width: "25%", textAlign: "center", borderRightWidth: 1 },
            ]}
          >
            Date
          </Text>
        </View>
        {payments.map((p, i) => {
          const isLastRow = i === payments.length - 1;
          const cellStyle = (base, isLast) => [
            base,
            isLastRow ? { borderBottomWidth: 1 } : {},
            isLast ? { borderRightWidth: 1 } : {},
          ];
          return (
            <View style={styles.tableRow} key={i}>
              <Text
                style={cellStyle(
                  [styles.tableCell, { width: "25%", textAlign: "center" }],
                  false
                )}
              >
                {displayValue(p.PaymentModeName || p.PaymentModeID)}
              </Text>
              <Text
                style={cellStyle(
                  [styles.tableCell, { width: "25%", textAlign: "center" }],
                  false
                )}
              >
                {displayValue(p.PaymentModeDetails || p.PaymentModeDesc)}
              </Text>
              <Text
                style={cellStyle(
                  [styles.tableCell, { width: "25%", textAlign: "center" }],
                  false
                )}
              >{`₹${formatNumber(p.Amount)}`}</Text>
              <Text
                style={cellStyle(
                  [styles.tableCell, { width: "25%", textAlign: "center" }],
                  true
                )}
              >
                {formatDate(p.PaymentDate)}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const DamagePdfSalePDF = ({ responseData }) => {
  let data = responseData;
  if (Array.isArray(responseData)) {
    data = responseData[0] || {};
  } else if (
    responseData?.postedData &&
    Array.isArray(responseData.postedData)
  ) {
    data = responseData.postedData[0] || {};
  } else if (responseData?.postedData) {
    data = responseData.postedData;
  }
  const fromType = data.BillEntityType || "";
  const fromName =
    data.Bill_CompanyName || data.BillEntityName || data.BillCompanyName || "";
  const fromAddress1 = data.Bill_AddressLine1 || data.BillAddressLine1 || "";
  const fromAddress2 = data.Bill_AddressLine2 || data.BillAddressLine2 || "";
  const fromCity = data.Bill_City || data.BillCity || "";
  const fromState = data.Bill_State || data.BillState || "";
  const fromPin = data.Bill_PinCode || data.BillPinCode || "";
  const fromPhone = data.Bill_PhoneNumber1 || data.BillPhoneNumber1 || "";
  const fromEmail = data.Bill_Email || "";
  const fromGST = data.Bill_GSTNumber || data.BillGSTNumber || "";
  const toType = data.EntityType || "";
  const toName = data.CompanyName || data.EntityName || data.Name || "";
  const toAddress1 = data.AddressLine1 || "";
  const toAddress2 = data.AddressLine2 || "";
  const toCity = data.City || "";
  const toState = data.State || "";
  const toPin = data.PinCode || "";
  const toPhone = data.PhoneNumber1 || "";
  const toEmail = data.Email || "";
  const toGST = data.GSTNumber || "";
  const {
    ReceiptProductModelList,
    TotalAmountBD,
    Discount,
    DiscountAmount,
    DiscountDesc,
    DiscountUnit,
    TotalAmountAD,
    CGSTP,
    CGSTAmount,
    SGSTP,
    SGSTAmount,
    GrandTotalAmount,
    RoundOffAmount,
    NetPaidAmount,
    NetDueAmount,
    Remarks,
    CheckedByName,
    PreparedByName,
    AuthorizedSignatoryByName,
    PaymentDetails,
    ReceiptID,
    ReceiptNumber,
    BillCode,
    ReceiptDate,
    PaymentType,
    PaymentStatus,
  } = data;
  let parsedProductList = [];
  if (typeof ReceiptProductModelList === "string") {
    try {
      parsedProductList = JSON.parse(ReceiptProductModelList);
    } catch {
      parsedProductList = [];
    }
  } else if (Array.isArray(ReceiptProductModelList)) {
    parsedProductList = ReceiptProductModelList;
  }
  let parsedPaymentDetails = [];
  if (typeof PaymentDetails === "string") {
    try {
      parsedPaymentDetails = JSON.parse(PaymentDetails);
    } catch {
      parsedPaymentDetails = [];
    }
  } else if (Array.isArray(PaymentDetails)) {
    parsedPaymentDetails = PaymentDetails;
  }
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={{ fontSize: 9 }}>
            Original for Recipient, Duplicate for Transporter, Triplicate for
            Supplier
          </Text>
          <Text style={styles.title}>Return Receipt</Text>
          <View style={styles.infoRow}>
            <View style={styles.infoBlock}>
              <Text>Invoice No: {displayValue(ReceiptNumber)}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text>Date: {formatDate(ReceiptDate)}</Text>
            </View>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              borderColor: "#000",
              marginBottom: 10,
            }}
          />
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoBlock}>
            <Text>From{fromType ? ` (${fromType})` : ""}:</Text>
            <Text>Name: {displayValue(fromName)}</Text>
            <Text>
              Address: {displayValue(fromAddress1)}
              {fromAddress1 && fromAddress2 ? ", " : ""}
              {displayValue(fromAddress2)}
            </Text>
            <Text>
              City/State/Pin: {displayValue(fromCity)}
              {fromCity && fromState ? ", " : ""}
              {displayValue(fromState)}
              {(fromCity || fromState) && fromPin ? ", " : ""}
              {displayValue(fromPin)}
            </Text>
            <Text>Phone: {displayValue(fromPhone)}</Text>
            <Text>Email: {displayValue(fromEmail)}</Text>
            {fromGST ? <Text>GST No.: {displayValue(fromGST)}</Text> : null}
          </View>
          <View style={styles.infoBlock}>
            <Text>To{toType ? ` (${toType})` : ""}:</Text>
            <Text>Name: {displayValue(toName)}</Text>
            <Text>
              Address: {displayValue(toAddress1)}
              {toAddress1 && toAddress2 ? ", " : ""}
              {displayValue(toAddress2)}
            </Text>
            <Text>
              City/State/Pin: {displayValue(toCity)}
              {toCity && toState ? ", " : ""}
              {displayValue(toState)}
              {(toCity || toState) && toPin ? ", " : ""}
              {displayValue(toPin)}
            </Text>
            <Text>Phone: {displayValue(toPhone)}</Text>
            <Text>Email: {displayValue(toEmail)}</Text>
            {toGST ? <Text>GST No.: {displayValue(toGST)}</Text> : null}
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              borderColor: "#000",
              marginBottom: 10,
            }}
          />
        </View>
        <View style={{ marginTop: 18, marginBottom: 8 }}>
          <Text style={{ fontSize: 11, fontWeight: "bold", marginBottom: 6 }}>
            Product Details:
          </Text>
          <ProductTable items={parsedProductList} />
        </View>
        <PaymentDetailsTable payments={parsedPaymentDetails} />
        <View style={styles.summary}>
          {TotalAmountBD !== undefined ? (
            <Text>Sub Total: ₹{displayValue(formatNumber(TotalAmountBD))}</Text>
          ) : null}
          {Discount !== undefined && Discount !== 0 ? (
            <Text>
              Discount{DiscountDesc ? ` (${displayValue(DiscountDesc)})` : ""} (
              {displayValue(formatNumber(Discount))}
              {getDiscountUnit(DiscountUnit)}): ₹
              {displayValue(formatNumber(DiscountAmount))}
            </Text>
          ) : null}
          {CGSTP && SGSTP ? (
            (() => {
              const cgst = parseFloat(CGSTAmount) || 0;
              const sgst = parseFloat(SGSTAmount) || 0;
              const totalGst = cgst + sgst;
              return (
                <Text>
                  CGST+SGST ({displayValue(formatNumber(CGSTP))}%+
                  {displayValue(formatNumber(SGSTP))}%): ₹
                  {formatNumber(totalGst)}
                </Text>
              );
            })()
          ) : CGSTP ? (
            <Text>
              CGST ({displayValue(formatNumber(CGSTP))}%): ₹
              {displayValue(formatNumber(CGSTAmount))}
            </Text>
          ) : SGSTP ? (
            <Text>
              SGST ({displayValue(formatNumber(SGSTP))}%): ₹
              {displayValue(formatNumber(SGSTAmount))}
            </Text>
          ) : null}
          {NetPaidAmount !== undefined ? (
            <Text>Paid: ₹{displayValue(formatNumber(NetPaidAmount))}</Text>
          ) : null}
          {NetDueAmount !== undefined ? (
            <Text>Due: ₹{displayValue(formatNumber(NetDueAmount))}</Text>
          ) : null}
          {GrandTotalAmount !== undefined ? (
            <Text style={{ fontWeight: "bold" }}>
              Grand Total: ₹{displayValue(formatNumber(GrandTotalAmount))}
            </Text>
          ) : null}
        </View>
        <View style={styles.section}>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Amount in Words:</Text>{" "}
            {numberToWordsInIndian(GrandTotalAmount || 0)}
          </Text>
        </View>
        <View style={styles.remarks}>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Remarks:</Text>{" "}
            {displayValue(Remarks)}
          </Text>
        </View>
        <View style={styles.terms}>
          <Text style={{ fontWeight: "bold" }}>Terms & Condition:</Text>
          <Text>
            1. Interest @24% per annum will be charged on bills not paid within
            30 days.
          </Text>
          <Text>
            2. Please check the GSTIN and inform for any discrepancy within 7
            days.
          </Text>
          <Text>3. Goods once sold shall not be taken back.</Text>
          <Text>4. No responsibility for Transit Risks.</Text>
          <Text>
            5. Disputes, if any, shall be subject to the Jurisdiction of Kolkata
            Courts.
          </Text>
          <Text>6. Please pay by cheque "A/C PAYEE" NEFT/RTGS only.</Text>
        </View>
        <View style={styles.signRow}>
          <Text>Checked By: {displayValue(CheckedByName)}</Text>
          <Text>Prepared By: {displayValue(PreparedByName)}</Text>
          <Text>Authorized By: {displayValue(AuthorizedSignatoryByName)}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default DamagePdfSalePDF;
