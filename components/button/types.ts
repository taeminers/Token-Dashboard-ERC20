export interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  size?: "m" | "l";
  children: React.ReactNode;
  fixedBottom?: boolean;
  type?: "button" | "submit" | "reset";
}
