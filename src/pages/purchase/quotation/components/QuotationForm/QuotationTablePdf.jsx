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

const quotationTablePdf = (quotations) => {
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
          <td style="width: 18%; border-top: none; border-bottom: 1px solid #000; border-right: 1px solid #ccc;">${handleNull(item.QuotationDate)}</td>
          <td style="width: 12%; border-top: none; border-bottom: 1px solid #000; border-right: 1px solid #ccc;">${handleNull(item.QuotationNo)}</td>
          <td style="width: 12%; border-top: none; border-bottom: 1px solid #000; border-right: 1px solid #ccc;">${handleNull(item.GrandTotalAmount)}</td>
          <td style="width: 20%; border-top: none; border-bottom: 1px solid #000; border-right: 1px solid #ccc;">${handleNull(item.CompanyName)}</td>
          <td style="width: 18%; border-top: none; border-bottom: 1px solid #000; border-right: 1px solid #ccc;">${handleNull(item.PhoneNumber1)}</td>
          <td style="width: 8%; border-top: none; border-bottom: 1px solid #000;">${totalProducts}</td>
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
        tr:nth-child(even) {
          background-color: #fff;
        }
        tr:nth-child(odd) {
          background-color: #fff;
        }
        tr:hover {
          background-color: #fff;
        }
        td {
          white-space: nowrap;
        }
      </style>
      <table>
        <thead>
          <tr>
            <th style="width: 8%;">No.</th>
            <th style="width: 13%;">Quotation Date</th>
            <th style="width: 14%;">Quotation No</th>
            <th style="width: 22%;">Grand Total Amount</th>
            <th style="width: 22%;">Supplier Name</th>
            <th style="width: 13%;">Company Phone No</th>
            <th style="width: 8%;">Total Products</th>
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
      <h1 style="text-align: center; color: #000; margin-bottom: -2px; margin-top: -6px;">Quotation Details</h1>
      ${generateTableHtml(quotations)}
      <p style="text-align: right; font-weight: bold;">Total Items: ${quotations.length}</p>
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

export const generateExcelFromQuotations = (quotations) => {
  const handleNull = (value) => (value === null || value === undefined ? "" : value);

  const data = quotations.map((item, index) => ({
    "No.": index + 1,
    "Quotation Date": handleNull(item.QuotationDate),
    "Quotation No": handleNull(item.QuotationNo),
    "Grand Total Amount": handleNull(item.GrandTotalAmount),
    "Supplier Name": handleNull(item.CompanyName),
    "Company Phone No": handleNull(item.PhoneNumber1),
    "Total Products": item.ModelMappingData ? item.ModelMappingData.length : 0,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Quotations");

  XLSX.writeFile(workbook, "Quotations.xlsx");
};

export default quotationTablePdf;
