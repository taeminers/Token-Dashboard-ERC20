import "./text-field.css";
import { TextFieldProps } from "./types";

export const TextField = ({ placeholder_text }: TextFieldProps) => {
  return <input className="text-field" placeholder={placeholder_text} />;
};
