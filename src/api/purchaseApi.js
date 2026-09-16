import axios from "axios";
import Cookies from "js-cookie"; // Import Cookies
import { financialYearConfig } from "../functionforAll";

const BASE_URL = process.env.REACT_APP_URL; // use environment variable

// console.log("Token:", token); // Is this showing?
// console.log("SanctumToken:", sanctumToken); // Does this include 'Bearer ...'?
// console.log("Base URL:", process.env.REACT_APP_URL); // Is this undefined?
// ./api/purchaseApi.js

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

// ============================================Dashboard=====================================
export const inventoryGraphApiFn = () => api.get("/api/inventory");
export const gstGraphApiFn = () => api.get("/api/gstTotalAmount?BillCode=INVP");
export const quotationGraphApiFn = async () => {
  const res = await api.get("/api/booking/total?EntityType=SUPP&BillCode=QUO");
  return res.data;
};
export const invoicePurGraphApiFn = () =>
  api.get("/api/invoice/total?EntityType=Supp&BillCode=INVP");
export const quoPurYearGraphApiFn = () =>
  api.get(
    `/api/monthWiseEntityBooking?EntityType=SUPP&BillCode=QUO&BillYear=${financialYearConfig.currentYear()}`
  );
export const incoicePurYearGraphApiFn = () =>
  api.get(
    `/api/monthlyInvoiceData?entity_type=SUPP&bill_code=INVP&bill_year=${financialYearConfig.currentYear()}`
  );
export const dueGraphApiFn = () =>
  api.get("/api/getReceiptPayment?BillCode=INVS");

// ==================================================== suppliers ==========================================
export const supplierListApiFn = () => api.get("/api/getSuppliers");

// ====================================================product ==========================================
export const productListApiFn = () => api.get("/api/getProductModels");

// ==================================================== quotation ==========================================
export const quotationtListApiFn = () =>
  api.get("/api/getquotationbookings?BillCode=QUO");
// ==================================================== invoice ==========================================
export const invoicePurListApiFn = () =>
  api.get("/api/getReceiptPayment?BillCode=INVP");
// ==================================================== inventory ==========================================
export const inventoryListApiFn = () => api.get("/api/inventory");
export const allTransuctionListApiFn = () =>
  api.get("/api/inventoryTransaction/all");
export const purchaseTransuctionListApiFn = () =>
  api.get("/api/inventoryTransaction/purchase");
export const saleTransuctionListApiFn = () =>
  api.get("/api/inventoryTransaction/sale");
export const PurchaseReturTransuctionListApiFn = () =>
  api.get("/api/inventoryTransaction/PurchaseReturn");
export const SaleReturnTransuctionListApiFn = () =>
  api.get("/api/inventoryTransaction/SaleReturn");
// =========================================damage=================================
export const damageListApiFn = () =>
  api.get("/api/getDamageReturn?BillCode=INVPR&Source=O&ReceiptID=0");
export const damageSupplierListApiFn = () =>
  api.get("/api/getentitylistbasedonreceipt?source=O&entityType=SUPP");

// =================================expiry ===================================
