import { FAB } from "@/components/FAB";
import { TaskItem } from "@/components/TaskItem";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { findAllTasks } from "@/redux/tasks/taskSlice";
import { useEffect } from "react";
import { useParams } from "react-router"
import { Separator } from "@/components/ui/separator"

function Project() {
	const { id } = useParams();
	const dispatch = useAppDispatch();
	const { tasks, loading } = useAppSelector((state) => state.tasks);

	useEffect(() => {
		if (id) {
			dispatch(findAllTasks(id));
		}
	}, [dispatch, id]);

	return (
    <div className="relative p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Project Tasks</h1>
      </header>

      <Separator />

      {loading && (
        <p className="text-muted-foreground">Loading tasks...</p>
      )}

      {!loading && tasks?.length === 0 && (
        <p className="text-muted-foreground">No tasks found for this project.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tasks?.map((task) => (
          <TaskItem key={task.id} task={task} projectId={id!} />
        ))}
      </div>

      <FAB to={`/projects/${id}/new-task`} />
    </div>
  )
}

export default Project
