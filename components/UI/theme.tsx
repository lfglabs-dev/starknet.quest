'use client'

import { createTheme } from "@mui/material";

export const theme = createTheme({
    components: {
      MuiModal: {
        defaultProps: {
          disableScrollLock: true,
        },
      },
    }
  })