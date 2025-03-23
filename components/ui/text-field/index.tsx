import { forwardRef } from "react";
import "./text-field.css";
import { TextFieldProps } from "./types";

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ placeholder_text, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className="text-field"
        placeholder={placeholder_text}
        {...props}
      />
    );
  }
);
TextField.displayName = "TextField";
