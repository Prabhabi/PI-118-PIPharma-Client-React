import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  OutlinedInput,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Chip,
  TextField,
  FormHelperText,
  Box,
  Grid,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { get } from "lodash";
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
  PaymentDetails: yup.array().of(
    yup.object().shape({
      amount: yup.number().required("Amount is required"),
      transactionNumber: yup
        .string()
        .required("Transaction number is required"),
    })
  ),
});

export default function MoneyPaymentForm({
  paymentAll,
  paymentinfoFn,
  finalAmount,
  paymentIsValidFn,
  invoiceSelect,
  paidAmount,
  setPaymentDetails, // <-- add this prop
}) {
  const {
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useFormContext();
  const theme = useTheme();
  const [paymentDetailsState, setPaymentDetailsState] = React.useState([]);
  // ======================================hnadle chnage ======================================
  const handleChange = (event) => {
    const newValue =
      typeof event.target.value === "string"
        ? event.target.value.split(",")
        : event.target.value;
    setValue("paymentName", newValue);

    const newPaymentDetails = newValue
      .map((paymentName) => {
        const payment = paymentAll.find(
          (p) => p.PaymentModeName === paymentName
        );
        if (!payment) {
          console.warn(`Payment not found for: ${paymentName}`);
          return null;
        }
        return {
          Amount: 0,
          PaymentModeCode: payment.PaymentModeCode,
          PaymentModeDetails: payment.PaymentModeDetails,
          PaymentModeID: payment.ID,
          paymentModeDesc: payment.PaymentModeName,
        };
      })
      .filter(Boolean);
    console.log("paymentaaaaaaa", newPaymentDetails);

    const totalAmountPaid = newPaymentDetails.reduce(
      (acc, payment) => acc + Number(payment.Amount),
      0
    );
    setValue("PaymentDetails", newPaymentDetails);
    setValue("totalAmountPaid", totalAmountPaid);
    setPaymentDetailsState(newPaymentDetails);

    const grandTotal = getValues("grandTotalAmount");
    setValue("dueAmount", grandTotal - totalAmountPaid);

    // ADD THIS LINE:
    if (typeof setPaymentDetails === "function")
      setPaymentDetails(newPaymentDetails);
  };
  // =============================================update result============================
  const updateResult = (index) => {
    const PaymentDetails = getValues("PaymentDetails") || [];
    const totalAmountPaid = PaymentDetails.reduce((sum, payment) => {
      const amount = payment.Amount ? Number(payment.Amount) : 0;
      return payment.PaymentModeDetails === "Return"
        ? sum - amount
        : sum + amount;
    }, 0);

    console.log("paymentDetails", PaymentDetails);
    const grandTotal = paidAmount;
    setValue("dueAmount", grandTotal - totalAmountPaid);
    setValue("NetPaidAmount", totalAmountPaid); // Set the total amount in the form state
    const totalDue = Number(grandTotal) - Number(totalAmountPaid);
    // setValue("NetDueAmount", totalDue.toFixed(2));
    setValue("NetDueAmount", Number(totalDue.toFixed(2)));

    // ADD THIS LINE:
    if (typeof setPaymentDetails === "function")
      setPaymentDetails(PaymentDetails);
  };
  // ============================================================================

  const getStyles = (name, paymentName) => ({
    fontWeight:
      paymentName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  });

  const blueBorderStyle = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "blue" },
      "&:hover fieldset": { borderColor: "blue" },
      "&.Mui-focused fieldset": { borderColor: "blue" },
    },
    "& .MuiInputLabel-root": { color: "blue" },
    "& .MuiSelect-root": {
      "& fieldset": { borderColor: "blue" },
      "&:hover fieldset": { borderColor: "blue" },
      "&.Mui-focused fieldset": { borderColor: "blue" },
    },
    "&.Mui-focused .MuiInputLabel-root": { color: "darkblue" },
    "&.Mui-focused .MuiSelect-root": { color: "darkblue" },
  };

  const darkblueBorderStyle = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "darkblue" },
      "&:hover fieldset": { borderColor: "darkblue" },
      "&.Mui-focused fieldset": { borderColor: "darkblue" },
    },
    "& .MuiInputLabel-root": { color: "darkblue" },
    "& .MuiSelect-root": {
      "& fieldset": { borderColor: "darkblue" },
      "&:hover fieldset": { borderColor: "darkblue" },
      "&.Mui-focused fieldset": { borderColor: "darkblue" },
    },
  };

  return (
    <Box>
      <Grid container spacing={2} sx={{ m: 0.4 }}>
        <Grid item xs={12} sm={4} md={4}>
          <FormControl
            fullWidth
            error={!!errors.PaymentType}
            sx={blueBorderStyle}
          >
            <InputLabel id="payment-type-label" sx={{ color: "darkblue" }}>
              Payment Type
            </InputLabel>
            <Controller
              name="PaymentType"
              control={control}
              defaultValue="F"
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="payment-type-label"
                  label="Payment Type"
                  sx={{
                    ...blueBorderStyle,
                    backgroundColor: "white",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "darkblue",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "darkblue",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "darkblue",
                    },
                    "& .MuiSelect-icon": { color: "darkblue" },
                    "&.Mui-focused .MuiInputLabel-root": { color: "darkblue" },
                  }}
                  inputProps={{ style: { color: "darkblue" } }}
                >
                  <MenuItem value="A">Advance</MenuItem>
                  <MenuItem value="F">Final</MenuItem>
                </Select>
              )}
            />
            {errors.PaymentType && (
              <FormHelperText>{errors.PaymentType.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <FormControl fullWidth sx={blueBorderStyle}>
            <InputLabel
              id="demo-multiple-chip-label"
              sx={{ color: "darkblue" }}
            >
              Payment Modes
            </InputLabel>
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
                  sx={{ background: "#fff" }}
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
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {selected.map((value, index) => (
                        <Chip
                          key={index}
                          label={value}
                          size="small"
                          sx={{ backgroundColor: "blue", color: "white" }}
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
                          field.value || []
                        ),
                        backgroundColor: (field.value || []).includes(
                          payment.PaymentModeName
                        )
                          ? "blue"
                          : "inherit",
                        color: (field.value || []).includes(
                          payment.PaymentModeName
                        )
                          ? "white"
                          : "inherit",
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
      </Grid>
      <Grid container spacing={2} sx={{ p: 2 }}>
        {paymentDetailsState.map((field, index) => (
          <React.Fragment key={index}>
            <Grid item xs={6}>
              <Controller
                name={`PaymentDetails[${index}].Amount`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    sx={{ backgroundColor: "white", ...blueBorderStyle }}
                    label={`Amount for ${paymentDetailsState[index].paymentModeDesc}`}
                    fullWidth
                    error={!!errors.PaymentDetails?.[index]?.Amount}
                    helperText={errors.PaymentDetails?.[index]?.Amount?.message}
                    onChange={(e) => {
                      field.onChange(e);
                      setValue(
                        `PaymentDetails[${index}].Amount`,
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
                name={`PaymentDetails[${index}].PaymentModeDesc`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    sx={{ backgroundColor: "white", ...blueBorderStyle }}
                    label={`Transaction Number for ${paymentDetailsState[index].paymentModeDesc}`}
                    fullWidth
                    error={!!errors.PaymentDetails?.[index]?.transactionNumber}
                    helperText={
                      errors.PaymentDetails?.[index]?.transactionNumber?.message
                    }
                    onChange={(e) => {
                      field.onChange(e);
                      setValue(
                        `PaymentDetails[${index}].PaymentModeDesc`,
                        e.target.value
                      );
                      updateResult(index);
                    }}
                  />
                )}
              />
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </Box>
  );
}
