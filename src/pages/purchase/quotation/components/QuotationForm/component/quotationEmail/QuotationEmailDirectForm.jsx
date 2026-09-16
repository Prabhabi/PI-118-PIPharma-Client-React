import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EmailIcon from "@mui/icons-material/Email";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Chip from "@mui/material/Chip";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"; // Import PDF icon
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DescriptionIcon from "@mui/icons-material/Description";
import EmailSendDialog from "../emailSendDialog/EmailSendDialog";
import { set } from "lodash";
import DialogMessage from "./DialogMessage";
import quotationPdfEmailDirect from "./QuotationPdfEmailDirect";

import invoiceSaleCreatepdfDirect from "../../../../../../sales/invoice/components/invoiceDialog/component/invoiceSaleCreatepdfDirect";
import invoiceSaleCreatepdfInner from "./../../../../../../sales/invoice/components/invoiceDialog/component/invoiceSaleCreatepdfInner";
import axios from "axios";
import Cookies from "js-cookie";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import AdvncedORderEmailPdfDirect from "../../../../../../sales/AdvncedORder/components/AdvanceORderForm/AdvanceOrderEmailPdfDirect";
import moneyReciptInvEmailpdf from "../../../../../moneyRecipt/components/MoneyReciptInvEmailpdf";
import moneyReciptNoInvEmailpdf from "../../../../../moneyRecipt/components/moneyReciptDialog/MoneyReciptNoInvEmailpdf";

const schema = yup.object().shape({
  to: yup.string().email("Invalid email"),
  cc: yup.string().email("Invalid email"),
  subject: yup.string().required("Subject is required"),
  body: yup.string().required("Body is required"),
  signature: yup.string(), // Add signature field (optional, or add validation if required)
});

