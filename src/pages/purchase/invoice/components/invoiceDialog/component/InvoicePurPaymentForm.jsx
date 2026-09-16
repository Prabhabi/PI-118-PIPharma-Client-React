import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Box, FormHelperText, Grid, Grid2 } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { get, method } from "lodash";
import Chip from "@mui/material/Chip";
import { useTheme } from "@mui/material/styles";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const schema = yup.object().shape({
  PaymentType: yup.string().required("Payment Type is required"),
  selectedPayments: yup.array().min(1, "Payment Mode is required"),
  paymentsDetails: yup.array().of(
    yup.object().shape({
      amount: yup.number().required("Amount is required"),
      transactionNumber: yup
        .string()
        .required("Transaction number is required"),
    })
  ),
});

export default function InvoicePurPaymentForm({
  paymentAll,
  paymentinfoFn,
  finalAmount,
  paymentIsValidFn,
  roundedStyle,
  darkGreenBorderStyle, // Add darkGreenBorderStyle as a prop
}) {
  const {
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useFormContext();

  const theme = useTheme();

  // console.log(errors);
  // finalAmount = Math.round(finalAmount * 100) / 100 || `0`;
  const [isTransNo, setIsTranNo] = React.useState(false);
  const [dueAmount, setDueAmount] = React.useState(0);
  const [selectedDate, setSelectedDate] = React.useState();
  const [paymentDetailsState, setPaymentDetailsState] = React.useState([]); // New state

  const selectedPayments = getValues("selectedPayments");
  const paymentsDetails = getValues("paymentsDetails") || [];
  const paymentName = getValues("paymentName") || [];

  // Calculate the total amount
  const totalAmount = paymentsDetails.reduce((sum, payment) => {
    return sum + (payment.amount ? Number(payment.amount) : 0);
  }, 0);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    const newValue = typeof value === "string" ? value.split(",") : value;
    setValue("paymentName", newValue);

    // Set paymentsDetails with the new value and id from paymentAll
    const newPaymentsDetails = newValue.map((paymentName) => {
      const payment = paymentAll.find((p) => p.PaymentModeName === paymentName);
      // Get today's date in yyyy-mm-dd format
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      const todayStr = `${yyyy}-${mm}-${dd}`;
      return {
        Amount: 0,
        PaymentDate: todayStr,
        PaymentModeCode: payment ? payment.PaymentModeCode : "",
        PaymentModeDetails: payment ? payment.PaymentModeDetails : "",
        PaymentModeID: payment ? payment.ID : "",
        paymentModeDesc: paymentName,
      };
    });
    console.log("newPaymentsDetails", newPaymentsDetails);

    // Calculate the total amount paid
    const totalAmountPaid = newPaymentsDetails.reduce((acc, payment) => {
      return acc + Number(payment.Amount);
    }, 0);

    // const totalAmountPaid = newValue
    //   .map((paymentName) => {
    //     const payment = paymentAll.find(
    //       (p) => p.PaymentModeName !== paymentName
    //     );
    //     return payment ? payment.amount : 0; // Return the amount or 0 if not found
    //   })
    //   .reduce((acc, amount) => acc + amount, 0); // Reduce to calculate the total

    // Update the fields in the paymentsDetails array
    setValue("paymentsDetails", newPaymentsDetails);
    setValue("totalAmountPaid", totalAmountPaid);
    setPaymentDetailsState(newPaymentsDetails); // Update state to trigger re-render

    const grandTotal = getValues("GrandTotalAmount");
    const dueAmount = grandTotal - totalAmountPaid;
    setValue("dueAmount", dueAmount);
  };

  const updateResult = (index) => {
    const paymentsDetails = getValues("paymentsDetails") || [];
    const totalAmountPaid = paymentsDetails.reduce((sum, payment) => {
      return sum + (payment.Amount ? Number(payment.Amount) : 0);
    }, 0);

    const grandTotal = getValues("GrandTotalAmount");
    console.log("grandTotal", grandTotal);
    const dueAmount = grandTotal - totalAmountPaid;
    setValue("dueAmount", dueAmount);
  };

  const getStyles = (name, paymentName, theme) => {
    return {
      fontWeight:
        paymentName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  };

  return (
    <>
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={12} sm={4} md={4}>
          <FormControl
            fullWidth
            error={!!errors.PaymentType}
            sx={darkGreenBorderStyle}
          >
            <InputLabel id="payment-type-label">Payment Type</InputLabel>
            <Controller
              name="PaymentType"
              control={control}
              defaultValue="F"
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="payment-type-label"
                  label="Payment Type"
                  sx={{ ...roundedStyle(), backgroundColor: "white" }}
                  defaultValue="F"
                >
                  <MenuItem value="F">Final</MenuItem>
                  <MenuItem value="P">Partial</MenuItem>
                </Select>
              )}
            />
            {errors.PaymentType && (
              <FormHelperText>{errors.PaymentType.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <FormControl
            sx={{
              width: 300,
              backgroundColor: "white",
              ...darkGreenBorderStyle,
            }}
          >
            <InputLabel id="demo-multiple-chip-label">Payment Modes</InputLabel>
            <Controller
              name="paymentName"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  value={field.value || []}
                  onChange={(event) => {
                    field.onChange(event);
                    handleChange(event);
                  }}
                  input={
                    <OutlinedInput
                      id="select-multiple-chip"
                      label="Payment Modes"
                    />
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value, index) => (
                        <Chip
                          key={index}
                          label={value}
                          color="primary" // Use MUI's primary color by default
                        />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {paymentAll.map((payment) => (
                    <MenuItem
                      key={payment.ID}
                      value={payment.PaymentModeName}
                      style={{
                        ...getStyles(
                          payment.PaymentModeName,
                          field.value || [],
                          theme
                        ),
                        ...((field.value || []).includes(
                          payment.PaymentModeName
                        )
                          ? {
                              backgroundColor: theme.palette.primary.main,
                              color: theme.palette.primary.contrastText,
                            }
                          : {}),
                      }}
                    >
                      {payment.PaymentModeName}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={4}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              sx={{
                width: " 100%",
                backgroundColor: "white",
                ...darkGreenBorderStyle,
              }}
              label="Expected Due Date"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              format="DD-MM-YYYY" // Display format in the picker
              // renderInput is deprecated in MUI X v6+, use textField slot instead
              textField={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ p: 2 }}>
        {paymentDetailsState.map((field, index) => {
          // console.log(field.paymentModeDesc);
          return (
            <React.Fragment key={index}>
              <Grid item xs={6}>
                <Controller
                  name={`paymentsDetails[${index}].Amount`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      sx={{ backgroundColor: "white", ...darkGreenBorderStyle }}
                      label={`Amount for ${paymentDetailsState[index].paymentModeDesc}`}
                      fullWidth
                      error={!!errors.paymentsDetails?.[index]?.Amount}
                      helperText={
                        errors.paymentsDetails?.[index]?.Amount?.message
                      }
                      onChange={(e) => {
                        field.onChange(e);
                        setValue(
                          `paymentsDetails[${index}].Amount`,
                          e.target.value
                        );
                        updateResult(index);
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name={`paymentsDetails[${index}].transactionNumber`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      sx={{ backgroundColor: "white", ...darkGreenBorderStyle }}
                      label={`Transaction Number for ${paymentDetailsState[index].paymentModeDesc}`}
                      fullWidth
                      error={
                        !!errors.paymentsDetails?.[index]?.transactionNumber
                      }
                      helperText={
                        errors.paymentsDetails?.[index]?.transactionNumber
                          ?.message
                      }
                      onChange={(e) => {
                        field.onChange(e);
                        setValue(
                          `paymentsDetails[${index}].transactionNumber`,
                          e.target.value
                        );
                        updateResult(index);
                      }}
                    />
                  )}
                />
              </Grid>
            </React.Fragment>
          );
        })}
      </Grid>
    </>
  );
}
