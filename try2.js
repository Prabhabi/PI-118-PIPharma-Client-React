import React, { useRef, useEffect, useState } from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { TextField, MenuItem, Button, Grid, Box } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";

// ✅ ItemRow Component: One row of the form
const ItemRow = ({
  control,
  index,
  setValue,
  childOptionsRef,
  sanctumToken,
}) => {
  const parentValue = useWatch({
    control,
    name: `items.${index}.parent`,
  });

  const [_, forceRender] = useState(0); // trigger re-render
  console.log("ok");

  useEffect(() => {
    if (
      parentValue &&
      (!childOptionsRef.current[index] ||
        childOptionsRef.current[index].fetchedForId !== parentValue)
    ) {
      axios
        .get(
          `${process.env.REACT_APP_URL}/api/getParamsInventory/${parentValue}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: sanctumToken,
            },
          }
        )
        .then((res) => {
          const data = res.data?.InventoryDetails || [];
          childOptionsRef.current[index] = {
            options: data,
            fetchedForId: parentValue,
          };
          setValue(`items.${index}.child`, "");
          forceRender((prev) => prev + 1); // 🔁 trigger re-render
        })
        .catch((err) => {
          console.error(`Error fetching for parent ${parentValue}`, err);
        });
    }
  }, [parentValue, index, sanctumToken, setValue]);

  const childOptions = childOptionsRef.current[index]?.options || [];

  return (
    <Box sx={{ mb: 2 }}>
      <Grid container spacing={2} alignItems="center">
        {/* Parent Dropdown */}
        <Grid item xs={4}>
          <Controller
            name={`items.${index}.parent`}
            control={control}
            render={({ field }) => (
              <TextField select label="Parent" fullWidth {...field}>
                <MenuItem value="1506">Parent 1</MenuItem>
                <MenuItem value="1502">Parent 2</MenuItem>
                <MenuItem value="3">Parent 3</MenuItem>
              </TextField>
            )}
          />
        </Grid>

        {/* Child Dropdown */}
        <Grid item xs={4}>
          <Controller
            name={`items.${index}.child`}
            control={control}
            render={({ field }) => (
              <TextField
                select
                label="Child"
                fullWidth
                {...field}
                disabled={childOptions === undefined}
              >
                {childOptions.length > 0 ? (
                  childOptions.map((opt, idx) => (
                    <MenuItem key={idx} value={opt.BatchNo || opt.ID}>
                      {opt.BatchNo || `Batch ${opt.ID}`}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No result</MenuItem>
                )}
              </TextField>
            )}
          />
        </Grid>

        {/* Description Field */}
        <Grid item xs={4}>
          <Controller
            name={`items.${index}.description`}
            control={control}
            render={({ field }) => (
              <TextField label="Description" fullWidth {...field} />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

// ✅ Main Form Component
const InvoiceCreateDialogFormS = () => {
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      items: [{ parent: "", child: "", description: "" }],
    },
  });

  const { fields, append } = useFieldArray({
    control,
    name: "items",
  });

  const token = Cookies.get("token");
  const sanctumToken = token ? `Bearer ${token.replace(/"/g, "")}` : "";

  const childOptionsRef = useRef({}); // Store fetched child options by index

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field, index) => (
        <ItemRow
          key={field.id}
          control={control}
          index={index}
          setValue={setValue}
          childOptionsRef={childOptionsRef}
          sanctumToken={sanctumToken}
        />
      ))}

      <Box sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          onClick={() => append({ parent: "", child: "", description: "" })}
          sx={{ mr: 2 }}
        >
          Add Row
        </Button>

        <Button variant="contained" type="submit">
          Submit
        </Button>
      </Box>
    </form>
  );
};

export default InvoiceCreateDialogFormS;



import React, { useEffect, useState } from "react";
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
// Import your SelectComponent and styles
import SelectComponent from "./component/SelectComponent";

// ✅ Memoized Row Component
const InvoiceRow = React.memo(function InvoiceRow({
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
  selectComponentStyles,
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
  console.log("ok");
  useEffect(() => {
    if (!productModelID) {
      setChildOptions([]);
      setValue(`items.${index}.child`, "");
      return;
    }
    let ignore = false;
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
        const data = res.data?.InventoryDetails || [];
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

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        {/* ✅ ProductModelID as SelectComponent */}
        <Grid item xs={7} sm={1.5}>
          <Controller
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
                />
              </>
            )}
          />
          {errors.items?.[index]?.ProductModelID && (
            <FormHelperText sx={{ color: "red" }}>
              {errors.items[index].ProductModelID.message}
            </FormHelperText>
          )}
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ mt: 1, textAlign: "center" }}
          >
            Available: {watch(`items.${index}.AvailableQuantity`) || 0}
          </Typography>
        </Grid>

        {/* ✅ Child Dropdown */}
        <Grid item xs={3}>
          <Controller
            name={`items.${index}.child`}
            control={control}
            render={({ field }) => (
              <TextField
                select
                label="Child"
                fullWidth
                {...field}
                disabled={!childOptions.length}
              >
                {childOptions.length > 0 ? (
                  childOptions.map((opt, idx) => (
                    <MenuItem key={idx} value={opt.BatchNo || opt.ID}>
                      {opt.BatchNo || `Batch ${opt.ID}`}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No result</MenuItem>
                )}
              </TextField>
            )}
          />
        </Grid>

        {/* ✅ Description */}
        <Grid item xs={3}>
          <Controller
            name={`items.${index}.description`}
            control={control}
            render={({ field }) => (
              <TextField label="Description" fullWidth {...field} />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
});

// ✅ Main Component
const InvoiceCreateDialogFormS = ({ allItems }) => {
  const token = Cookies.get("token");
  const sanctumToken = token ? `Bearer ${token.replace(/"/g, "")}` : "";

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      items: [{ ProductModelID: "", child: "", description: "" }],
    },
  });

  const { fields, append } = useFieldArray({
    control,
    name: "items",
  });

  const itemOptions = allItems.map((item) => ({
    value: item.ProductModelID,
    label: `${item.BrandName} ${item.ModelNumber}`,
  }));

  // Local state for SelectComponent value per row
  const [itemSelect, setItemSelect] = useState(fields.map(() => null));

  // Ensure itemSelect stays in sync with fields
  useEffect(() => {
    if (fields.length > itemSelect.length) {
      setItemSelect((prev) => [
        ...prev,
        ...Array(fields.length - prev.length).fill(null),
      ]);
    }
  }, [fields.length, itemSelect.length]);

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field, index) => (
        <InvoiceRow
          key={field.id}
          field={field}
          index={index}
          control={control}
          allItems={allItems}
          itemOptions={itemOptions}
          setValue={setValue}
          errors={errors}
          sanctumToken={sanctumToken}
          itemSelect={itemSelect}
          setItemSelect={setItemSelect}
          watch={watch}
        />
      ))}

      <Box sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          onClick={() =>
            append({
              ProductModelID: "",
              child: "",
              description: "",
            })
          }
          sx={{ mr: 2 }}
        >
          Add Row
        </Button>

        <Button variant="contained" type="submit">
          Submit
        </Button>
      </Box>
    </form>
  );
};

