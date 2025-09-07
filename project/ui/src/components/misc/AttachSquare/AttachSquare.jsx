import React from "react";
import { Box } from "@mui/material";
import Attach from "@/components/misc/Attach/Attach";

export default function AttachSquare({ children }) {
  return (
    <Attach top={50} offset={39}>
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <Box
          sx={{
            width: 10,
            height: 10,
            bgcolor: "primary.main",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: "calc(25vw - 20px)",
            left: "100%",
            top: "-50%",
          }}
        >
          {children}
        </Box>
      </Box>
    </Attach>
  );
}
