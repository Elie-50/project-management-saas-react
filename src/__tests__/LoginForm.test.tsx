/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import { LoginForm } from "@/components/login-form";
import * as authSlice from "@/redux/auth/authSlice";
import * as reduxHooks from "@/redux/hooks";
import { useNavigate } from "react-router";
import type { RootState } from "@/redux/store";

jest.mock("react-router", () => ({
  useNavigate: jest.fn(),
}));

describe("LoginForm", () => {
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

    jest.spyOn(authSlice, "login").mockImplementation(() => {
      return () =>
        Promise.resolve({
          meta: { requestStatus: "fulfilled" },
          payload: { accessToken: "mock-token" },
        }) as any;
    });
  });

  it("renders email and password inputs and login button", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("updates form fields when typed into", () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "mypassword" } });

    expect(emailInput.value).toBe("john@example.com");
    expect(passwordInput.value).toBe("mypassword");
  });

  it("dispatches login with form data and navigates on success", async () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "mypassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(authSlice.login).toHaveBeenCalledWith({
        email: "john@example.com",
        password: "mypassword",
      });

      expect(mockDispatch).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("does not navigate if login fails and shows error", async () => {
    (authSlice.login as unknown as jest.Mock).mockImplementation(() => {
      return () =>
        Promise.resolve({
          meta: { requestStatus: "rejected" },
          error: "Invalid credentials",
        });
    });

    jest.spyOn(reduxHooks, "useAppSelector").mockImplementation((selector) =>
      selector({
        auth: { loading: false, error: "Invalid credentials", accessToken: null, user: null },
      } as RootState)
    );

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "bad@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(authSlice.login).toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();

      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it("disables login button when loading", () => {
    jest.spyOn(reduxHooks, "useAppSelector").mockImplementation((selector) =>
      selector({
        auth: { loading: true, error: null, accessToken: null, user: null },
      } as RootState)
    );

    render(<LoginForm />);

    const button = screen.getByRole("button", { name: /login/i });
    expect(button).toBeDisabled();
  });
});
