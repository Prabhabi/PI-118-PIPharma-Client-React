// SelectComponent.jsx
import Select from "react-select";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import {
  TextField,
  MenuItem,
  Button,
  Grid,
  Box,
  Typography,
  FormHelperText,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import _, { round } from "lodash";
import {
  formatDateTime,
  greenBorderStyle,
} from "../../../../../../functionforAll";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: "3.2rem",
    // minWidth: "500px", // <-- Added here
    border: state.isFocused ? "1px solid #4caf50" : "1px solid #c4c4c4",
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
};

const SelectComponent = ({
  options,
  value,
  onChange,
  placeholder,
  isSearchable,
  ...rest
}) => {
  return (
    <Select
      {...rest}
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      isSearchable={isSearchable}
      styles={customStyles} // <-- Use customStyles here
    />
  );
};

// export  SelectComponent;
// ===================================================2nd comp ==================================

export const InvoiceRow = React.memo(function InvoiceRow({
  field,
  index,
  control,
  allItems,
  itemOptions,
  setValue,
  errors,
  sanctumToken,
  itemSelect,
  setItemSelect,
  watch,
  getValues,
  updateResult,
  selectComponentStyles,
  onRemove, // <-- accept onRemove prop
  mrpSetFn,
}) {
  // Only watch the fields for this row
  const availableQuantity = useWatch({
    control,
    name: `items.${index}.AvailableQuantity`,
  });
  const productModelID = useWatch({
    control,
    name: `items.${index}.ProductModelID`,
  });

  // Local state for child options
  const [childOptions, setChildOptions] = useState([]);

  // Fetch child options when ProductModelID changes
  useEffect(() => {
    if (!productModelID) {
      setChildOptions([]);
      setValue(`items.${index}.child`, "");
      return;
    }
    let ignore = false;
    console.log(
      `${process.env.REACT_APP_URL}/api/getParamsInventory/${productModelID}`
    );
    axios
      .get(
        `${process.env.REACT_APP_URL}/api/getParamsInventory/${productModelID}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: sanctumToken,
          },
        }
      )
      .then((res) => {
        if (ignore) return;
        const data = res.data?.raw_result || [];
        console.log("childOptions data", res.data);
        setChildOptions(data);
        setValue(`items.${index}.child`, "");
      })
      .catch(() => {
        if (ignore) return;
        setChildOptions([]);
        setValue(`items.${index}.child`, "");
      });
    return () => {
      ignore = true;
    };
  }, [productModelID, index, sanctumToken, setValue]);

  // Memoize setValue for this row
  const setRowValue = React.useCallback(
    (name, value) => setValue(`items.${index}.${name}`, value),
    [setValue, index]
  );
  console.log("childOptions", childOptions);
  return (
    <Box sx={{ width: "100%", mb: 2 }}>
      <Grid container spacing={2} alignItems="center">
        {/* ✅ ProductModelID as SelectComponent */}
        <p>{index + 1}</p>
        <Grid item xs={7} sm={2.5}>
          {/* <Controller
            name={`items.${index}.ProductModelID`}
            control={control}
            render={({ field }) => (
              <>
                <SelectComponent
                  {...field}
                  value={itemSelect[index] || null}
                  onChange={(selectedOption) => {
                    const selectedItem = allItems.find(
                      (item) => item.ProductModelID === selectedOption.value
                    );

                    setValue(
                      `items.${index}.ProductModelID`,
                      selectedItem.ProductModelID
                    );
                    setValue(
                      `items.${index}.BrandName`,
                      selectedItem.BrandName
                    );
                    setValue(
                      `items.${index}.BrandMasterID`,
                      selectedItem.BrandMasterID
                    );
                    setValue(
                      `items.${index}.ModelNumber`,
                      selectedItem.ModelNumber
                    );
                    setValue(`items.${index}.MRP`, selectedItem.Price || 0);

                    const quantity = Number(
                      watch(`items.${index}.Quantity`) || 0
                    );
                    setValue(
                      `items.${index}.result`,
                      (selectedItem.Price || 0) * quantity
                    );

                    setValue(
                      `items.${index}.AvailableQuantity`,
                      selectedItem.AvailableQuantity
                    );
                    setValue(`items.${index}.StripeOf`, selectedItem.StripOf);
                    setValue(`items.${index}.StripeQty`, 0);
                    setValue(`items.${index}.lQty`, 0);
                    setValue(`items.${index}.CGSTP`, selectedItem.CGSTP || 0);
                    setValue(`items.${index}.SGSTP`, selectedItem.SGSTP || 0);
                    setValue(`items.${index}.Price`, 0);
                    setValue(`items.${index}.result`, 0);
                    setValue(`items.${index}.discount`, 0);
                    setValue("GrandTotalAmount", 0);
                    setValue("NetTotalAmount", 0);
                    setValue("TotalDiscount", 0);
                    setValue("dueAmount", 0);
                    setValue("totalGst", 0);

                    updateResult();

                    field.onChange(selectedOption.value);

                    const newItemSelect = [...itemSelect];
                    newItemSelect[index] = {
                      value: selectedItem.ProductModelID,
                      label: `${selectedItem.BrandName} ${selectedItem.ModelNumber}`,
                    };
                    setItemSelect(newItemSelect);
                  }}
                  options={itemOptions}
                  placeholder="Select Product"
                  isSearchable={true}
                  // style={{ heigh:  }} <-- Remove this line
                />
              </>
            )}
          /> */}
          <Controller
            name={`items.${index}.ProductModelID`}
            control={control}
            rules={{ required: "Product is required" }}
            render={({ field }) => {
              const selectedItem = allItems.find(
                (item) => item.ProductModelID === field.value
              );

              const selectedValue = selectedItem
                ? {
                    value: selectedItem.ProductModelID,
                    label: ` ${selectedItem.ModelNumber}`,
                  }
                : null;

              return (
                <SelectComponent
                  {...field}
                  value={selectedValue}
                  onChange={(selectedOption) => {
                    const selected = allItems.find(
                      (item) => item.ProductModelID === selectedOption.value
                    );

                    if (selected) {
                      setValue(
                        `items.${index}.ProductModelID`,
                        selected.ProductModelID
                      );
                      setValue(`items.${index}.BrandName`, selected.BrandName);
                      setValue(
                        `items.${index}.BrandMasterID`,
                        selected.BrandMasterID
                      );
                      setValue(
                        `items.${index}.ModelNumber`,
                        selected.ModelNumber
                      );
                      setValue(`items.${index}.MRP`, selected.Price || 0);
                      setValue(
                        `items.${index}.AvailableQuantity`,
                        selected.AvailableQuantity
                      );
                      setValue(`items.${index}.StripeOf`, selected.StripOf);
                      setValue(`items.${index}.StripeQty`, 0);
                      setValue(`items.${index}.lQty`, 0);
                      setValue(`items.${index}.CGSTP`, selected.CGSTP || 5);
                      setValue(`items.${index}.SGSTP`, selected.SGSTP || 5);
                      setValue(`items.${index}.Price`, 0);
                      setValue(`items.${index}.result`, 0);
                      setValue(`items.${index}.discount`, 0);

                      // reset totals
                      setValue("GrandTotalAmount", 0);
                      setValue("NetTotalAmount", 0);
                      setValue("TotalDiscount", 0);
                      setValue("dueAmount", 0);
                      setValue("totalGst", 0);

                      updateResult();
                    }

                    // update RHF value
                    field.onChange(selectedOption.value);
                  }}
                  options={itemOptions}
                  placeholder="Select Product"
                  isSearchable
                />
              );
            }}
          />

          {errors.items?.[index]?.ProductModelID && (
            <FormHelperText sx={{ color: "red" }}>
              {errors.items[index].ProductModelID.message}
            </FormHelperText>
          )}
          {/* <Typography
            variant="body2"
            color="textSecondary"
            sx={{ mt: 1, textAlign: "center" }}
          >
            Available: {watch(`items.${index}.AvailableQuantity`) || 0}
          </Typography> */}
        </Grid>

        {/* ✅ Child Dropdown */}
        <Grid item xs={1.3}>
          <Controller
            name={`items.${index}.child`}
            control={control}
            render={({ field }) => {
              const fieldError = errors?.items?.[index]?.child;

              return (
                <TextField
                  select
                  label="Batch No"
                  fullWidth
                  {...field}
                  disabled={!childOptions.length}
                  error={!!fieldError}
                  helperText={fieldError ? fieldError.message : ""}
                  onChange={(e) => {
                    const value = e.target.value;

                    field.onChange(value); // ✅ Correct
                    setValue(`items.${index}.child`, e.target.value);
                    const selectedChild = childOptions.find(
                      (child) => child.BatchNo === e.target.value
                    );
                    setValue(
                      `items.${index}.ExpiryDate`,
                      formatDateTime(selectedChild?.ExpiryDate)
                    );

                    setValue(`items.${index}.MRP`, selectedChild?.MRP || 0);
                    setValue(`items.${index}.StripOf`, selectedChild?.MRP || 0);
                  }}
                >
                  {childOptions.length > 0 ? (
                    childOptions.map((opt, idx) => (
                      <MenuItem key={idx} value={opt.BatchNo}>
                        {opt.BatchNo} - {formatDateTime(opt?.ExpiryDate)}-{" "}
                        {opt?.Quantity}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No result</MenuItem>
                  )}
                </TextField>
              );
            }}
          />
        </Grid>

        {/* ✅ Description */}

        <Grid item xs={5} sm={0.85}>
          <Controller
            name={`items.${index}.MRP`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="MRP"
                sx={{
                  background: "white",
                  ...greenBorderStyle,
                  "& .MuiInputBase-root": {
                    height: "3.2rem",
                  },
                }}
                error={!!errors.items?.[index]?.MRP}
                defaultValue={0}
                helperText={errors.items?.[index]?.MRP?.message}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  updateResult(index); // Trigger calculation
                }}
              />
            )}
          />
          {/* {errors.items?.[index]?.MRP && (
                                <FormHelperText sx={{ color: "red" }}>
                                  {errors.items[index].MRP.message}
                                </FormHelperText>
                              )} */}
        </Grid>
        <Grid item xs={5} sm={0.85}>
          <Controller
            name={`items.${index}.StripeOf`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Stripe Of"
                sx={{
                  background: "white",
                  ...greenBorderStyle,
                  "& .MuiInputBase-root": {
                    height: "3.2rem",
                  },
                }}
                error={!!errors.items?.[index]?.StripeOf}
                defaultValue={0}
                helperText={errors.items?.[index]?.StripeOf?.message}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  updateResult(index); // Trigger calculation
                }}
              />
            )}
          />
          {/* {errors.items?.[index]?.StripeOf && (
                                <FormHelperText sx={{ color: "red" }}>
                                  {errors.items[index].StripeOf.message}
                                </FormHelperText>
                              )} */}
        </Grid>
        <Grid item xs={5} sm={0.85}>
          <Controller
            name={`items.${index}.StripeQty`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Stripe Qty"
                sx={{
                  background: "white",
                  ...greenBorderStyle,
                  "& .MuiInputBase-root": {
                    height: "3.2rem",
                  },
                }}
                error={!!errors.items?.[index]?.StripeQty}
                defaultValue={0}
                helperText={errors.items?.[index]?.StripeQty?.message}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  updateResult(index); // Trigger calculation
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={5} sm={0.85}>
          <Controller
            name={`items.${index}.lQty`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="L. Qty"
                sx={{
                  background: "white",
                  ...greenBorderStyle,
                  "& .MuiInputBase-root": {
                    height: "3.2rem",
                  },
                }}
                error={!!errors.items?.[index]?.StripeQty}
                defaultValue={0}
                helperText={errors.items?.[index]?.StripeQty?.message}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  updateResult(index); // Trigger calculation
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={5} sm={0.85}>
          <Controller
            name={`items.${index}.Price`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Rate"
                sx={{
                  background: "white",
                  ...greenBorderStyle,
                  "& .MuiInputBase-root": {
                    height: "3.2rem",
                  },
                }}
                error={!!errors.items?.[index]?.Price}
                defaultValue={0}
                helperText={errors.items?.[index]?.Price?.message}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  updateResult(index); // Trigger calculation
                }}
              />
            )}
          />
          {/* {errors.items?.[index]?.Price && (
                                <FormHelperText sx={{ color: "red" }}>
                                  {errors.items[index].Price.message}
                                </FormHelperText>
                              )} */}
        </Grid>

        <Grid item xs={5} sm={0.85}>
          <Controller
            name={`items.${index}.discount`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                defaultValue={5}
                fullWidth
                label="Discount%"
                sx={{
                  background: "white",
                  ...greenBorderStyle,
                  "& .MuiInputBase-root": {
                    height: "3.2rem",
                  },
                }}
                error={!!errors.items?.[index]?.discount}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  updateResult(index); // Trigger calculation
                }}
              />
            )}
          />
          {errors.items?.[index]?.SGSTP && (
            <FormHelperText sx={{ color: "red" }}>
              {errors.items[index].SGSTP.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid item xs={5} sm={0.85}>
          <Controller
            name={`items.${index}.SGSTP`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                defaultValue={5}
                fullWidth
                label="SGSTP"
                sx={{
                  background: "white",
                  ...greenBorderStyle,
                  "& .MuiInputBase-root": {
                    height: "3.2rem",
                  },
                }}
                error={!!errors.items?.[index]?.SGSTP}
                helperText={errors.items?.[index]?.SGSTP?.message}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  updateResult(index); // Trigger calculation
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={5} sm={0.85}>
          <Controller
            name={`items.${index}.CGSTP`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="CGSTP"
                sx={{
                  background: "white",
                  ...greenBorderStyle,
                  "& .MuiInputBase-root": {
                    height: "3.2rem",
                  },
                }}
                error={!!errors.items?.[index]?.CGSTP}
                defaultValue={5}
                helperText={errors.items?.[index]?.CGSTP?.message}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  updateResult(index); // Trigger calculation
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={5} sm={1}>
          <Controller
            name={`items.${index}.result`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                sx={{
                  background: "white",
                  ...greenBorderStyle,
                  "& .MuiInputBase-root": {
                    height: "3.2rem",
                  },
                }}
                label="Total"
                defaultValue={5}
                variant="outlined"
                size="small"
                fullWidth
                InputLabelProps={{
                  shrink: true, // Keeps the label inside the field even when focused or filled
                }}
                InputProps={{
                  readOnly: true, // Makes the TextField read-only
                }}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
});
