/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TaskForm from "@/components/TaskForm";
import * as reduxHooks from "@/redux/hooks";
import * as taskSlice from "@/redux/tasks/taskSlice";
import * as membershipSlice from "@/redux/organizations/membershipSlice";
import { useNavigate, useParams } from "react-router";
import type { RootState } from "@/redux/store";

jest.mock("react-router", () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

describe("TaskForm", () => {
  const mockNavigate = jest.fn();
  const mockDispatch = jest.fn((thunkFn) => thunkFn());
  const mockMembers = [
    { id: "1", firstName: "John", lastName: "Doe" },
    { id: "2", firstName: "Jane", lastName: "Smith" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useParams as jest.Mock).mockReturnValue({ projectId: "123" });

    jest.spyOn(reduxHooks, "useAppDispatch").mockReturnValue(mockDispatch);

    jest.spyOn(reduxHooks, "useAppSelector").mockImplementation((selector) =>
      selector({
        membership: { members: mockMembers },
        organization: { selected: { id: "org-1" } },
        tasks: { error: null },
      } as RootState)
    );

		jest.spyOn(membershipSlice, 'findAllOrgMembers').mockImplementation(() => {
			return () =>
				Promise.resolve({
					meta: { requestStatus: "fulfilled" },
					payload: mockMembers,
				}) as any;
		});

		jest.spyOn(taskSlice, 'createTask').mockImplementation(() => {
			return () =>
				Promise.resolve({
					meta: { requestStatus: "fulfilled" },
					payload: {},
				}) as any;
		});

		jest.spyOn(taskSlice, 'updateTask').mockImplementation(() => {
			return () =>
				Promise.resolve({
					meta: { requestStatus: "fulfilled" },
					payload: {},
				}) as any;
		});
  });

  it("renders all form fields", () => {
    render(<TaskForm />);

    expect(screen.getByLabelText(/task name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/assignee/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/color/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create task/i })).toBeInTheDocument();
  });

  it("updates input fields when typed into", () => {
    render(<TaskForm />);

    const nameInput = screen.getByLabelText(/task name/i) as HTMLInputElement;
    const descInput = screen.getByLabelText(/description/i) as HTMLTextAreaElement;

    fireEvent.change(nameInput, { target: { value: "New Task" } });
    fireEvent.change(descInput, { target: { value: "Task details" } });

    expect(nameInput.value).toBe("New Task");
    expect(descInput.value).toBe("Task details");
  });

  it("dispatches createTask and navigates on success", async () => {
    render(<TaskForm />);

    fireEvent.change(screen.getByLabelText(/task name/i), {
      target: { value: "Test Task" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create task/i }));

    await waitFor(() => {
      expect(taskSlice.createTask).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Test Task",
          status: "To Do",
          projectId: "123",
        })
      );
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/projects/123/tasks");
    });
  });

  it("dispatches updateTask when editing existing task", async () => {
    const mockTask = {
      id: "t-1",
      name: "Old Task",
      description: "Old desc",
      color: "#ff0000",
      dueDate: "2025-01-01",
      assignee: { id: "1" },
    };

    render(<TaskForm task={mockTask as any} />);

    fireEvent.change(screen.getByLabelText(/task name/i), {
      target: { value: "Updated Task" },
    });

    fireEvent.click(screen.getByRole("button", { name: /update task/i }));

    await waitFor(() => {
      expect(taskSlice.updateTask).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "t-1",
          name: "Updated Task",
        })
      );
      expect(mockNavigate).toHaveBeenCalledWith("/projects/123/tasks");
    });
  });

  it("does not navigate when there's an error", async () => {
    jest.spyOn(reduxHooks, "useAppSelector").mockImplementation((selector) =>
      selector({
        membership: { members: mockMembers },
        organization: { selected: { id: "org-1" } },
        tasks: { error: "Failed to create task" },
      } as RootState)
    );

    render(<TaskForm />);

    fireEvent.change(screen.getByLabelText(/task name/i), {
      target: { value: "Bad Task" },
    });
    fireEvent.click(screen.getByRole("button", { name: /create task/i }));

    await waitFor(() => {
      expect(taskSlice.createTask).toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

	it("prefills input fields and select dropdown when task prop is provided", () => {
    const mockTask = {
      id: "t-1",
      name: "Prefilled Task",
      description: "Already has details",
      color: "#00ff00",
      dueDate: "2025-12-31",
      assignee: { id: "2" },
    };

    render(<TaskForm task={mockTask as any} />);

    const nameInput = screen.getByLabelText(/task name/i) as HTMLInputElement;
    const descInput = screen.getByLabelText(/description/i) as HTMLTextAreaElement;
    const colorInput = screen.getByLabelText(/color/i) as HTMLInputElement;
    const dateInput = screen.getByLabelText(/due date/i) as HTMLInputElement;
    const button = screen.getByRole("button", { name: /update task/i });

    expect(nameInput.value).toBe("Prefilled Task");
    expect(descInput.value).toBe("Already has details");
    expect(colorInput.value).toBe("#00ff00");
    expect(dateInput.value).toBe("2025-12-31");
    expect(button).toHaveTextContent(/update task/i);
  });
});
