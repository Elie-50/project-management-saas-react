import { useEffect, useState } from "react"
import { createTask, updateTask, type CreateTaskDto, type Task } from "@/redux/tasks/taskSlice"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { findAllOrgMembers } from "@/redux/organizations/membershipSlice"
import { useNavigate, useParams } from "react-router"

type TaskFormProps = {
  task?: Task;
  projectId?: string;
}

export default function TaskForm({ task }: TaskFormProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { members } = useAppSelector((state) => state.membership);
  const { selected } = useAppSelector((state) => state.organization);
  const { error } = useAppSelector((state) => state.tasks);
  const { projectId } = useParams();

  const [formData, setFormData] = useState<Partial<Task>>({
    name: task?.name || "",
    description: task?.description || "",
    color: task?.color || "#ffffff",
    dueDate: task?.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd") : "",
    assigneeId: task?.assignee?.id || "",
    projectId: projectId || ''
  });

  useEffect(() => {
    if (selected) {
      dispatch(findAllOrgMembers(selected.id))
    }
  }, [dispatch, selected]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!task) {
      await dispatch(createTask({ status: 'To Do', ...formData } as CreateTaskDto));
    } else {
      await dispatch(updateTask({ id: task.id, ...formData }))
    }

    if (!error && projectId) {
      navigate(`/projects/${projectId}/tasks`);
    }
  }

  return (
    <Card className="max-w-lg w-full mx-auto shadow-md">
      <CardHeader>
        <CardTitle>{task ? "Edit Task" : "Create Task"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Name */}
          <div className="space-y-1">
            <Label htmlFor="name">Task Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter task name"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the task..."
              rows={3}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="assignee">Assignee</Label>
            <Select
              value={formData.assigneeId}
              onValueChange={(value) =>
                setFormData({ ...formData, assigneeId: value })
              }
            >
              <SelectTrigger id="assignee">
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.firstName} {member.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="color">Color</Label>
            <div className="flex items-center gap-3">
              <Input
                id="color"
                name="color"
                type="color"
                value={formData.color as string}
                onChange={handleChange}
                className="w-12 h-12 p-0 border rounded-md cursor-pointer"
              />
              <span className="text-sm text-muted-foreground">
                {formData.color}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              name="dueDate"
              value={formData.dueDate as string}
              onChange={handleChange}
            />
          </div>

          <Button type="submit" className="w-full">
            {task ? "Update Task" : "Create Task"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
