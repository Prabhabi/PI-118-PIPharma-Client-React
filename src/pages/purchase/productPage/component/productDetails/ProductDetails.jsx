import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import NumbersIcon from "@mui/icons-material/Numbers";
import CategoryIcon from "@mui/icons-material/Category";
import StraightenIcon from "@mui/icons-material/Straighten";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import KitchenIcon from "@mui/icons-material/Kitchen";
import LayersIcon from "@mui/icons-material/Layers";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import CodeIcon from "@mui/icons-material/Code";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import InventoryIcon from "@mui/icons-material/Inventory";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import DescriptionIcon from "@mui/icons-material/Description";

const isValid = (val) =>
  val !== null &&
  val !== undefined &&
  val !== "" &&
  val !== "null" &&
  val !== "undefined";

const ProductDetails = ({ data, fetchProduct }) => {
  if (!data) return null;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h6">Product Information</Typography>
          {isValid(data.ModelNumber) && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <NumbersIcon sx={{ color: "#1a472a" }} />
              <Typography>Brand Name: {data.ModelNumber}</Typography>
            </Box>
          )}

          {isValid(data.ProductCategoryName) && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LayersIcon sx={{ color: "#1a472a" }} />
              <Typography>Category: {data.ProductCategoryName}</Typography>
            </Box>
          )}
          {isValid(data.ProductSubCategoryName) && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ViewModuleIcon sx={{ color: "#1a472a" }} />
              <Typography>
                Generic Name: {data.ProductSubCategoryName}
              </Typography>
            </Box>
          )}
          {/* {isValid(data.HSNCode) && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CodeIcon sx={{ color: "#1a472a" }} />
              <Typography>HSN Code: {data.HSNCode}</Typography>
            </Box>
          )} */}
          {/* {isValid(data.Shape) && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CropSquareIcon sx={{ color: "#1a472a" }} />
              <Typography>Shape: {data.Shape}</Typography>
            </Box>
          )} */}
          {isValid(data.Dimension) && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <FormatSizeIcon sx={{ color: "#1a472a" }} />
              <Typography>Strength Power Unit: {data.Dimension}</Typography>
            </Box>
          )}
          {isValid(data.StripOf) && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <InventoryIcon sx={{ color: "#1a472a" }} />
              <Typography>Strip Of: {data.StripOf}</Typography>
            </Box>
          )}
        </Box>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h6">Product Details</Typography>

          {isValid(data.StripQty) && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <InventoryIcon sx={{ color: "#1a472a" }} />
              <Typography>Strip Qty: {data.StripQty}</Typography>
            </Box>
          )}
          {isValid(data.Price) && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PriceCheckIcon sx={{ color: "#1a472a" }} />
              <Typography>Price: ₹{data.Price}</Typography>
            </Box>
          )}
          {isValid(data.QtyPerBox) && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <NumbersIcon sx={{ color: "#1a472a" }} />
              <Typography>Qty Per Box: {data.QtyPerBox}</Typography>
            </Box>
          )}
          {isValid(data.AvailableQuantity) && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <InventoryIcon sx={{ color: "#1a472a" }} />
              <Typography>
                Available Quantity: {data.AvailableQuantity}
              </Typography>
            </Box>
          )}
          {isValid(data.Description) && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <DescriptionIcon sx={{ color: "#1a472a" }} />
              <Typography>Description: {data.Description}</Typography>
            </Box>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default ProductDetails;
