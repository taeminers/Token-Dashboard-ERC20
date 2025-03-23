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
      <div className={`${fixedBottom ? "fixed-bottom-container" : ""}`}>
        <button
          ref={ref}
          onClick={onClick}
          disabled={disabled}
          className={`custom-button ${
            size === "l" ? "button-lg" : "button-md"
          }`}
        >
          {children}
        </button>
      </div>
    );
  }
);

Button.displayName = "Button";
