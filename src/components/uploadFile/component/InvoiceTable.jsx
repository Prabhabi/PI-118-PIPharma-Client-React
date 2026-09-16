import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const InvoiceTable = ({ invoiceData }) => {
  const { control, register, watch } = useForm({
    defaultValues: {
      products: [
        {
          productName: invoiceData?.["Product Details"]?.["No. Product"] || "",
          model: invoiceData?.["Product Details"]?.Model || "",
          quantity: invoiceData?.["Product Details"]?.Qty?.split(" ")[0] || "",
          boxQuantity:
            invoiceData?.["Product Details"]?.Qty?.split("Box Qty: ")[1]?.split(
              " "
            )[0] || "",
          price: invoiceData?.["Product Details"]?.Price || "",
          discount:
            invoiceData?.["Product Details"]?.Discount?.replace("%", "") || "",
          amount: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  // Watch all fields for calculations
  const watchFieldArray = watch("products");
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  // Calculate amount for each row
  const calculateAmount = (price, quantity, discount) => {
    const numPrice = parseFloat(price) || 0;
    const numQuantity = parseFloat(quantity) || 0;
    const numDiscount = parseFloat(discount) || 0;
    const subtotal = numPrice * numQuantity;
    const discountAmount = (subtotal * numDiscount) / 100;
    return subtotal - discountAmount;
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product Name</TableCell>
            <TableCell>Model</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Box Quantity</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Discount (%)</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {controlledFields.map((field, index) => {
            const amount = calculateAmount(
              field.price,
              field.quantity,
              field.discount
            );

            return (
              <TableRow key={field.id}>
                <TableCell>
                  <input
                    {...register(`products.${index}.productName`)}
                    style={{ width: "100%" }}
                  />
                </TableCell>
                <TableCell>
                  <input
                    {...register(`products.${index}.model`)}
                    style={{ width: "100%" }}
                  />
                </TableCell>
                <TableCell>
                  <input
                    type="number"
                    {...register(`products.${index}.quantity`)}
                    style={{ width: "100%" }}
                  />
                </TableCell>
                <TableCell>
                  <input
                    type="number"
                    {...register(`products.${index}.boxQuantity`)}
                    style={{ width: "100%" }}
                  />
                </TableCell>
                <TableCell>
                  <input
                    type="number"
                    {...register(`products.${index}.price`)}
                    style={{ width: "100%" }}
                  />
                </TableCell>
                <TableCell>
                  <input
                    type="number"
                    {...register(`products.${index}.discount`)}
                    style={{ width: "100%" }}
                  />
                </TableCell>
                <TableCell>₹{amount.toFixed(2)}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => remove(index)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Button
        variant="contained"
        onClick={() =>
          append({
            productName: "",
            model: "",
            quantity: "",
            boxQuantity: "",
            price: "",
            discount: "",
            amount: 0,
          })
        }
        sx={{ mt: 2, ml: 2, mb: 2 }}
      >
        Add Product
      </Button>
    </TableContainer>
  );
};

export default InvoiceTable;
