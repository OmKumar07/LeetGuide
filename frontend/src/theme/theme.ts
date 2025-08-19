import { createTheme, type ThemeOptions } from "@mui/material/styles";

// LeetCode color palette
const leetcodeColors = {
  // LeetCode brand colors
  leetcodeOrange: "#FFA116",
  leetcodeGreen: "#00AF9B",
  leetcodeBlue: "#0EA5E9",

  // Difficulty colors
  easy: "#00AF9B",
  medium: "#FFB800",
  hard: "#FF375F",

  // Status colors
  accepted: "#00AF9B",
  wrongAnswer: "#FF375F",
  timeLimitExceeded: "#FFA116",
};

// Light theme configuration
const lightTheme: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: leetcodeColors.leetcodeOrange,
      dark: "#E6910D",
      light: "#FFB84D",
    },
    secondary: {
      main: leetcodeColors.leetcodeGreen,
      dark: "#008A7A",
      light: "#33C2B3",
    },
    background: {
      default: "#F7F8FA",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A1A1A",
      secondary: "#737373",
    },
    divider: "#E5E7EB",
    grey: {
      50: "#F9FAFB",
      100: "#F3F4F6",
      200: "#E5E7EB",
      300: "#D1D5DB",
      400: "#9CA3AF",
      500: "#6B7280",
      600: "#4B5563",
      700: "#374151",
      800: "#1F2937",
      900: "#111827",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.25rem",
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "1.875rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "1.125rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.75rem",
      lineHeight: 1.5,
    },
    button: {
      fontSize: "0.875rem",
      fontWeight: 500,
      textTransform: "none" as const,
    },
  },
  shape: {
    borderRadius: 8,
  },
};

// Dark theme configuration
const darkTheme: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: leetcodeColors.leetcodeOrange,
      dark: "#E6910D",
      light: "#FFB84D",
    },
    secondary: {
      main: leetcodeColors.leetcodeGreen,
      dark: "#008A7A",
      light: "#33C2B3",
    },
    background: {
      default: "#0F1419",
      paper: "#1A1A1A",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#A3A3A3",
    },
    divider: "#2D2D2D",
    grey: {
      50: "#FAFAFA",
      100: "#F5F5F5",
      200: "#EEEEEE",
      300: "#E0E0E0",
      400: "#BDBDBD",
      500: "#9E9E9E",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.25rem",
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "1.875rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "1.125rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.75rem",
      lineHeight: 1.5,
    },
    button: {
      fontSize: "0.875rem",
      fontWeight: 500,
      textTransform: "none" as const,
    },
  },
  shape: {
    borderRadius: 8,
  },
};

export const createLeetCodeTheme = (mode: "light" | "dark") => {
  const themeOptions = mode === "light" ? lightTheme : darkTheme;

  return createTheme({
    ...themeOptions,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            padding: "8px 16px",
            fontSize: "0.875rem",
            fontWeight: 500,
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          },
          contained: {
            backgroundColor:
              mode === "light"
                ? leetcodeColors.leetcodeOrange
                : leetcodeColors.leetcodeOrange,
            color: "#FFFFFF",
            "&:hover": {
              backgroundColor: mode === "light" ? "#E6910D" : "#E6910D",
            },
          },
          outlined: {
            borderColor: mode === "light" ? "#E5E7EB" : "#2D2D2D",
            color: mode === "light" ? "#374151" : "#FFFFFF",
            "&:hover": {
              borderColor: mode === "light" ? "#D1D5DB" : "#404040",
              backgroundColor: mode === "light" ? "#F9FAFB" : "#2A2A2A",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            border:
              mode === "light" ? "1px solid #E5E7EB" : "1px solid #2D2D2D",
            boxShadow:
              mode === "light"
                ? "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
                : "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 6,
              backgroundColor: mode === "light" ? "#FFFFFF" : "#1A1A1A",
              "& fieldset": {
                borderColor: mode === "light" ? "#E5E7EB" : "#2D2D2D",
              },
              "&:hover fieldset": {
                borderColor: mode === "light" ? "#D1D5DB" : "#404040",
              },
              "&.Mui-focused fieldset": {
                borderColor: leetcodeColors.leetcodeOrange,
              },
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "light" ? "#FFFFFF" : "#1A1A1A",
            color: mode === "light" ? "#1A1A1A" : "#FFFFFF",
            boxShadow:
              mode === "light"
                ? "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
                : "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
            borderBottom:
              mode === "light" ? "1px solid #E5E7EB" : "1px solid #2D2D2D",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 4,
          },
        },
      },
    },
  });
};

export { leetcodeColors };
