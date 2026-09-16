// import React, { useState } from "react";
// import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
// import worker from "pdfjs-dist/legacy/build/pdf.worker.entry";
// import Tesseract from "tesseract.js";
// import OpenAI from "openai";
// import Select from "react-select";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { useForm, useFieldArray, Controller } from "react-hook-form";
// import InvoiceTable from "./InvoiceTable";

// import {
//   Box,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select as MuiSelect,
//   Paper,
// } from "@mui/material";
// import "./Pdf.css";

// pdfjsLib.GlobalWorkerOptions.workerSrc = worker;

// const options = [
//   { value: "option1", label: "Option 1" },
//   { value: "option2", label: "Option 2" },
//   { value: "option3", label: "Option 3" },
// ];

// const Pdf = () => {
//   const [text, setText] = useState("");
//   const [subdSelect, setSubdSelect] = useState(null);
//   const [userType, setUserType] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [processedData, setProcessedData] = useState(null);
//   const [error, setError] = useState(null);
//   const [supplierSelect, setSupplierSelect] = useState(null);

//   const { control, setValue } = useForm({
//     defaultValues: {
//       SupplierId: "",
//     },
//   });

//   const renderSelectComponent = (
//     label,
//     field,
//     options,
//     placeholder,
//     onChange
//   ) => {
//     return (
//       <Select
//         {...field}
//         options={options}
//         placeholder={placeholder}
//         onChange={(selected) => {
//           field.onChange(selected);
//           if (onChange) onChange(selected);
//         }}
//         value={options?.find((option) => option.value === field.value) || null}
//         isClearable
//       />
//     );
//   };

//   const OPENAI_API_KEY =
//     process.env.REACT_APP_OPENAI_API_KEY;

//   const openai = new OpenAI({
//     apiKey: OPENAI_API_KEY,
//     dangerouslyAllowBrowser: true,
//   });

//   const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//   const processWithOpenAI = async (textContent) => {
//     try {
//       const completion = await openai.chat.completions.create({
//         messages: [
//           {
//             role: "system",
//             content:
//               "You are a helpful assistant that processes document content and extracts structured information.",
//           },
//           {
//             role: "user",
//             content: `Please analyze this document content and extract key information in a structured format: \n\n${textContent}`,
//           },
//         ],
//         model: "gpt-3.5-turbo",
//       });

//       return completion.choices[0].message.content;
//     } catch (error) {
//       console.error("Error processing with OpenAI:", error);
//       setError("Failed to process with OpenAI. Please try again.");
//       return null;
//     }
//   };

//   const handleFile = async (e) => {
//     const selectedFile = e.target.files[0];
//     if (!selectedFile) return;

//     setLoading(true);
//     const reader = new FileReader();
//     reader.onload = async function () {
//       const typedArray = new Uint8Array(this.result);
//       const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
//       const allTextData = [];

//       for (let i = 1; i <= pdf.numPages; i++) {
//         const page = await pdf.getPage(i);
//         const content = await page.getTextContent();
//         const hasText = content.items.some((item) => item.str.trim());

//         if (hasText) {
//           const textItems = content.items.map((item) => item.str).join(" ");
//           allTextData.push(`Page ${i} (Digital Text):\n${textItems}`);
//         } else {
//           const viewport = page.getViewport({ scale: 2 });
//           const canvas = document.createElement("canvas");
//           const context = canvas.getContext("2d");
//           canvas.width = viewport.width;
//           canvas.height = viewport.height;

//           await page.render({ canvasContext: context, viewport }).promise;

//           const {
//             data: { text: ocrText },
//           } = await Tesseract.recognize(canvas, "eng", {
//             logger: (m) => console.log(`[OCR Page ${i}]`, m.status, m.progress),
//           });

//           allTextData.push(`Page ${i} (OCR):\n${ocrText}`);
//         }
//       }

//       setText(allTextData.join("\n\n"));
//       const structuredData = await processWithOpenAI(allTextData.join("\n\n"));
//       setProcessedData(structuredData);
//       setLoading(false);
//     };

//     reader.readAsArrayBuffer(selectedFile);
//   };

//   const handleUserTypeChange = (event) => {
//     setUserType(event.target.value);
//   };
//   // \=========================================================================
//   const queryClient = new QueryClient();

//   const fetchSuppliers = async () => {
//     const token = Cookies.get("token");
//     const sanctumToken = `Bearer ${token?.replace(/"/g, "")}`;

//     const response = await axios.get(
//       `${process.env.REACT_APP_URL}/api/getSuppliers`,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: sanctumToken,
//         },
//       }
//     );

//     return response.data;
//   };
//   const {
//     data: suppliers,
//     isLoading,
//     isError,

