import { ComponentProps } from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { IMaskMixin } from "react-imask";
import { MarkerWhich } from "typedefs/types";

const MaskedTextField = IMaskMixin((props: TextFieldProps) => (
    <TextField {...props}/>
));

type MaskedTextFieldProps = ComponentProps<typeof MaskedTextField>;

export const InputTimeCode = (props: MaskedTextFieldProps & { which: MarkerWhich }) => {
  return (
    <MaskedTextField {...props}/>
  );
};