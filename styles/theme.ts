import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6affaf",
      light: "#5ce3fe",
    },
    secondary: {
      main: "#f4faff",
      dark: "#eae0d5",
    },
    background: {
      default: "#29282b",
    },
  },
  components: {
    MuiModal: {
      defaultProps: {
        disableScrollLock: true,
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          "& .MuiTabs-flexContainer": {
            display: "flex",
            flexDirection: "column", // For mobile versions
            alignItems: "center",
            ["@media (min-width:768px)"]: {
              flexDirection: "row", // For desktop versions
            },
          },
        },
        // Overrides the styles for the selected tab indicator
        indicator: {
          backgroundColor: "transparent",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        // Overrides the styles for unselected tabs
        root: {
          color: "#E1DCEA", // Text color for unselected tabs
          width: "100%",
          ["@media (min-width:768px)"]: {
            width: "fit-content",
          },
          "&.Mui-selected": {
            color: "#000", // Text color for the selected tab
            backgroundColor: "#fff", // Background of the selected tab
          },
        },
      },
    },
  },
});

export default theme;
