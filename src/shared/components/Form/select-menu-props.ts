// Dark dropdown styling for MUI <Select MenuProps={selectMenuProps}> inside modals
export const selectMenuProps = {
  PaperProps: {
    sx: {
      bgcolor: "#161c2d",
      backgroundImage: "none",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "10px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
      "& .MuiMenuItem-root": {
        color: "#cbd5e1",
        fontSize: "0.925rem",
        "&:hover": {
          bgcolor: "rgba(96, 165, 250, 0.1)",
          color: "#f1f5f9",
        },
        "&.Mui-selected": {
          bgcolor: "rgba(96, 165, 250, 0.15)",
          color: "#60a5fa",
          "&:hover": { bgcolor: "rgba(96, 165, 250, 0.2)" },
        },
      },
      "&::-webkit-scrollbar": { width: "4px" },
      "&::-webkit-scrollbar-thumb": {
        background: "rgba(255, 255, 255, 0.15)",
        borderRadius: "4px",
      },
    },
  },
};
