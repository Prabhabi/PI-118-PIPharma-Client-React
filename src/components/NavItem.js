import React, { useEffect, useState } from "react";
import { Button, Box } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { styled } from "@mui/system";
import {
  ShoppingCart,
  People,
  Receipt,
  Storefront,
  History,
  Inventory,
  Category,
} from "@mui/icons-material";
import NavigateNextIcon from "@mui/icons-material/ArrowForwardIos";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import TimelineIcon from "@mui/icons-material/Timeline";
import BrokenImageIcon from "@mui/icons-material/BrokenImage";

// Add this before the NavItem component
const IconContainer = styled("div")(({ color }) => ({
  backgroundColor: color,
  borderRadius: "50%",
  padding: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& svg": {
    fontSize: "20px",
    color: "white",
  },
}));

// NavItem Component - Will render the navbar items based on the current section (purchase or sales)
const NavItem = () => {
  const location = useLocation();
  const navContainerRef = React.useRef(null);

  const purchasePaths = [
    "/purchase",
    "/suppliers",
    "/quotations",
    "/invoicep",
    "/inventory",
    "/productpage",
    "/damage-purchase",
    "/expiry",
  ];

  // Determine the current section based on the exact URL path
  const [currentSection, setCurrentSection] = useState(() => {
    return purchasePaths.includes(location.pathname) ? "purchase" : "sales";
  });

  useEffect(() => {
    // Update the current section when the URL changes
    setCurrentSection(
      purchasePaths.includes(location.pathname) ? "purchase" : "sales"
    );
  }, [location.pathname]);

  const purchaseItems = [
    { name: "OverView", path: "/purchase", icon: <TimelineIcon /> },

    { name: "Suppliers", path: "/suppliers", icon: <Storefront /> },
    { name: "Quotations", path: "/quotations", icon: <ShoppingCart /> },

    { name: "Invoice", path: "/invoicep", icon: <Receipt /> },
    { name: "Inventory", path: "/inventory", icon: <Inventory /> },
    { name: "Product Page", path: "/productpage", icon: <Category /> },
    { name: "Expiry", path: "/expiry", icon: <Category /> },
    // {
    //   name: "Damage Page",
    //   path: "/damage-purchase",
    //   icon: <BrokenImageIcon />,
    // },
  ];

  const salesItems = [
    { name: "OverView", path: "/sales", icon: <TimelineIcon /> },

    { name: "Customer", path: "/customer", icon: <People /> },
    { name: "Doctors", path: "/subdealer", icon: <Category /> },

    // { name: "Advance Order", path: "/advanceOrder", icon: <ShoppingCart /> },
    { name: "Invoice", path: "/invoices", icon: <Receipt /> },
    {
      name: "Order Request",
      path: "/moneyrecipt",
      icon: <CurrencyRupeeIcon />,
    },
    {
      name: "Return",
      path: "/damage-sales",
      icon: <BrokenImageIcon />,
    },
  ];

  const navItems =
    currentSection === "purchase"
      ? purchaseItems
      : currentSection === "sales"
        ? salesItems
        : [];

  const scrollLeft = () => {
    if (navContainerRef.current) {
      navContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (navContainerRef.current) {
      navContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const getIconColor = (name) => {
    const colors = {
      OverView: "#FF6B6B",
      Suppliers: "#4ECDC4",
      Quotations: "#45B7D1",
      Invoice: "#96CEB4",
      Inventory: "#D4A5A5",
      "Product Page": "#9B59B6",
      Customer: "#3498DB",
      "Sub Dealer": "#E67E22",
      // "Advance Order": "#2ECC71",
      "Order Reques": "#F1C40F",
    };
    return colors[name] || "#95A5A6";
  };

  return (
    <Box
      position="relative"
      sx={{
        mt: 7,
        bgcolor: "white",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        // bgcolor: "red",
      }}
    >
      <NavButtonEdge onClick={scrollLeft} position="left">
        <NavigateNextIcon sx={{ transform: "rotate(180deg)", ml: 1 }} />
      </NavButtonEdge>
      <NavItemsContainer ref={navContainerRef} sx={{ paddingX: 6 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavButton
              key={item.name}
              component={Link}
              to={item.path}
              style={{ textTransform: "none" }}
              $active={isActive}
            >
              <IconContainer color={getIconColor(item.name)}>
                {item.icon}
              </IconContainer>
              {item.name}
            </NavButton>
          );
        })}
      </NavItemsContainer>
      <NavButtonEdge onClick={scrollRight} position="right">
        <NavigateNextIcon sx={{ color: "green", mr: 1 }} />
      </NavButtonEdge>
    </Box>
  );
};

// Styled components for the navbar items
const NavItemsContainer = styled("div")({
  display: "flex",
  overflowX: "scroll", // Keep scrolling enabled
  whiteSpace: "nowrap", // Prevent items from wrapping
  marginTop: "10px", // Space between existing Navbar and new NavItem section
  paddingLeft: "10px", // Create a gap between the left button and nav items
  paddingRight: "10px", // Create a gap between the right button and nav items
  // justifyContent: "center", // Center align the items
  padding: "0 20px", // Add horizontal padding
  "&::-webkit-scrollbar": {
    display: "none", // Hide the scrollbar for Webkit-based browsers
  },
  scrollbarWidth: "none", // For Firefox to hide scrollbar
});

const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "$active" && prop !== "active",
})(({ $active }) => ({
  color: "green",
  padding: "8px 16px",
  textTransform: "none",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  flexShrink: 0,
  minWidth: "auto",
  backgroundColor: "white !important", // Force white background
  "&:hover": {
    backgroundColor: "rgba(0, 128, 0, 0.1) !important",
    color: "green",
  },
  "&:active": {
    color: "green",
    backgroundColor: "rgba(0, 128, 0, 0.2) !important",
    textDecoration: "underline",
  },
  ...($active && {
    color: "green",
    borderBottom: "2px solid green",
  }),
}));

const NavButtonEdge = styled(Button)(({ position }) => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  [position]: "-10px", // Move the buttons slightly outside the container
  zIndex: 1,
  minWidth: "40px", // Ensure the button has a minimum width

  backgroundColor: "white !important", // Force white background

  "&:hover": {
    backgroundColor: "green !important", // Changed hover background color to green
    "& .MuiSvgIcon-root": {
      color: "white", // Change icon color to white on hover
    },
  },
}));

export default NavItem;
