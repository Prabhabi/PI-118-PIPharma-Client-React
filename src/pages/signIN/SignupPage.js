// import { useState } from "react";
// import { Box, TextField, Button, Typography, Grid } from "@mui/material";
// import { Link, useNavigate } from "react-router-dom";
// import backgroundImg from "../../img/signup.webp";
// import probhabi from "../../img/probhabi.png"; // Import the tiny logo
// import sideImage from "../../img/stikerSignup.png"; // Import the PNG file
// import millan from "../../img/millan logo.png"; // Import the medium logo
// import HomeIcon from "@mui/icons-material/Home";

// import SingupShowMz from "../../components/showMsz/SingupShowMz";
// import axios from "axios";

// function SignupPage({ setDbjson }) {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [open, setOpen] = useState(false);
//   const navige = useNavigate();

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const validateForm = () => {
//     const tempErrors = {
//       name: formData.name ? "" : "Name is required",
//       email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
//         ? ""
//         : "Email is not valid",
//       password:
//         formData.password.length >= 6
//           ? ""
//           : "Password must be at least 6 characters",
//       confirmPassword:
//         formData.password === formData.confirmPassword
//           ? ""
//           : "Passwords do not match",
//     };
//     setErrors(tempErrors);
//     return Object.values(tempErrors).every((error) => error === "");
//   };

//   const onSubmit = async () => {
//     if (validateForm()) {
//       const newUser = {
//         ...formData,
//         password_confirmation: formData.password,
//         isAdmin,
//       };
//       console.log(newUser);
//       try {
//         const res = await axios.post(
//           `${process.env.REACT_APP_URL}/api/signup`,
//           newUser
//         );
//         setOpen(true);
//         setDbjson((prevState) => ({
//           ...prevState,
//           users: [...prevState.users, res.data],
//         }));
//       } catch (error) {
//         console.error("Error creating user:", error);
//       }
//     }
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         height: "100vh",
//         backgroundImage: `url(${backgroundImg})`,
//         backgroundSize: "cover",
//         zIndex: 1,
//         justifyContent: "center",
//       }}
//     >
//       {/* Background Overlay */}
//       <Box
//         sx={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           width: "100%",
//           height: "100%",
//           backgroundColor: "rgba(31, 39, 18, 0.6)", // Use rgba for semi-transparency
//           zIndex: 2,
//         }}
//       />
//       {/* Millan Logo at top left */}
//       {/* <Box
//         sx={{
//           position: "absolute",
//           top: 16,
//           left: 16,
//           backgroundColor: "#fff",
//           borderRadius: "50%",
//           padding: "8px",
//           zIndex: 6,
//           p: 0.5,
//         }}
//       >
//         <img src={probhabi} alt="Millan Logo" style={{ height: "80px" }} />
//       </Box> */}
//       <Box
//         sx={{
//           position: "absolute",
//           top: 16,
//           left: 16,
//           backgroundColor: "#fff",
//           borderRadius: "50%",
//           padding: "2px",
//           zIndex: 6,
//           cursor: "pointer",
//         }}
//         onClick={() => navige("/")}
//       >
//         <HomeIcon />
//       </Box>
//       {/* Background Color Filter */}
//       <Box
//         sx={{
//           position: "relative",
//           backgroundColor: "rgba(161, 214, 178, 0.3)", // Use rgba for semi-transparency
//           zIndex: 3,
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           pr: "4rem",
//           pl: "15rem",
//           pt: "-10rem",
//           mt: "3rem",
//           maxHeight: "90vh",
//         }}
//       >
//         {/* Content */}
//         <Box sx={{ display: "flex", alignItems: "center", zIndex: 3 }}>
//           {/* Form Card */}
//           <Box
//             sx={{
//               maxWidth: "50vh",
//               maxHeight: "100vh",
//               backgroundColor: "rgba(255, 255, 255, 0.95)", // Increase visibility
//               border: "3px solid rgba(255, 255, 255, .2)",
//               boxShadow: "0 0 10px rgba(0, 0, 0, .2)",
//               borderRadius: "12px",
//               padding: "10px 30px 4px 30px",
//               m: "auto",
//               zIndex: 999,
//               display: "flex",
//               flexDirection: "column",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             {/* Logo */}
//             <Box sx={{ textAlign: "center", mb: 2 }}>
//               <img src={millan} alt="Logo" style={{ height: "80px" }} />
//             </Box>
//             <Typography
//               variant="h4"
//               sx={{
//                 color: "black",
//                 fontWeight: "bold",
//                 padding: "0.5rem",
//                 textAlign: "center",
//               }}
//             >
//               Create New Account
//             </Typography>
//             <Grid container spacing={2} sx={{ mt: -1 }}>
//               {["name", "email", "password", "confirmPassword"].map(
//                 (field, index) => (
//                   <Grid item xs={12} key={index}>
//                     <TextField
//                       fullWidth
//                       variant="outlined"
//                       label={
//                         field.charAt(0).toUpperCase() +
//                         field
//                           .slice(1)
//                           .replace("confirmPassword", "Confirm Password")
//                       }
//                       name={field}
//                       type={field.includes("password") ? "password" : "text"}
//                       value={formData[field]}
//                       onChange={handleChange}
//                       error={!!errors[field]}
//                       helperText={errors[field]}
//                       autoComplete={field === "confirmPassword" ? "off" : field}
//                       InputProps={{
//                         style: { color: "#458f5c", borderRadius: 10 },
//                       }}
//                       InputLabelProps={{
//                         style: { color: "#458f5c", fontWeight: "bold" },
//                       }}
//                       sx={{
//                         "& .MuiOutlinedInput-root": {
//                           backgroundColor: "#fff",
//                           "& fieldset": { borderColor: "#458f5c" },
//                           "&:hover fieldset": {
//                             borderColor: "#458f5c",
//                             boxShadow: "0 0 5px rgba(69, 143, 92, 0.5)",
//                           },
//                           "&.Mui-focused fieldset": {
//                             borderColor: "#458f5c",
//                             borderWidth: 2,
//                           },
//                         },
//                         "& .MuiFormHelperText-root": {
//                           color: "#f44336",
//                           fontWeight: "bold",
//                         },
//                       }}
//                     />
//                   </Grid>
//                 )
//               )}
//             </Grid>
//             <Box
//               sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
//             >
//               <Button
//                 fullWidth
//                 variant="contained"
//                 sx={{
//                   mr: 1,
//                   padding: "10px 30px",
//                   borderRadius: "12px",
//                   backgroundColor: "#458f5c",
//                   fontWeight: "bold",
//                 }}
//                 onClick={onSubmit}
//               >
//                 Sign Up
//               </Button>
//             </Box>
//             <Typography
//               variant="body1"
//               align="center"
//               sx={{ mt: 0.8, color: "#000" }}
//             >
//               Already have an account?{" "}
//               <Link
//                 to="/login"
//                 variant="body2"
//                 sx={{ color: "#458f5c", fontWeight: "bold" }}
//               >
//                 Log in
//               </Link>
//             </Typography>
//             {/* Footer */}
//             <Box
//               sx={{
//                 textAlign: "center",
//                 mt: "2rem",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <img
//                 src={probhabi}
//                 alt="Tiny Logo"
//                 style={{ height: "20px", marginRight: "8px" }}
//               />
//               <Typography variant="body2" fontSize="0.8rem">
//                 Product by Prabhabi Infocom
//               </Typography>
//             </Box>
//           </Box>
//           {/* formcard */}
//           {/* Side Image */}
//           <Box
//             sx={{
//               display: { xs: "none", md: "block" },
//               ml: -11.5,
//               mt: 17,
//               zIndex: 99999,
//               position: "relative",
//               opacity: 1, // Increase visibility
//             }}
//           >
//             <img
//               src={sideImage}
//               alt="Side"
//               style={{ maxHeight: "550px", borderRadius: "12px" }}
//             />
//           </Box>
//         </Box>
//       </Box>
//       <SingupShowMz
//         open={open}
//         handleClickOpen={() => setOpen(true)}
//         handleClose={() => setOpen(false)}
//         message={1}
//       />
//     </Box>
//   );
// }

// export default SignupPage;
