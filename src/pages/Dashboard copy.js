import React from "react";
import InvoiceGraph from "./purchaseGraph/component/invoiceGraph/InvoiceGraph";
import GstGraph from "./purchaseGraph/component/gstgraph/GstGraph";
import QuotationGraph from "./purchaseGraph/component/quotationGraph/QuotaitonGraph";
import { Stack } from "@mui/material";

export default function Dashboard() {
  return (
    <div>
      <Stack direction="row" spacing={2} sx={{ p: 2 }}>
        <GstGraph />
        <QuotationGraph />
        <InvoiceGraph />
      </Stack>
    </div>
  );
}
