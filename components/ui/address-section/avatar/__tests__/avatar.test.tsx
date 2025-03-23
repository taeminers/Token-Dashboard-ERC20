import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Avatar } from "..";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

describe("Avatar", () => {
  it("should render avatar image with correct props", () => {
    render(<Avatar />);

    const avatarImage = screen.getByAltText("user avatar");
    expect(avatarImage).toBeInTheDocument();
    expect(avatarImage).toHaveAttribute("src", "/img/avatar.png");
    expect(avatarImage).toHaveAttribute("width", "40");
    expect(avatarImage).toHaveAttribute("height", "40");
  });

  it("should have proper accessibility attributes", () => {
    render(<Avatar />);

    const avatarImage = screen.getByRole("img", { name: "user avatar" });
    expect(avatarImage).toBeInTheDocument();
    expect(avatarImage).toHaveAttribute("alt", "user avatar");
  });
});
