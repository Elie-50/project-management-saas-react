import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Plus } from "lucide-react"
import { useNavigate } from "react-router"

export function FAB({ to }: { to: string }) {
	const navigate = useNavigate();

	const moveTo = () => {
		navigate(to);	
	}

  return (
    <div className="fixed bottom-6 right-6">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            className="rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90 hover:cursor-pointer"
						onClick={moveTo}
          >
            <Plus className="h-8 w-8 text-white" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add New Task</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
