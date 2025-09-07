import { Box } from "@mui/material";

export default function ExpandButton({ open, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        position: "fixed",
        top: "50%",
        right: 0,
        transform: "translateY(-50%)",
        width: 10,
        height: 50,
        bgcolor: "primary.main",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "&:hover": { opacity: 0.8 },
        zIndex: 2,
      }}
    >
      <Box
        component="span"
        sx={{
          width: 0,
          height: 0,
          borderTop: "4px solid transparent",
          borderBottom: "4px solid transparent",
          borderLeft: "6px solid black",
          transform: open ? "rotate(0deg)" : "rotate(180deg)",
        }}
      />
    </Box>
  );
}
