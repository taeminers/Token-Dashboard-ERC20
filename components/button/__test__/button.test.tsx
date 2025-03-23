import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Button } from "../index";
import React from "react";

describe("Button", () => {
  it("renders button with default props", () => {
    render(<Button size="l">Click me</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Click me");
    expect(button).toHaveClass("custom-button", "button-lg");
  });

  it("renders medium size button", () => {
    render(<Button size="m">Medium Button</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-button", "button-md");
  });

  it("handles click events", () => {
    const handleClick = jest.fn();
    render(
      <Button size="l" onClick={handleClick}>
        Clickable
      </Button>
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("uses default onClick when not provided", () => {
    render(<Button size="l">Default Click</Button>);

    const button = screen.getByRole("button");
    // This should not throw an error
    expect(() => {
      fireEvent.click(button);
    }).not.toThrow();
  });

  it("renders disabled button", () => {
    render(
      <Button size="l" disabled>
        Disabled
      </Button>
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("renders with fixed bottom position", () => {
    render(
      <Button size="l" fixedBottom>
        Fixed Bottom
      </Button>
    );

    const container = screen.getByRole("button").parentElement;
    expect(container).toHaveClass("fixed-bottom-container");
  });

  it("forwards ref to button element", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <Button size="l" ref={ref}>
        Ref Button
      </Button>
    );

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toBe(screen.getByRole("button"));
  });
});
