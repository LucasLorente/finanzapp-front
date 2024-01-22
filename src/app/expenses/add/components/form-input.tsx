import TextField from "@mui/material/TextField";
import React from "react";

const FormInput = ({ field, name, value, ...props }: any) => {
  return (
    <div>
      <TextField id="outlined-basic" variant="outlined" {...field} {...props} />
    </div>
  );
};

export default FormInput;
