import React from 'react';
import CircleIcon from "@mui/icons-material/Circle";

import Attach from '@/components/misc/Attach/Attach';

export default function AttachCircle({ children }) {
  return (
    <Attach top={50} offset={39}>
      <CircleIcon
        sx={{
          fontSize: 10,
          color: "primary.main",
        }}
      />
    </Attach>
  );
}
