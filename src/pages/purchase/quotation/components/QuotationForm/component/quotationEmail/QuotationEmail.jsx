import * as React from "react";
import { useRef } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Chip from "@mui/material/Chip";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DescriptionIcon from "@mui/icons-material/Description";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import EmailSendDialog from "../emailSendDialog/EmailSendDialog";
import { OutlinedInput } from "@mui/material/OutlinedInput";
import { Email } from "@mui/icons-material";

export default function QuotationEmail({
  openEmail,
  handleClickOpenEmail,
  handleCloseEmail,
  handleEmaildata,
  emailData,
  parentValues,
  onEmailSubmit,
  onSubmita,
}) {
  const [toChips, setToChips] = React.useState([]); // Added state for "To" chips
  const [ccChips, setCcChips] = React.useState([]);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [openDia, setOpenDia] = React.useState(false);
  const [status, setStatus] = React.useState(null);

  const [formData, setFormData] = React.useState({
    to: "",
    cc: "",
    subject: "",
    body: "",
  });

  const handleAddToChip = (value) => {
    if (value.trim() !== "") {
      setToChips((prev) => {
        const updatedChips = [...prev, value.trim()];
        setFormData((prevFormData) => ({
          ...prevFormData,
          to: updatedChips.join(", "),
        }));
        return updatedChips;
      });
    }
  };

  const handleDeleteToChip = (chipToDelete) => {
    setToChips((prev) => {
      const updatedChips = prev.filter((chip) => chip !== chipToDelete);
      setFormData((prevFormData) => ({
        ...prevFormData,
        to: updatedChips.join(", "),
      }));
      return updatedChips;
    });
  };

  const handleAddCcChip = (value) => {
    if (value.includes("@")) {
      setCcChips((prev) => {
        const updatedChips = [...prev, value.trim()];
        setFormData((prevFormData) => ({
          ...prevFormData,
          cc: updatedChips.join(", "),
        }));
        return updatedChips;
      });
    }
  };

  const handleDeleteCcChip = (chipToDelete) => {
    setCcChips((prev) => {
      const updatedChips = prev.filter((chip) => chip !== chipToDelete);
      setFormData((prevFormData) => ({
        ...prevFormData,
        cc: updatedChips.join(", "),
      }));
      return updatedChips;
    });
  };

  const handleSubmit = () => {
    const data = {
      ...formData,
      to: toChips.join(", "),
      cc: ccChips.join(", "),
    };
    handleCloseEmail();
    setCcChips([]);
    setFormData({ to: "", cc: "", subject: "", body: "" });
    setOpenSnackbar(true);
    handleEmaildata(data);
  };
  // ==============================================send ===================================
  const onSend = async () => {
    handleEmaildata(formData);
    onSubmita();

    // const data = { ...formData, cc: ccChips.join(", ") };
    // handleCloseEmail();
    // setCcChips([]);
    // setFormData({ to: "", cc: "", subject: "", body: "" });
    // setOpenSnackbar(true);
    // setOpenDia(true);
    // const response = await onEmailSubmit(data, parentValues);
    // if (response.status === "success") {
    //   setStatus("success");
    //   setOpenDia(false);
    // } else {
    // setStatus("error");
    // setOpenDia(false);
    // }
  };

  const clearChips = () => {
    setToChips([]);
    setCcChips([]);
    setFormData({ to: "", cc: "", subject: "", body: "" });
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
          ml: 2,
        }}
      >
        Send Email
      </Button>
      <Dialog
        open={openEmail}
        onClose={() => {
          handleCloseEmail();
          clearChips();
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Email</span>
            <IconButton
              onClick={() => {
                handleCloseEmail();
                clearChips();
              }}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div>
              <TextField
                label="To"
                fullWidth
                margin="normal"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    const value = e.target.value.trim();
                    if (value) {
                      handleAddToChip(value);
                      e.target.value = ""; // Clear input after adding chip
                    }
                  }
                }}
                onBlur={(e) => {
                  const value = e.target.value.trim();
                  if (value) {
                    handleAddToChip(value);
                    e.target.value = ""; // Clear input after adding chip
                  }
                }}
              />
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {toChips.map((chip, index) => (
                  <Chip
                    key={index}
                    label={chip}
                    onDelete={() => handleDeleteToChip(chip)}
                    style={{ backgroundColor: "green", color: "white" }} // Set chip color to green
                    deleteIcon={<CloseIcon style={{ color: "white" }} />} // Set close button color to white
                  />
                ))}
              </div>
            </div>
            <div>
              <TextField
                label="CC"
                fullWidth
                margin="normal"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    const value = e.target.value.trim();
                    if (value.includes("@")) {
                      handleAddCcChip(value);
                      e.target.value = ""; // Clear input after adding chip
                    }
                  }
                }}
              />
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {ccChips.map((chip, index) => (
                  <Chip
                    key={index}
                    label={chip}
                    onDelete={() => handleDeleteCcChip(chip)}
                    style={{ backgroundColor: "green", color: "white" }} // Set chip color to green
                    deleteIcon={<CloseIcon style={{ color: "white" }} />} // Set close button color to white
                  />
                ))}
              </div>
            </div>
            <TextField
              label="Subject"
              fullWidth
              margin="normal"
              value={formData.subject}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, subject: e.target.value }))
              }
            />
            <div>
              <ReactQuill
                theme="snow"
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, body: value }))
                }
                value={formData.body || ""}
                style={{
                  border: "1px solid #ccc",
                  height: "200px",
                }}
              />
            </div>
            <DialogActions>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginRight: "auto",
                }}
              >
                <DescriptionIcon
                  style={{
                    marginRight: "8px",
                    color: "red",
                    fontSize: "3rem",
                  }}
                />
                <span>QuotationNo.pdf</span>
              </div>
              <Button
                onClick={() => {
                  handleCloseEmail();
                  clearChips();
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="success"
                type="submit"
                autoFocus
                onClick={onSend}
              >
                Send
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
      {/* <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={
          <span style={{ display: "flex", alignItems: "center" }}>
            <CheckCircleIcon style={{ marginRight: "8px" }} />
            Email sent successfully
          </span>
        }
      /> */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "16px",
        }}
      ></div>
      <EmailSendDialog
        status={status}
        openDias={openDia}
        onClose={() => setOpenDia(false)}
      />
    </React.Fragment>
  );
}
