import html2pdf from "html2pdf.js";
import React from "react";

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

// const generatePdfMoneyRecipt = (data, count) => {
//   const items = data?.items;
//   //   const payments = JSON.parse(data?.paymentsJSON);

//   const itemsTable = `
//     <table border="1" style="width: 100%; border-collapse: collapse;">
//       <thead>
//         <tr>
//           <th>Item Name</th>
//           <th>Description</th>
//           <th>Quantity</th>
//           <th>Unit Price</th>
//           <th>Total Price</th>
//         </tr>
//       </thead>
//       <tbody>
//         ${items
//           .map(
//             (item) => `
//           <tr>
//             <td>${item.ItemName}</td>
//             <td>${item.ItemDesc}</td>
//             <td>${item.Quantity}</td>
//             <td>${item.UnitPrice}</td>
//             <td>${item.TotalPrice}</td>
//           </tr>
//         `
//           )
//           .join("")}
//       </tbody>
//     </table>
//   `;

//   const summaryTable = `
//   <table style="width: 100%; border-collapse: collapse; margin-top: 20px; background-color: #fff;">
//     <thead>
//       <tr>
//         <th style="padding: 10px; border: 1px solid #ddd;">Total Price</th>
//         <th style="padding: 10px; border: 1px solid #ddd;">Final Price after Discount</th>
//         <th style="padding: 10px; border: 1px solid #ddd;">SGST ${data.sgstp}% + CGST ${data.cgstp}%</th>
//         <th style="padding: 10px; border: 1px solid #ddd;">Final Price after GST with Roundup</th>
//       </tr>
//     </thead>
//     <tbody>
//       <tr>
//         <td style="text-align: center; padding: 10px; border: 1px solid #ddd;">${data.totalAmountBD}</td>
//         <td style="text-align: center; padding: 10px; border: 1px solid #ddd;">${data.totalAmountAD}</td>
//         <td style="text-align: center; padding: 10px; border: 1px solid #ddd;">${data.sgstAmount} + ${data.cgstAmount}</td>
//         <td style="text-align: center; padding: 10px; border: 1px solid #ddd;">${data.netTotalAmount}</td>
//       </tr>
//     </tbody>
//   </table>`;

//   // Function to generate individual page content
//   const generatePageContent = (isLastPage) => `
//     <div style="font-family: Arial, sans-serif; color: #111; padding: .5rem 3rem; ${
//       isLastPage ? "" : "page-break-after: always;"
//     }">
//       <img src="/img/logo/millanlogo.png" alt="Logo" style="width:100px; height:auto; position: absolute; top: 8px; left: 8px;"/>
//      <h1 style="text-align: center; color: blue; margin-bottom: 2px; line-height: 0.8;">MILAN HOME SOLUTION</h1>
// <h3 style="text-align: center; margin-bottom: 2px; line-height: 0.8;">Sukhmay Sengupta Road (L. N. Bari Road)</h3>
// <p style="text-align: center; margin-bottom: 2px; line-height: 0.8;">Banamalipur, Agartala, Tripura</p>
// <p style="text-align: center; margin-bottom: 2px; line-height: 0.8;">GSTN: 16AIUPC5516D1ZE</p>
// <p style="text-align: center; margin-bottom: 2px; line-height: 0.8;">State Code and Name: 16 Tripura</p>

//       <p><strong>Date:</strong> ${new Date().toLocaleDateString("en-GB")}</p>
//       <p>Received with thanks from <strong>${
//         data.customerName
//       }</strong> the sum of Rupees <strong>${numberToWordsInIndian(
//         data.netTotalAmount
//       )}</strong></p>
// <p>
// </p>

// <p>
//   Payment Type: <strong>${
//     data.paymentType === "A"
//       ? "Advance"
//       : data.paymentType === "F"
//         ? "Final"
//         : "Unknown"
//   }</strong>
// </p>

// ${itemsTable}
// ${summaryTable}

// <p style="text-align: right; margin-top: 4rem;">Signature: ...............................................................</p>
//     </div>
//   `;

//   // Generate content for all pages
//   const finalContent = Array.from({ length: count }, (_, index) =>
//     generatePageContent(index === count - 1)
//   ).join("");

//   // Generate PDF
//   html2pdf()
//     .from(finalContent)
//     .outputPdf("blob")
//     .then((pdfBlob) => {
//       const pdfUrl = URL.createObjectURL(pdfBlob);
//       const printWindow = window.open(pdfUrl);

