import React, { useState } from "react";
import {
  List,
  Typography,
  Drawer as MuiDrawer,
  Dialog,
  Box,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import ProductMasterUpdate from "./MasterTableUpdate/ProductMasterUPdate/ProductMasterUpdate";
import HsnMasterUpdate from "./MasterTableUpdate/HsnMasterUpdate/HsnMasterUpdate";
import ColorMaster from "./MasterTableUpdate/ColorMasterUpdate/ColorMaster";
import AddressMasterUpdate from "./MasterTableUpdate/AddressMasterUpdate/AddressMasterUpdate";
import SignatoryMasterUpdate from "./MasterTableUpdate/SignatoryMasterUpdate/SignatoryMasterUpdate";
import InventoryMasterUpdate from "./MasterTableUpdate/InventoryMasterUpdate copy/InventoryMasterUpdate";
import PropertyMaster from "./MasterTableUpdate/Property Master/PropertyMaster";
import EmailMaster from "./MasterTableUpdate/EmailMaster/EmailTamplates"; // <-- Add this import
import CategoryIcon from "@mui/icons-material/Category";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import HomeIcon from "@mui/icons-material/Home";
import MedicationIcon from "@mui/icons-material/Medication";
import PersonIcon from "@mui/icons-material/Person";
import InventoryIcon from "@mui/icons-material/Inventory";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EmailIcon from "@mui/icons-material/Email";
import BusinessIcon from "@mui/icons-material/Business";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee"; // Add this import
import FeaturedPlayListIcon from "@mui/icons-material/FeaturedPlayList";
import SettingsDamageReturn from "./MasterTableUpdate/Property Master/SettingsPropertyMaster";
import DeaseseMaster from "./MasterTableUpdate/deaseseMaster/DeaseseMaster";
const Drawer = ({
  isDrawerOpen,
  toggleDrawer,
  setCurrentSection,
  isMobile,
}) => {
  const navigate = useNavigate();
  const location = useLocation(); // Add this line to get the current location
  const [masterTableOpen, setMasterTableOpen] = React.useState(false);
  const [productUpdateOpen, setProductUpdateOpen] = React.useState(false);
  const [hsnMasterUpdateOpen, setHsnMasterUpdateOpen] = React.useState(false);
  const [returnMaster, setReturnMaseter] = useState(false);
  const [colorMasterOpen, setColorMasterOpen] = React.useState(false);
  const [addressMasterUpdateOpen, setAddressMasterUpdateOpen] =
    React.useState(false);
  const [addinventoryMasterUpdateOpen, setInventoryMasterUpdateOpen] =
    React.useState(false);
  const [signatoryMasterUpdateOpen, setSignatoryMasterUpdateOpen] =
    React.useState(false);
  const [emailMasterOpen, setEmailMasterOpen] = useState(false); // <-- Add state
  const [openDamage, setOpenDamage] = React.useState(false);

  const handleMasterTableClick = () => setMasterTableOpen(!masterTableOpen);

  const handleProductUpdateOpen = () => setProductUpdateOpen(true);
  const handleProductUpdateClose = () => setProductUpdateOpen(false);
  const handleHsnMasterUpdateOpen = () => setHsnMasterUpdateOpen(true);
  const handleHsnMasterUpdateClose = () => setHsnMasterUpdateOpen(false);
  const handleColorMasterOpen = () => setColorMasterOpen(true);
  const handleColorMasterClose = () => setColorMasterOpen(false);
  const handleAddressMasterUpdateOpen = () => setAddressMasterUpdateOpen(true);
  const handleInventoryMasterOpen = () => setInventoryMasterUpdateOpen(true);
  const handleInventoryMasterUpdateClose = () =>
    setInventoryMasterUpdateOpen(false);

  const handleAddressMasterUpdateClose = () =>
    setAddressMasterUpdateOpen(false);
  const handleSignatoryMasterUpdateOpen = () =>
    setSignatoryMasterUpdateOpen(true);
  const handleSignatoryMasterUpdateClose = () =>
    setSignatoryMasterUpdateOpen(false);
  const handleOpenDamage = () => setOpenDamage(true);
  const handleCloseDamang = () => setOpenDamage(false);

  const isSalesPath = [
    "/sales",
    "/customer",
    "/advanceOrder",
    "/invoices",
    "/return-in",
    "/subdealer",
    "/damage-sales",
    "/moneyrecipt",
  ].includes(location.pathname);

  const isPurchasePath = [
    "/purchase",
    "/invoicep",
    "/quotations",
    "/suppliers",
    "/delivery",
    "/return-out",
    "/damage-purchase",
    "/inventory",
    "/productpage",
    "/expiry",
  ].includes(location.pathname);

  const isDamagePath = ["/damage", "/damage-purchase"].includes(
    location.pathname
  );

  const masterItems = [
    {
      title: "Product",
      icon: CategoryIcon,
      color: "#388e3c",
      onClick: handleProductUpdateOpen,
    },
    // {
    //   title: "HSN",
    //   icon: AssignmentIcon,
    //   color: "#1976d2",
    //   onClick: handleHsnMasterUpdateOpen,
    // },
    {
      title: "Disease",
      icon: MedicationIcon,
      color: "#d32f2f",
      onClick: handleColorMasterOpen,
    },
    {
      title: "Address",
      icon: HomeIcon,
      color: "#fbc02d",
      onClick: handleAddressMasterUpdateOpen,
    },
    {
      title: "Signatory",
      icon: PersonIcon,
      color: "#7b1fa2",
      onClick: handleSignatoryMasterUpdateOpen,
    },
    {
      title: "Inventory",
      icon: InventoryIcon,
      color: "#43a047",
      onClick: handleInventoryMasterOpen,
    },
    {
      title: "Property",
      icon: BusinessIcon,
      color: "#ff9800",
      onClick: () => setReturnMaseter(true),
    },
    {
      title: "P. Value",
      icon: FeaturedPlayListIcon,
      color: "#607d8b",
      onClick: handleOpenDamage,
    },
    {
      title: "Email",
      icon: EmailIcon,
      color: "#0288d1",
      onClick: () => setEmailMasterOpen(true),
    },
  ];

  return (
    <MuiDrawer
      anchor="left"
      open={isDrawerOpen}
      onClose={toggleDrawer} // This will close the drawer
      variant={isMobile ? "temporary" : "permanent"} // Temporary drawer on mobile, permanent on desktop
      sx={{
        "& .MuiDrawer-paper": {
          height: "calc(100vh - 65px)", // Adjust height to account for margin-top
          py: "20px",
          paddingTop: "10px",
          bgcolor: "#7fbbe7", // Skyblue with 10% opacity (keep original)
          mt: "65px",
          position: "fixed",
          width: 230, // Fixed width for drawer
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between", // Ensure content is spaced out
        },
      }}
    >
      <Box>
        {/* Milan Enterprise Title */}
        {/* <Typography
          variant="h6"
          gutterBottom
          sx={{
            color: "black",
            fontWeight: 300,
            paddingLeft: "5px",
            maxWidth: "100%",
            width: "100%",
            // margin: "auto",
            // bgcolor: "red",
            textAlign: "center",
          }}
        >
          Milan Enterprise&nbsp;&nbsp;
        </Typography>

        <Divider sx={{ borderBottomWidth: 2, borderColor: "#333" }} /> */}

        {/* Navigation List */}
        <List sx={{ mt: 2 }}>
          {/* Redesigned Purchase and Sales as full-width stacked boxes */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              mb: 2,
              width: "100%",
              maxWidth: "100%",
              mx: "auto",
            }}
          >
            {/* Purchase Box */}
            <Box
              sx={{
                background: isPurchasePath ? "#0078cf" : "#fff",
                borderRadius: "10px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                width: "100%",
                height: 60,
                minHeight: 60,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                cursor: "pointer",
                transition: "box-shadow 0.2s, transform 0.2s, background 0.2s",
                color: isPurchasePath ? "#fff" : "#222",
                px: 2,
                "&:hover": {
                  boxShadow: "0 2px 8px rgba(0,0,0,0.16)",
                  transform: "translateY(-2px) scale(1.04)",
                  background: isPurchasePath ? "#0078cf" : "#f5f5f5",
                },
              }}
              onClick={() => {
                setCurrentSection("purchase");
                navigate("/purchase");
              }}
            >
              <InventoryIcon
                sx={{
                  fontSize: "1.8rem",
                  color: isPurchasePath ? "#fff" : "#43a047",
                  mr: 1.5,
                  backgroundColor: isPurchasePath ? "#69f0ae" : "",
                  padding: "8px",
                  borderRadius: "50%",
                  transition: "all 0.2s",
                }}
              />
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  color: isPurchasePath ? "#fff" : "#222",
                  fontSize: "1rem",
                }}
              >
                Purchase
              </Typography>
            </Box>
            {/* Sales Box */}
            <Box
              sx={{
                background: isSalesPath ? "#0078cf" : "#fff",
                borderRadius: "10px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                width: "100%",
                height: 60,
                minHeight: 60,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                cursor: "pointer",
                transition: "box-shadow 0.2s, transform 0.2s, background 0.2s",
                color: isSalesPath ? "#fff" : "#222",
                px: 2,
                "&:hover": {
                  boxShadow: "0 2px 8px rgba(0,0,0,0.16)",
                  transform: "translateY(-2px) scale(1.04)",
                  background: isSalesPath ? "#0078cf" : "#f5f5f5",
                },
              }}
              onClick={() => {
                setCurrentSection("sales");
                navigate("/sales");
              }}
            >
              <CurrencyRupeeIcon
                sx={{
                  fontSize: "1.8rem",
                  color: isSalesPath ? "#fff" : "#388e3c",
                  mr: 1.5,
                  backgroundColor: isSalesPath ? "#69f0ae" : "",
                  padding: "8px",
                  borderRadius: "50%",
                  transition: "all 0.2s",
                }}
              />
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  color: isSalesPath ? "#fff" : "#222",
                  fontSize: "1rem",
                }}
              >
                Sales
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              // background: "#9ccc65", // Skyblue with 10% opacity
              borderRadius: "10px",
              p: 1,
            }}
          >
            <Box
              sx={{
                textAlign: "center",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "#000",
                  textAlign: "center",
                  mt: 2,
                  fontSize: "1rem",
                  color: "#016901",
                  fontWeight: "bold",
                  pt: 2,
                  py: 0.5,
                }}
              >
                Master List
              </Typography>
            </Box>
            <Box
              sx={{
                background: "#fff", // Changed to white
                borderRadius: "10px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)", // Added subtle shadow
                p: 1,
                mt: 1,
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 1,
                  justifyContent: "center",
                  // ✅ Removed maxHeight and overflow
                }}
              >
                {masterItems.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <Box
                      key={index}
                      sx={{
                        width: 54,
                        height: 54,
                        minWidth: 54,
                        minHeight: 54,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "box-shadow 0.2s, transform 0.2s",
                        cursor: "pointer",
                        "&:hover": {
                          boxShadow: "0 2px 8px rgba(0,0,0,0.16)",
                          transform: "translateY(-2px) scale(1.04)",
                          background: "#f5f5f5",
                        },
                      }}
                      onClick={item.onClick}
                    >
                      <IconComponent
                        sx={{ fontSize: "1.8rem", color: item.color }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 600,
                          color: "#222",
                          mt: 0.2,
                          fontSize: "10px",
                        }}
                      >
                        {item.title}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
          {/* Removed Master Data dropdown ListItem and Collapse */}
        </List>
      </Box>

      {/* Dialogs for each update */}
      <Dialog
        open={productUpdateOpen}
        onClose={handleProductUpdateClose}
        fullWidth
        maxWidth="md"
      >
        <ProductMasterUpdate onClose={handleProductUpdateClose} />
      </Dialog>

      <Dialog
        open={hsnMasterUpdateOpen}
        onClose={handleHsnMasterUpdateClose}
        fullWidth
        maxWidth="md"
      >
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              cursor: "pointer",
              zIndex: 1,
            }}
            onClick={handleHsnMasterUpdateClose}
          ></Box>
          <HsnMasterUpdate
            handleHsnMasterUpdateClose={handleHsnMasterUpdateClose}
          />
        </Box>
      </Dialog>

      <Dialog
        open={colorMasterOpen}
        onClose={handleColorMasterClose}
        fullWidth
        maxWidth="md"
      >
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              cursor: "pointer",
              zIndex: 1,
            }}
            onClick={handleColorMasterClose}
          ></Box>

          <DeaseseMaster handleColorMasterClose={handleColorMasterClose} />
        </Box>
      </Dialog>

      <Dialog
        open={addressMasterUpdateOpen}
        onClose={handleAddressMasterUpdateClose}
        fullWidth
        maxWidth="md"
      >
        <AddressMasterUpdate handleClose={handleAddressMasterUpdateClose} />
      </Dialog>
      {/* ======================================================= */}
      <Dialog
        open={signatoryMasterUpdateOpen}
        onClose={handleSignatoryMasterUpdateClose}
        fullWidth
        maxWidth="md"
      >
        <SignatoryMasterUpdate
          handleSignatoryMasterUpdateClose={handleSignatoryMasterUpdateClose}
        />{" "}
      </Dialog>
      {/* ======================================================= */}
      <Dialog
        open={addinventoryMasterUpdateOpen}
        onClose={handleInventoryMasterUpdateClose}
        fullWidth
        maxWidth="md"
      >
        <InventoryMasterUpdate
          handleInventoryMasterUpdateClose={handleInventoryMasterUpdateClose}
        />{" "}
      </Dialog>
      {/* ========================================================== */}
      <Dialog
        open={returnMaster}
        onClose={() => setReturnMaseter(false)}
        fullWidth
        maxWidth="md"
      >
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              cursor: "pointer",
              zIndex: 1,
            }}
            onClick={() => setReturnMaseter(false)}
          ></Box>
          <PropertyMaster onClose={() => setReturnMaseter(false)} />{" "}
        </Box>
      </Dialog>
      {/* Email Master Dialog */}
      <Dialog
        open={emailMasterOpen}
        onClose={() => setEmailMasterOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              cursor: "pointer",
              zIndex: 1,
            }}
            onClick={() => setEmailMasterOpen(false)}
          ></Box>
          <EmailMaster onClose={() => setEmailMasterOpen(false)} />
        </Box>
      </Dialog>
      <Dialog
        open={openDamage}
        onClose={handleCloseDamang}
        fullWidth
        maxWidth="md"
      >
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              cursor: "pointer",
              zIndex: 1,
            }}
            onClick={handleCloseDamang}
          ></Box>
          <SettingsDamageReturn
            open={openDamage}
            handleClose={handleCloseDamang}
          />
        </Box>
      </Dialog>
      <div
        style={{
          position: "absolute",
          bottom: "50px",
          display: "flex",
          alignItems: "center",
          gap: ".50rem",
          width: "100%",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <img
          src="img/logo/prabhabi.png"
          alt="prabhabiLogo"
          style={{
            width: "20px",
            height: "20px",
            // backgroundColor: "white",
            borderRadius: "50%",
            fontWeight: "bold",
            fontSize: "1rem",
          }}
        />
        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "12px" }}>
          Product By Prabhabi infocom
        </Typography>{" "}
      </div>
    </MuiDrawer>
  );
};

export default Drawer;
