import type { User } from "@/redux/users/meSlice"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Button } from "./ui/button"
import { Plus, Trash } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { addMemberToOrganization, removeFromOrganization } from "@/redux/organizations/membershipSlice"

function UserListItem({ user }: { user: User }) {
	const dispatch = useAppDispatch();
	const { selected } = useAppSelector((state) => state.organization);
	const { membersIds } = useAppSelector((state) => state.membership);

	const exists = membersIds.some(id => user.id === id)

	const addToOrg = () => {
		dispatch(addMemberToOrganization({ userId: user.id, orgId: selected?.id as string }))
	};

	const removeFromOrg = () => {
		dispatch(removeFromOrganization({ userId: user.id, orgId: selected?.id as string }));
	}

	return (
		<div className="p-4 flex flex-row items-center rounded-2xl border m-2">
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
				{
					exists ?
					<Button
						className="hover:cursor-pointer"
						variant='destructive'
						onClick={removeFromOrg}
					>
						<Trash />
						Remove from Organization
					</Button>
				:
					<Button
						className="hover:cursor-pointer"
						onClick={addToOrg}
					>
						<Plus />
						Add to Organization
					</Button>
				}
			</div>
		</div>
	)
}

export default UserListItem