//     refetch,
//   } = useQuery({
//     queryKey: ["suppliers"],
//     queryFn: fetchSuppliers,
//     // staleTime: 60 * 60 * 1000, // optional: cache data for 5 minutes
//   });
//   // console.log("Suppliers Data:", suppliers.data);
//   // ===============option supplier ==========================
//   const supplierOptions = suppliers?.data?.map((supplier) => ({
//     label: supplier.SupplierName,
//     id: supplier.SupplierID,
//     name: supplier.SupplierName,
//     contactPerson: supplier.ContactPerson,
//     MobileNo1: supplier.MobileNo1,
//     address: `${supplier.AddressLine1 == null ? "" : supplier.AddressLine1} ${
//       suppliers.data.AddressLine2 == null ? "" : suppliers.data.AddressLine2
//     }`,
//     company: supplier.companyName,
//     bank: `${supplier.BankName == null ? "" : supplier.BankName} ${
//       supplier.AccountNumber == null ? "" : supplier.AccountNumber
//     } Ifsc: ${supplier.IFSCCode == null ? "" : supplier.IFSCCode}`,
//   }));
//   // \=========================================================================

//   const renderInvoiceTable = () => {
//     if (!processedData) return null;

//     // console.log("processedData type:", typeof processedData);
//     // console.log("processedData value:", processedData);

//     try {
//       let parsedData = processedData;

//       // Only attempt to parse if it's a string and looks like JSON
//       if (typeof processedData === "string") {
//         try {
//           parsedData = JSON.parse(processedData);
//           console.log("Parsed processedData:", parsedData);
//         } catch (err) {
//           console.error("Failed to parse JSON:", err);
//           return (
//             <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
//               <div>Error: Invalid data format</div>
//             </Paper>
//           );
//         }
//       }

//       // Validate that parsedData is an object or array
//       if (typeof parsedData !== "object" || parsedData === null) {
//         return (
//           <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
//             <div>Error: Invalid data structure</div>
//           </Paper>
//         );
//       }

//       return (
//         <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
//           <InvoiceTable invoiceData={parsedData} />
//         </Paper>
//       );
//     } catch (err) {
//       console.error("Error parsing invoice data:", err);
//       return null;
//     }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
//         <FormControl sx={{ minWidth: 200 }}>
//           <InputLabel id="user-type-label">User Type</InputLabel>
//           <MuiSelect
//             labelId="user-type-label"
//             id="user-type"
//             value={userType}
//             label="User Type"
//             onChange={handleUserTypeChange}
//           >
//             <MenuItem value="supplier">Supplier</MenuItem>
//             <MenuItem value="customer">Customer</MenuItem>
//             <MenuItem value="subdealer">Subdealer</MenuItem>
//           </MuiSelect>
//         </FormControl>
//         <Box sx={{ minWidth: 200 }}>
//           <Controller
//             name="SupplierId"
//             control={control}
//             render={({ field }) =>
//               renderSelectComponent(
//                 null,
//                 field,
//                 supplierOptions,
//                 "Select Supplier",
//                 (selectedOption) => {
//                   setValue(
//                     "SupplierId",
//                     selectedOption ? selectedOption.id : ""
//                   );
//                   setSupplierSelect(selectedOption);
//                 }
//               )
//             }
//           />
//         </Box>
//       </div>
//       <h2>Upload PDF and Extract Text (Digital + OCR)</h2>
//       {error && (
//         <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
//       )}
//       <input type="file" accept="application/pdf" onChange={handleFile} />
//       <button
//         onClick={async () => {
//           if (!text) {
//             setError("Please upload a PDF file first");
//             return;
//           }
//           setLoading(true);
//           try {
//             const result = await processWithOpenAI(text);
//             setProcessedData(result);
//           } catch (error) {
//             setError("Failed to process with OpenAI. Please try again.");
//           }
//           setLoading(false);
//         }}
//       >
//         Upload
//       </button>
//       {loading ? (
//         <p>Processing PDF, please wait...</p>
//       ) : (
//         <div>
//           <h3>Extracted Text:</h3>
//           <pre style={{ whiteSpace: "pre-wrap", marginTop: "20px" }}>
//             {text}
//           </pre>
//           {processedData && (
//             <>
//               <h3>Processed Data (OpenAI):</h3>
//               <pre style={{ whiteSpace: "pre-wrap", marginTop: "20px" }}>
//                 {JSON.stringify(processedData, null, 2)}
//               </pre>
//             </>
//           )}
//         </div>
//       )}
//       {renderInvoiceTable()}
//     </div>
//   );
// };

// export default Pdf;
