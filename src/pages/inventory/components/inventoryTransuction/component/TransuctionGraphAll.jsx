import React from "react";
import { Box, List, ListItem, ListItemText } from "@mui/material";
import { Warning, CheckCircle } from "@mui/icons-material";

export default function TransuctionGraphAll({ transuctionList }) {

  const inventoryAll = transuctionList; // Define inventoryAll

  return (
    <div>
      <Box sx={{ overflowY: "auto", bgcolor: "#eee", flexGrow: 1 }}>
        <List>
          {inventoryAll.map((item, index) => (
            <ListItem key={index}>
              {item.TransactionType === "Sale" ? (
                <Warning color="error" />
              ) : (
                <CheckCircle color="success" />
              )}
              <ListItemText
                primary={`${item.ModelNumber} - ${item.TransactionType} (${item.Quantity} items)`}
                sx={{ marginLeft: 1 }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </div>
  );
}
