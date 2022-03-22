import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
  spacing: 4,
  palette: {
    primary: {
      main: "#1976d2",
      contrastText: "#000",
    },
    secondary: {
      main: "#000",
      contrastText: "#fff",
    },
    error: {
      main: "#f44336",
      contrastText: "#fff",
    },
    warning: {
      main: "#fabd23",
      contrastText: "#000",
    },
    info: {
      main: "#fff",
      contrastText: "#fff",
    },
    success: {
      main: "#4caf50",
      contrastText: "#000",
    },
    grey: {
      A700: "#7E7E7E",
    },
    background: {
      default: "#fafafa",
    },
  },
  typography: {
    htmlFontSize: 24,
    fontFamily: "Prompt",
    fontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    h1: {
      fontFamily: "Prompt",
      fontWeight: 400,
      fontSize: "5rem",
      lineHeight: 1.167,
    },
    h2: {
      fontFamily: "Prompt",
      fontWeight: 400,
      fontSize: "2.5rem",
      lineHeight: 1.2,
    },
    h3: {
      fontFamily: "Prompt",
      fontWeight: 400,
      fontSize: "2.083rem",
      lineHeight: 1.167,
    },
    h4: {
      fontFamily: "Prompt",
      fontWeight: 400,
      fontSize: "2rem",
      lineHeight: 1.235,
    },
    h5: {
      fontFamily: "Prompt",
      fontWeight: 400,
      fontSize: "1.75rem",
      lineHeight: 1.334,
    },
    h6: {
      fontFamily: "Prompt",
      fontWeight: 400,
      fontSize: "1.417rem",
      lineHeight: 1.6,
    },
    subtitle1: {
      fontFamily: "Prompt",
      fontWeight: 400,
      fontSize: "1.25rem",
      lineHeight: 1.75,
    },
    subtitle2: {
      fontFamily: "Prompt",
      fontWeight: 400,
      fontSize: "1.042rem",
      lineHeight: 1.57,
    },
    body1: {
      fontFamily: "Prompt",
      fontWeight: 400,
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    body2: {
      fontFamily: "Prompt",
      fontWeight: 400,
      fontSize: "0.9rem",
      lineHeight: 1.43,
    },
    button: {
      fontFamily: "Prompt",
      fontWeight: 400,
      fontSize: "1.417rem",
      lineHeight: 1.75,
      textTransform: "none",
    },
    caption: {
      fontFamily: "Prompt",
      fontWeight: 400,
      fontSize: "0.833rem",
      lineHeight: 1.66,
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
