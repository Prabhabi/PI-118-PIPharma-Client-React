import React, { useState } from "react";
import {
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Typography,
    Button,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
} from "@mui/material";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import { Controller, useForm, useWatch } from "react-hook-form";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import EmailIcon from '@mui/icons-material/Email';

const roundedStyle = () => ({
    borderRadius: "10px",
});

const ReturnInvoice = () => {
    const { control, handleSubmit, watch } = useForm();
    const [printType, setPrintType] = useState(1);

    // Watch form values
    const watchDiscount = watch("discount", 0);
    const watchSGSTP = watch("SGSTP", 18);
    const watchCGSTP = watch("CGSTP", 18);
    const watchRoundUpAmount = watch("roundUpAmount", 0);
    const watchTotalAmount = watch("totalAmount", 0);

    // Calculations
    const finalAmount =
        watchTotalAmount - (watchDiscount || 0);
    const sgstValue = (finalAmount * (watchSGSTP / 100)).toFixed(2);
    const cgstValue = (finalAmount * (watchCGSTP / 100)).toFixed(2);
    const finalPriceWithGST =
        parseFloat(finalAmount) +
        parseFloat(sgstValue) +
        parseFloat(cgstValue) -
        parseFloat(watchRoundUpAmount);

    const onSubmit = (data) => {
        // console.log("Submitted Data: ", data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} sx={{ mt: 2, justifyContent: "center" }}>
                <Grid item xs={12} sm={3}>
                    <Controller
                        name="discountDesc"
                        control={control}
                        defaultValue="festival discount"
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Discount Description"
                                fullWidth
                                sx={roundedStyle()}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                        <InputLabel id="discount-type-label">Discount Unit</InputLabel>
                        <Controller
                            name="discountUnit"
                            control={control}
                            defaultValue="P"
                            render={({ field }) => (
                                <Select
                                    labelId="discount-type-label"
                                    label="Discount Unit"
                                    {...field}
                                    sx={roundedStyle()}
                                >
                                    <MenuItem value="P">Percentage</MenuItem>
                                    <MenuItem value="C">Cash</MenuItem>
                                </Select>
                            )}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Controller
                        name="SGSTP"
                        control={control}
                        defaultValue={18}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="SGST Percentage"
                                sx={roundedStyle()}
                                fullWidth
                                type="number"
                                InputProps={{ inputProps: { min: 0 } }}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Controller
                        name="CGSTP"
                        control={control}
                        defaultValue={18}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="CGST Percentage"
                                sx={roundedStyle()}
                                fullWidth
                                type="number"
                                InputProps={{ inputProps: { min: 0 } }}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Controller
                        name="discount"
                        control={control}
                        defaultValue={0}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Discount"
                                sx={roundedStyle()}
                                fullWidth
                                type="number"
                                InputProps={{ inputProps: { min: 0 } }}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Controller
                        name="roundUpAmount"
                        control={control}
                        defaultValue={0}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Roundup Amount"
                                sx={roundedStyle()}
                                fullWidth
                                type="number"
                                InputProps={{ inputProps: { min: 0 } }}
                            />
                        )}
                    />
                </Grid>

                <Table
                    sx={{
                        width: "100%",
                        borderCollapse: "collapse",
                        backgroundColor: "#fff",mt:5
                    }}
                >
                    <TableHead sx={{mt:5}}>
                        <TableRow sx={{ backgroundColor: '#1976d2' }} >
                            <TableCell sx={{ textAlign: "center", color: '#fff', fontWeight: 'bold' }}>
                                Total Price
                            </TableCell>
                            <TableCell sx={{ textAlign: "center", color: '#fff', fontWeight: 'bold' }}>
                                Final Price after Discount
                            </TableCell>
                            <TableCell sx={{ textAlign: "center", color: '#fff', fontWeight: 'bold'}}>
                                SGST {watchSGSTP}% + CGST {watchCGSTP}%
                            </TableCell>
                            <TableCell sx={{ textAlign: "center",color: '#fff', fontWeight: 'bold' }}>
                                Final Price after GST with Roundup
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell sx={{ textAlign: "center" }}>{watchTotalAmount}</TableCell>
                            <TableCell sx={{ textAlign: "center" }}>{finalAmount}</TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                                {sgstValue} + {cgstValue}
                            </TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                                {finalPriceWithGST}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <Grid item xs={12} sm={6}>
                    <Typography
                        variant="h6"
                        sx={{ display: "flex", alignItems: "center", gap: ".5rem" }}
                    >
                        <CurrencyRupeeRoundedIcon />
                        Payment Section
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <FormControl>
                        <FormLabel>Copy</FormLabel>
                        <RadioGroup
                            row
                            value={printType}
                            onChange={(e) => setPrintType(e.target.value)}
                        >
                            <FormControlLabel value={1} control={<Radio />} label="Original" />
                            <FormControlLabel
                                value={2}
                                control={<Radio />}
                                label="Original + Office Copy"
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                    <Button
                        variant="contained"
                        type="submit"
                    >
                        Print &nbsp; <PictureAsPdfIcon /></Button>

                    <Button variant="contained" color="success" sx={{ ml: 2 }}>Send &nbsp; <EmailIcon /></Button>

                </Grid>
            </Grid>
        </form>
    );
};

export default ReturnInvoice;
