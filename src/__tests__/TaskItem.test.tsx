/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskItem } from "@/components/TaskItem";
import * as reduxHooks from "@/redux/hooks";
import * as taskSlice from "@/redux/tasks/taskSlice";
import { useNavigate } from "react-router";

jest.mock("react-router", () => ({
  useNavigate: jest.fn(),
}));

describe("TaskItem", () => {
  const mockNavigate = jest.fn();
  const mockDispatch = jest.fn();

  const baseTask = {
    id: "t1",
    name: "Test Task",
    description: "This is a test task",
    status: "To Do" as const,
    color: "#ff0000",
    dueDate: "2025-12-31",
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    jest.spyOn(reduxHooks, "useAppDispatch").mockReturnValue(mockDispatch);

    jest.spyOn(taskSlice, "deleteTask").mockImplementation(() => {
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

		jest.spyOn(taskSlice, "setSelectedTask").mockImplementation((payload: any) => ({
			type: "tasks/setSelectedTask",
			payload,
		})) as any;
  });

  it("renders task info correctly", () => {
    render(<TaskItem task={{ ...baseTask, assignee: null }} projectId="p1" />);

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("This is a test task")).toBeInTheDocument();
    expect(screen.getByText(/to do/i)).toBeInTheDocument();
    expect(screen.getByText(/you/i)).toBeInTheDocument();
  });

  it("shows assignee initials and name when assigned", () => {
    const task = {
      ...baseTask,
      assignee: { id: "u1", firstName: "John", lastName: "Doe" },
    };

    render(<TaskItem task={task} projectId="p1" />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("calls navigate when Edit button is clicked", () => {
    const task = {
      ...baseTask,
      status: "In Progress" as const,
      assignee: { id: "u1", firstName: "John" },
    };

    render(<TaskItem task={task} projectId="p123" />);

    const editButton = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(editButton);

    expect(mockNavigate).toHaveBeenCalledWith("/projects/p123/edit-task/t1");
  });

  it("dispatches deleteTask when Delete is clicked", () => {
    const task = {
      ...baseTask,
      status: "In Progress" as const,
      assignee: { id: "u1", firstName: "John" },
    };

    render(<TaskItem task={task} projectId="p1" />);

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(taskSlice.deleteTask).toHaveBeenCalledWith("t1");
    expect(mockDispatch).toHaveBeenCalled();
  });

  it("dispatches updateTask to 'In Progress' when Start clicked", () => {
    render(<TaskItem task={{ ...baseTask, status: "To Do", assignee: null }} projectId="p1" />);

    const startButton = screen.getByRole("button", { name: /start/i });
    fireEvent.click(startButton);

    expect(taskSlice.setSelectedTask).toHaveBeenCalledWith(
      expect.objectContaining({ id: "t1" })
    );
    expect(taskSlice.updateTask).toHaveBeenCalledWith({
      id: "t1",
      status: "In Progress",
    });
  });

  it("dispatches updateTask to 'Done' when Finish clicked", () => {
    render(<TaskItem task={{ ...baseTask, status: "In Progress", assignee: null }} projectId="p1" />);

    const finishButton = screen.getByRole("button", { name: /finish/i });
    fireEvent.click(finishButton);

    expect(taskSlice.setSelectedTask).toHaveBeenCalledWith(
      expect.objectContaining({ id: "t1" })
    );
    expect(taskSlice.updateTask).toHaveBeenCalledWith({
      id: "t1",
      status: "Done",
    });
  });

  it("shows near-due warning if due date is within 3 days", () => {
    const nearDueDate = new Date();
    nearDueDate.setDate(nearDueDate.getDate() + 2);

    render(
      <TaskItem
        task={{
          ...baseTask,
          dueDate: nearDueDate.toISOString(),
          assignee: null,
        }}
        projectId="p1"
      />
    );

    expect(screen.getByText(/day/i)).toBeInTheDocument();
  });
});
