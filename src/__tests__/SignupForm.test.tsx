/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SignupForm } from "@/components/signup-form";
import * as authSlice from "@/redux/auth/authSlice";
import * as reduxHooks from "@/redux/hooks";
import { useNavigate } from "react-router";
import type { RootState } from "@/redux/store";

jest.mock("react-router", () => ({
  useNavigate: jest.fn(),
}));

describe("SignupForm", () => {
  const mockNavigate = jest.fn();
  const mockDispatch = jest.fn((thunkFn) => thunkFn());

  beforeEach(() => {
    jest.clearAllMocks();

    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    jest.spyOn(reduxHooks, "useAppDispatch").mockReturnValue(mockDispatch);
    jest.spyOn(reduxHooks, "useAppSelector").mockImplementation((selector) =>
      selector({
        auth: { loading: false, error: null, accessToken: null, user: null },
      } as RootState)
    );

    jest.spyOn(authSlice, "signup").mockImplementation(() => {
      return () =>
        Promise.resolve({
          meta: { requestStatus: "fulfilled" },
        }) as any;
    });
  });

  it("renders all input fields and the submit button", () => {
    render(<SignupForm />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });

  it("updates form fields when typed into", () => {
    render(<SignupForm />);

    const usernameInput = screen.getByLabelText(/username/i) as HTMLInputElement;
    const firstNameInput = screen.getByLabelText(/first name/i) as HTMLInputElement;
    const lastNameInput = screen.getByLabelText(/last name/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i) as HTMLInputElement;

    fireEvent.change(usernameInput, { target: { value: "JohnDoe" } });
    fireEvent.change(firstNameInput, { target: { value: "John" } });
    fireEvent.change(lastNameInput, { target: { value: "Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "mypassword" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "mypassword" } });

    expect(usernameInput.value).toBe("JohnDoe");
    expect(firstNameInput.value).toBe("John");
    expect(lastNameInput.value).toBe("Doe");
    expect(emailInput.value).toBe("john@example.com");
    expect(passwordInput.value).toBe("mypassword");
    expect(confirmPasswordInput.value).toBe("mypassword");
  });

  it("dispatches signup with form data and navigates on success", async () => {
    render(<SignupForm />);

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "JohnDoe" } });
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: "John" } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: "mypassword" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "mypassword" } });

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(authSlice.signup).toHaveBeenCalledWith({
        username: "JohnDoe",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "mypassword",
      });
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("does not navigate if signup fails and shows error", async () => {
    (authSlice.signup as unknown as jest.Mock).mockImplementation(() => {
      return () =>
        Promise.resolve({
          meta: { requestStatus: "rejected" },
          error: "Signup failed",
        });
    });

    jest.spyOn(reduxHooks, "useAppSelector").mockImplementation((selector) =>
      selector({
        auth: { loading: false, error: "Signup failed", accessToken: null, user: null },
      } as RootState)
    );

    render(<SignupForm />);

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "JohnDoe" } });
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: "John" } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: "mypassword" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "mypassword" } });

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(authSlice.signup).toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();

      expect(screen.getByText(/signup failed/i)).toBeInTheDocument();
    });
  });

  it("disables submit button when loading", () => {
    jest.spyOn(reduxHooks, "useAppSelector").mockImplementation((selector) =>
      selector({
        auth: { loading: true, error: null, accessToken: null, user: null },
      } as RootState)
    );

    render(<SignupForm />);

    const button = screen.getByRole("button", { name: /create account/i });
    expect(button).toBeDisabled();
  });
});
