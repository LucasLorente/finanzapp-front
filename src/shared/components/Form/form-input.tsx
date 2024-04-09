import TextField from "@mui/material/TextField";
import React from "react";

const FormInput = ({ field, name, value, ...props }: any) => {
  return (
    <TextField
      {...field}
      {...props}
      InputProps={{
        className: "white-color",
      }}
    />
  );
};

export default FormInput;
