import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DisconnectedView } from "../DisconnectedView";

// Mock next/image

const mockOnConnect = jest.fn();

describe("DisconnectedView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render connect button with correct text", () => {
    render(<DisconnectedView onConnect={mockOnConnect} />);

    const connectButton = screen.getByRole("button", { name: "지갑 연결하기" });
    expect(connectButton).toBeInTheDocument();
    expect(connectButton).toBeEnabled();
  });

  it("should call onConnect when button is clicked", async () => {
    mockOnConnect.mockResolvedValueOnce(undefined);
    render(<DisconnectedView onConnect={mockOnConnect} />);

    const connectButton = screen.getByRole("button", { name: "지갑 연결하기" });
    await fireEvent.click(connectButton);

    await waitFor(() => {
      expect(mockOnConnect).toHaveBeenCalledTimes(1);
    });
  });

  //   it("should handle onconnect rejection gracefully", async () => {
  //     mockonconnect.mockimplementation(() => promise.reject("connection failed"));
  //     render(<disconnectedview onconnect={mockonconnect} />);

  //     const connectbutton = screen.getbyrole("button", { name: "지갑 연결하기" });

  //     // click the button and expect the rejection to be handled
  //     await fireevent.click(connectbutton);

  //     await waitfor(() => {
  //       expect(mockonconnect).tohavebeencalledtimes(1);
  //       expect(connectbutton).tobeenabled();
  //     });
  //   });
});
