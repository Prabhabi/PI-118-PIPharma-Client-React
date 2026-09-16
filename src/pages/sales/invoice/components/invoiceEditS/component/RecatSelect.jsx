import React from "react";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";

export default function RecatSelect({ options, name }) {
  console.log("aa");
  const { control } = useForm();
  return (
    <div>
      {" "}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            options={options}
            // onChange={(selectedOption) => field.onChange(selectedOption.value)}
            value={options.find((option) => option.value === field.value)}
          />
        )}
      />
    </div>
  );
}
