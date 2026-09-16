import html2pdf from "html2pdf.js";
import React from "react";

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
              <tr>
                <td style="padding: 4px; border-left: 1px solid #000; border-right: 1px solid #000; text-align: center; font-size: 11px;">${index + 1}</td>
                <td style="padding: 4px; border-left: 1px solid #000; border-right: 1px solid #000; font-size: 11px;">${productModelText}</td>
                <td style="padding: 4px; border-left: 1px solid #000; border-right: 1px solid #000; text-align: center; font-size: 11px;">${displayValue(item.Quantity)}${item.UnitQuantity ? " " + item.UnitQuantity : ""}</td>
                <td style="padding: 4px; border-left: 1px solid #000; border-right: 1px solid #000; text-align: center; font-size: 11px;">${item.QtyPerBox ? item.QtyPerBox : "-"}</td>
                <td style="padding: 4px; border-left: 1px solid #000; border-right: 1px solid #000; text-align: right; font-size: 11px;">₹${displayValue(item.Price)}</td>
                <td style="padding: 4px; border-left: 1px solid #000; border-right: 1px solid #000; text-align: right; font-size: 11px;">₹${displayValue(item.Amount)}</td>
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
                <th style="width: 12%; padding: 4px; border: 1px solid #000; text-align: right; font-size: 11px; font-weight: 600;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
              <tr>
                <td colspan="6" style="border-top: 1px solid #000;"></td>
              </tr>
            </tbody>
          </table>
        `;
};

const generateBankAndCompanyDetailsHtml = (data) => {
  return `
    <div style="display: flex; flex-direction: row; justify-content: space-between; margin-top: 10px; position: relative;">
      <div style="width: 65%; font-size: 10px;">
        ${
          data.Bill_BankName ||
          data.Bill_AccountNumber ||
          data.Bill_IFSCCode ||
          data.Bill_BranchName
            ? `<p><strong>Bank Details:</strong></p>
        <p>
          ${data.Bill_BankName ? `Bank Name: ${displayValue(data.Bill_BankName)}` : ""}
          ${data.Bill_AccountNumber ? `, Account Number: ${displayValue(data.Bill_AccountNumber)}` : ""}
          ${data.Bill_IFSCCode ? `, IFSC Code: ${displayValue(data.Bill_IFSCCode)}` : ""}
          ${data.Bill_BranchName ? `, Branch: ${displayValue(data.Bill_BranchName)}` : ""}
        </p>`
            : ""
        }
        <p><strong>Terms & Condition:</strong></p>
        <p style="margin: 2px 0; font-size: 8px;">1. Interest @24% per annum will be charged on bills not paid within 30 days.</p>
        <p style="margin: 2px 0; font-size: 8px;">2. Please check the GSTIN and inform for any discrepancy within 7 days.</p>
        <p style="margin: 2px 0; font-size: 8px;">3. Goods once sold shall not be taken back.</p>
        <p style="margin: 2px 0; font-size: 8px;">4. No responsibility for Transit Risks.</p>
        <p style="margin: 2px 0; font-size: 8px;">5. Disputes, if any, shall be subject to the Jurisdiction of Kolkata Courts.</p>
        <p style="margin: 2px 0; font-size: 8px;">6. Please pay by cheque "A/C PAYEE" NEFT/RTGS only.</p>
      </div>
      <div style="position: absolute; right: 0; bottom: 0; width: 33%; font-size: 12px; text-align: center; align-self: flex-end; margin-left: 30px;">
        <div style="height: 32px;"></div>
        ${data.AuthorizedSignatoryByName ? `<p style="margin: 2px 0;">Authorized By: ${displayValue(data.AuthorizedSignatoryByName)}</p>` : ""}
        <p style="border-bottom: 1px solid #000; margin: 0;"></p>
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
  `;
};

const quotationPdf = (data) => {
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
          ${QuotationNo ? `<strong>Quotation No.:</strong> ${displayValue(QuotationNo)}` : ""}
        </div>
        <div style="flex: 1; text-align: right; line-height: 1; font-size: 10px;">
          ${QuotationDate ? `<strong>Date:</strong> ${new Date(QuotationDate).toLocaleDateString("en-GB")}` : ""}
        </div>
      </div>
      <hr>
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
      <div>
      ${Bill_CompanyName ? `<p style="margin: 2px 0; font-size: 10px;"><strong>Form:</strong> ${displayValue(Bill_CompanyName)}</p>` : ""}
      ${Bill_AddressLine1 || Bill_AddressLine2 ? `<p style="margin: 2px 0; font-size: 10px;">${displayValue(Bill_AddressLine1)}${Bill_AddressLine1 && Bill_AddressLine2 ? ", " : ""}${displayValue(Bill_AddressLine2)}</p>` : ""}
      ${Bill_City || Bill_State || Bill_PinCode ? `<p style="margin: 2px 0; font-size: 10px;">${displayValue(Bill_City)}${Bill_City && Bill_State ? ", " : ""}${displayValue(Bill_State)}${(Bill_City || Bill_State) && Bill_PinCode ? ", " : ""}${displayValue(Bill_PinCode)}</p>` : ""}
      ${Bill_PhoneNumber1 || Bill_PhoneNumber2 ? `<p style="margin: 2px 0; font-size: 10px;">${displayValue(Bill_PhoneNumber1)}${Bill_PhoneNumber1 && Bill_PhoneNumber2 ? `, ${displayValue(Bill_PhoneNumber2)}` : ""}</p>` : ""}
      ${Bill_GSTNumber ? `<p style="margin: 2px 0; font-size: 10px;"><strong>GST No.:</strong> ${displayValue(Bill_GSTNumber)}</p>` : ""}
      </div>
      <div>
        ${CompanyName ? `<p style="margin: 2px 0; font-size: 10px;"><strong>To:</strong> ${displayValue(CompanyName)}</p>` : ""}
        ${AddressLine1 || AddressLine2 ? `<p style="margin: 2px 0; font-size: 10px;">${displayValue(AddressLine1)}${AddressLine1 && AddressLine2 ? ", " : ""}${displayValue(AddressLine2)}</p>` : ""}
        ${City || State || PinCode ? `<p style="margin: 2px 0; font-size: 10px;">${displayValue(City)}${City && State ? ", " : ""}${displayValue(State)}${(City || State) && PinCode ? ", " : ""}${displayValue(PinCode)}</p>` : ""}
        ${PhoneNumber1 || PhoneNumber2 ? `<p style="margin: 2px 0; font-size: 10px;">${displayValue(PhoneNumber1)}${PhoneNumber1 && PhoneNumber2 ? `, ${displayValue(Bill_PhoneNumber2)}` : ""}</p>` : ""}
        ${GSTNumber ? `<p style="margin: 2px 0; font-size: 10px;"><strong>GST No.:</strong> ${displayValue(GSTNumber)}</p>` : ""}
      </div>
      </div>
      <hr>
      <div>
        <p style="font-size: 12px;"><strong>Product Details:</strong></p>
        ${generateTableHtml(parsedModelMappingData)}
      </div>
      <div style="text-align: right; font-size: 10px;">
        ${TotalAmountBD ? `<p>Sub Total: ₹${displayValue(formatNumber(TotalAmountBD))}</p>` : ""}
        ${Discount ? `<p>Discount (${displayValue(formatNumber(Discount))}%): ₹${displayValue(formatNumber(DiscountAmount))}</p>` : ""}
        ${TotalAmountAD ? `<p>Taxable Amount: ₹${displayValue(formatNumber(TotalAmountAD))}</p>` : ""}
        ${
          CGSTP && SGSTP
            ? `<p>CGST+SGST (${displayValue(formatNumber(CGSTP))}%+${displayValue(formatNumber(SGSTP))}%): ₹${displayValue(formatNumber(CGSTAmount))}+₹${displayValue(formatNumber(SGSTAmount))}</p>`
            : CGSTP
              ? `<p>CGST (${displayValue(formatNumber(CGSTP))}%): ₹${displayValue(formatNumber(CGSTAmount))}</p>`
              : SGSTP
                ? `<p>SGST (${displayValue(formatNumber(SGSTP))}%): ₹${displayValue(formatNumber(SGSTAmount))}</p>`
                : ""
        }
        ${RoundOffAmount ? `<p>Round Off: ₹${displayValue(formatNumber(RoundOffAmount))}</p>` : ""}
        ${GrandTotalAmount ? `<p><strong>Grand Total: ₹${displayValue(formatNumber(GrandTotalAmount))}</strong></p>` : ""}
      </div>
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

export default quotationPdf;
