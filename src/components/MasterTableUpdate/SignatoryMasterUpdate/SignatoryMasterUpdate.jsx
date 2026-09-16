import {
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Grid,
  Typography,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  DialogTitle,
  IconButton,
  DialogContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import WifiChannelIcon from "@mui/icons-material/WifiChannel";
import MuiAlert from "@mui/material/Alert";
import LoadingComp from "../../loadingComp/LoadingComp";
import ErrorComp from "../../error/ErrorComp";
import Cookies from "js-cookie"; // Import Cookies
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { signatoryMasterApiFn } from "../../../api/commonApi";
import { useQuery } from "@tanstack/react-query";

// Validation schema
const schema = yup
  .object()
  .shape({
    Name: yup
      .string()
      .required("Name is required")
      .matches(/^[A-Za-z\s]+$/, "Name is not valid"),
    // MobileNo: yup
    //   .string()
    //   .required("Mobile No is required")
    //   .matches(/^\d{10}$/, "Mobile No must be exactly 10 digits"),
    // Email: yup.string().email("Invalid email").required("Email is required"),
    CheckedBy: yup.boolean(),
    PreparedBy: yup.boolean(),
    AuthorizedSignatory: yup.boolean(),
  })
  .test("at-least-one-checked", "At least one must be checked", function (obj) {
    const { CheckedBy, PreparedBy, AuthorizedSignatory } = obj;
    if (!CheckedBy && !PreparedBy && !AuthorizedSignatory) {
      // Return error under "checkedError" path
      return this.createError({
        path: "checkedError",
        message: "At least one must be checked",
      });
    }
    return true;
  });

export default function SignatoryMasterUpdate({
  handleSignatoryMasterUpdateClose,
}) {
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [signatoryDetails, setSignatoryDetails] = React.useState({
    CheckedByList: [],
    PreparedByList: [],
    AuthorizedSignatoryList: [],
  });
  const [editId, setEditId] = useState(null);

  const token = Cookies.get("token");
  const sanctumToken = `Bearer ${token.replace(/"/g, "")}`;

  // const fetchSignatoryDetails = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_URL}/api/getsignatorydetails`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: sanctumToken,
  //         },
  //       }
  //     );
  //     const signatoryDetails = JSON.parse(
  //       response.data.data[0].SignatoryDetails
  //     ).SignatoryDetails;
  //     // console.log(signatoryDetails);
  //     const { CheckedByList, PreparedByList, AuthorizedSignatoryList } =
  //       signatoryDetails;
  //     setSignatoryDetails({
  //       CheckedByList,
  //       PreparedByList,
  //       AuthorizedSignatoryList,
  //     });
  //   } catch (error) {
  //     // console.error(error);
  //     setError(true);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   fetchSignatoryDetails();
  // }, []);

  // =======================================================================
  const { data, isLoading, refetch, isError } = useQuery({
    queryKey: ["signatoryMasterApi"],
    queryFn: signatoryMasterApiFn,
    refetchOnWindowFocus: false, // disable refetch on window focus
    refetchOnReconnect: false, // disable refetch on network reconnect
    refetchInterval: false, // disable background polling
    staleTime: Infinity,
  });
  useEffect(() => {
    const signatoryDetailsStr = data?.data?.data?.[0]?.SignatoryDetails;
    let signatoryDetails = {
      CheckedByList: [],
      PreparedByList: [],
      AuthorizedSignatoryList: [],
    };
    if (signatoryDetailsStr) {
      try {
        const parsed = JSON.parse(signatoryDetailsStr);
        if (parsed?.SignatoryDetails) {
          signatoryDetails = parsed.SignatoryDetails;
        }
      } catch (e) {
        // Optionally log error or handle as needed
      }
    }
    const { CheckedByList, PreparedByList, AuthorizedSignatoryList } =
      signatoryDetails;
    setSignatoryDetails({
      CheckedByList,
      PreparedByList,
      AuthorizedSignatoryList,
    });
  }, [data]);

  // ===================================================================
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      Name: "",
      MobileNo: "",
      Email: "",
      CheckedBy: false,
      PreparedBy: false,
      AuthorizedSignatory: false,
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const postData = {
      ...data,
      CheckedBy: data.CheckedBy ? 1 : 0,
      PreparedBy: data.PreparedBy ? 1 : 0,
      AuthorizedSignatory: data.AuthorizedSignatory ? 1 : 0,
    };
    // console.log(postData);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL}/api/postsignatorydetails`,
        postData,
        {
          headers: {
            Authorization: sanctumToken,
          },
        }
      );
      // console.log(response.data);
      setSnackbarMessage(response.data.message);
      setSnackbarOpen(true);
      reset();
      refetch();
    } catch (error) {
      // console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.put(
        `${process.env.REACT_APP_URL}/api/DeleteSignatoryDetails/${id}`,
        {},
        {
          headers: {
            Authorization: sanctumToken,
          },
        }
      );
      setSnackbarMessage("Signatory deleted successfully");
      setSnackbarOpen(true);
      refetch();
    } catch (error) {
      setSnackbarMessage("Failed to delete signatory");
      setSnackbarOpen(true);
      // console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    reset({
      Name: item.Name || "",
      MobileNo: item.Mobile || item.MobileNo || "",
      Email: item.Email || "",
      CheckedBy: signatoryDetails.CheckedByList.some((x) => x.ID === item.ID),
      PreparedBy: signatoryDetails.PreparedByList.some((x) => x.ID === item.ID),
      AuthorizedSignatory: signatoryDetails.AuthorizedSignatoryList.some(
        (x) => x.ID === item.ID
      ),
    });
    setEditId(item.ID);
  };

  const handleUpdate = async (data) => {
    setLoading(true);
    const putData = {
      Name: data.Name,
      MobileNo: data.MobileNo,
      Email: data.Email,
      CheckedBy: data.CheckedBy ? 1 : 0,
      PreparedBy: data.PreparedBy ? 1 : 0,
      AuthorizedSignatory: data.AuthorizedSignatory ? 1 : 0,
    };
    try {
      await axios.put(
        `${process.env.REACT_APP_URL}/api/UpdateSignatoryDetails/${editId}`,
        putData,
        {
          headers: {
            Authorization: sanctumToken,
          },
        }
      );
      setSnackbarMessage("Signatory updated successfully");
      setSnackbarOpen(true);
      setEditId(null);
      reset();
      refetch();
    } catch (error) {
      setSnackbarMessage("Failed to update signatory");
      setSnackbarOpen(true);
      // console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleClose = () => {
    // Handle close action
  };
  // console.log(errors);
  // console.log(signatoryDetails);
  return (
    <Box>
      <DialogTitle
        sx={{
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WifiChannelIcon /> Add Signatory Details
        </Box>
        <IconButton
          sx={{ color: "white" }}
          onClick={handleSignatoryMasterUpdateClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: "left", position: "relative" }}>
          {/* <CloseIcon
            sx={{ position: "absolute", top: 16, right: 16, cursor: "pointer" }}
          /> */}
          {/* <Typography
            variant="h5"
            sx={{
              marginLeft: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              mt: 2,
              fontWeight: "bold",
              color: "#395c45",
            }}
          >
            <WifiChannelIcon /> Add Signatory Details
          </Typography> */}
          <Box sx={{ p: 3, textAlign: "center", p: 5 }}>
            <form onSubmit={handleSubmit(editId ? handleUpdate : onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="Name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        error={!!errors.Name}
                        helperText={errors.Name ? errors.Name.message : ""}
                        InputLabelProps={{ style: { color: "#0078cf" } }}
                        InputProps={{
                          style: { color: "#0078cf" },
                          classes: { notchedOutline: "green-border" },
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "#0078cf",
                            },
                            "&:hover fieldset": {
                              borderColor: "#0078cf",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#0078cf",
                            },
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="MobileNo"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Mobile No"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        error={!!errors.MobileNo}
                        helperText={
                          errors.MobileNo ? errors.MobileNo.message : ""
                        }
                        InputLabelProps={{ style: { color: "#0078cf" } }}
                        InputProps={{
                          style: { color: "#0078cf" },
                          classes: { notchedOutline: "green-border" },
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "#0078cf",
                            },
                            "&:hover fieldset": {
                              borderColor: "#0078cf",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#0078cf",
                            },
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="Email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        error={!!errors.Email}
                        helperText={errors.Email ? errors.Email.message : ""}
                        InputLabelProps={{ style: { color: "#0078cf" } }}
                        InputProps={{
                          style: { color: "#0078cf" },
                          classes: { notchedOutline: "green-border" },
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "#0078cf",
                            },
                            "&:hover fieldset": {
                              borderColor: "#0078cf",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#0078cf",
                            },
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Controller
                    name="CheckedBy"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            {...field}
                            checked={field.value}
                            sx={{
                              color: "#0078cf",
                              "&.Mui-checked": {
                                color: "#0078cf",
                              },
                            }}
                          />
                        }
                        label="Checked By"
                      />
                    )}
                  />
                  <Controller
                    name="PreparedBy"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            {...field}
                            checked={field.value}
                            sx={{
                              color: "#0078cf",
                              "&.Mui-checked": {
                                color: "#0078cf",
                              },
                            }}
                          />
                        }
                        label="Prepared By"
                      />
                    )}
                  />
                  <Controller
                    name="AuthorizedSignatory"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            {...field}
                            checked={field.value}
                            sx={{
                              color: "#0078cf",
                              "&.Mui-checked": {
                                color: "#0078cf",
                              },
                            }}
                          />
                        }
                        label="Authorized Signatory"
                      />
                    )}
                  />

                  {/* Display the validation message for "at-least-one-checked" */}
                  {errors && errors["checkedError"] && (
                    <Typography color="error" sx={{ mt: 1 }}>
                      {errors["checkedError"].message}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{
                      backgroundColor: "#0078cf",
                      width: "6rem",
                      height: "3rem",
                    }}
                  >
                    {editId ? "Update" : "Submit"}
                  </Button>
                  {editId && (
                    <Button
                      variant="outlined"
                      sx={{ ml: 2, height: "3rem" }}
                      onClick={() => {
                        reset();
                        setEditId(null);
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead
                        sx={{ backgroundColor: "#1b5e20", color: "white" }}
                      >
                        <TableRow>
                          <TableCell sx={{ color: "white" }}>
                            Checked By
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>
                            Prepared By
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>
                            Authorized Signatory
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {signatoryDetails.CheckedByList.map(
                          (checkedBy, index) => (
                            <TableRow key={index}>
                              <TableCell>{checkedBy.Name}</TableCell>
                              <TableCell>
                                {signatoryDetails.PreparedByList[index]
                                  ? signatoryDetails.PreparedByList[index].Name
                                  : ""}
                              </TableCell>
                              <TableCell>
                                {signatoryDetails.AuthorizedSignatoryList[index]
                                  ? signatoryDetails.AuthorizedSignatoryList[
                                      index
                                    ].Name
                                  : ""}
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="small"
                                  onClick={() => handleEdit(checkedBy)}
                                >
                                  <EditIcon sx={{ color: "darkgreen" }} />
                                </Button>
                                <Button
                                  size="small"
                                  onClick={() => handleDelete(checkedBy.ID)}
                                >
                                  <DeleteIcon color="error" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </form>
          </Box>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
          >
            <MuiAlert
              onClose={handleSnackbarClose}
              severity="success"
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </MuiAlert>
          </Snackbar>
          <LoadingComp loading={loading} />
          <ErrorComp error={error} />
        </Box>
      </DialogContent>
    </Box>
  );
}
