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

// ============================================common=====================================
export const hsnMasterApiFn = () => api.get("/api/getHSN");
export const paymentMasterApiFn = () => api.get("/api/getPaymentModes");
export const signatoryMasterApiFn = () => api.get("/api/getsignatorydetails");
export const companyMasterApiFn = () => api.get("/api/getCompany");
export const categoryMasterApiFn = () => api.get("/api/categories/1");
export const brandMasterApiFn = () => api.get("/api/getCompany");

export const colorMasterApiFn = () => api.get("/api/colormaster");
export const deaseseApiFn = () => api.get("/api/FetchAllDiseases");
export const stateMasterApiFn = () => api.get("/api/state-master");
