import html2pdf from "html2pdf.js";
import React from "react";
import axios from "axios";
import Cookies from "js-cookie";

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

const formatValue = (value) => {
  return value ?? " ";
};

const generateTableHtml = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return `
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <thead>
          <tr>
            <th>No.</th>
            <th>Product Model</th>
            <th>Qty</th>
            <th>Box Qty</th>
            <th>Price</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="6" style="text-align:center;">No items</td>
          </tr>
        </tbody>
      </table>
    `;
  }

  const tableRows = items
    .map((item, index) => {
      const productModelText = `${formatValue(item.ProductModelName)}`;
      return `
        <tr class="item-row">
          <td style="width: 5%; border-left: 1px solid #000; text-align: center; word-wrap: break-word; font-size: 11px;">${index + 1}</td>
          <td style="width: 45%; border-left: 1px solid #000; word-wrap: break-word; white-space: pre-wrap; font-size: 11px;">${productModelText}</td>
          <td style="width: 12%; border-left: 1px solid #000; text-align: center; word-wrap: break-word; font-size: 11px;">${formatValue(item.Quantity)}</td>
          <td style="width: 10%; border-left: 1px solid #000; text-align: center; word-wrap: break-word; font-size: 11px;">${item.QtyPerBox ? formatValue(item.QtyPerBox) : "-"}</td>
          <td style="width: 12%; border-left: 1px solid #000; text-align: right; word-wrap: break-word; font-size: 11px;">₹${formatValue(item.Price)}</td>
          <td style="width: 12%; border-left: 1px solid #000; border-right: 1px solid #000; text-align: right; word-wrap: break-word; font-size: 11px;">₹${formatValue(item.Amount)}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <table style="width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 10px; table-layout: fixed;">
      <thead>
        <tr>
          <th style="width: 5%; border: 1px solid #000; font-size: 11px;">No.</th>
          <th style="width: 45%; border: 1px solid #000; text-align: left; font-size: 11px;">Product Model</th>
          <th style="width: 12%; border: 1px solid #000; text-align: center; font-size: 11px;">Qty</th>
          <th style="width: 10%; border: 1px solid #000; text-align: center; font-size: 11px;">Box Qty</th>
          <th style="width: 12%; border: 1px solid #000; text-align: right; font-size: 11px;">Price</th>
          <th style="width: 12%; border: 1px solid #000; text-align: right; font-size: 11px;">Amount</th>
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
          <td style="border-top: 1px solid #000; border-right: 1px solid #000;"></td>
        </tr>
      </tbody>
    </table>
  `;
};

const generateBankAndCompanyDetailsHtml = (data) => {
  return `
    <div style="display: flex; flex-direction: row; justify-content: space-between; margin-top: 10px;">
      <div style="width: 48%; font-size: 10px;">
        <p><strong>Bank Details:</strong></p>
        <p>Bank Name: ${formatValue(data.Bill_BankName)}, Account Number: ${formatValue(data.Bill_AccountNumber)}, IFSC Code: ${formatValue(data.Bill_IFSCCode)}, Branch: ${formatValue(data.Bill_BranchName)}</p>
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
    <div style="display: flex; flex-direction: row; justify-content: flex-end; margin-top: 10px;">
      <div style="width: 33%; font-size: 12px; text-align: right;">
        <p style="margin: 2px 0;">Authorized By: ${formatValue(data.AuthorizedSignatoryByName)}</p>
        <p style="border-bottom: 1px solid #000; margin: 0;"></p>
      </div>
    </div>
  `;
};

const quotationPdfEmailDirect = (data, emailFormData, emailMszFn) => {
  console.log("data", data);
  console.log("emailFormData", emailFormData);
  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;
  if (!data) return;

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
    Name,
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
        <h1 style="margin: 0; font-size: 22px;">Advance Order</h1>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <p style="margin: 0; line-height: 1; flex: 1; font-size: 10px;">${formatValue(Bill_CompanyName)}</p>
        <div style="flex: 1; text-align: center; line-height: 1; font-size: 10px;">
          <strong>Order No.:</strong> ${formatValue(QuotationNo)}
        </div>
        <div style="flex: 1; text-align: right; line-height: 1; font-size: 10px;">
          <strong>Date:</strong> ${QuotationDate ? new Date(QuotationDate).toLocaleDateString("en-GB") : " "}
        </div>
      </div>
      <hr>
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
      <div>
        ${Bill_CompanyName ? `<p style="margin: 2px 0; font-size: 10px;"><strong>From:</strong> ${formatValue(Bill_CompanyName)}</p>` : ""}
        ${
          Bill_AddressLine1 || Bill_AddressLine2
            ? `<p style="margin: 2px 0; font-size: 10px;">${[
                Bill_AddressLine1,
                Bill_AddressLine2,
              ]
                .filter(Boolean)
                .map((val) => formatValue(val))
                .join(" ")}</p>`
            : ""
        }
        ${
          Bill_City || Bill_State || Bill_PinCode
            ? `<p style="margin: 2px 0; font-size: 10px;">${[
                Bill_City,
                Bill_State,
                Bill_PinCode,
              ]
                .filter(Boolean)
                .map((val) => formatValue(val))
                .join(", ")}</p>`
            : ""
        }
        ${Bill_PhoneNumber1 ? `<p style="margin: 2px 0; font-size: 10px;">${formatValue(Bill_PhoneNumber1)}${Bill_PhoneNumber2 ? `, ${formatValue(Bill_PhoneNumber2)}` : ""}</p>` : ""}
        ${Bill_GSTNumber ? `<p style="margin: 2px 0; font-size: 10px;"><strong>GST No.:</strong> ${formatValue(Bill_GSTNumber)}</p>` : ""}
      </div>
      <div>
        ${Name ? `<p style="margin: 2px 0; font-size: 10px;"><strong>To:</strong> ${formatValue(Name)}</p>` : ""}
        ${CompanyName ? `<p style="margin: 2px 0; font-size: 10px;">${formatValue(CompanyName)}</p>` : ""}
        ${
          AddressLine1 || AddressLine2
            ? `<p style="margin: 2px 0; font-size: 10px;">${[
                AddressLine1,
                AddressLine2,
              ]
                .filter(Boolean)
                .map((val) => formatValue(val))
                .join(", ")}</p>`
            : ""
        }
        ${
          City || State || PinCode
            ? `<p style="margin: 2px 0; font-size: 10px;">${[
                City,
                State,
                PinCode,
              ]
                .filter(Boolean)
                .map((val) => formatValue(val))
                .join(", ")}</p>`
            : ""
        }
        ${PhoneNumber1 ? `<p style="margin: 2px 0; font-size: 10px;">${formatValue(PhoneNumber1)}${PhoneNumber2 ? `, ${formatValue(PhoneNumber2)}` : ""}</p>` : ""}
        ${GSTNumber ? `<p style="margin: 2px 0; font-size: 10px;"><strong>GST No.:</strong> ${formatValue(GSTNumber)}</p>` : ""}
      </div>
      </div>
      <hr>
      <div>
        <p style="font-size: 12px;"><strong>Product Details:</strong></p>
        ${generateTableHtml(parsedModelMappingData)}
      </div>
      <div style="text-align: right; font-size: 10px;">
        ${TotalAmountBD ? `<p>Sub Total: ₹${formatNumber(TotalAmountBD)}</p>` : ""}
        ${Discount && DiscountAmount ? `<p>Discount (${formatNumber(Discount)}%): ₹${formatNumber(DiscountAmount)}</p>` : ""}
        ${TotalAmountAD ? `<p>Taxable Amount: ₹${formatNumber(TotalAmountAD)}</p>` : ""}
        ${CGSTP || SGSTP ? `<p>GST (${CGSTP ? `CGST: ${formatNumber(CGSTP)}%` : ""}${CGSTP && SGSTP ? " + " : ""}${SGSTP ? `SGST: ${formatNumber(SGSTP)}%` : ""}): ₹${formatNumber(parseFloat(CGSTAmount || 0) + parseFloat(SGSTAmount || 0))}</p>` : ""}
        ${GrandTotalAmount ? `<p><strong>Grand Total: ₹${formatNumber(GrandTotalAmount)}</strong></p>` : ""}
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
      formData.append("file", pdfBlob, "quotation.pdf");
      formData.append("to", emailFormData.to);
      emailFormData.cc && formData.append("cc", emailFormData.cc);
      formData.append("subject", emailFormData.subject);
      formData.append("body", emailFormData.body);
      formData.append("bill_number", emailFormData.bill_number);
      formData.append("entity_type", "SUPP");
      formData.append("entity_tid", data.EntityID);

      // Make a POST request to upload the PDF using axios
      axios
        .post(
          `${process.env.REACT_APP_URL}/api/send-email-with-attachment`,
          formData,
          {
            headers: {
              Authorization: sanctumToken,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          emailMszFn(true);
        })
        .catch((error) => {
          emailMszFn(false);
        });
    });
};

export default quotationPdfEmailDirect;
