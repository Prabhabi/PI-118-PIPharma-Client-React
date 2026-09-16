import * as React from "react";
import {
  useForm,
  useFormContext,
  Controller,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import dayjs from "dayjs";
import { get, method } from "lodash";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import Cookies from "js-cookie";
import { greenBorderStyle } from "../../../../../../functionforAll";
import { useQueries } from "@tanstack/react-query";
import ReactSelect from "react-select";

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

const darkblueBorderStyle = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "darkblue",
    },
    "&:hover fieldset": {
      borderColor: "darkblue",
    },
    "&.Mui-focused fieldset": {
      borderColor: "darkblue",
    },
  },
};

const darkblueLabelStyle = {
  color: "darkblue",
  "&.Mui-focused": {
    color: "darkblue",
  },
};
const darkblueDatePickerLabelStyle = {
  "& .MuiInputLabel-root": {
    color: "darkblue",
    "&.Mui-focused": {
      color: "darkblue",
    },
  },
};

// =======================================================================?
export default function InvoiceSalesPaymentForm({
  paymentAll,
  paymentinfoFn,
  finalAmount,
  paymentIsValidFn,
  roundedStyle,
  moneyReciptList,
}) {
  const methods = useFormContext();
  const {
    control,
    formState: { errors },
    setValue,
    getValues,
  } = methods;

  const theme = useTheme();
  console.log("paymentAll", paymentAll);

  console.log(errors);
  // finalAmount = Math.round(finalAmount * 100) / 100 || `0`;
  const [isTransNo, setIsTranNo] = React.useState(false);
  const [dueAmount, setDueAmount] = React.useState(0);
  const [selectedDate, setSelectedDate] = React.useState();
  const [remarks, setRemarks] = React.useState("");
  const [paymentDetailsState, setPaymentDetailsState] = React.useState([]); // New state

  const selectedPayments = getValues("selectedPayments");
  const paymentsDetails = getValues("paymentsDetails") || [];
  const paymentName = getValues("paymentName") || [];

  // Calculate the total amount
  const totalAmount = paymentsDetails.reduce((sum, payment) => {
    return sum + (payment.amount ? Number(payment.amount) : 0);
  }, 0);
  // ==============================================================================
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

    // Calculate the total amount paid
    const totalAmountPaid = newPaymentsDetails.reduce((acc, payment) => {
      return acc + Number(payment.Amount);
    }, 0);

    // Update the fields in the paymentsDetails array
    setValue("paymentsDetails", newPaymentsDetails);
    setValue("totalAmountPaid", totalAmountPaid);
    setPaymentDetailsState(newPaymentsDetails); // Update state to trigger re-render

    const grandTotal = getValues("GrandTotalAmount");
    const AdvancePayment = getValues("advanceOrderAmount") || 0;
    const roundUpAmount = getValues("roundUpAmount") || 0;
    console.log("Grand Total:", grandTotal);

    const dueAmount = grandTotal - totalAmountPaid;

    setValue("dueAmount", dueAmount - Number(AdvancePayment));
  };
  // ===========================================update result ===========================
  const updateResult = (index) => {
    const paymentsDetails = getValues("paymentsDetails") || [];
    const totalAmountPaid = paymentsDetails.reduce((sum, payment) => {
      return sum + (payment.Amount ? Number(payment.Amount) : 0);
    }, 0);

    const grandTotal = getValues("GrandTotalAmount");
    const dueAmount = grandTotal - totalAmountPaid;
    const AdvancePayment = getValues("advanceOrderAmount") || 0;

    setValue("dueAmount", dueAmount - Number(AdvancePayment));
  };

  const getStyles = (name, paymentName, theme) => {
    return {
      fontWeight:
        paymentName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  };
  // ===========================================================================

  console.log("moneyReciptList", moneyReciptList);
  const orderReqOptions = moneyReciptList?.map((item) => ({
    value: item.RequestOrderMasterID,
    label: ` ${item.RequestOrderNo}`,
    NetPaidAmount: item.AdvanceAmount,
    name: `${item.RequestOrderNo}`,
    // date: item?.SupplierDetails?.SupplierEntryTimeStamp,
    // Price: item.Price,
    // HSN: item.HSNCode,
    // StripOf: item.StripOf,
  }));

  return (
    <>
      <Grid container spacing={2} sx={{ p: 2, ml: 0.5 }}>
        <Grid
          item
          xs={12}
          sm={4}
          md={6}
          sx={{ alignItems: "center", display: "flex" }}
        >
          <Typography>Select Advance Order</Typography>
        </Grid>

        <Grid item xs={7} sm={6} sx={{ mt: 3 }}>
          <Stack direction="row" spacing={4} alignItems="center">
            <Controller
              name="selectOrderRequest"
              control={control}
              render={({ field }) => (
                <ReactSelect
                  {...field}
                  options={orderReqOptions}
                  value={
                    orderReqOptions.find(
                      (option) => option.value === field.value
                    ) || null
                  }
                  onChange={(option) => {
                    // update form value correctly
                    field.onChange(option ? option.value : null);

                    // your extra logic
                    setValue(
                      "advanceOrderAmount",
                      option ? option.NetPaidAmount : 0
                    );
                    updateResult(0);
                  }}
                  isClearable
                  placeholder="Select Order Request"
                  // 👇 force single-select style, no "blue block highlight"
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      minHeight: "3.2rem",
                      // minWidth: "500px", // <-- Added here
                      border: state.isFocused
                        ? "1px solid #4caf50"
                        : "1px solid #c4c4c4",
                      boxShadow: state.isFocused ? "0 0 0 1px #4caf50" : "none",
                      "&:hover": {
                        border: "1px solid #4caf50",
                      },
                      backgroundColor: "#fff",
                    }),
                    menu: (provided) => ({
                      ...provided,
                      zIndex: 9999,
                    }),
                  }}
                />
              )}
            />

            <Grid item xs={6} sm={6}>
              <Controller
                name="advanceOrderAmount"
                control={control}
                defaultValue={0}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    id="lumpsum-discount"
                    label="Advance Order Amount"
                    sx={{ ...roundedStyle(), ...greenBorderStyle }}
                    fullWidth
                    error={!!fieldState.error}
                    helperText={
                      fieldState.error ? fieldState.error.message : null
                    }
                    InputProps={{
                      inputProps: { min: 0 },
                      readOnly: true, // Makes the TextField read-only
                    }}
                    value={field.value || ""} // Ensure blank if invalid
                  />
                )}
              />
            </Grid>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <FormControl
            fullWidth
            error={!!errors.PaymentType}
            sx={darkblueBorderStyle}
          >
            <InputLabel id="payment-type-label" sx={darkblueLabelStyle}>
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
                    ...roundedStyle(),
                    backgroundColor: "white",
                    ...darkblueBorderStyle,
                  }}
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
          <FormControl
            sx={{
              width: 320,
              backgroundColor: "white",
              ...darkblueBorderStyle,
            }}
          >
            <InputLabel id="demo-multiple-chip-label" sx={darkblueLabelStyle}>
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
                  onChange={(event) => {
                    field.onChange(event);
                    handleChange(event);
                  }}
                  input={
                    <OutlinedInput
                      id="select-multiple-chip"
                      label="Payment Modes"
                      sx={{ ...darkblueBorderStyle }}
                    />
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value, index) => (
                        <Chip
                          key={index}
                          label={value}
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
                          field.value || [], // Ensure field.value is an array
                          theme
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
        <Grid item xs={12} sm={4} md={4}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              sx={{
                width: "100%",
                backgroundColor: "white",
                ...darkblueBorderStyle,
                ...darkblueDatePickerLabelStyle,
              }}
              label="Expected Due Date"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              format="DD-MM-YYYY" // Display format in the picker
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  sx={{ ...darkblueBorderStyle }}
                  InputLabelProps={{ style: darkblueLabelStyle }}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
        sx={{ pl: 2, justifyContent: "space-between" }}
      >
        {paymentDetailsState.map((field, index) => {
          return (
            <React.Fragment key={index}>
              <Grid item xs={5.5} sx={{ ml: 2.5 }}>
                <Controller
                  name={`paymentsDetails[${index}].Amount`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      sx={{
                        backgroundColor: "white",
                        ...darkblueBorderStyle,
                      }}
                      label={`Amount for ${paymentDetailsState[index].paymentModeDesc}`}
                      fullWidth
                      error={!!errors.paymentsDetails?.[index]?.Amount}
                      helperText={
                        errors.paymentsDetails?.[index]?.Amount?.message
                      }
                      InputLabelProps={{ style: darkblueLabelStyle }}
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
              <Grid item xs={5.5} sx={{ ml: 2.5 }}>
                <Controller
                  name={`paymentsDetails[${index}].transactionNumber`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      sx={{
                        backgroundColor: "white",
                        ...darkblueBorderStyle,
                      }}
                      label={`Transaction Number for ${paymentDetailsState[index].paymentModeDesc}`}
                      fullWidth
                      error={
                        !!errors.paymentsDetails?.[index]?.transactionNumber
                      }
                      helperText={
                        errors.paymentsDetails?.[index]?.transactionNumber
                          ?.message
                      }
                      InputLabelProps={{ style: darkblueLabelStyle }}
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
