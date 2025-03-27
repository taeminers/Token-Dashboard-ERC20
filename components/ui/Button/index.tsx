"use client";
import React from "react";
import "./button.css";
import { ButtonProps } from "./types";

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      onClick = () => {},
      disabled = false,
      size = "l",
      children,
      fixedBottom = false,
    },
    ref
  ) => {
    return (
      <div className={`${fixedBottom ? "button__fixed-container" : ""}`}>
        <button
          ref={ref}
          onClick={onClick}
          disabled={disabled}
          className={`button ${size === "l" ? "button__lg" : "button__md"}`}
        >
          {children}
        </button>
      </div>
    );
  }
);

Button.displayName = "Button";
