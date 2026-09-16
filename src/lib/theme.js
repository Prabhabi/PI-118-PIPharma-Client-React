import { createTheme } from "@mui/material/styles";

// Export a function instead of a constant
export const getTheme = (mode = "light") => {
  const isLight = mode === "light";

  return createTheme({
    palette: {
      mode,
      background: {
        main: isLight ? "#edf6fe" : "#121212", // light blue or dark gray
        contrastText: isLight ? "#1976d2" : "#fff",
        default: isLight ? "#edf6fe" : "#121212",
        paper: isLight ? "#fff" : "#1e1e1e",
      },
      text: {
        primary: isLight ? "#1976d2" : "#fff",
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            color: "#fff",
            "&.MuiButton-contained": {
              backgroundColor: "#1976d2",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            },
            "&.MuiButton-outlined": {
              color: "#1976d2",
              borderColor: "#1976d2",
            },
          },
        },
      },
      NavButton: {
        styleOverrides: {
          root: {
            backgroundColor: isLight ? "#fff !important" : "#333 !important",
            color: "#1976d2",
            "&:hover": {
              backgroundColor: isLight ? "#fff !important" : "#444 !important",
            },
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: "#1976d2",
            "& .MuiTableCell-root": {
              backgroundColor: "#1976d2",
              color: "#fff",
            },
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            backgroundColor: "#1976d2",
            color: "#fff",
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: "#1565c0 !important",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: isLight ? "white" : "#1e1e1e",
            borderRadius: "4px",
            "& fieldset": {
              border: "1px solid #1976d2 !important",
            },
            "&:hover fieldset": {
              border: "1px solid #1565c0 !important",
            },
            "&.Mui-focused fieldset": {
              border: "2px solid #1976d2 !important",
            },
          },
        },
      },
    },
    typography: {
      allVariants: {
        color: isLight ? "#1976d2" : "#fff",
      },
    },
  });
};
