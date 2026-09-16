import html2pdf from "html2pdf.js";
import React from "react";

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

// Add this helper function after the imports
const formatNumber = (value) => {
  const num = parseFloat(value);
  if (isNaN(num)) return "0";
  return num === 0 ? "0.00" : num.toFixed(2).replace(/\.?0+$/, "");
};

// Helper to safely display values (returns blank for null/undefined/"null")
const safe = (val) =>
  val === null || val === undefined || val === "null" ? "" : val;

// Function to generate the PDF
const generateTableHtml = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return `
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <thead>
          <tr>
            <th style="text-align: center;">No.</th>
            <th style="text-align: center;">Product Model</th>
            <th style="text-align: center;">Strip Of</th>
            <th style="text-align: center;">Strip Qty</th>
            <th style="text-align: center;">CGST%</th>
            <th style="text-align: center;">SGST%</th>
            <th style="text-align: center;">Price</th>
            <th style="text-align: center;">Disc%</th>
            <th style="text-align: center;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="9" style="text-align:center;">No items</td>
          </tr>
        </tbody>
      </table>
    `;
  }

  const tableRows = items
    .map((item, index) => {
      const productModelText = `${safe(item.ProductModelName)}`;
      return `
        <tr class="item-row">
          <td style="width: 5%; border-left: 1px solid #000; text-align: center; word-wrap: break-word; font-size: 11px;">${index + 1}</td>
          <td style="width: 35%; border-left: 1px solid #000; text-align: center; word-wrap: break-word; white-space: pre-wrap; font-size: 11px;">${productModelText}</td>
          <td style="width: 8%; border-left: 1px solid #000; text-align: center; word-wrap: break-word; font-size: 11px;">${safe(item.StripOf)}</td>
          <td style="width: 8%; border-left: 1px solid #000; text-align: center; word-wrap: break-word; font-size: 11px;">${safe(item.StripQty)}</td>
          <td style="width: 8%; border-left: 1px solid #000; text-align: center; word-wrap: break-word; font-size: 11px;">${safe(item.CGSTP)}</td>
          <td style="width: 8%; border-left: 1px solid #000; text-align: center; word-wrap: break-word; font-size: 11px;">${safe(item.SGSTP)}</td>
          <td style="width: 12%; border-left: 1px solid #000; text-align: center; word-wrap: break-word; font-size: 11px;">₹${safe(item.Rate)}</td>
          <td style="width: 8%; border-left: 1px solid #000; text-align: center; word-wrap: break-word; font-size: 11px;">${safe(item.DISP)}%</td>
          <td style="width: 12%; border-left: 1px solid #000; border-right: 1px solid #000; text-align: center; word-wrap: break-word; font-size: 11px;">₹${safe(item.Amount)}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <table style="width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 10px; table-layout: fixed;">
      <thead>
        <tr>
          <th style="width: 5%; border: 1px solid #000; font-size: 11px; text-align: center;">No.</th>
          <th style="width: 35%; border: 1px solid #000; text-align: center; font-size: 11px;">Product Model</th>
          <th style="width: 8%; border: 1px solid #000; text-align: center; font-size: 11px;">Strip Of</th>
          <th style="width: 8%; border: 1px solid #000; text-align: center; font-size: 11px;">Strip Qty</th>
          <th style="width: 8%; border: 1px solid #000; text-align: center; font-size: 11px;">CGST%</th>
          <th style="width: 8%; border: 1px solid #000; text-align: center; font-size: 11px;">SGST%</th>
          <th style="width: 12%; border: 1px solid #000; text-align: center; font-size: 11px;">Price</th>
          <th style="width: 8%; border: 1px solid #000; text-align: center; font-size: 11px;">Disc%</th>
          <th style="width: 12%; border: 1px solid #000; text-align: center; font-size: 11px;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
        <tr>
          <td style="border-top: 1px solid #000;"></td>
          <td style="border-top: 1px solid #000;"></td>
          <td style="border-top: 1px solid #000;"></td>
          <td style="border-top: 1px solid #000;"></td>
          <td style="border-top: 1px solid #000;"></td>
          <td style="border-top: 1px solid #000;"></td>
          <td style="border-top: 1px solid #000;"></td>
          <td style="border-top: 1px solid #000;"></td>
          <td style="border-top: 1px solid #000; border-right: 1px solid #000;"></td>
        </tr>
      </tbody>
    </table>
  `;
};

const generatePaymentTableHtml = (payments) => {
  // If payments is not an array or is empty, show "No payment"
  if (!Array.isArray(payments) || payments.length === 0) {
    return `
      <table style="width: 100%; border-collapse: collapse; font-size: 10px; table-layout: fixed;">
        <thead>
          <tr>
            <th style="width: 10%; border: 1px solid #000; font-size: 10px;">Sl No.</th>
            <th style="width: 45%; border: 1px solid #000; font-size: 10px;">Payment Mode</th>
            <th style="width: 25%; border: 1px solid #000; font-size: 10px;">Amount</th>
            <th style="width: 20%; border: 1px solid #000; font-size: 10px;">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="4" style="text-align:center; font-size: 10px; border: 1px solid #000;">No payment</td>
          </tr>
        </tbody>
      </table>
    `;
  }
  const paymentRows = payments
    ?.map((payment, index) => {
      return `
        <tr>
           <td style="width: 10%; border-left: 1px solid #000; text-align: center; word-wrap: break-word; font-size: 10px;">${index + 1}</td>
          <td style="width: 45%; border-left: 1px solid #000; word-wrap: break-word; white-space: pre-wrap; font-size: 10px; text-align: center;">${safe(payment.PaymentModeName) || "N/A"}</td>
          <td style="width: 25%; border-left: 1px solid #000; text-align: center; word-wrap: break-word; font-size: 10px;">${safe(payment.Amount)}</td>
          <td style="width: 20%; border-left: 1px solid #000; border-right: 1px solid #000; text-align: center; word-wrap: break-word; font-size: 10px;">${payment.PaymentDate ? new Date(payment.PaymentDate).toLocaleDateString("en-GB") : ""}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <table style="width: 100%; border-collapse: separate; border-spacing: 0; font-size: 10px; table-layout: fixed; border: 1px solid #000;">
      <thead style="display: table-header-group;">
        <tr>
          <th style="width: 10%; border: 1px solid #000; font-size: 10px;">Sl No.</th>
          <th style="width: 45%; border: 1px solid #000; font-size: 10px;">Payment Mode</th>
          <th style="width: 25%; border: 1px solid #000; font-size: 10px;">Amount</th>
          <th style="width: 20%; border: 1px solid #000; font-size: 10px;">Date</th>
        </tr>
      </thead>
      <tbody>
        ${paymentRows}
        <tr>
          <td style="width: 10%; border-top: 1px solid #000; border-right: 1px solid #000; font-size: 10px;"></td>
          <td style="width: 45%; border-top: 1px solid #000; border-right: 1px solid #000; font-size: 10px;"></td>
          <td style="width: 25%; border-top: 1px solid #000; border-right: 1px solid #000; font-size: 10px;"></td>
          <td style="width: 20%; border-top: 1px solid #000; border-right: 1px solid #000; font-size: 10px;"></td>
        </tr>
      </tbody>
    </table>
  `;
};

const generateBankAndCompanyDetailsHtml = (data) => {
  return `
    <div style="display: flex; flex-direction: row; justify-content: space-between; margin-top: 10px;">
      <div style="width: 48%; font-size: 10px;">
        <p><strong>Bank Details:</strong> for <span style="font-weight: bold; font-size: 10px;">${safe(data.CompanyName) || safe(data.Name)}</span></p>
        <p> "Bank Name: ${safe(data.Bill_BankName)}, Account Number: ${safe(data.Bill_AccountNumber)}, IFSC Code: ${safe(data.Bill_IFSCCode)}, Branch: ${safe(data.Bill_BranchName)}</p>
        <p><strong>Terms & Condition:</strong></p>
        <p style="margin: 2px 0; font-size: 8px;">1. Interest @24% per annum will be charged on bills not paid within 30 days.</p>
        <p style="margin: 2px 0; font-size: 8px;">2. Please check the GSTIN and inform for any discrepancy within 7 days.</p>
        <p style="margin: 2px 0; font-size: 8px;">3. Goods once sold shall not be taken back.</p>
        <p style="margin: 2px 0; font-size: 8px;">4. No responsibility for Transit Risks.</p>
        <p style="margin: 2px 0; font-size: 8px;">5. Disputes, if any, shall be subject to the Jurisdiction of Kolkata Courts.</p>
        <p style="margin: 2px 0; font-size: 8px;">6. Please pay by cheque "A/C PAYEE" NEFT/RTGS only.</p>
      </div>
      <div style="width: 48%; font-size: 10px; text-align: right;">
        
      </div>
    </div>
    <div style="display: flex; flex-direction: row; justify-content: space-between; margin-top: 10px;">

      <div style="width: 33%; font-size: 12px; text-align: center;">
       <p style="margin: 2px 0;">Checked by: ${safe(data.CheckedByName)}</p>
        <p style="border-bottom: 1px solid #000; margin: 0;"></p>
      </div>
      <div style="width: 33%; font-size: 12px; text-align: center;">
       <p style="margin: 2px 0;">Prepared by: ${safe(data.PreparedByName)}</p>
        <p style="border-bottom: 1px solid #000; margin: 0;"></p>
      </div>
      <div style="width: 33%; font-size: 12px; text-align: center;">
        <p style="margin: 2px 0;">Authorized By: ${safe(data.AuthorizedSignatoryByName)}</p>
        <p style="border-bottom: 1px solid #000; margin: 0;"></p>
      </div>
    </div>
  `;
};

const A4_PAGE_STYLE = `
  <style>
    .a4-page {
      width: 210mm;
      min-height: 297mm;
      max-width: 210mm;
      margin:  auto;
      padding: 0 8mm 10mm 8mm;
      border: 1.5px solid #000;
      box-sizing: border-box;
      background: #fff;
      position: relative;
      background-size: 100% 270mm;
      background-repeat: repeat-y;
    }
    .a4-inner {
      padding-top: 10 !important;
      padding-bottom: 24mm !important;
    }
    .a4-page:not(:first-child) .a4-inner {
      padding-top: 0 !important;
    }
    @media print {
      /* Prevent table rows and key blocks from breaking across pages */
      tr, .item-row, .a4-inner, .amount-summary-margin-top, .manual-top-border {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }
      table {
        page-break-inside: auto;
      }
      thead {
        display: table-header-group;
      }
      tfoot {
        display: table-footer-group;
      }
    }
    body {
      background: #fff !important;
    }
    thead {
      display: table-header-group;
    }
    tfoot {
      display: table-footer-group;
    }
    .amount-summary-margin-top {
      margin-top: 40px !important;
    }
  </style>
`;

const invoicePurCreatepdfback = (data) => {
  console.log("invoicePurCreatepdf data", data);
  const {
    ReceiptNumber,
    ReceiptDate,
    Bill_CompanyName,
    Bill_AddressLine1,
    Bill_AddressLine2,
    Bill_City,
    Bill_State,
    Bill_PinCode,
    Bill_PhoneNumber1,
    Bill_PhoneNumber2,
    Bill_GSTNumber,
    CompanyName,
    Name,
    AddressLine1,
    AddressLine2,
    City,
    State,
    PinCode,
    PhoneNumber1,
    PhoneNumber2,
    GSTNumber,
    ReceiptProductModelList,
    PaymentDetails,
  } = data;

  const parsedModelMappingData =
    typeof ReceiptProductModelList === "string"
      ? JSON.parse(`[${ReceiptProductModelList}]`)
      : ReceiptProductModelList;

  // Flatten if nested array (fix for items not showing)
  const flatModelMappingData =
    Array.isArray(parsedModelMappingData) &&
    Array.isArray(parsedModelMappingData[0])
      ? parsedModelMappingData[0]
      : parsedModelMappingData;

  const parsedPaymentDetails = (() => {
    if (!PaymentDetails) return [];
    if (typeof PaymentDetails === "string") {
      try {
        const arr = JSON.parse(`[${PaymentDetails}]`);
        // If arr is an array and first element is also an array, flatten
        if (Array.isArray(arr) && Array.isArray(arr[0])) return arr[0];
        return arr;
      } catch {
        return [];
      }
    }
    if (Array.isArray(PaymentDetails)) return PaymentDetails;
    return [];
  })();
  // console.log("parsedPaymentDetails", parsedPaymentDetails);

  // Helper to determine margin for Amount Summary section based on page count
  // We'll estimate page count by content length (since we can't know actual rendered pages before PDF generation)
  // For a more robust solution, you may want to split content into multiple .a4-page divs if needed.
  // Here, we use a simple heuristic: if product rows > 15, assume 2+ pages.
  const productRowsCount = Array.isArray(flatModelMappingData)
    ? flatModelMappingData.length
    : 0;
  const isMultiPage = productRowsCount > 15; // adjust threshold as needed
  const amountSummaryMargin = isMultiPage ? "25px" : "0";

  const htmlContent = `
    // ${A4_PAGE_STYLE}
    <div class="a4-page">
      <div class="a4-inner">
        <div style="border-bottom: 1.5px solid #000; width: 100%; margin-bottom: 10px;"></div>
        <!-- Header Section -->
        <div style="font-family: Arial, sans-serif; color: #000;">
          <div style="padding: 10px; border-bottom: 1px solid #000;">
            <div style="text-align: center; margin-bottom: 10px;">
              <p style="margin: 0; font-size: 10px;">Original for Recipient, Duplicate for Transporter, Triplicate for Supplier</p>
              <h1 style="margin: 0; font-size: 22px;">Purchase Order</h1>
              <div style="border-bottom: 1.5px solid #000; width: 100%; margin: 10px 0 0 0;"></div>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <p style="margin: 0; line-height: 1; flex: 1; font-size: 10px;">${safe(CompanyName)}</p>
              <div style="flex: 1; text-align: center; line-height: 1; font-size: 10px;">
                <strong>Purchase Order No.:</strong> ${safe(ReceiptNumber)}
              </div>
              <div style="flex: 1; text-align: right; line-height: 1; font-size: 10px;">
                <strong>Date:</strong> ${ReceiptDate ? new Date(ReceiptDate).toLocaleDateString("en-GB") : ""}
              </div>
            </div>

            <!-- Address Section -->
            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
              <!-- From Address -->
              <div style="flex: 1;">
                <p style="margin: 2px 0; font-size: 10px;"><strong>From:</strong> <strong> ${safe(CompanyName) || safe(Name)}</strong> </p>
                <p style="margin: 2px 0; font-size: 10px;">${safe(AddressLine1)}${safe(AddressLine1) && safe(AddressLine2) ? ", " : ""}${safe(AddressLine2)}</p>
                <p style="margin: 2px 0; font-size: 10px;">${safe(City)}${safe(City) && safe(State) ? ", " : ""}${safe(State)}${(safe(City) || safe(State)) && safe(PinCode) ? ", " : ""}${safe(PinCode)}</p>
                <p style="margin: 2px 0; font-size: 10px;">${safe(PhoneNumber1)}${safe(PhoneNumber1) && safe(PhoneNumber2) ? `, ` : ""}${safe(PhoneNumber2)}</p>
                <p style="margin: 2px 0; font-size: 10px;"><strong>GST No.:</strong> ${safe(GSTNumber)}</p>
              </div>
              <!-- To Address -->
              <div style="flex: 1;">
                <p style="margin: 2px 0; font-size: 10px;"><strong>To:</strong> <strong> ${safe(Bill_CompanyName)}</strong> </p>
                <p style="margin: 2px 0; font-size: 10px;">${safe(Bill_AddressLine1)}${safe(Bill_AddressLine1) && safe(Bill_AddressLine2) ? ", " : ""}${safe(Bill_AddressLine2)}</p>
                <p style="margin: 2px 0; font-size: 10px;">${safe(Bill_City)}${safe(Bill_City) && safe(Bill_State) ? ", " : ""}${safe(Bill_State)}${(safe(Bill_City) || safe(Bill_State)) && safe(Bill_PinCode) ? ", " : ""}${safe(Bill_PinCode)}</p>
                <p style="margin: 2px 0; font-size: 10px;">${safe(Bill_PhoneNumber1)}${safe(Bill_PhoneNumber1) && safe(Bill_PhoneNumber2) ? `, ` : ""}${safe(Bill_PhoneNumber2)}</p>
                <p style="margin: 2px 0; font-size: 10px;"><strong>GST No.:</strong> ${safe(Bill_GSTNumber)}</p>
              </div>
            </div>
          </div>

          <!-- Product Details Section -->
<div style="break-inside: avoid; page-break-inside: avoid; -webkit-column-break-inside: avoid;">
            <p style="font-size: 12px; margin-top: 10px;"><strong>Product Details:</strong></p>
            ${generateTableHtml(flatModelMappingData)}
          </div>

          <!-- Payment Details Section -->
          <div>
            <p style="font-size: 12px;"><strong>Payment Details:</strong></p>
            ${generatePaymentTableHtml(parsedPaymentDetails)}
          </div>

          <!-- Amount Summary Section -->
          <div class="${isMultiPage ? "amount-summary-margin-top" : ""}" style="margin-top: ${amountSummaryMargin};">
                <p style="margin: 2px 0; text-align: right; font-size: 10px;">Round Off: ${formatNumber(safe(data.RoundOffAmount))}</p>
                <p style="margin: 2px 0; text-align: right; font-size: 10px;">Paid Amount: ${formatNumber(safe(data.NetPaidAmount))}</p>
                <p style="margin: 2px 0; text-align: right; font-size: 10px;">Due amount: ${formatNumber(safe(data.NetDueAmount))}</p>
                <p style="margin: 2px 0; text-align: right; font-size: 10px;"> <strong>Grand Total: ${Number(safe(data.GrandTotalAmount)) + Number(safe(data.RoundOffAmount))}</strong> </p>
          </div>

          <!-- Footer Section -->
          <div>
            <p style="font-size: 10px;"> <strong>Remarks:</strong> ${safe(data.Remarks)} </p>
            ${generateBankAndCompanyDetailsHtml(data)}
          </div>
        </div>
      </div>
    </div>
  `;

  html2pdf()
    .from(htmlContent)
    .set({
      margin: 0,
      filename: `invoice-${safe(ReceiptNumber)}.pdf`,
      html2canvas: {
        scale: 2,
        letterRendering: true,
        useCORS: true,
        logging: false,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
        compress: true,
      },
    })
    .outputPdf("blob")
    .then((pdfBlob) => {
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const printWindow = window.open(pdfUrl);
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    });
};

export default invoicePurCreatepdf;
