import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SearchProvider, useSearch } from "../SearchContext";

// Test component that uses the search context
const TestComponent = () => {
  const { searchTerm, setSearchTerm } = useSearch();
  return (
    <div>
      <div data-testid="search-term">{searchTerm}</div>
      <input
        data-testid="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button data-testid="clear-button" onClick={() => setSearchTerm("")}>
        Clear
      </button>
    </div>
  );
};

describe("SearchContext", () => {
  it("should initialize with empty search term", () => {
    render(
      <SearchProvider>
        <TestComponent />
      </SearchProvider>
    );

    expect(screen.getByTestId("search-term")).toHaveTextContent("");
  });

  it("should update search term when input changes", () => {
    render(
      <SearchProvider>
        <TestComponent />
      </SearchProvider>
    );

    const input = screen.getByTestId("search-input");
    fireEvent.change(input, { target: { value: "test" } });

    expect(screen.getByTestId("search-term")).toHaveTextContent("test");
  });

  it("should clear search term", () => {
    render(
      <SearchProvider>
        <TestComponent />
      </SearchProvider>
    );

    const input = screen.getByTestId("search-input");
    fireEvent.change(input, { target: { value: "test" } });
    expect(screen.getByTestId("search-term")).toHaveTextContent("test");

    const clearButton = screen.getByTestId("clear-button");
    fireEvent.click(clearButton);
    expect(screen.getByTestId("search-term")).toHaveTextContent("");
  });

  it("should throw error when useSearch is used outside provider", () => {
    const TestWithoutProvider = () => {
      useSearch();
      return null;
    };

    expect(() => {
      render(<TestWithoutProvider />);
    }).toThrow("useSearch must be used within a SearchProvider");
  });
});
