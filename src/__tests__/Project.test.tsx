/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Project from "@/pages/Project";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { findAllTasks } from "@/redux/tasks/taskSlice";
import { useParams } from "react-router";

// Mock the hooks and router
jest.mock("@/redux/hooks");
jest.mock("@/redux/tasks/taskSlice");
jest.mock("react-router", () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

// Mock child components
jest.mock("@/components/TaskItem", () => ({
  TaskItem: ({ task }: any) => <div data-testid="task-item">{task.name}</div>,
}));
jest.mock("@/components/FAB", () => ({
  FAB: ({ to }: any) => <a data-testid="fab" href={to}>FAB</a>,
}));
jest.mock("@/components/ui/separator", () => ({
  Separator: () => <hr data-testid="separator" />,
}));

describe("Project Component", () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useParams as jest.Mock).mockReturnValue({ id: "123" });
  });

  it("dispatches findAllTasks on mount if id exists", () => {
    (useAppSelector as jest.Mock).mockReturnValue({ tasks: [], loading: false });
    render(<Project />);
    expect(mockDispatch).toHaveBeenCalledWith(findAllTasks("123"));
  });

  it("shows loading message when loading", () => {
    (useAppSelector as jest.Mock).mockReturnValue({ tasks: [], loading: true });
    render(<Project />);
    expect(screen.getByText("Loading tasks...")).toBeInTheDocument();
  });

  it("shows no tasks message when tasks array is empty", () => {
    (useAppSelector as jest.Mock).mockReturnValue({ tasks: [], loading: false });
    render(<Project />);
    expect(screen.getByText("No tasks found for this project.")).toBeInTheDocument();
  });

  it("renders task items when tasks exist", () => {
    const tasks = [
      { id: "t1", name: "Task One" },
      { id: "t2", name: "Task Two" },
    ];
    (useAppSelector as jest.Mock).mockReturnValue({ tasks, loading: false });
    render(<Project />);
    const renderedTasks = screen.getAllByTestId("task-item");
    expect(renderedTasks).toHaveLength(2);
    expect(renderedTasks[0]).toHaveTextContent("Task One");
    expect(renderedTasks[1]).toHaveTextContent("Task Two");
  });

  it("renders FAB with correct link", () => {
    (useAppSelector as jest.Mock).mockReturnValue({ tasks: [], loading: false });
    render(<Project />);
    const fab = screen.getByTestId("fab");
    expect(fab).toHaveAttribute("href", "/projects/123/new-task");
  });
});
