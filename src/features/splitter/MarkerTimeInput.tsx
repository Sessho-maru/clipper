import { ComponentProps } from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { IMaskMixin } from "react-imask";

const InternalMaskTextField = IMaskMixin((props) => (
  <TextField {...props as any}/>
))

type MaskProps = ComponentProps<typeof InternalMaskTextField>

export const MarkerTimeInput = (props: TextFieldProps & MaskProps) => {
  return (
    <InternalMaskTextField {...props}/> 
  );
}