export default InvoiceCreateDialogFormS;



  {fields.map((field, index) => {
                return (
                  <Stack
                    direction="row"
                    key={field.id}
                    sx={{
                      width: "100%",
                      justifyContent: "space-evenly",
                      rowGap: 5,
                      mb: 2,
                    }}
                  >
                    <p>{index + 1}.</p>

                    <Grid item xs={7} sm={1.5}>
                      <Controller
                        name={`items.${index}.ProductModelID`}
                        control={control}
                        render={({ field }) => (
                          <>
                            <SelectComponent
                              {...field}
                              value={itemSelect[index] || null}
                              onChange={(selectedOption) => {
                                const selectedItem = allItems.find(
                                  (item) =>
                                    item.ProductModelID === selectedOption.value
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
                                setValue(
                                  `items.${index}.MRP`,
                                  selectedItem.Price || 0
                                );

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
                                setValue(
                                  `items.${index}.StripeOf`,
                                  selectedItem.StripOf
                                );

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
                            />
                          </>
                        )}
                      />
                      {errors.items?.[index]?.ProductModelID && (
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.items[index].ProductModelID.message}
                        </FormHelperText>
                      )}
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ mt: 1, textAlign: "center" }}
                      >
                        Available:{" "}
                        {watch(`items.${index}.AvailableQuantity`) || 0}
                      </Typography>
                    </Grid>

                    {/* ✅ Child Dropdown */}
                    <Grid item xs={3}>
                      <Controller
                        name={`items.${index}.child`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            select
                            label="Child"
                            fullWidth
                            {...field}
                            disabled={!childOptions.length}
                          >
                            {childOptions.length > 0 ? (
                              childOptions.map((opt, idx) => (
                                <MenuItem
                                  key={idx}
                                  value={opt.BatchNo || opt.ID}
                                >
                                  {opt.BatchNo || `Batch ${opt.ID}`}
                                </MenuItem>
                              ))
                            ) : (
                              <MenuItem disabled>No result</MenuItem>
                            )}
                          </TextField>
                        )}
                      />
                    </Grid>

                    <Grid item xs={5} sm={1}>
                      <Controller
                        name={`items.${index}.ExpiryDate`}
                        control={control}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              {...field}
                              label="Expiry Date"
                              sx={{
                                background: "white",
                                ...greenBorderStyle,
                                "& .MuiInputBase-root": {
                                  height: "3.2rem",
                                },
                              }}
                              format="DD-MM-YYYY"
                              value={
                                field.value
                                  ? dayjs(field.value, "YYYY-MM-DD")
                                  : null
                              }
                              onChange={(newValue) => {
                                const formatted = newValue
                                  ? dayjs(newValue).format("YYYY-MM-DD")
                                  : "";
                                field.onChange(formatted);
                                updateResult(index);
                              }}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      {errors.items?.[index]?.ExpiryDate && (
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.items[index].ExpiryDate.message}
                        </FormHelperText>
                      )}
                    </Grid>
                    <Grid item xs={5} sm={0.8}>
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
                    <Grid item xs={5} sm={0.8}>
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
                            helperText={
                              errors.items?.[index]?.StripeOf?.message
                            }
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
                    <Grid item xs={5} sm={0.8}>
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
                            helperText={
                              errors.items?.[index]?.StripeQty?.message
                            }
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              updateResult(index); // Trigger calculation
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={5} sm={0.8}>
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
                            helperText={
                              errors.items?.[index]?.StripeQty?.message
                            }
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              updateResult(index); // Trigger calculation
                            }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={5} sm={0.8}>
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

                    <Grid item xs={5} sm={0.8}>
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
                            helperText={errors.items?.[index]?.SGSTP?.message}
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
                    <Grid item xs={5} sm={0.8}>
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
                      {errors.items?.[index]?.SGSTP && (
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.items[index].SGSTP.message}
                        </FormHelperText>
                      )}
                    </Grid>

                    <Grid item xs={5} sm={0.8}>
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
                      {errors.items?.[index]?.CGSTP && (
                        <FormHelperText sx={{ color: "red" }}>
                          {errors.items[index].CGSTP.message}
                        </FormHelperText>
                      )}
                    </Grid>
                    <Grid item xs={5} sm={0.8}>
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

                    <IconButton
                      color="error"
                      onClick={() => {
                        removeFn(index);
                        updateResult(0);
                      }}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        mt: 1,
                      }}
                    >
                      <DeleteIcon style={{ color: "red" }} />
                    </IconButton>
                  </Stack>
                );
              })}