import React from "react";
import { Box } from "@mui/material";

import DatePart from "@/components/DatePart/DatePart";
import date_2_dmy from "@/util/functions/date_2_dmy";

export default function TimeAside({ open, date }) {
  const { day, month, year } = date_2_dmy(date);

  return (
    <Box
      sx={{
        flex: open ? "1 1 25%" : "0 0 0%",
        borderLeft: open ? "2px solid" : "none",
        borderColor: "primary.main",
        overflow: "hidden",
        position: "sticky",
        top: 0,
        opacity: open ? 1 : 0,
      }}
    >
      {/* Fixed date display (same styling/spacing as DatePin) */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
          ml: '5px',
          mt: '52px',
          width: "calc(25vw - 20px)",
        }}
      >
        <DatePart>{day}</DatePart>
        <DatePart>{month}</DatePart>
        <DatePart>{year}</DatePart>
      </Box>
    </Box>
  );
}
