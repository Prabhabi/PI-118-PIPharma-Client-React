import React, { useEffect } from "react";
import { Controller } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import Box from "@mui/material/Box";
const selectComponentStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#ffffff",
    borderColor: "sky", // Always  border
    boxShadow: "none",
    minHeight: "56px", // increased from 50px
    height: "56px", // explicitly set height
    "&:hover": {
      borderColor: "sky",
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
    color: "sky",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "sky",
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
      backgroundColor: "sky",
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
                color: "",
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
                console.log("1");
              } else if (selectedOption) {
                // User selected from options
                field.onChange(selectedOption); // Pass the whole option object
                console.log("2");
              } else {
                field.onChange(null);
                console.log("3");
              }
            }}
            onBlur={field.onBlur}
            styles={{
              ...selectComponentStyles,
            }}
            value={
              field.value
                ? typeof field.value === "object"
                  ? field.value
                  : options.find((opt) => opt.value === field.value) || null
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
