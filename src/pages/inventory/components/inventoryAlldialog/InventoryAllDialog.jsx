import * as React from "react";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CurrentStockSection from "./component/CurrentStockSection";
import StockAlertSection from "./component/StockAlertSection";
import SwipeableIcon from "@mui/icons-material/Swipe";

export default function InventoryAllDialog({
  handleClose,
  inventoryList,
  aboutDetails,
}) {
  return (
    <React.Fragment>
      <DialogTitle
        id="alert-dialog-title"
        sx={{
          m: 0,
          p: 2,
          position: "relative",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <SwipeableIcon />
        {`${aboutDetails} details`}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ minHeight: "60vh" }}>
        <DialogContentText id="alert-dialog-description" component="div">
          {aboutDetails === "Current Stock" && (
            <CurrentStockSection inventoryList={inventoryList} />
          )}
          {aboutDetails === "Stock Alerts" && (
            <StockAlertSection inventoryList={inventoryList} />
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="success" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </React.Fragment>
  );
}
