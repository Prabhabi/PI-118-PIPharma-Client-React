import React from "react";
import TextField from "@mui/material/TextField";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  ThemeProvider,
  createTheme,
  Button,
  Snackbar,
  Alert,
  Paper,
  Grid,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Chip,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";

// Custom theme with dark green colors (copied from SettingsPropertyMaster)
const theme = createTheme({
  palette: {
    primary: {
      main: "#1b5e20",
      light: "#4c8c4a",
      dark: "#003300",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& label": {
            color: "#1b5e20",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#1b5e20",
            },
            "&:hover fieldset": {
              borderColor: "#4c8c4a",
            },
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          "& label": {
            color: "#1b5e20",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#1b5e20",
            },
            "&:hover fieldset": {
              borderColor: "#4c8c4a",
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        multiple: {
          "& .MuiChip-root": {
            color: "white",
            backgroundColor: "#1b5e20",
            "& .MuiChip-deleteIcon": {
              color: "white",
              "&:hover": {
                color: "#e0e0e0",
              },
            },
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: "#1b5e20 !important",
            color: "white",
            "&:hover": {
              backgroundColor: "#4c8c4a !important",
            },
          },
          "&:hover": {
            backgroundColor: "#e8f5e9",
          },
        },
      },
    },
  },
});

export default function EmailMaster({ onTemplateAdded, onClose }) {
  const [subject, setSubject] = React.useState("");
  const [body, setBody] = React.useState("");
  const [signature, setSignature] = React.useState(""); // Add this line
  const [properties, setProperties] = React.useState([]);
  // Changed from string to array for multiple selection
  const [selectedProperty, setSelectedProperty] = React.useState([]);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");
  const [showPreview, setShowPreview] = React.useState(false);

  // Auth token (copied from SettingsPropertyMaster)
  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

  // Fetch properties for dropdown
  React.useEffect(() => {
    const fetchProperties = async () => {
      try {
        const url = `${process.env.REACT_APP_URL}/api/getProperties/1`;
        const response = await axios.get(
          url,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: sanctumToken,
            },
          }
        );
        // Use response.data.data if available and is array, else fallback to []
        const propArr = Array.isArray(response?.data?.data)
          ? response.data.data
          : [];
        setProperties(propArr);
      } catch (error) {
        setProperties([]);
      }
    };
    fetchProperties();
  }, [sanctumToken]);

  const handlePropertyChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedProperty(typeof value === "string" ? value.split(",") : value);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProperty.length || !subject || !body) {
      setSnackbarMessage(
        "Please select at least one property and fill subject/body."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      // Send a single request with comma-separated IDs
      const formattedValue = JSON.stringify({
        subject: subject,
        body: body,
        signature: signature, // Add signature to the payload
      });

      const payload = {
        PropertyMasterIDs: selectedProperty.join(","),
        Value: formattedValue,
        LargeContent: 1,
      };

      const url = `${process.env.REACT_APP_URL}/api/propertyInsert`;

      await axios.post(
        url,
        payload,
        {
          headers: {
            Authorization: sanctumToken,
          },
        }
      );

      setSnackbarMessage("Successfully submitted to all selected properties");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Notify parent to refresh and close dialog
      if (onTemplateAdded) onTemplateAdded();
      if (onClose) onClose();
    } catch (error) {
      setSnackbarMessage("Submission failed");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Enhanced editor configuration
  const editorModules = {
    toolbar: [
      [{ font: [] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "sub" }, { script: "super" }],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["blockquote", "code-block"],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3 }} component="form" onSubmit={handleSubmit}>
        <Paper elevation={3} sx={{ p: 3, mb: 3, bgcolor: "#f5f5f5" }}>
          <Typography variant="h5" color="primary" gutterBottom>
            Email Template Configuration
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Property Type</InputLabel>
                <Select
                  multiple
                  value={selectedProperty}
                  onChange={handlePropertyChange}
                  label="Property Type"
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={
                            (Array.isArray(properties) ? properties : []).find(
                              (p) => p.ID === value
                            )?.PropertyName
                          }
                          size="small"
                        />
                      ))}
                    </Box>
                  )}
                >
                  {(Array.isArray(properties) ? properties : []).map((item) => (
                    <MenuItem key={item.ID} value={item.ID}>
                      {item.PropertyName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Email Subject"
                fullWidth
                margin="normal"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <Typography color="textSecondary" sx={{ mr: 1 }}>
                      📧
                    </Typography>
                  ),
                }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={showPreview}
                    onChange={(e) => setShowPreview(e.target.checked)}
                    color="primary"
                  />
                }
                label="Show Preview"
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  bgcolor: "white",
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  mb: 3,
                }}
              >
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  Email Body
                </Typography>
                <ReactQuill
                  theme="snow"
                  modules={editorModules}
                  formats={[
                    "font",
                    "header",
                    "size",
                    "bold",
                    "italic",
                    "underline",
                    "strike",
                    "color",
                    "background",
                    "script",
                    "align",
                    "list",
                    "bullet",
                    "indent",
                    "blockquote",
                    "code-block",
                    "link",
                    "image",
                    "video",
                  ]}
                  value={body}
                  onChange={setBody}
                  style={{
                    height: showPreview ? "300px" : "400px", // Adjust height when preview is shown
                    marginBottom: "60px",
                  }}
                />
              </Paper>

              {/* New Signature Section */}
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  bgcolor: "white",
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  mb: showPreview ? 3 : 0,
                }}
              >
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  Email Signature
                </Typography>
                <ReactQuill
                  theme="snow"
                  modules={editorModules}
                  formats={[
                    "font",
                    "header",
                    "size",
                    "bold",
                    "italic",
                    "underline",
                    "strike",
                    "color",
                    "background",
                    "script",
                    "align",
                    "list",
                    "bullet",
                    "indent",
                    "blockquote",
                    "code-block",
                    "link",
                    "image",
                    "video",
                  ]}
                  value={signature}
                  onChange={setSignature}
                  style={{
                    height: "100px",
                    marginBottom: "60px",
                  }}
                />
              </Paper>

              {showPreview && (
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    bgcolor: "white",
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    minHeight: "300px",
                  }}
                >
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    Email Preview
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  {/* Email-like preview container */}
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "#f8f9fa",
                      borderRadius: 1,
                      border: "1px solid #dee2e6",
                    }}
                  >
                    {/* Email Header */}
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{ color: "#6c757d", mb: 1 }}
                      >
                        From: System Admin
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#6c757d", mb: 1 }}
                      >
                        Subject: {subject || "(No subject)"}
                      </Typography>
                      <Divider />
                    </Box>

                    {/* Email Body */}
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: "white",
                        borderRadius: 1,
                        minHeight: "200px",
                      }}
                    >
                      <div
                        dangerouslySetInnerHTML={{
                          __html: body || "(No content)",
                        }}
                        style={{
                          fontFamily: "Arial, sans-serif",
                          fontSize: "14px",
                          lineHeight: "1.6",
                        }}
                      />
                      {signature && (
                        <>
                          <Divider sx={{ my: 2 }} />
                          <div
                            dangerouslySetInnerHTML={{ __html: signature }}
                            style={{
                              fontFamily: "Arial, sans-serif",
                              fontSize: "14px",
                              lineHeight: "1.6",
                            }}
                          />
                        </>
                      )}
                    </Box>
                  </Box>
                </Paper>
              )}
            </Grid>
          </Grid>

          <Box
            sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                setSubject("");
                setBody("");
              }}
            >
              Clear
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ px: 4 }}
            >
              Save Template
            </Button>
          </Box>
        </Paper>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}
