import { EmptyOutline } from "@/components/EmptyOutline"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { findAllMemberships } from "@/redux/organizations/membershipSlice";
import { useEffect } from "react";

function Dashboard() {
	const dispatch = useAppDispatch();
	const { memberships } = useAppSelector((state) => state.membership);

	useEffect(() => {
		dispatch(findAllMemberships());
	}, [dispatch]);
	return (
		<div className="min-h-screen flex justify-center items-center">
			{memberships.length == 0 && (
				<EmptyOutline />
			)}

			{memberships.map((membership) => (
				membership.organization.name
			))}
		</div>
	)
}

export default Dashboard
