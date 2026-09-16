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

// Function to generate the PDF
const generateTableHtml = (items) => {
  const safeValue = (value) =>
    value === null || value === undefined ? "" : value;

  const tableRows = items
    .map((item, index) => {
      const productModelText = safeValue(item.ProductModelName) || "-";
      return `
              <tr>
                <td style="padding: 4px; border-left: 1px solid #000; border-right: 1px solid #000; text-align: center; font-size: 11px;">${index + 1}</td>
                <td style="padding: 4px; border-left: 1px solid #000; border-right: 1px solid #000; font-size: 11px;">${productModelText}</td>
                <td style="padding: 4px; border-left: 1px solid #000; border-right: 1px solid #000; text-align: center; font-size: 11px;">${safeValue(item.Quantity)} ${item.UnitQuantity}</td>
                <td style="padding: 4px; border-left: 1px solid #000; border-right: 1px solid #000; text-align: center; font-size: 11px;">${safeValue(item.QtyPerBox ? item.QtyPerBox : "-")}</td>
                <td style="padding: 4px; border-left: 1px solid #000; border-right: 1px solid #000; text-align: right; font-size: 11px;">₹${safeValue(item.Rate)}</td>
                <td style="padding: 4px; border-left: 1px solid #000; border-right: 1px solid #000; text-align: center; font-size: 11px;">${safeValue(item.DISP)}%</td>
                <td style="padding: 4px; border-left: 1px solid #000; border-right: 1px solid #000; text-align: right; font-size: 11px;">₹${safeValue(item.Amount)}</td>
              </tr>
            `;
    })
    .join("");

  return `
          <table style="width: 100%; border-collapse: collapse; margin: 15px 0; background: #fff;">
            <thead>
              <tr style="background: #fff;">
                <th style="width: 5%; padding: 4px; border: 1px solid #000; font-size: 11px; font-weight: 600;">No.</th>
                <th style="width: 45%; padding: 4px; border: 1px solid #000; text-align: left; font-size: 11px; font-weight: 600;">Product Model</th>
                <th style="width: 12%; padding: 4px; border: 1px solid #000; text-align: center; font-size: 11px; font-weight: 600;">Qty</th>
                <th style="width: 10%; padding: 4px; border: 1px solid #000; text-align: center; font-size: 11px; font-weight: 600;">Box Qty</th>
                <th style="width: 12%; padding: 4px; border: 1px solid #000; text-align: right; font-size: 11px; font-weight: 600;">Price</th>
                <th style="width: 8%; padding: 4px; border: 1px solid #000; text-align: center; font-size: 11px; font-weight: 600;">Disc%</th>
                <th style="width: 12%; padding: 4px; border: 1px solid #000; text-align: right, font-size: 11px; font-weight: 600;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
              <tr>
                <td colspan="7" style="border-top: 1px solid #000;"></td>
              </tr>
            </tbody>
          </table>
        `;
};

