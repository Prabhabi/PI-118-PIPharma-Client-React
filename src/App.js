import React, { useState, useEffect, useMemo } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Box, useMediaQuery } from "@mui/material";
import Navbar from "./components/Navbar";
import Drawer from "./components/Drawer";
import Welcome from "./pages/Welcome";
import LoginPage from "./pages/signIN/LoginPage";
import SignupPage from "./pages/signIN/SignupPage";
import Quotation from "./pages/purchase/quotation/Quotation";
import Delivery from "./pages/purchase/Delivery";
import ReturnOut from "./pages/purchase/Returnout/ReturnOut";
import DamageSales from "./pages/sales/DamageSale/DamageSale";
import NotPage from "./components/NotPage";
import UserProfile from "./components/UserProfile";
import NavItem from "./components/NavItem";
import Suppliers from "./pages/purchase/supplier/Suppliers";
import SubDealer from "./pages/purchase/subDeler/SubDealer";
import ProductPage from "./pages/purchase/productPage/ProductPage";
import CustomerList from "./pages/sales/customers/Customer";
import Manage from "./components/CompanyManage/CompanyManage";
import AdvanceORder from "./pages/sales/AdvncedORder/AdvncedORder";
import InvoicePur from "./pages/purchase/invoice/InvoicePur";
import InvoiceSales from "./pages/sales/invoice/InvoiceSales";
// import { BackHand } from "@mui/icons-material";
import Test from "./components/Test";
import Test1 from "./components/Test1";
import Test2 from "./components/Test2";
import Dashboard from "./pages/Dashboard copy";
import PurchaseGraph from "./pages/purchaseGraph/PurchaseGraph";
import Inventor from "./pages/inventory/Inventory";
import MoneyRecipt from "./pages/purchase/moneyRecipt/MoneyRecipt";
import SalesGraph from "./pages/salesGraph/SalesGraph";
import Help from "./pages/Help";
import { ThemeProvider } from "@emotion/react";
import { getTheme } from "./lib/theme";
import  EXpiry  from "./pages/purchase/EXpiry/EXpiry";
import { light } from "@mui/material/styles/createPalette";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentSection, setCurrentSection] = useState("purchase");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 900px)");

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    if (loggedInStatus === "true") {
      setIsLoggedIn(true);
    }
  }, []);
  // ========== dark or light mode ==========
  const [mode, setMode] = useState("light");
  const theme = useMemo(() => getTheme(mode), [mode]);

  const handleLogin = () => {};

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem("isLoggedIn", "false");
  };

  const availableRoutes = [
    "/",
    "/login",
    "/signup",
    "/suppliers",
    "/purchase",
    "/sales",
    "/hm",
    "/user",
    "/quotations",
    "/delivery",
    "/return-out",
    "/damage-purchase",
    "/damage-sales",
    "/inventory",
    "/productpage",
    "/customer",
    "/invoicep",
    "/invoices",
    "/damageSales",
    "/return-in",
    "/manage",
    "/subdealer",
    "/moneyrecipt",
    "/advanceOrder",
    "/working",
    "/notWorking",
    "/notWorking2",
    "/notFound",
    "/expiry",

  ];

  const isWelcomePage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";
  const isNotFoundPage = !availableRoutes.includes(location.pathname);

  const showAvatarMenu = !(
    isWelcomePage ||
    isLoginPage ||
    isSignupPage ||
    isNotFoundPage
  );

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  const cache = localStorage.getItem("REACT_QUERY_OFFLINE_CACHE");
  if (cache) {
    const sizeInBytes = new Blob([cache]).size;
    const sizeInKB = sizeInBytes / 1024;
    const sizeInMB = sizeInKB / 1024;

    console.log(
      `Cache size: ${sizeInBytes} bytes (${sizeInKB.toFixed(2)} KB / ${sizeInMB.toFixed(2)} MB)`
    );
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <Box sx={{ overflowX: "hidden" }}>
          {/* Show Drawer based on screen size */}
          {!isWelcomePage &&
            !isLoginPage &&
            !isSignupPage &&
            !isNotFoundPage && (
              <Box>
                <Drawer
                  setCurrentSection={setCurrentSection}
                  isDrawerOpen={isDrawerOpen}
                  toggleDrawer={toggleDrawer}
                  isMobile={isMobile}
                />
                <Navbar
                  currentSection={currentSection}
                  setCurrentSection={setCurrentSection}
                  handleLogout={handleLogout}
                  isLoggedIn={isLoggedIn}
                  showAvatarMenu={showAvatarMenu}
                  toggleDrawer={toggleDrawer}
                  isMobile={isMobile}
                />
              </Box>
            )}
          <Box
            sx={{
              flexDirection: "column",
              ml: { xs: 0, sm: 0, md: "240px", lg: "240px" },
              // mt: "20px",
            }}
          >
            {!isWelcomePage &&
              !isLoginPage &&
              !isSignupPage &&
              !isNotFoundPage && (
                <Box>
                  <NavItem
                    currentSection={currentSection}
                    setCurrentSection={setCurrentSection}
                  />
                </Box>
              )}

            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route
                path="/login"
                element={<LoginPage handleLogin={handleLogin} />}
              />
              {/* Other routes */}
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/purchase" element={<PurchaseGraph />} />
              <Route path="/sales" element={<SalesGraph />} />
              <Route path="/hm" element={<Dashboard />} />
              <Route path="/user" element={<UserProfile />} />
              <Route path="/quotations" element={<Quotation />} />
              <Route path="/delivery" element={<Delivery />} />
              <Route path="/return-out" element={<ReturnOut />} />
              {/* <Route path="/damage-purchase" element={<DamagePurchase />} /> */}
              <Route path="/damage-sales" element={<DamageSales />} />
              <Route path="/inventory" element={<Inventor />} />
              <Route path="/productpage" element={<ProductPage />} />
              <Route path="/customer" element={<CustomerList />} />
              <Route path="/invoicep" element={<InvoicePur />} />
              <Route path="/invoices" element={<InvoiceSales />} />
              <Route path="/manage" element={<Manage />} />
              <Route path="/subdealer" element={<SubDealer />} />
              <Route path="moneyrecipt" element={<MoneyRecipt />} />
              <Route path="/advanceOrder" element={<AdvanceORder />} />
              <Route path="/working" element={<Test />} />
              <Route path="/notWorking" element={<Test1 />} />
              <Route path="/notWorking2" element={<Test2 />} />
              <Route path="notFound" element={<NotPage />} />
              <Route path="help" element={<Help />} />
              <Route path="/expiry" element={<EXpiry />} />
              {/* Wildcard route */}
              <Route path="*" element={<NotPage />} /> 
            </Routes>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
};

const WrappedApp = () => (
  <Router>
    <App />
  </Router>
);

export default WrappedApp;
