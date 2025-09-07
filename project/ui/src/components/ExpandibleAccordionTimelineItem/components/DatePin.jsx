import React from "react";

import { Box } from "@mui/material";

import AttachCircle from "@/components/misc/AttachCircle/AttachCircle";
import AttachDiamond from "@/components/misc/AttachDiamond/AttachDiamond";
import AttachSquare from "@/components/misc/AttachSquare/AttachSquare";

import DatePart from "@/components/DatePart/DatePart";
import date_2_dmy from "@/util/functions/date_2_dmy";

export default function DatePin({ date, shift = "year" }) {
  const { day, month, year } = date_2_dmy(date);

  const AttachComponent =
    shift === "day" ? AttachCircle : shift === "month" ? AttachDiamond : AttachSquare;

  // Three fixed slots: Day | Month | Year
  const slots = [
    { key: "d", show: true, content: day },
    { key: "m", show: shift !== "day", content: month },
    { key: "y", show: shift === "year", content: year },
  ];

  return (
    <AttachComponent>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
          width: "100%",
        }}
      >
        {slots.map(({ key, show, content }) => (
          <Box key={key} sx={{ visibility: show ? "visible" : "hidden" }}>
            <DatePart>{content}</DatePart>
          </Box>
        ))}
      </Box>
    </AttachComponent>
  );
}