export default function QuotationEmailDirectForm({
  openEmail,
  handleClickOpenEmail,
  handleCloseEmail,
  handleEmaildata,
  emailData,
  type,
  handleAddCustomerClose,
}) {
  const [successMsz, setSuccessMsz] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [ccChips, setCcChips] = React.useState(emailData?.cc || []); // Pre-fill CC chips
  const [toChips, setToChips] = React.useState(
    emailData?.Email ? [emailData.Email] : []
  );
  const [openDia, setOpenDia] = React.useState(false);
  const [status, setStatus] = React.useState(null);
  const [toError, setToError] = React.useState("");
  const [selectedTemplate, setSelectedTemplate] = React.useState(""); // Track selected template
  const handleAddCcChip = (value, clearInput, fieldOnChange) => {
    if (value.includes("@") && value.includes(".")) {
      setCcChips((prev) => {
        const updated = [...prev, value.trim()];
        // Update the field value as a string (for react-hook-form)
        fieldOnChange(updated.join(", "));
        return updated;
      });
      clearInput(); // Clear the input field after adding a chip
    }
  };

  const handleDeleteCcChip = (chipToDelete) => {
    setCcChips((prev) => prev.filter((chip) => chip !== chipToDelete));
  };

  const handleAddToChip = (value, clearInput) => {
    if (value.includes("@") && value.includes(".")) {
      setToChips((prev) => [...prev, value.trim()]);
      clearInput();
    }
  };
  const [rows, setRows] = React.useState([]);

  // Auth token (reference EmailMaster)
  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

  const handleDeleteToChip = (chipToDelete) => {
    setToChips((prev) => prev.filter((chip) => chip !== chipToDelete));
  };

  const successFunction = (data) => {
    setSuccessMsz(data);
    if (data) {
      setStatus(2); // Update status to 2 when email is sent successfully
    }
  };

  React.useEffect(() => {
    if (status === 2) {
      setOpenSnackbar(true); // Open the Snackbar when status is 2
    }
  }, [status]);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_URL}/api/getpropertyKeyValue?LargeContent=1`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: sanctumToken,
            },
          }
        );
        // Fix: Check if res.data is an object and handle accordingly
        const templatesData = res.data.data || res.data || [];
        setRows(Array.isArray(templatesData) ? templatesData : [templatesData]);
      } catch (error) {
        console.error("Error fetching templates:", error);
        setRows([]);
      }
    };
    fetchData();
  }, [sanctumToken]);

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset, // Added reset function
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      // to: emailData?.Email || "", // Pre-fill "to"
      cc: emailData?.cc?.join(", ") || "", // Pre-fill "cc" as a comma-separated string
      subject: emailData?.subject || "", // Pre-fill "subject"
      body: emailData?.body || "", // Pre-fill "body"
      signature: emailData?.signature || "", // Add signature default
    },
  });

  const onSubmit = (data) => {
    if (toChips.length === 0) {
      const value = data.to?.trim();
      if (!value || !value.includes("@") || !value.includes(".")) {
        setToError("To is required");
        return;
      }
      setToError(""); // Clear error if valid
    } else {
      setToError(""); // Clear error if chips exist
    }

    data.to = toChips.length > 0 ? toChips.join(", ") : data.to?.trim();
    data.cc = ccChips.join(", ");

    type == "QUO" &&
      AdvncedORderEmailPdfDirect(emailData, data, successFunction); // Call the function with the correct parameters
    type == "ADVB" &&
      AdvncedORderEmailPdfDirect(emailData, data, successFunction); // Call the function with the correct parameters
    type == "INVS" &&
      invoiceSaleCreatepdfInner(emailData, data, successFunction); // Call the function with the correct parameters
    type == "MRIS" && moneyReciptInvEmailpdf(emailData, data, successFunction); // Call the function with the correct parameters
    type == "MRWIS" &&
      moneyReciptNoInvEmailpdf(emailData, data, successFunction); // Call the function with the correct parameters

    // quotationPdfEmail5(data, emailData, successFunction); // Call the function with the correct parameters

    setOpenDia(true); // Open the dialog after form submission
    setStatus(1); // Set the status to 1

    // handleCloseEmail();
    setToChips([]);
    setCcChips([]); // Reset CC chips
    reset({ to: "", cc: "", subject: "", body: "", signature: "" }); // Reset form fields including signature
  };

  // Handle template selection
  const handleTemplateChange = (event) => {
    const templateId = event.target.value;
    setSelectedTemplate(templateId);
    const template = rows.find((row) => row.ID === templateId);
    if (template) {
      let valueObj = {};
      try {
        valueObj = JSON.parse(template.Value);
      } catch {}
      reset({
        subject: valueObj.subject || "",
        body: valueObj.body || "",
        signature: valueObj.signature || "",
        // cc: ccChips.join(", "),
        // to: toChips.join(", "),
      });
    }
  };

  return (
    <React.Fragment>
      <Button
        variant="contained"
        onClick={handleClickOpenEmail}
        sx={{
          height: "3rem",
          width: { xs: "100%", sm: "auto" },
          textTransform: "none",
          backgroundColor: "#4D795B",
        }}
      >
        Email Quotation
      </Button>
      <Dialog
        open={openEmail}
        onClose={() => {
          handleCloseEmail();
          reset({ to: "", cc: "", subject: "", body: "" }); // Reset form fields
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <EmailIcon style={{ marginRight: "8px" }} />
              Email
            </div>
            <IconButton
              onClick={() => {
                handleCloseEmail();
                reset({ to: "", cc: "", subject: "", body: "" }); // Reset form fields
                handleAddCustomerClose && handleAddCustomerClose();
                reset({ to: "", cc: "", subject: "", body: "" }); // Reset form fields
              }}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          {/* Dropdown for email templates */}
          <FormControl
            fullWidth
            sx={{
              mt: 1,
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "green",
                },
              },
              "& .MuiInputLabel-root": {
                color: "green",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "green",
              },
            }}
          >
            <InputLabel id="email-template-select-label">
              Select Email Template
            </InputLabel>
            <Select
              labelId="email-template-select-label"
              value={selectedTemplate}
              label="Select Email Template"
              onChange={handleTemplateChange}
              sx={{
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "green",
                },
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {rows.map((row) => {
                let valueObj = {};
                try {
                  valueObj = JSON.parse(row.Value);
                } catch {}
                return (
                  <MenuItem key={row.ID} value={row.ID}>
                    {row.PropertyName} - {valueObj.subject || ""}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="to"
              control={control}
              render={({ field }) => (
                <div>
                  <TextField
                    {...field}
                    label="Send to"
                    fullWidth
                    margin="normal"
                    error={!!errors.to || !!toError}
                    helperText={toError || errors.to?.message}
                    InputLabelProps={{
                      style: { color: "green" },
                    }}
                    InputProps={{
                      sx: {
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "green",
                        },
                      },
                      onKeyDown: (e) => {
                        if (e.key === " " || e.key === "Enter") {
                          e.preventDefault();
                          const value = e.target.value.trim();
                          if (value.includes("@") && value.includes(".")) {
                            handleAddToChip(value, () => field.onChange(""));
                            setToError(""); // Clear error on chip add
                          }
                        }
                      },
                      onBlur: (e) => {
                        const value = e.target.value.trim();
                        if (
                          value &&
                          value.includes("@") &&
                          value.includes(".")
                        ) {
                          handleAddToChip(value, () => field.onChange(""));
                          setToError(""); // Clear error on chip add
                        }
                      },
                    }}
                    value={field.value || ""}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      setToError(""); // Clear error on change
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      marginTop: "8px",
                    }}
                  >
                    {toChips.map((chip, index) => (
                      <Chip
                        key={index}
                        label={chip}
                        onDelete={() => {
                          handleDeleteToChip(chip);
                          field.onChange(
                            toChips.filter((c) => c !== chip).join(", ")
                          );
                        }}
                        color="success"
                      />
                    ))}
                  </div>
                </div>
              )}
            />
            <Controller
              name="cc"
              control={control}
              render={({ field }) => (
                <div>
                  <TextField
                    {...field}
                    label="CC"
                    fullWidth
                    margin="normal"
                    error={!!errors.cc}
                    helperText={errors.cc?.message}
                    InputLabelProps={{
                      style: { color: "green" }, // Set label color
                    }}
                    InputProps={{
                      sx: {
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "green", // Set focus border color
                        },
                      },
                      onKeyDown: (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          const value = e.target.value.trim();
                          if (value.includes("@") && value.includes(".")) {
                            handleAddCcChip(
                              value,
                              () => field.onChange(""),
                              field.onChange
                            );
                          }
                        }
                      },
                    }}
                    value={field.value || ""}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      marginTop: "8px",
                    }}
                  >
                    {ccChips.map((chip, index) => (
                      <Chip
                        key={index}
                        label={chip}
                        onDelete={() => {
                          handleDeleteCcChip(chip);
                          field.onChange(
                            ccChips.filter((c) => c !== chip).join(", ")
                          ); // Update field value as a string
                        }}
                        color="success" // Changed chip color to green
                      />
                    ))}
                  </div>
                </div>
              )}
            />
            <Controller
              name="subject"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Subject"
                  fullWidth
                  margin="normal"
                  error={!!errors.subject}
                  helperText={errors.subject?.message}
                  InputLabelProps={{
                    style: { color: "green" }, // Set label color
                  }}
                  InputProps={{
                    sx: {
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "green", // Set focus border color
                      },
                    },
                  }}
                />
              )}
            />
            <Controller
              name="body"
              control={control}
              render={({ field }) => (
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      color: "green",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Body
                  </label>
                  <ReactQuill
                    {...field}
                    theme="snow"
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ["bold", "italic", "underline", "strike"],
                        [{ color: [] }, { background: [] }],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["link", "image"],
                        ["clean"],
                      ],
                    }}
                    formats={[
                      "header",
                      "bold",
                      "italic",
                      "underline",
                      "strike",
                      "color",
                      "background",
                      "list",
                      "bullet",
                      "link",
                      "image",
                    ]}
                    onChange={(value) => field.onChange(value)}
                    value={field.value || ""}
                    style={{
                      border: errors.body ? "1px solid red" : "1px solid #ccc",
                      height: "300px", // Increased height
                    }}
                  />
                  {errors.body && (
                    <span style={{ color: "red", fontSize: "12px" }}>
                      {errors.body.message}
                    </span>
                  )}
                </div>
              )}
            />
            {/* Signature Section */}
            <Controller
              name="signature"
              control={control}
              render={({ field }) => (
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      color: "green",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Signature
                  </label>
                  <ReactQuill
                    {...field}
                    theme="snow"
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ["bold", "italic", "underline", "strike"],
                        [{ color: [] }, { background: [] }],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["link", "image"],
                        ["clean"],
                      ],
                    }}
                    formats={[
                      "header",
                      "bold",
                      "italic",
                      "underline",
                      "strike",
                      "color",
                      "background",
                      "list",
                      "bullet",
                      "link",
                      "image",
                    ]}
                    onChange={(value) => field.onChange(value)}
                    value={field.value || ""}
                    style={{
                      border: "1px solid #ccc",
                      height: "120px",
                    }}
                  />
                  {errors.signature && (
                    <span style={{ color: "red", fontSize: "12px" }}>
                      {errors.signature.message}
                    </span>
                  )}
                </div>
              )}
            />

            {/* Fixed DialogActions at the bottom of the dialog, but inside the form */}
            <DialogActions
              sx={{
                position: "sticky",
                bottom: 0,
                background: "#fff",
                zIndex: 10,
                borderTop: "1px solid #eee",
                px: 2,
                py: 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginRight: "auto", // Align to the left
                }}
              >
                <DescriptionIcon
                  style={{
                    marginRight: "8px",
                    color: "red",
                    fontSize: "3rem",
                  }}
                />
                <span>
                  {emailData.QuotationNo || emailData.ReceiptNumber}.pdf
                </span>
              </div>
              <Button
                onClick={() => {
                  handleCloseEmail();
                  reset({ to: "", cc: "", subject: "", body: "" }); // Reset form fields
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="success"
                type="submit"
                autoFocus
              >
                Send
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <EmailSendDialog
        status={status} // Ensure status is passed correctly
        openDias={openDia}
        onClose={() => {
          setOpenDia(false); // Close the dialog
          setStatus(null); // Reset status when dialog is closed
          handleCloseEmail();
          handleAddCustomerClose && handleAddCustomerClose();
        }}
      />
    </React.Fragment>
  );
}
