import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Avtar from "./Avtarmenu";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";

import {
  subDealerListApiFn,
  advbListApiFn,
  advbSalesCustGraphApiFn,
  advbSalesSubdGraphApiFn,
  advbSalesYearGraphApiFn,
  customerListApiFn,
  gstSalesGraphApiFn,
  incoiceSalesYearGraphApiFn,
  invoiceListApiFn,
  invoiceSalesCustGraphApiFn,
  invoiceSalesSubdGraphApiFn,
  moneyReciptListApiFn,
  moneyReciptSalesGraphApiFn,
  damageListSalesApiFn,
  moneyReciptYearWiseGraphApiFn,
} from "../api/salesApi";
import {
  supplierListApiFn,
  dueGraphApiFn,
  gstGraphApiFn,
  incoicePurYearGraphApiFn,
  inventoryGraphApiFn,
  invoicePurGraphApiFn,
  invoicePurListApiFn,
  productListApiFn,
  quoPurYearGraphApiFn,
  quotationGraphApiFn,
  quotationtListApiFn,
  inventoryListApiFn,
  damageListApiFn,
  allTransuctionListApiFn,
  purchaseTransuctionListApiFn,
  PurchaseReturTransuctionListApiFn,
  saleTransuctionListApiFn,
  damageSupplierListApiFn,
  SaleReturnTransuctionListApiFn,
} from "../api/purchaseApi";
import {
  signatoryMasterApiFn,
  companyMasterApiFn,
  hsnMasterApiFn,
  paymentMasterApiFn,
  brandMasterApiFn,
  colorMasterApiFn,
  deaseseApiFn,
} from "../api/commonApi";

