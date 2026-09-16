import React, { useEffect, useState } from "react";
import { Box, Typography, Stack } from "@mui/material";

import ListAltIcon from "@mui/icons-material/ListAlt";
import ProductCreateDialog from "./component/ProductCreateDialog";
import ProductTable from "./component/ProductTable";
import axios from "axios";
import LoadingComp from "../../../components/loadingComp/LoadingComp";
import Cookies from "js-cookie"; // Import Cookies
import { productListApiFn } from "../../../api/purchaseApi";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useTheme } from "@emotion/react";
import TestSearchCreate from "./component/TestSearchCreate";
import { deaseseApiFn } from "../../../api/commonApi";

const ProductPage = () => {
  // const [dataa, setDataa] = useState([]);
  // const [loading, setLoading] = useState(true);

  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

  // const fetchProduct = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_URL}/api/getProductModels`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: sanctumToken,
  //         },
  //       }
  //     );
  //     setData(response.data);
  //     setLoading(false);
  //   } catch (error) {
  //     // console.error("Error fetching data:", error);
  //   }
  // };
  // useEffect(() => {
  //   fetchProduct();
  // }, []);
  // =======================================================================
  // const { data, isLoading, refetch } = useQuery({
  //   queryKey: ["productListApi"],
  //   queryFn: productListApiFn, // Same as in prefetch
  // });
  // const product = data?.data || [];
  // console.log(isLoading, "isLoading");
  // ========================================react query ===================================?
  const results = useQueries({
    queries: [
      {
        queryKey: ["deaseseApi"],
        queryFn: deaseseApiFn,
      },
      {
        queryKey: ["productListApi"],
        queryFn: productListApiFn, // Same as in prefetch
      },
    ],
  });
  const loading = results.some((result) => result.isLoading);

  // Destructure the responses
  const [diseaseQuery, productQuery] = results;

  const isLoading = diseaseQuery.isLoading || productQuery.isLoading || loading;

  const isError = diseaseQuery.isError || productQuery.isError;
  const diseaseData = diseaseQuery.data?.data?.data || [];
  const product = productQuery.data?.data || [];
  // console.log("categoryData", categoryData);
  // ++++++=============================================================================

  // ===========================================================================
  const theme = useTheme();
  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        bgcolor: theme.palette.background.main,
        minHeight: "100vh",
      }}
    >
      {/* Product Table */}
      <Stack direction="row" justifyContent="space-between">
        <Box></Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            marginBottom: 4,
            color: "#4D795B",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            color: "blue",
            mb: 6,
            fontSize: { xs: "1.8rem", sm: "2.125rem" },
          }}
        >
          <ListAltIcon sx={{ mr: 1, fontSize: "2.2rem", color: "blue" }} />
          Product List
        </Typography>
        <ProductCreateDialog fetchProduct={productQuery.refetch} />
      </Stack>
      <br />

      <ProductTable
        data={product}
        fetchProduct={productQuery.refetch}
        diseaseData={diseaseData}
      />
      <LoadingComp loading={isLoading} />
      {/* <TestSearchCreate /> */}
    </Box>
  );
};

export default ProductPage;
