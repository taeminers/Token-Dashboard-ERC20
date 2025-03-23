import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SearchBar } from "..";
import { SearchProvider } from "@/context/SearchContext/SearchContext";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

const renderWithProvider = () => {
  return render(
    <SearchProvider>
      <SearchBar />
    </SearchProvider>
  );
};

describe("SearchBar", () => {
  it("should render search input with placeholder", () => {
    renderWithProvider();
    const input = screen.getByPlaceholderText("토큰 검색");
    expect(input).toBeInTheDocument();
  });

  it("should update search term when typing", () => {
    renderWithProvider();
    const input = screen.getByPlaceholderText("토큰 검색");

    fireEvent.change(input, { target: { value: "test token" } });
    expect(input).toHaveValue("test token");
  });

  it("should clear search term when clicking clear button", () => {
    renderWithProvider();
    const input = screen.getByPlaceholderText("토큰 검색");
    const clearButton = screen.getByAltText("Close Icon");

    fireEvent.change(input, { target: { value: "test token" } });
    expect(input).toHaveValue("test token");

    fireEvent.click(clearButton);
    expect(input).toHaveValue("");
  });

  it("should render search and clear icons", () => {
    renderWithProvider();
    const searchIcon = screen.getByAltText("Search Icon");
    const clearIcon = screen.getByAltText("Close Icon");

    expect(searchIcon).toBeInTheDocument();
    expect(clearIcon).toBeInTheDocument();
  });
});
