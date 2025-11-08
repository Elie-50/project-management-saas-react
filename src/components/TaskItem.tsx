import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { CalendarDays, AlertTriangle, Pencil, Trash2, Play, CheckCircle } from "lucide-react"
import { format, differenceInCalendarDays } from "date-fns"
import { cn } from "@/lib/utils"
import { useAppDispatch } from "@/redux/hooks"
import { deleteTask, setSelectedTask, updateTask } from "@/redux/tasks/taskSlice"
import { useNavigate } from "react-router"
import { useEffect, useState } from "react"

interface TaskItemProps {
  task: {
    id: string
    name: string
    description: string
    status: "To Do" | "In Progress" | "Done"
    color: string
    dueDate?: string | Date
    assignee?: {
      id: string
      username?: string
      firstName?: string
      lastName?: string
    } | null
  },
	projectId: string
}

export function TaskItem({ task, projectId }: TaskItemProps) {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [isNearDue, setIsNearDue] = useState(false);
	const [daysLeft, setDaysLeft] = useState(0);
  const isUnassigned = !task.assignee
  const assigneeName = isUnassigned
    ? "You"
    : task.assignee?.firstName
    ? `${task.assignee.firstName} ${task.assignee.lastName ?? ""}`.trim()
    : task.assignee?.username ?? "Unknown"

  const statusColor =
    task.status === "Done"
      ? "bg-green-500"
      : task.status === "In Progress"
      ? "bg-yellow-500"
      : "bg-gray-400"
	
	useEffect(() => {
		if (task.dueDate) {
			const due = new Date(task.dueDate)
			setDaysLeft(differenceInCalendarDays(due, new Date()));
			setIsNearDue(daysLeft <= 3 && daysLeft >= 0);
		}
	}, [task.dueDate, daysLeft]);

	const handleDelete = () => {
		dispatch(deleteTask(task.id));
	};

	const handleEdit = () => {
		navigate(`/projects/${projectId}/edit-task/${task.id}`)
	};

	const handleEditStatus = (newStatus: 'Done' | 'In Progress' ) => {
		dispatch(setSelectedTask(task));
		dispatch(updateTask({ id: task.id, status: newStatus }))
	};

  return (
    <Card className="w-full border border-border shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">{task.name}</CardTitle>
        <Badge className={cn("text-white capitalize", statusColor)}>
          {task.status}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{task.description}</p>

        <Separator />

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarFallback>
                {isUnassigned
                  ? "Y"
                  : `${task.assignee?.firstName?.[0]?.toUpperCase()}${task.assignee?.lastName?.[0]?.toUpperCase()}`
								}
              </AvatarFallback>
            </Avatar>
            <span>{assigneeName}</span>
          </div>

          {task.dueDate && (
            <div className="flex items-center gap-1">
							{isNearDue ? 
								<AlertTriangle className="h-4 w-4 text-red-500" />
								: <CalendarDays className="h-4 w-4 text-muted-foreground" />
							}
							<span className={isNearDue ? "text-red-500" : "text-muted-foreground"}>
								{isNearDue 
									? `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left`
									: format(new Date(task.dueDate), "MMM d, yyyy")
								}
							</span>
						</div>
          )}
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex flex-col space-y-3">
        <div
          className="w-full h-1 rounded-full"
          style={{ backgroundColor: task.color }}
        />

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          {!isUnassigned && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={handleEdit}
              >
                <Pencil className="h-4 w-4 mr-1" /> Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </>
          )}

          {isUnassigned && task.status === "To Do" && (
            <Button
              size="sm"
              onClick={() => handleEditStatus('In Progress')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Play className="h-4 w-4 mr-1" /> Start
            </Button>
          )}

          {isUnassigned && task.status === "In Progress" && (
            <Button
              size="sm"
              onClick={() => handleEditStatus('Done')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-1" /> Finish
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