const Navbar = ({ handleLogout, showAvatarMenu, toggleDrawer, isMobile }) => {
  // Select only the user object from the Redux state
  const user = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Redirect to home page if user data is not available
  useEffect(() => {
    if (!user?.user) {
      navigate("/");
    }
  }, [user, navigate]);
  // ====================================prefetch==========================================
  const queryClient = useQueryClient();

  // Add state for loading progress
  const [prefetchProgress, setPrefetchProgress] = useState(0);
  const [prefetchDone, setPrefetchDone] = useState(false);
  const [currentApiName, setCurrentApiName] = useState(""); // Track current API name
  const [timeoutApi, setTimeoutApi] = useState(null); // Track timeout API
  const [isRetrying, setIsRetrying] = useState(false); // Track if retrying
  const [refetchAllTrigger, setRefetchAllTrigger] = useState(0); // Trigger for full refetch

  // Split APIs into critical (needed for initial render) and background (graphs, reports, etc.)
  const criticalApis = [
    { queryKey: ["customerListApi"], queryFn: customerListApiFn },
    { queryKey: ["supplierListApi"], queryFn: supplierListApiFn },
    { queryKey: ["productListApi"], queryFn: productListApiFn },
    { queryKey: ["invoiceListApi"], queryFn: invoiceListApiFn },
    { queryKey: ["invoicePurListApi"], queryFn: invoicePurListApiFn },
    { queryKey: ["inventoryListApi"], queryFn: inventoryListApiFn },
    { queryKey: ["quotationListApi"], queryFn: quotationtListApiFn },
    { queryKey: ["allTransuctionListApi"], queryFn: allTransuctionListApiFn },
    { queryKey: ["deaseseApi"], queryFn: deaseseApiFn },

    {
      queryKey: ["purchaseTransuctionListApi"],
      queryFn: purchaseTransuctionListApiFn,
    },
    { queryKey: ["saleTransuctionListApi"], queryFn: saleTransuctionListApiFn },
    {
      queryKey: ["purchaseReturnTransuctionListApi"],
      queryFn: PurchaseReturTransuctionListApiFn,
    },
    {
      queryKey: ["saleReturnTransuctionListApi"],
      queryFn: SaleReturnTransuctionListApiFn,
    },
    { queryKey: ["damageListApi"], queryFn: damageListApiFn },
    { queryKey: ["damageSupplierListApi"], queryFn: damageSupplierListApiFn },
    { queryKey: ["hsnMasterApi"], queryFn: hsnMasterApiFn },
    { queryKey: ["paymentMasterApi"], queryFn: paymentMasterApiFn },
    { queryKey: ["signatoryMasterApi"], queryFn: signatoryMasterApiFn },
    { queryKey: ["companyMasterApi"], queryFn: companyMasterApiFn },
    { queryKey: ["brandMasterApi"], queryFn: brandMasterApiFn },
    { queryKey: ["colorMasterApi"], queryFn: colorMasterApiFn },
  ];

  const backgroundApis = [
    // purchase graph
    { queryKey: ["inventoryGraphApi"], queryFn: inventoryGraphApiFn },
    { queryKey: ["gstGraphApi"], queryFn: gstGraphApiFn },
    { queryKey: ["quotationGraphApi"], queryFn: quotationGraphApiFn },
    { queryKey: ["invoicePurGraphApi"], queryFn: invoicePurGraphApiFn },
    { queryKey: ["quoPurYearGraphApi"], queryFn: quoPurYearGraphApiFn },
    { queryKey: ["incoicePurYearGraphApi"], queryFn: incoicePurYearGraphApiFn },
    { queryKey: ["dueGraphApi"], queryFn: dueGraphApiFn },
    // sales main
    { queryKey: ["subDealerListApi"], queryFn: subDealerListApiFn },
    { queryKey: ["advbListApi"], queryFn: advbListApiFn },
    { queryKey: ["moneyReciptListApi"], queryFn: moneyReciptListApiFn },
    { queryKey: ["damageListSalesApi"], queryFn: damageListSalesApiFn },
    // sales graph
    {
      queryKey: ["incoiceSalesYearGraphApi"],
      queryFn: incoiceSalesYearGraphApiFn,
    },
    { queryKey: ["gstSalesGraphApi"], queryFn: gstSalesGraphApiFn },
    {
      queryKey: ["moneyReciptSalesGraphApi"],
      queryFn: moneyReciptSalesGraphApiFn,
    },
    { queryKey: ["advbSalesCustGraphApi"], queryFn: advbSalesCustGraphApiFn },
    { queryKey: ["advbSalesSubdGraphApi"], queryFn: advbSalesSubdGraphApiFn },
    { queryKey: ["advbSalesYearGraphApi"], queryFn: advbSalesYearGraphApiFn },
    {
      queryKey: ["invoiceSalesCustGraphApi"],
      queryFn: invoiceSalesCustGraphApiFn,
    },
    {
      queryKey: ["invoiceSalesSubdGraphApi"],
      queryFn: invoiceSalesSubdGraphApiFn,
    },
    {
      queryKey: ["moneyReciptYearWiseGraphApi"],
      queryFn: moneyReciptYearWiseGraphApiFn,
    },
  ];

  // Helper to prefetch APIs in parallel (background only, use prefetchQuery)
  const prefetchInParallel = async (apiList) => {
    await Promise.all(
      apiList.map(({ queryKey, queryFn }) =>
        queryClient
          .prefetchQuery({
            queryKey,
            queryFn,
            staleTime: Infinity,
            cacheTime: Infinity,
          })
          .catch(() => {})
      )
    );
  };

  // Helper to chunk array
  const chunk = (arr, size) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );

  // Prefetch background APIs in chunks
  const prefetchChunksSequentially = async () => {
    const backgroundApiChunks = chunk(backgroundApis, 5);
    for (const chunkApis of backgroundApiChunks) {
      await prefetchInParallel(chunkApis);
      await new Promise((res) => setTimeout(res, 500)); // Delay to reduce pressure
    }
  };

  // Helper to prefetch a single API with timeout (critical only, use ensureQueryData)
  const prefetchWithTimeout = async ({ queryKey, queryFn }) => {
    return new Promise(async (resolve, reject) => {
      let timeoutId = setTimeout(() => {
        setTimeoutApi({ queryKey, queryFn });
        reject(new Error("Timeout"));
      }, 45000); // 45 seconds

      try {
        await queryClient.ensureQueryData({
          queryKey,
          queryFn,
          staleTime: Infinity,
          cacheTime: Infinity,
        });
        clearTimeout(timeoutId);
        resolve();
      } catch (e) {
        clearTimeout(timeoutId);
        reject(e);
      }
    });
  };

  // Optimized prefetch logic
  useEffect(() => {
    // Prevent double execution in development (React.StrictMode)
    let didRun = false;
    if (didRun) return;
    didRun = true;

    let completed = 0;
    setPrefetchProgress(0);
    setPrefetchDone(false);
    setCurrentApiName("");
    setTimeoutApi(null);

    const loadCritical = async () => {
      for (const api of criticalApis) {
        setCurrentApiName(api.queryKey[0]);
        try {
          await prefetchWithTimeout(api);
        } catch (e) {
          if (e.message === "Timeout") return;
        }
        completed += 1;
        setPrefetchProgress(
          Math.round((completed / criticalApis.length) * 100)
        );
      }
      setPrefetchDone(true); // UI can continue
      setCurrentApiName("");
      // Fire background APIs in chunks
      prefetchChunksSequentially();
    };

    loadCritical();
    // eslint-disable-next-line
  }, [isRetrying, refetchAllTrigger]);

  // Retry handler for timed out API (critical only)
  const handleRetryTimeoutApi = async () => {
    if (!timeoutApi) return;
    setIsRetrying(true);
    setTimeoutApi(null);
    setCurrentApiName(timeoutApi.queryKey[0]);
    try {
      await prefetchWithTimeout(timeoutApi);
      // After retry, continue prefetching the rest of critical APIs
      let completed =
        criticalApis.findIndex(
          (item) => item.queryKey[0] === timeoutApi.queryKey[0]
        ) + 1;
      setPrefetchProgress(Math.round((completed / criticalApis.length) * 100));
      for (let i = completed; i < criticalApis.length; i++) {
        setCurrentApiName(criticalApis[i].queryKey[0]);
        try {
          await prefetchWithTimeout(criticalApis[i]);
        } catch (e) {
          if (e.message === "Timeout") return;
        }
        setPrefetchProgress(Math.round(((i + 1) / criticalApis.length) * 100));
      }
      setPrefetchDone(true);
      setCurrentApiName("");
      // Fire background APIs in chunks
      prefetchChunksSequentially();
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <>
      <AppBar position="fixed" sx={{ bgcolor: "#0078CF" }}>
        <Toolbar>
          {/* Mobile menu button */}
          <img
            // onClick={() => navigate("/help")}
            onClick={() => navigate("/purchase")}
            src="img/logo/millan.png"
            alt="prabhabiLogo"
            style={{
              width: "35px",
              height: "35px",
              backgroundColor: "white",
              borderRadius: "50%",
              padding: ".3rem",
              marginRight: "1.5rem",
              cursor: "pointer",
            }}
          />
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer} // Toggle drawer when clicked
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Home Icon */}
          {/* <IconButton
          edge="start"
          color="inherit"
          aria-label="home"
          component={Link}
          to="/hm"
        >
          <HomeIcon />
        </IconButton> */}
          <p>Welcome, {user?.user?.name}</p>

          {/* Date and Time Section */}
          <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
            {/* Date Container
          <Box
            sx={{
              p: 1.5,
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              mr: 2,
            }}
          >
            
            <Typography
              variant="body2"
              sx={{ color: "#eee", fontWeight: "bold", fontSize: "0.9rem" }}
            >
              {currentDate}
            </Typography>
          </Box> */}
          </Box>
          {/* <button
            onClick={() => localStorage.removeItem("REACT_QUERY_OFFLINE_CACHE")}
          >
            Clear React Query Cache
          </button> */}

          {/* Avatar Menu */}
          <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
            {/* Loader beside avatar */}
            {!prefetchDone && (
              <Box
                sx={{
                  mr: 2,
                  display: "inline-flex",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                {/* Show current API name first */}
                <span
                  style={{
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: "bold",
                    marginRight: 12,
                    whiteSpace: "nowrap",
                  }}
                >
                  {timeoutApi
                    ? timeoutApi.queryKey[0] + " (Timeout)"
                    : currentApiName}
                </span>
                {/* Progress bar to the right of API name */}
                <Box sx={{ position: "relative", display: "inline-flex" }}>
                  <CircularProgress
                    variant="determinate"
                    value={prefetchProgress}
                    size={36}
                    thickness={4}
                    sx={{ color: "#fff" }}
                  />
                  {/* Percentage in the center of the circle */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      {`${prefetchProgress}%`}
                    </span>
                  </Box>
                </Box>
                {/* Show refresh and refetch all buttons if timeout */}
                {timeoutApi && (
                  <>
                    <button
                      style={{
                        marginLeft: 12,
                        background: "#fff",
                        color: "#0078CF",
                        border: "none",
                        borderRadius: 4,
                        padding: "4px 10px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                      onClick={handleRetryTimeoutApi}
                      disabled={isRetrying}
                    >
                      {isRetrying ? "Retrying..." : "Refresh"}
                    </button>
                    <button
                      style={{
                        marginLeft: 8,
                        background: "#fff",
                        color: "#d32f2f",
                        border: "none",
                        borderRadius: 4,
                        padding: "4px 10px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setIsRetrying(false);
                        setTimeoutApi(null);
                        setPrefetchProgress(0);
                        setPrefetchDone(false);
                        setCurrentApiName("");
                        setRefetchAllTrigger((v) => v + 1); // trigger full refetch
                      }}
                      disabled={isRetrying}
                    >
                      Refetch All
                    </button>
                  </>
                )}
              </Box>
            )}
            {showAvatarMenu && (
              <Avtar
                handleLogout={handleLogout}
                alt="Remy Sharp"
                src="img/avtar.jpg"
              />
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
