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
    "Zero","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten",
    "Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"
  ];
  const tens = [
    "","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"
  ];
  const convertHundreds = (num) => {
    if (num === 0) return "";
    if (num < 20) return units[num];
    if (num < 100)
      return tens[Math.floor(num / 10)] + (num % 10 ? " " + units[num % 10] : "");
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

const generateTableHtml = (items) => {
  const tableRows = items
    ?.map((item, index) => {
      // Parse ModelStatusData for separation
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

      // Sum quantities by status
      const getQty = (status) =>
        msd
          .filter(
            (m) =>
              (m.ProductModelStatus || "")
                .trim()
                .toUpperCase()
                .startsWith(status)
          )
          .reduce((sum, m) => sum + Number(m.Quantity || 0), 0);

      const damagedQty = getQty("D");
      const returnedQty = getQty("R");
      const existingQty = getQty("E");

      // Determine how to display quantity
      let qtyDisplay = "";
      if (
        item.ProductModelStatus === "R" &&
        msd.length > 0
      ) {
        // For "R", only show ModelStatusData breakdown, ignore parent Quantity
        qtyDisplay = `Damaged: ${damagedQty} | Returned: ${returnedQty} | Existing: ${existingQty}`;
      } else if (item.ProductModelStatus === "N") {
        // For "N", show parent Quantity as usual
        qtyDisplay = `Qty: ${displayValue(item.Quantity)}`;
      } else if (msd.length > 0) {
        // For other statuses, show breakdown if ModelStatusData exists
        qtyDisplay = `Damaged: ${damagedQty} | Returned: ${returnedQty} | Existing: ${existingQty}`;
      } else {
        // Fallback to parent Quantity
        qtyDisplay = `Qty: ${displayValue(item.Quantity)}`;
      }

      return `
        <tr class="item-row">
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center; font-size: 11px;">${index + 1}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-size: 11px;">${displayValue(item.ProductModelName)}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center; font-size: 11px;">${qtyDisplay}</td>
       <!--   <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center; font-size: 11px;">${displayValue(item.DISP)}</td> -->
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center; font-size: 11px;">${displayValue(item.UnitQuantity)}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-size: 11px;">${item.Rate !== undefined && item.Rate !== null && item.Rate !== "" ? `₹${displayValue(formatNumber(item.Rate))}` : ""}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-size: 11px;">${item.Amount !== undefined && item.Amount !== null && item.Amount !== "" ? `₹${displayValue(formatNumber(item.Amount))}` : ""}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center; font-size: 11px;">${item.ProductModelStatus || ""}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <table style="width: 100%; border-collapse: collapse; margin: 15px 0; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <thead>
        <tr style="background: #f8f9fa;">
          <th style="width: 5%; padding: 12px 8px; border-bottom: 2px solid #dee2e6; font-size: 11px; font-weight: 600; color: #495057;">No.</th>
          <th style="width: 20%; padding: 12px 8px; border-bottom: 2px solid #dee2e6; text-align: left; font-size: 11px; font-weight: 600; color: #495057;">Product Model</th>
          <th style="width: 20%; padding: 12px 8px; border-bottom: 2px solid #dee2e6; text-align: center; font-size: 11px; font-weight: 600; color: #495057;">Qty (Damaged | Returned | Existing)</th>
        <!--  <th style="width: 8%; padding: 12px 8px; border-bottom: 2px solid #dee2e6; text-align: center; font-size: 11px; font-weight: 600; color: #495057;">Discount%</th> -->
          <th style="width: 10%; padding: 12px 8px; border-bottom: 2px solid #dee2e6; text-align: center; font-size: 11px; font-weight: 600; color: #495057;">Unit </th>
          <th style="width: 12%; padding: 12px 8px; border-bottom: 2px solid #dee2e6; text-align: right; font-size: 11px; font-weight: 600; color: #495057;">Rate</th>
          <th style="width: 12%; padding: 12px 8px; border-bottom: 2px solid #dee2e6; text-align: right, font-size: 11px; font-weight: 600; color: #495057;">Amount</th>
          <th style="width: 10%; padding: 12px 8px; border-bottom: 2px solid #dee2e6; text-align: center; font-size: 11px; font-weight: 600; color: #495057;">Status</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  `;
};

const generatePaymentDetailsHtml = (payments) => {
  if (!Array.isArray(payments) || payments.length === 0) return "";
  return `
    <div style="margin-top: 10px;">
      <strong>Payment Details:</strong>
      <table style="width: 100%; border-collapse: collapse; margin-top: 5px; font-size: 10px;">
        <thead>
          <tr>
            <th style="border-bottom: 1px solid #ccc; padding: 4px;">Mode</th>
            <th style="border-bottom: 1px solid #ccc; padding: 4px;">Desc</th>
            <th style="border-bottom: 1px solid #ccc; padding: 4px;">Amount</th>
            <th style="border-bottom: 1px solid #ccc; padding: 4px;">Date</th>
          </tr>
        </thead>
        <tbody>
          ${payments
            .map(
              (p) => `
            <tr>
              <td style="padding: 4px;">${displayValue(p.PaymentModeName || p.PaymentModeID)}</td>
              <td style="padding: 4px;">${displayValue(p.PaymentModeDetails || p.PaymentModeDesc)}</td>
              <td style="padding: 4px;">₹${formatNumber(p.Amount)}</td>
              <td style="padding: 4px;">${formatDate(p.PaymentDate)}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
};

const DamagePdf = (responseData) => {
  // Handle array input (take first object if array)
  let data = responseData;
  if (Array.isArray(responseData)) {
    data = responseData[0] || {};
  } else if (responseData?.postedData && Array.isArray(responseData.postedData)) {
    data = responseData.postedData[0] || {};
  } else if (responseData?.postedData) {
    data = responseData.postedData;
  }

  // --- Extract fields for From/To sections ---
  // "From" (BillEntity) - typically the issuer (company)
  const fromType = data.BillEntityType || "";
  const fromName = data.Bill_CompanyName || data.BillEntityName || data.BillCompanyName || "";
  const fromAddress1 = data.Bill_AddressLine1 || data.BillAddressLine1 || "";
  const fromAddress2 = data.Bill_AddressLine2 || data.BillAddressLine2 || "";
  const fromCity = data.Bill_City || data.BillCity || "";
  const fromState = data.Bill_State || data.BillState || "";
  const fromPin = data.Bill_PinCode || data.BillPinCode || "";
  const fromPhone = data.Bill_PhoneNumber1 || data.BillPhoneNumber1 || "";
  const fromEmail = data.Bill_Email || "";
  const fromGST = data.Bill_GSTNumber || data.BillGSTNumber || "";

  // "To" (Entity) - typically the customer/supplier/subdealer
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

  // Destructure all needed fields from data
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

  // Parse ReceiptProductModelList and PaymentDetails if they are JSON strings
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

  // Helper for discount unit
  const getDiscountUnit = (unit) => {
    if (!unit) return "";
    if (unit === "P") return "%";
    if (unit === "A") return "₹";
    return unit;
  };

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #000; padding: 5px; border: 1px solid #000; height: 100%; box-sizing: border-box; font-size: 10px;">
      <div style="text-align: center; margin-bottom: 10px;">
        <p style="margin: 0; font-size: 10px;">Original for Recipient, Duplicate for Transporter, Triplicate for Supplier</p>
        <h1 style="margin: 0; font-size: 22px;">Damage/Return Receipt</h1>
      </div>
      <!-- Receipt Info Section -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 10px;">
        <div>
          <strong>Invoice No:</strong> ${displayValue(ReceiptNumber)}<br/>
          <strong>Date:</strong> ${formatDate(ReceiptDate)}<br/>
          <!-- <strong>Bill Code:</strong> ${displayValue(BillCode)}<br/> -->
        </div>
        <div>
          <strong>Payment Type:</strong> ${displayValue(PaymentType)}<br/>
          <strong>Payment Status:</strong> ${displayValue(PaymentStatus)}<br/>
        </div>
      </div>
      <!-- From/To Section -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <div style="width: 48%; font-size: 10px;">
          <strong>From${fromType ? ` (${fromType})` : ""}:</strong>
          <div><strong>Name:</strong> ${displayValue(fromName)}</div>
          <div><strong>Address:</strong> ${displayValue(fromAddress1)}${fromAddress1 && fromAddress2 ? ", " : ""}${displayValue(fromAddress2)}</div>
          <div><strong>City/State/Pin:</strong> ${displayValue(fromCity)}${fromCity && fromState ? ", " : ""}${displayValue(fromState)}${(fromCity || fromState) && fromPin ? ", " : ""}${displayValue(fromPin)}</div>
          <div><strong>Phone:</strong> ${displayValue(fromPhone)}</div>
          <div><strong>Email:</strong> ${displayValue(fromEmail)}</div>
          ${fromGST ? `<div><strong>GST No.:</strong> ${displayValue(fromGST)}</div>` : ""}
        </div>
        <div style="width: 48%; font-size: 10px;">
          <strong>To${toType ? ` (${toType})` : ""}:</strong>
          <div><strong>Name:</strong> ${displayValue(toName)}</div>
          <div><strong>Address:</strong> ${displayValue(toAddress1)}${toAddress1 && toAddress2 ? ", " : ""}${displayValue(toAddress2)}</div>
          <div><strong>City/State/Pin:</strong> ${displayValue(toCity)}${toCity && toState ? ", " : ""}${displayValue(toState)}${(toCity || toState) && toPin ? ", " : ""}${displayValue(toPin)}</div>
          <div><strong>Phone:</strong> ${displayValue(toPhone)}</div>
          <div><strong>Email:</strong> ${displayValue(toEmail)}</div>
          ${toGST ? `<div><strong>GST No.:</strong> ${displayValue(toGST)}</div>` : ""}
        </div>
      </div>
      <hr>
      <div>
        <p style="font-size: 12px;"><strong>Product Details:</strong></p>
        ${generateTableHtml(parsedProductList)}
      </div>
      <div style="text-align: right; font-size: 10px;">
        ${TotalAmountBD !== undefined ? `<p>Sub Total: ₹${displayValue(formatNumber(TotalAmountBD))}</p>` : ""}
        ${
          Discount !== undefined && Discount !== 0
            ? `<p>Discount${DiscountDesc ? ` (${displayValue(DiscountDesc)})` : ""} (${displayValue(formatNumber(Discount))}${getDiscountUnit(DiscountUnit)}): ₹${displayValue(formatNumber(DiscountAmount))}</p>`
            : ""
        }
       <!-- ${TotalAmountAD !== undefined ? `<p>Taxable Amount: ₹${displayValue(formatNumber(TotalAmountAD))}</p>` : ""} -->
        ${
          (CGSTP && SGSTP)
            ? (() => {
                const cgst = parseFloat(CGSTAmount) || 0;
                const sgst = parseFloat(SGSTAmount) || 0;
                const totalGst = cgst + sgst;
                return `<p>CGST+SGST (${displayValue(formatNumber(CGSTP))}%+${displayValue(formatNumber(SGSTP))}%) = ₹${formatNumber(totalGst)}</p>`;
              })()
            : CGSTP
              ? `<p>CGST (${displayValue(formatNumber(CGSTP))}%): ₹${displayValue(formatNumber(CGSTAmount))}</p>`
              : SGSTP
                ? `<p>SGST (${displayValue(formatNumber(SGSTP))}%): ₹${displayValue(formatNumber(SGSTAmount))}</p>`
                : ""
        }
      <!--  ${RoundOffAmount !== undefined ? `<p>Round Off: ₹${displayValue(formatNumber(RoundOffAmount))}</p>` : ""} -->
        ${NetPaidAmount !== undefined ? `<p>Paid: ₹${displayValue(formatNumber(NetPaidAmount))}</p>` : ""}
        ${NetDueAmount !== undefined ? `<p>Due: ₹${displayValue(formatNumber(NetDueAmount))}</p>` : ""}
        ${GrandTotalAmount !== undefined ? `<p><strong>Grand Total: ₹${displayValue(formatNumber(GrandTotalAmount))}</strong></p>` : ""}
      </div>
      <div style="margin-top: 10px; font-size: 10px;">
        <strong>Amount in Words:</strong> ${numberToWordsInIndian(GrandTotalAmount || 0)}
      </div>
      ${generatePaymentDetailsHtml(parsedPaymentDetails)}
      <div style="margin-top: 10px; font-size: 10px;">
        <strong>Remarks:</strong> ${displayValue(Remarks)}
      </div>
      <div style="margin-top: 20px; font-size: 9px;">
      <strong>Terms & Condition:</strong>
        <p style="margin: 2px 0; font-size: 8px;">1. Interest @24% per annum will be charged on bills not paid within 30 days.</p>
        <p style="margin: 2px 0; font-size: 8px;">2. Please check the GSTIN and inform for any discrepancy within 7 days.</p>
        <p style="margin: 2px 0; font-size: 8px;">3. Goods once sold shall not be taken back.</p>
        <p style="margin: 2px 0; font-size: 8px;">4. No responsibility for Transit Risks.</p>
        <p style="margin: 2px 0; font-size: 8px;">5. Disputes, if any, shall be subject to the Jurisdiction of Kolkata Courts.</p>
        <p style="margin: 2px 0; font-size: 8px;">6. Please pay by cheque "A/C PAYEE" NEFT/RTGS only.</p>
        </div>
        <div style="margin-top: 20px; display: flex; justify-content: space-between; font-size: 10px;">
          <div>
            <strong>Checked By:</strong> ${displayValue(CheckedByName)}
          </div>
          <div>
            <strong>Prepared By:</strong> ${displayValue(PreparedByName)}
          </div>
          <div>
            <strong>Authorized By:</strong> ${displayValue(AuthorizedSignatoryByName)}
          </div>
        </div>
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

export default DamagePdf;
