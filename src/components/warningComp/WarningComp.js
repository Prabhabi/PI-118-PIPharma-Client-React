import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Typography } from "@mui/material";
import { Warning } from "@mui/icons-material";

export default function WarningComp({ warningStatus, warningDataFn, message }) {
  const [open, setOpen] = React.useState(warningStatus);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    warningDataFn(false);
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title">
          <Warning color="warning" sx={{ verticalAlign: "middle", mr: 1 }} />
          Warning
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography variant="h6" gutterBottom>
              {message}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            No
          </Button>
          <Button
            onClick={() => warningDataFn(true)}
            variant="contained"
            color="success"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

//  =======================================quotation warning ======================================
//   const [warningStatus, setWarningStatus] = useState(false);
//   const [warningData, serWarningData] = useState(null);
//   const warningDataFn = (data) => {
//     serWarningData(data);
//   };

//  =============================================================================

//    {warningStatus && (
//         <WarningComp
//           warningStatus={warningStatus}
//           warningDataFn={warningDataFn} message="Are you sure you want to Generate Quotation?"
//         />
//       )}
