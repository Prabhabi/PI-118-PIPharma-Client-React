import axios from "axios";
import Cookies from "js-cookie"; // Import Cookies
import { financialYearConfig } from "../functionforAll";

const BASE_URL = process.env.REACT_APP_URL; // use environment variable

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 If you need auth headers
api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  const sanctumToken = token ? `Bearer ${token.replace(/"/g, "")}` : "";
  if (token) {
    config.headers.Authorization = sanctumToken;
  }
  return config;
});
// ==========================================Dashboard===================================
export const incoiceSalesYearGraphApiFn = () =>
  api.get(
    `/api/monthlyInvoiceData?entity_type=CUST&bill_code=INVS&bill_year=${financialYearConfig.currentYear()}`
  );
export const gstSalesGraphApiFn = () =>
  api.get("/api/gstTotalAmount?BillCode=INVS");
export const moneyReciptSalesGraphApiFn = () =>
  api.get("/api/moneyReceiptTotal?bill_code=MRIS");
export const advbSalesCustGraphApiFn = () =>
  api.get("/api/booking/total?EntityType=CUST&BillCode=ADVB");
export const advbSalesSubdGraphApiFn = () =>
  api.get("/api/booking/total?EntityType=SUBD&BillCode=ADVB");
export const advbSalesYearGraphApiFn = () =>
  api.get(
    `/api/monthWiseEntityBooking?EntityType=CUST&BillCode=ADVB&BillYear=${financialYearConfig.currentYear()}`
  );
export const invoiceSalesCustGraphApiFn = () =>
  api.get("/api/invoice/total?EntityType=CUST&BillCode=INVS");
export const invoiceSalesSubdGraphApiFn = () =>
  api.get("/api/invoice/total?EntityType=SUBD&BillCode=INVS");
export const moneyReciptYearWiseGraphApiFn = () => {
  return api.get(
    `/api/monthWiseBill?BillCode=MRIS&BillYear=${financialYearConfig.currentYear()}&Entity=CUST`
  );
};

// ==========================================customer ===============================
export const customerListApiFn = () => api.get("/api/getCustomers");

// ==========================================sub dealer===============================
// export const subDealerListApiFn = () => api.get("/api/getSubDealers");

// =======================================advance order ==================================
export const advbListApiFn = () =>
  api.get("/api/getquotationbookings?BillCode=ADVB");

// ==========================================invoice ===============================
export const invoiceListApiFn = () =>
  api.get("/api/getReceiptPayment?BillCode=INVS");
// ==========================================money recipt ===============================
export const moneyReciptListApiFn = () => api.get("/api/moneyReceiptPayment");
// =========================================damage=================================
export const damageListSalesApiFn = () =>
  api.get("/api/getDamageReturn?BillCode=INVSR&Source=O&ReceiptID=0");
// export const damageCustomerListApiFn = () =>
//   api.get("/api/getentitylistbasedonreceipt?source=O&entityType=SUPP");
// ------------------------------------docotor =======================================
export const subDealerListApiFn = () => api.get("/api/FetchAllDoctors");
// ------------------------------------order request=======================================
export const orderRequestListApiFn = () => api.get("/api/getRequestOrder");
