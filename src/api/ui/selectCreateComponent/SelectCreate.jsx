import React, { useEffect } from "react";
import { Controller } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import Box from "@mui/material/Box";
const selectComponentStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#ffffff",
    borderColor: "blue", // Always blue border
    boxShadow: "none",
    minHeight: "50px",
    "&:hover": {
      borderColor: "blue",
    },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#ffffff",
    boxShadow: "none",
    zIndex: 100,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "blue" : "#ffffff",
    color: state.isFocused ? "#fff" : "#000",
    padding: "10px",
    "&:hover": {
      color: "#fff",
    },
  }),
  singleValue: (base) => ({
    ...base,
    color: "blue",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "blue",
    color: "#fff",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#fff",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#fff",
    "&:hover": {
      backgroundColor: "blue",
      color: "#fff",
    },
  }),
};

export default function SelectCreate({
  control,
  options,
  onCreateFn,
  warningDataFn,
  selectedfetchData,
  name,
  label,
  postDone,
}) {
  // useEffect(() => {
  //   if (postDone) {
  //     control.setValue(name, options[0]);
  //   }
  // }, [postDone, control, name, options]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Box sx={{ mb: 2 }}>
          {/* {label && (
            <label
              style={{
                display: "block",
                marginBottom: 4,
                color: "blue",
                fontWeight: 500,
              }}
            >
              {label}
            </label>
          )} */}
          <CreatableSelect
            {...field}
            options={options}
            onChange={async (selectedOption) => {
              console.log("Selected Option:", selectedOption);
              if (selectedOption?.__isNew__) {
                // User typed a new value

                // const newValue = found
                //   ? found
                //   : {
                //       label: selectedOption.value,
                //       value: selectedfetchData,
                //       __isNew__: true,
                //     };
                onCreateFn(selectedOption.value);
                // if (result && typeof result.then === "function") {
                //   await result;
                // }
                // field.onChange(options[0]);
              } else if (selectedOption) {
                // User selected from options
                field.onChange(selectedOption.value);
              } else {
                field.onChange("");
              }
            }}
            onBlur={field.onBlur}
            styles={{
              ...selectComponentStyles,
            }}
            value={
              field.value
                ? typeof field.value === "number" ||
                  typeof field.value === "string"
                  ? options.find((opt) => opt.value === field.value) || {
                      label: field.value,
                      value: field.value,
                    }
                  : field.value
                : null
            }
            placeholder={label}
            isClearable
          />
        </Box>
      )}
    />
  );
}
