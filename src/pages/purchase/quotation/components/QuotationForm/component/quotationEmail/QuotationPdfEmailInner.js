import html2pdf from "html2pdf.js";
import React from "react";
import axios from "axios";
import Cookies from "js-cookie"; // Add this import for Cookies
import DialogMessage from "./DialogMessage";

// Helper to display (--) for missing/empty/null values
const displayValue = (val) => {
  if (val === undefined || val === null) return "(--)";
  if (typeof val === "string" && val.trim() === "") return "(--)";
  if (typeof val === "number" && isNaN(val)) return "(--)";
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
  const thousands = ["Hundred", "Thousand", "Lakh", "Crore"];

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
  return num === 0 ? "0.00" : num.toFixed(2).replace(/\.?0+$/, "");
};

const generateTableHtml = (items) => {
  const tableRows = items
    ?.map((item, index) => {
      const productModelText = displayValue(item.ProductModelName);
      return `
        <tr class="item-row">
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center; font-size: 11px;">${index + 1}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-size: 11px;">${productModelText}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center; font-size: 11px;">${displayValue(item.Quantity)} ${displayValue(item.UnitQuantity)}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center; font-size: 11px;">${item.QtyPerBox ? item.QtyPerBox : "(--)"} </td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-size: 11px;">₹${displayValue(item.Price)}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-size: 11px;">₹${displayValue(item.Amount)}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <table style="width: 100%; border-collapse: collapse; margin: 15px 0; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <thead>
        <tr style="background: #f8f9fa;">
          <th style="width: 5%; padding: 12px 8px; border-bottom: 2px solid #dee2e6; font-size: 11px; font-weight: 600; color: #495057;">No.</th>
          <th style="width: 45%; padding: 12px 8px; border-bottom: 2px solid #dee2e6; text-align: left; font-size: 11px; font-weight: 600; color: #495057;">Product Model</th>
          <th style="width: 12%; padding: 12px 8px; border-bottom: 2px solid #dee2e6; text-align: center; font-size: 11px; font-weight: 600; color: #495057;">Qty</th>
          <th style="width: 10%; padding: 12px 8px; border-bottom: 2px solid #dee2e6; text-align: center; font-size: 11px; font-weight: 600; color: #495057;">Box Qty</th>
          <th style="width: 12%; padding: 12px 8px; border-bottom: 2px solid #dee2e6; text-align: right; font-size: 11px; font-weight: 600; color: #495057;">Price</th>
          <th style="width: 12%; padding: 12px 8px; border-bottom: 2px solid #dee2e6; text-align: right; font-size: 11px; font-weight: 600; color: #495057;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  `;
};

const generateBankAndCompanyDetailsHtml = (data) => {
  return `
    <div style="display: flex; flex-direction: row; justify-content: space-between; margin-top: 10px;">
      <div style="width: 48%; font-size: 10px;">
        <p><strong>Bank Details:</strong></p>
        <p>Bank Name: ${displayValue(data.Bill_BankName)}, Account Number: ${displayValue(data.Bill_AccountNumber)}, IFSC Code: ${displayValue(data.Bill_IFSCCode)}, Branch: ${displayValue(data.Bill_BranchName)}</p>
        <p><strong>Terms & Condition:</strong></p>
        <p style="margin: 2px 0; font-size: 8px;">1. Interest @24% per annum will be charged on bills not paid within 30 days.</p>
        <p style="margin: 2px 0; font-size: 8px;">2. Please check the GSTIN and inform for any discrepancy within 7 days.</p>
        <p style="margin: 2px 0; font-size: 8px;">3. Goods once sold shall not be taken back.</p>
        <p style="margin: 2px 0; font-size: 8px;">4. No responsibility for Transit Risks.</p>
        <p style="margin: 2px 0; font-size: 8px;">5. Disputes, if any, shall be subject to the Jurisdiction of Kolkata Courts.</p>
        <p style="margin: 2px 0; font-size: 8px;">6. Please pay by cheque "A/C PAYEE" NEFT/RTGS only.</p>
      </div>
      <div style="width: 48%; font-size: 10px; text-align: right;">
        <p>for <span style="font-weight: bold; font-size: 10px;">${displayValue(data.CompanyName)}</span></p>
      </div>
    </div>
    <!--
    <div style="display: flex; flex-direction: row; justify-content: space-between; margin-top: 10px;">
      <div style="width: 33%; font-size: 12px; text-align: center;">
        <p style="margin: 2px 0;">Checked by: ${displayValue(data.CheckedByName)}</p>
        <p style="border-bottom: 1px solid #000; margin: 0;"></p>
      </div>
      <div style="width: 33%; font-size: 12px; text-align: center;">
        <p style="margin: 2px 0;">Prepared by: ${displayValue(data.PreparedByName)}</p>
        <p style="border-bottom: 1px solid #000; margin: 0;"></p>
      </div>
    </div>
    -->
    <div style="width: 33%; font-size: 12px; text-align: center;">
      <p style="margin: 2px 0;">Authorized By: ${displayValue(data.AuthorizedSignatoryByName)}</p>
      <p style="border-bottom: 1px solid #000; margin: 0;"></p>
    </div>
  `;
};

const quotationPdfEmailInner = (data, emailFormData, emailMszFn) => {
  console.log("data", data);
  console.log("emailFormData", emailFormData);
  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`; // Add token logic here

  const {
    QuotationNo,
    QuotationDate,
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
    AddressLine1,
    AddressLine2,
    City,
    State,
    PinCode,
    PhoneNumber1,
    PhoneNumber2,
    GSTNumber,
    ModelMappingData,
    TotalAmountBD,
    Discount,
    DiscountAmount,
    TotalAmountAD,
    CGSTP,
    CGSTAmount,
    SGSTP,
    SGSTAmount,
    GrandTotalAmount,
    RoundOffAmount,
    NetTotalAmount,
    AuthorizedSignatoryByName,
    CheckedByName,
    PreparedByName,
    Bill_BankName,
    Bill_AccountNumber,
    Bill_IFSCCode,
    Bill_BranchName,
  } = data;

  const parsedModelMappingData =
    typeof ModelMappingData === "string"
      ? JSON.parse(ModelMappingData)
      : ModelMappingData;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #000; padding: 5px; border: 1px solid #000; height: 100%; box-sizing: border-box; font-size: 10px;">
      <div style="text-align: center; margin-bottom: 10px;">
        <p style="margin: 0; font-size: 10px;">Original for Recipient, Duplicate for Transporter, Triplicate for Supplier</p>
        <h1 style="margin: 0; font-size: 22px;">Quotation</h1>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <p style="margin: 0; line-height: 1; flex: 1; font-size: 10px;">${displayValue(CompanyName)}</p>
        <div style="flex: 1; text-align: center; line-height: 1; font-size: 10px;">
          <strong>Quotation No.:</strong> ${displayValue(QuotationNo)}
        </div>
        <div style="flex: 1; text-align: right; line-height: 1; font-size: 10px;">
          <strong>Date:</strong> ${QuotationDate ? new Date(QuotationDate).toLocaleDateString("en-GB") : "(--)"}
        </div>
      </div>
      <hr>
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
      <div>
      <p style="margin: 2px 0; font-size: 10px;"><strong>Form:</strong> ${displayValue(Bill_CompanyName)}</p>
      <p style="margin: 2px 0; font-size: 10px;">${displayValue(Bill_AddressLine1)}, ${displayValue(Bill_AddressLine2)}</p>
      <p style="margin: 2px 0; font-size: 10px;">${displayValue(Bill_City)}, ${displayValue(Bill_State)}, ${displayValue(Bill_PinCode)}</p>
      <p style="margin: 2px 0; font-size: 10px;">${displayValue(Bill_PhoneNumber1)}${Bill_PhoneNumber2 ? `, ${displayValue(Bill_PhoneNumber2)}` : ""}</p>
      <p style="margin: 2px 0; font-size: 10px;"><strong>GST No.:</strong> ${displayValue(Bill_GSTNumber)}</p>
      </div>
      <div>
        <p style="margin: 2px 0; font-size: 10px;"><strong>To:</strong> ${displayValue(CompanyName)}</p>
        <p style="margin: 2px 0; font-size: 10px;">${displayValue(AddressLine1)}, ${displayValue(AddressLine2)}</p>
        <p style="margin: 2px 0; font-size: 10px;">${displayValue(City)}, ${displayValue(State)}, ${displayValue(PinCode)}</p>
        <p style="margin: 2px 0; font-size: 10px;">${displayValue(PhoneNumber1)}${PhoneNumber2 ? `, ${displayValue(PhoneNumber2)}` : ""}</p>
        <p style="margin: 2px 0; font-size: 10px;"><strong>GST No.:</strong> ${displayValue(GSTNumber)}</p>
      </div>
      </div>
      <hr>
      <div>
        <p style="font-size: 12px;"><strong>Product Details:</strong></p>
        ${generateTableHtml(parsedModelMappingData)}
      </div>
      <div style="text-align: right; font-size: 10px;">
        <p>Sub Total: ₹${displayValue(formatNumber(TotalAmountBD))}</p>
        <p>Discount (${displayValue(formatNumber(Discount))}%): ₹${displayValue(formatNumber(DiscountAmount))}</p>
        <p>Taxable Amount: ₹${displayValue(formatNumber(TotalAmountAD))}</p>
        <p>CGST (${displayValue(formatNumber(CGSTP))}%): ₹${displayValue(formatNumber(CGSTAmount))}</p>
        <p>SGST (${displayValue(formatNumber(SGSTP))}%): ₹${displayValue(formatNumber(SGSTAmount))}</p>
        <p>Round Off: ₹${displayValue(formatNumber(RoundOffAmount))}</p>
        <p><strong>Grand Total: ₹${displayValue(formatNumber(GrandTotalAmount))}</strong></p>
      </div>
      ${generateBankAndCompanyDetailsHtml(data)}
    </div>
  `;

  html2pdf()
    .from(htmlContent)
    .set({ margin: 10 })
    .outputPdf("blob")
    .then((pdfBlob) => {
      // Create a FormData object to attach the PDF
      const formData = new FormData();
      formData.append("file", pdfBlob, "quotation.pdf"); // Correctly append the file field
      formData.append("to", emailFormData.to); // Use the emailFormData to fieldqq
      emailFormData.cc && formData.append("cc", emailFormData.cc); // Use the emailFormData cc field
      formData.append("subject", emailFormData.subject); // Use the emailFormData subject field
      formData.append("body", emailFormData.body); // Use the emailFormData body field
      formData.append("bill_code", "QUO"); // Add bill_code field
      // formData.append("bill_number", emailFormData.bill_number); // Add bill_number field
      formData.append("bill_number", data.QuotationBookingMasterID); // Add bill_number field

      formData.append("entity_type", "SUPP"); // Add entity_type field
      formData.append("entity_tid", data.EntityID); // Add entity_tid field

      // Make a POST request to upload the PDF using axios
      axios
        .post(
          `${process.env.REACT_APP_URL}/api/send-email-with-attachment`,
          formData,
          {
            headers: {
              Authorization: sanctumToken, // Use the constructed sanctumToken
              "Content-Type": "multipart/form-data", // Ensure the correct content type
            },
          }
        )
        .then((response) => {
          console.log("PDF sent successfully:", response.data); // Debug log
          emailMszFn(true); // Ensure this is called with `true`
        })
        .catch((error) => {
          console.error("Error sending PDF:", error); // Debug log
          emailMszFn(false); // Call with `false` in case of error
        });
    });
};

export default quotationPdfEmailInner;
