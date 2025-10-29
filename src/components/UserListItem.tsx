import type { User } from "@/redux/users/meSlice"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Button } from "./ui/button"
import { Plus } from "lucide-react"

function UserListItem({ user, key }: { user: User, key: number }) {
	return (
		<div key={key} className="p-4 flex flex-row items-center rounded-2xl border m-2">
			<Avatar className="h-8 w-8 rounded-full p-4">
				<AvatarFallback className="rounded-lg">
					{user?.firstName.charAt(0)}
					{user?.lastName.charAt(0)}
				</AvatarFallback>
			</Avatar>
			<div className="px-4">
				<div className="text-blue-500 italic">@{user.username}</div>
				<div className="font-semibold">{user.firstName} {user.lastName}</div>
			</div>
			<div className="ml-auto">
				<Button>
					<Plus />
					Add to Organization
				</Button>
			</div>
		</div>
	)
}

export default UserListItem
