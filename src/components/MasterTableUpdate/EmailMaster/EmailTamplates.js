import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardHeader,
  CardContent,
  Collapse,
  IconButton,
  Grid,
  Divider,
  Dialog,
  DialogContent,
  createTheme,
  ThemeProvider,
  InputAdornment,
  DialogTitle,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import RefreshIcon from "@mui/icons-material/Refresh";
import Cookies from "js-cookie";
import axios from "axios";
import EmailMaster from "./EmailMaster";

export default function EmailTamplates({ onClose }) {
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Auth token (reference EmailMaster)
  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

  // Refactor fetchData so it can be called from child
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const url = `${process.env.REACT_APP_URL}/api/getpropertyKeyValue?LargeContent=1`;
      const res = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: sanctumToken,
        },
      });
      // console.log("GET:", url, res.data);
      // Fix: Use res.data.data if available and is array
      const arr = Array.isArray(res.data?.data) ? res.data.data : [];
      setRows(arr);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [sanctumToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Callback for EmailMaster to trigger refresh
  const handleTemplateAdded = () => {
    fetchData();
    setDialogOpen(false);
  };

  // Filter rows by property name or subject (from Value)
  const filteredRows = rows.filter((row) => {
    const valueObj = (() => {
      try {
        return JSON.parse(row.Value);
      } catch {
        return {};
      }
    })();
    return (
      !search ||
      (row.PropertyName &&
        row.PropertyName.toLowerCase().includes(search.toLowerCase())) ||
      (valueObj.subject &&
        valueObj.subject.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const theme = createTheme({
    palette: {
      primary: {
        main: "#1b5e20", // dark green
      },
      secondary: {
        main: "#4caf50", // light green
      },
      background: {
        default: "#ffffff",
        paper: "#f8f9fa",
      },
    },
  });

  const handleExpandClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Modify close handler to use props
  const handleHsnMasterUpdateClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <DialogTitle
        sx={{
          backgroundColor: "#0078cf",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EmailIcon />
          Email Templates
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            size="small"
            onClick={fetchData}
            sx={{
              color: "white",
              border: "1px solid #fff",
              borderRadius: "50%",
              mr: 1,
              "&:hover": { background: "#388e3c" },
            }}
            title="Refresh"
            disabled={loading}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={handleHsnMasterUpdateClose}
            sx={{
              color: "white",
              "&:hover": { opacity: 0.8 },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            p: 3,
            backgroundColor: "background.default",
            minHeight: "100vh",
          }}
        >
          {/* Loading spinner */}
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <span
                className="MuiCircularProgress-root MuiCircularProgress-colorPrimary MuiCircularProgress-indeterminate"
                style={{ width: 32, height: 32, display: "inline-block" }}
              >
                <svg viewBox="22 22 44 44" style={{ width: 32, height: 32 }}>
                  <circle
                    className="MuiCircularProgress-circle"
                    cx="44"
                    cy="44"
                    r="20.2"
                    fill="none"
                    stroke="#1b5e20"
                    strokeWidth="3.6"
                    strokeDasharray="80px, 200px"
                    strokeDashoffset="0px"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </Box>
          )}
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <TextField
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              variant="outlined"
              size="small"
              sx={{
                flex: 1,
                mr: 2,
                background: "#fff",
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              sx={{
                minWidth: 160,
                fontWeight: "bold",
                backgroundColor: "#0078cf",
              }}
              onClick={() => setDialogOpen(true)}
            >
              Add Template
            </Button>
          </Box>

          {/* Email Cards Grid */}
          <Grid container spacing={2}>
            {filteredRows.map((row) => {
              let valueObj = {};
              try {
                valueObj = JSON.parse(row.Value);
              } catch {}

              // Ensure subject/body/signature are shown correctly even if missing
              const subject = valueObj.subject || "";
              const body = valueObj.body || "";
              const signature = valueObj.signature || "";

              return (
                <Grid item xs={12} key={row.ID}>
                  <Card
                    sx={{
                      mb: 2,
                      backgroundColor: "#ffffff",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      "&:hover": {
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                      },
                    }}
                  >
                    <CardHeader
                      avatar={<MailOutlineIcon sx={{ color: "#1b5e20" }} />}
                      action={
                        <IconButton
                          onClick={() => handleExpandClick(row.ID)}
                          sx={{
                            transform:
                              expandedId === row.ID
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                            transition: "0.3s",
                            color: "#1b5e20",
                          }}
                        >
                          <ExpandMoreIcon />
                        </IconButton>
                      }
                      title={
                        <Typography
                          variant="h6"
                          sx={{ color: "#1b5e20", fontWeight: "bold" }}
                        >
                          {row.PropertyName}
                        </Typography>
                      }
                      subheader={
                        <Typography sx={{ color: "#424242" }}>
                          Subject: {subject}
                        </Typography>
                      }
                    />
                    <Collapse
                      in={expandedId === row.ID}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Divider />
                      <CardContent>
                        <Box sx={{ mb: 3 }}>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "bold", mb: 1, color: "#1b5e20" }}
                          >
                            Email Body:
                          </Typography>
                          <Box
                            sx={{
                              p: 2,
                              backgroundColor: "#f8f9fa",
                              borderRadius: 1,
                              border: "1px solid #e0e0e0",
                              minHeight: "100px",
                            }}
                          >
                            <div
                              dangerouslySetInnerHTML={{
                                __html: body,
                              }}
                              style={{
                                whiteSpace: "pre-line",
                                fontSize: 14,
                              }}
                            />
                          </Box>
                        </Box>

                        <Box>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "bold", mb: 1, color: "#1b5e20" }}
                          >
                            Signature:
                          </Typography>
                          <Box
                            sx={{
                              p: 2,
                              backgroundColor: "#f8f9fa",
                              borderRadius: 1,
                              border: "1px solid #e0e0e0",
                            }}
                          >
                            <div
                              dangerouslySetInnerHTML={{
                                __html: signature,
                              }}
                              style={{
                                whiteSpace: "pre-line",
                                fontSize: 14,
                              }}
                            />
                          </Box>
                        </Box>
                      </CardContent>
                    </Collapse>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Dialog for EmailMaster */}
          <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogContent sx={{ p: 0 }}>
              <EmailMaster
                onTemplateAdded={handleTemplateAdded}
                onClose={() => setDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </Box>
      </DialogContent>
    </ThemeProvider>
  );
}