const generatePaymentTableHtml = (payments) => {
  if (!payments || payments.length === 0) {
    return `
      <div style="font-size: 10px; padding: 5px; text-align: center;">
        No payments
      </div>
    `;
  }

  const paymentRows = payments
    ?.map((payment, index) => {
      return `
        <tr>
           <td style="width: 10%; border-left: 1px solid #000; text-align: center; word-wrap: break-word; font-size: 10px;">${index + 1}</td>
          <td style="width: 45%; border-left: 1px solid #000; word-wrap: break-word; white-space: pre-wrap; font-size: 10px; text-align: center;">${payment.PaymentModeName}</td>
          <td style="width: 25%; border-left: 1px solid #000; text-align: center; word-wrap: break-word; font-size: 10px;">${payment.Amount}</td>
          <td style="width: 20%; border-left: 1px solid #000; border-right: 1px solid #000; text-align: center; word-wrap: break-word; font-size: 10px;">${new Date(payment.PaymentDate).toLocaleDateString("en-GB")}</td>
        </tr>
      `;
    })
    .join("");

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
        ${paymentRows}
        <tr>
          <td style="width: 10%; border-top: 1px solid #000; font-size: 10px;"></td>
          <td style="width: 45%; border-top: 1px solid #000; font-size: 10px;"></td>
          <td style="width: 25%; border-top: 1px solid #000; font-size: 10px;"></td>
          <td style="width: 20%; border-top: 1px solid #000; border-right: 1px solid #000; font-size: 10px;"></td>
        </tr>
      </tbody>
    </table>
  `;
};

// const generateSummaryTableHtml = (data) => {
//   return `
//     <table style="width: 100%; border-collapse: collapse; font-size: 10px; table-layout: fixed;">
//       <thead>
//         <tr>
//           <th style="width: 16.67%; border: 1px solid #000; text-align: center; font-size: 10px;">T. Amt Bef Disc.</th>
//           <th style="width: 16.67%; border: 1px solid #000; text-align: center; font-size: 10px;">T. Amt Aft Disc.</th>
//           <th style="width: 16.67%; border: 1px solid #000; text-align: center; font-size: 10px;">SGST + CGST</th>
//           <th style="width: 16.67%; border: 1px solid #000; text-align: center; font-size: 10px;">Grand T. Amt.</th>
//           <th style="width: 16.67%; border: 1px solid #000; text-align: center; font-size: 10px;">Paid Amt</th>
//           <th style="width: 16.67%; border: 1px solid #000; text-align: center; font-size: 10px;">Due Amt</th>
//         </tr>
//       </thead>
//       <tbody>
//         <tr>
//           <td style="width: 16.67%; border-left: 1px solid #000; text-align: center; font-size: 10px;">${data.TotalAmountBD}</td>
//           <td style="width: 16.67%; border-left: 1px solid #000; text-align: center; font-size: 10px;">${data.TotalAmountAD}</td>
//           <td style="width: 16.67%; border-left: 1px solid #000; text-align: center; font-size: 10px;">${data.SGSTAmount} + ${data.CGSTAmount}</td>
//           <td style="width: 16.67%; border-left: 1px solid #000; text-align: center; font-size: 10px;">${data.GrandTotalAmount}</td>
//           <td style="width: 16.67%; border-left: 1px solid #000; text-align: center; font-size: 10px;">${data.NetPaidAmount}</td>
//           <td style="width: 16.67%; border-left: 1px solid #000; border-right: 1px solid #000; text-align: center; font-size: 10px;">${data.NetDueAmount}</td>
//         </tr>
//         <tr>
//           <td style="width: 16.67%; border-top: 1px solid #000; font-size: 10px;"></td>
//           <td style="width: 16.67%; border-top: 1px solid #000; font-size: 10px;"></td>
//           <td style="width: 16.67%; border-top: 1px solid #000; font-size: 10px;"></td>
//           <td style="width: 16.67%; border-top: 1px solid #000; font-size: 10px;"></td>
//           <td style="width: 16.67%; border-top: 1px solid #000; font-size: 10px;"></td>
//           <td style="width: 16.67%; border-top: 1px solid #000; border-right: 1px solid #000; font-size: 10px;"></td>
//         </tr>
//         <tr style="width: 700px; display: flex; justify-content: space-between;">
//           <td style="width: 400px; border-top: 1px solid #000; text-align: left; padding: 5px; font-size: 10px;">
//             <strong>Remarks:</strong> ${data.Remarks || ""}
//           </td>
//           <td style="width: 300px; border-top: 1px solid #000; text-align: right, padding: 5px; font-size: 10px;">
//             <strong>Due Date:</strong> ${data.PDueDueDate || ""}
//           </td>
//         </tr>
//         <tr>
//           <td colspan="6" style="border-top: 1px solid #000; text-align: left; padding: 5px; font-size: 10px;">
//             <strong>Amount:</strong> ${numberToWordsInIndian(data.GrandTotalAmount)}
//           </td>
//         </tr>
//       </tbody>
//     </table>
//   `;
// };

const generateBankAndCompanyDetailsHtml = (data) => {
  return `
    <div style="display: flex; flex-direction: row; justify-content: space-between; margin-top: 10px;">
      <div style="width: 48%; font-size: 10px;">
        <p><strong>Bank Details:</strong></p>
        <p> "Bank Name: ${data.Bill_BankName}, Account Number: ${data.Bill_AccountNumber}, IFSC Code: ${data.Bill_IFSCCode}, Branch: ${data.Bill_BranchName}</p>
        <p><strong>Terms & Condition:</strong></p>
        <p style="margin: 2px 0; font-size: 8px;">1. Interest @24% per annum will be charged on bills not paid within 30 days.</p>
        <p style="margin: 2px 0; font-size: 8px;">2. Please check the GSTIN and inform for any discrepancy within 7 days.</p>
        <p style="margin: 2px 0; font-size: 8px;">3. Goods once sold shall not be taken back.</p>
        <p style="margin: 2px 0; font-size: 8px;">4. No responsibility for Transit Risks.</p>
        <p style="margin: 2px 0; font-size: 8px;">5. Disputes, if any, shall be subject to the Jurisdiction of Kolkata Courts.</p>
        <p style="margin: 2px 0; font-size: 8px;">6. Please pay by cheque "A/C PAYEE" NEFT/RTGS only.</p>
      </div>
   
    </div>
    <div style="display: flex; flex-direction: row; justify-content: space-between; margin-top: 10px;">

      <div style="width: 33%; font-size: 12px; text-align: center;">
       <p style="margin: 2px 0;">Checked by: ${data.CheckedByName}</p>
        <p style="border-bottom: 1px solid #000; margin: 0;"></p>
      </div>
      <div style="width: 33%; font-size: 12px; text-align: center;">
       <p style="margin: 2px 0;">Prepared by: ${data.PreparedByName}</p>
        <p style="border-bottom: 1px solid #000; margin: 0;"></p>
      </div>
      <div style="width: 33%; font-size: 12px; text-align: center;">
        <p style="margin: 2px 0;">Authorized By: ${data.AuthorizedSignatoryByName}</p>
        <p style="border-bottom: 1px solid #000; margin: 0;"></p>
      </div>
    </div>
  `;
};

const invoiceSaleCreatepdfBackup = (data) => {
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

  // Helper function to handle null or undefined values
  const safeValue = (value) =>
    value === null || value === undefined ? "" : value;

  // Fix parsing logic for ReceiptProductModelList
  const parsedModelMappingData = Array.isArray(ReceiptProductModelList)
    ? ReceiptProductModelList
    : typeof ReceiptProductModelList === "string"
      ? JSON.parse(ReceiptProductModelList)
      : [];

  // Fix parsing logic for PaymentDetails
  const parsedPaymentDetails = Array.isArray(PaymentDetails)
    ? PaymentDetails
    : typeof PaymentDetails === "string"
      ? JSON.parse(PaymentDetails)
      : [];

  const htmlContent = `
       <div style="font-family: Arial, sans-serif; color: #000; padding: 5px; border: 1px solid #000; height: 100%; box-sizing: border-box; font-size: 10px;">
      <div style="text-align: center; margin-bottom: 10px;">
        <p style="margin: 0; font-size: 10px;">Original for Recipient, Duplicate for Transporter, Triplicate for Supplier</p>
        <h1 style="margin: 0; font-size: 22px;">Tax Invoice</h1>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <p style="margin: 0; line-height: 1; flex: 1; font-size: 10px;"><strong> ${safeValue(Bill_CompanyName)}</strong></p>
        <div style="flex: 1; text-align: center; line-height: 1; font-size: 10px;">
          <strong>Invoice No.:</strong> ${safeValue(ReceiptNumber)}
        </div>
        <div style="flex: 1; text-align: right; line-height: 1; font-size: 10px;">
          <strong>Date:</strong> ${safeValue(new Date(ReceiptDate).toLocaleDateString("en-GB"))}
        </div>
      </div>

      <hr>
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <div>
          <p style="margin: 2px 0; font-size: 10px;"><strong>From:</strong> <strong>${safeValue(Bill_CompanyName)}</strong></p>
          <p style="margin: 2px 0; font-size: 10px;">${[safeValue(Bill_AddressLine1), safeValue(Bill_AddressLine2)].filter(Boolean).join(", ")}</p>
          <p style="margin: 2px 0; font-size: 10px;">${[safeValue(Bill_City), safeValue(Bill_State), safeValue(Bill_PinCode)].filter(Boolean).join(", ")}</p>
          <p style="margin: 2px 0; font-size: 10px;">${[safeValue(Bill_PhoneNumber1), safeValue(Bill_PhoneNumber2)].filter(Boolean).join(", ")}</p>
          <p style="margin: 2px 0; font-size: 10px;"><strong>GST No.:</strong> ${safeValue(Bill_GSTNumber)}</p>
        </div>
        <div>
          <p style="margin: 2px 0; font-size: 10px;"><strong>To:</strong> <strong>${safeValue(CompanyName || Name)}</strong></p>
          <p style="margin: 2px 0; font-size: 10px;">${[safeValue(AddressLine1), safeValue(AddressLine2)].filter(Boolean).join(", ")}</p>
          <p style="margin: 2px 0; font-size: 10px;">${[safeValue(City), safeValue(State), safeValue(PinCode)].filter(Boolean).join(", ")}</p>
          <p style="margin: 2px 0; font-size: 10px;">${[safeValue(PhoneNumber1), safeValue(PhoneNumber2)].filter(Boolean).join(", ")}</p>
          <p style="margin: 2px 0; font-size: 10px;"><strong>GST No.:</strong> ${safeValue(GSTNumber)}</p>
        </div>
      </div>
    <hr>
      <div>
        <p style="font-size: 12px;"><strong>Product Details:</strong></p>
        ${generateTableHtml(parsedModelMappingData)}
      </div>
      <div>
        <p style="font-size: 12px;"><strong>Payment Details:</strong></p>
        ${parsedPaymentDetails ? generatePaymentTableHtml(parsedPaymentDetails) : "None"}
      </div>
            <p style="margin: 2px 0; text-align: right; font-size: 10px;">Amount: ${safeValue(data.TotalAmountBD)}</p>
            <p style="margin: 2px 0; text-align: right; font-size: 10px;">Discount (${formatNumber(safeValue(data.Discount))}%): ${formatNumber(safeValue(data.DiscountAmount))}</p>
            <!-- <p style="margin: 2px 0; text-align: right; font-size: 10px;">Total Taxable Amount: ${data.TotalAmountAD}</p>
            <p style="margin: 2px 0; text-align: right; font-size: 10px;">CGST @${data.CGSTP}% on Taxable Amount: ${data.CGSTAmount}</p>
            <p style="margin: 2px 0; text-align: right; font-size: 10px;">SGST @${data.SGSTP}% on Taxable Amount: ${data.SGSTAmount}</p> -->
            <p style="margin: 2px 0; text-align: right; font-size: 10px;">Total GST @${formatNumber(Number(safeValue(data.CGSTP)) + Number(safeValue(data.SGSTP)))} : ${formatNumber(Number(safeValue(data.SGSTAmount)) + Number(safeValue(data.CGSTAmount)))}</p>
            <p style="margin: 2px 0; text-align: right; font-size: 10px;">Round Off: ${formatNumber(safeValue(data.RoundOffAmount))}</p>
            <p style="margin: 2px 0; text-align: right; font-size: 10px;">Paid Amount: ${formatNumber(safeValue(data.NetPaidAmount))}</p>
            <p style="margin: 2px 0; text-align: right; font-size: 10px;">Due amount: ${formatNumber(safeValue(data.NetDueAmount))}</p>
            <p style="margin: 2px 0; text-align: right; font-size: 10px;"> <strong>Grand Total: ${formatNumber(Number(safeValue(data.GrandTotalAmount)))}</strong> </p>
          <hr>

                 <p style="font-size: 10px;"> <strong>Remarks:</strong> ${safeValue(data.Remarks)} </p>

      ${generateBankAndCompanyDetailsHtml(data)}
    </div>
  `;

  html2pdf()
    .from(htmlContent)
    .set({ margin: 10 })
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

export default invoiceSaleCreatepdfBackup;
