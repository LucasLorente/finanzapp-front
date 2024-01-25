import TextField from "@mui/material/TextField";
import React from "react";

const FormInput = ({ field, name, value, ...props }: any) => {
  return <TextField variant="outlined" {...field} {...props} />;
};

export default FormInput;
