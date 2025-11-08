import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { FAB } from "@/components/FAB";
import { useNavigate } from "react-router";

jest.mock("react-router", () => ({
  useNavigate: jest.fn(),
}));

describe("FAB Component", () => {
  it("renders and navigates on click", () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    render(<FAB to="/projects/123/new-task" />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/projects/123/new-task");
  });
});
