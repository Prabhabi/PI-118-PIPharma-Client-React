import html2pdf from "html2pdf.js";
import React from "react";
import * as XLSX from "xlsx";

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

const AdvanceOrderTablePdf = (advanceOrders) => {
  const handleNull = (value) => {
    return value === null || value === undefined ? "" : value;
  };

  const generateTableHtml = (items) => {
    if (!items) return "";

    const tableRows = items
      .map((item, index) => {
        const totalProducts = item.ModelMappingData ? item.ModelMappingData.length : 0;
        return `
        <tr>
          <td style="width: 8%; border-top: none; border-bottom: 1px solid #000; border-right: 1px solid #ccc;">${index + 1}</td>
          <td style="width: 15%; border-top: none; border-bottom: 1px solid #000; border-right: 1px solid #ccc;">${handleNull(item.QuotationNo)}</td>
          <td style="width: 20%; border-top: none; border-bottom: 1px solid #000; border-right: 1px solid #ccc;">${handleNull(item.CompanyName)}</td>
          <td style="width: 20%; border-top: none; border-bottom: 1px solid #000; border-right: 1px solid #ccc;">${handleNull(item.Name)}</td>
          <td style="width: 15%; border-top: none; border-bottom: 1px solid #000; border-right: 1px solid #ccc;">${handleNull(item.PhoneNumber1)}</td>
          <td style="width: 10%; border-top: none; border-bottom: 1px solid #000; border-right: 1px solid #ccc;">${totalProducts}</td>
          <td style="width: 12%; border-top: none; border-bottom: 1px solid #000;">${handleNull(item.TotalAmountAD)}</td>
        </tr>
      `;
      })
      .join("");

    return `
      <style>
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
          margin-bottom: 10px;
          page-break-inside: avoid;
        }
        th, td {
          border: 1px solid #000;
          padding: 2px;
          text-align: center;
        }
        th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
      </style>
      <table>
        <thead>
          <tr>
            <th style="width: 8%;">No.</th>
            <th style="width: 15%;">AdvancedOrder No</th>
            <th style="width: 20%;">Company Name</th>
            <th style="width: 20%;">Consumer Name</th>
            <th style="width: 15%;">Phone No</th>
            <th style="width: 10%;">Total Items</th>
            <th style="width: 12%;">Gross Amount</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;
  };

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 0.5rem; line-height: 1; border: 1px solid #ddd; border-radius: 8px; page-break-inside: avoid;">
      <h1 style="text-align: center; color: #000; margin-bottom: -2px; margin-top: -6px;">AdvanceOrder Details</h1>
      ${generateTableHtml(advanceOrders)}
      <p style="text-align: right; font-weight: bold;">Total Items: ${advanceOrders.length}</p>
    </div>
  `;

  html2pdf()
    .from(htmlContent)
    .set({
      margin: [0, 4, 1, 4],
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
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

export const generateExcelFromAdvanceOrders = (advanceOrders) => {
  const handleNull = (value) => (value === null || value === undefined ? "" : value);

  const data = advanceOrders.map((item, index) => ({
    "No.": index + 1,
    "Quotation No": handleNull(item.QuotationNo),
    "Company Name": handleNull(item.CompanyName),
    "Consumer Name": handleNull(item.Name),
    "Phone No": handleNull(item.PhoneNumber1),
    "Total Items": item.ModelMappingData ? item.ModelMappingData.length : 0,
    "Gross Amount": handleNull(item.TotalAmountAD),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "AdvanceOrders");

  XLSX.writeFile(workbook, "AdvanceOrders.xlsx");
};

export default AdvanceOrderTablePdf;