//       if (printWindow) {
//         printWindow.onload = () => {
//           printWindow.print();
//         };
//       }
//     });
// };
const generatePdfMoneyRecipt = (data, count) => {
  const items = data?.items;
  const itemSelect = data.itemSelect;
  const totalsArray = data.totalsArray;

  //   const itemsTable = `
  //       <table border="1" style="width: 100%; border-collapse: collapse;">
  //         <thead>
  //           <tr>
  //             <th>Particulars</th>
  //             <th>HSN</th>

  //             <th>Qty</th>
  //             <th>Unit Unit</th>
  //             <th>Rate</th>
  //             <th>Disc%</th>
  //             <th>Amount</th>

  //           </tr>
  //         </thead>
  //         <tbody>
  //           ${items
  //             .map(
  //               (item) => `
  //             <tr>
  //               <td>${item.ItemName || "Product A"}</td>
  //               <td>${item.ItemHsnMasterID || "N/A"}</td>
  //               <td>${item.Quantity}</td>
  //               <td>${item.Unit || "N/A"}</td>
  //               <td>${item.Rate || "N/A"}</td>
  //               <td>${item.Amount || "N/A"}</td>
  //               <td>${item.Amount || "N/A"}</td>

  //             </tr>
  //           `
  //             )
  //             .join("")}
  //         </tbody>
  //       </table>
  //     `;
  const itemsTable = `
  <table border="1" style="width: 100%; border-collapse: collapse;">
    <thead>
      <tr>
        <th>Particulars</th>
        <th>HSN</th>
        <th>Qty</th>
        <th>Unit</th>
        <th>Rate</th>
        <th>Disc%</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      ${items
        .map(
          (item, index) => `
        <tr>
          <td>${itemSelect[index]?.selectedOption?.name || "Product A"}</td>
        //   <td>${item.ItemHsnMasterID || "N/A"}</td>
                          <td>${item.ItemHsnMasterID || "N/A"}</td>

          <td>${item.Quantity}</td>
          <td>${item.Unit || "N/A"}</td>
          <td>${item.Rate || "N/A"}</td>
          <td>${item.Amount || "N/A"}</td>
          <td>${totalsArray[index] || "N/A"}</td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>
`;
  const summaryTable = `
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px; background-color: #fff;">
        <thead>
          <tr>
            <th style="padding: 10px; border: 1px solid #ddd;">Total Price</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Final Price after Discount</th>
            <th style="padding: 10px; border: 1px solid #ddd;">SGST ${data.sgstp}% + CGST ${data.cgstp}%</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Final Price after GST with Roundup</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align: center; padding: 10px; border: 1px solid #ddd;">${data.totalAmountBD}</td>
            <td style="text-align: center; padding: 10px; border: 1px solid #ddd;">${data.totalAmountAD}</td>
            <td style="text-align: center; padding: 10px; border: 1px solid #ddd;">${data.sgstAmount} + ${data.cgstAmount}</td>
            <td style="text-align: center; padding: 10px; border: 1px solid #ddd;">${data.netTotalAmount}</td>
          </tr>
        </tbody>
      </table>
    `;

  const generatePageContent = (isLastPage) => `
      <div style="font-family: Arial, sans-serif; color: #111; padding: .5rem 3rem; ${isLastPage ? "" : "page-break-after: always;"}">
        <img src="/img/logo/millanlogo.png" alt="Logo" style="width:100px; height:auto; position: absolute; top: 8px; left: 8px;"/>
        <h1 style="text-align: center; color: blue; margin-bottom: 2px; line-height: 0.8;">MILAN HOME SOLUTION</h1>
        <h3 style="text-align: center; margin-bottom: 2px; line-height: 0.8;">Sukhmay Sengupta Road (L. N. Bari Road)</h3>
        <p style="text-align: center; margin-bottom: 2px; line-height: 0.8;">Banamalipur, Agartala, Tripura</p>
        <p style="text-align: center; margin-bottom: 2px; line-height: 0.8;">GSTN: 16AIUPC5516D1ZE</p>
        <p style="text-align: center; margin-bottom: 2px; line-height: 0.8;">State Code and Name: 16 Tripura</p>
  
        <p><strong>Date:</strong> ${new Date().toLocaleDateString("en-GB")}</p>
        <p>Received with thanks from <strong>${data.customerSelect.name || "Supplier A"}</strong> the sum of Rupees <strong>${numberToWordsInIndian(data.netTotalAmount)}</strong></p>
        <p>Payment Type: <strong>${
          data.paymentType === "A"
            ? "Advance"
            : data.paymentType === "F"
              ? "Final"
              : "Unknown"
        }</strong></p>
  
        ${itemsTable}
        ${summaryTable}
  
        <p style="text-align: right; margin-top: 4rem;">Signature: ...............................................................</p>
      </div>
    `;

  const finalContent = Array.from({ length: count }, (_, index) =>
    generatePageContent(index === count - 1)
  ).join("");

  html2pdf()
    .from(finalContent)
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

export default generatePdfMoneyRecipt;
