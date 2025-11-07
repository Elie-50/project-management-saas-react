import TaskForm from "@/components/TaskForm";
import { Spinner } from "@/components/ui/spinner";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getTask } from "@/redux/tasks/taskSlice";
import { useEffect } from "react";
import { useParams } from "react-router"

function TaskFormPage() {
	const { projectId, taskId } = useParams();
	const dispatch = useAppDispatch();
	const { selected } = useAppSelector((state) => state.tasks)

	useEffect(() => {
		if (taskId) {
			dispatch(getTask(taskId));
		}
	}, [dispatch, taskId]);


	return (
		<>
			{taskId ? (
				selected ? <TaskForm projectId={projectId} task={selected} /> : <div className="flex items-center justify-center h-screen"><Spinner /></div>
			) : (
				<TaskForm projectId={projectId} />
			)}
		</>
	)
}

export default TaskFormPage
