import React, { useEffect, useState } from "react";
import SelectCreate from "../../../../api/ui/selectCreateComponent/SelectCreate";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box } from "@mui/material";

const onCreateCompany = async (newValue) => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newValue }),
    });
    const result = await response.json();
    alert(`Created new: ${result.name || newValue}`);
  } catch (error) {
    alert("Failed to create new company");
  }
};

const selectedfetchData = "cat1";
const postDone = false;

const schema = yup.object().shape({
  ProductSubCategoryID: yup.string().required("Sub-category is required"),
});

export default function TestSearchCreate() {
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ProductSubCategoryID: "",
    },
  });

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((users) => {
        const options = users.map((user) => ({
          value: user.id,
          label: user.email,
        }));
        setSubCategoryOptions(options);
      });
  }, []);

  const onSubmit = (data) => {
    alert(JSON.stringify(data));
  };

  return (
    <Box sx={{ width: "100%", padding: 2, height: "100vh" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SelectCreate
          control={control}
          options={subCategoryOptions}
          onCreateFn={onCreateCompany}
          selectedfetchData={selectedfetchData}
          name="ProductSubCategoryID"
          label="Product Sub-Category"
          postDone={postDone}
        />
        {errors.ProductSubCategoryID && (
          <p style={{ color: "red" }}>{errors.ProductSubCategoryID.message}</p>
        )}
        <button type="submit">Submit</button>
      </form>
    </Box>
  );
}
