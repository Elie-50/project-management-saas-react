import { useNavigate, useSearchParams } from "react-router"
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";
import { searchUsers } from "@/redux/users/searchSlice";
import SearchInput from "@/components/SearchInput";
import { useDebounce } from "use-debounce";
import UserListItem from "@/components/UserListItem";
import { Paginator } from "@/components/Paginator";

function UserSearch() {
	const dispatch = useAppDispatch();
	const { data, loading } = useAppSelector((state) => state.usersSearch);

	const [searchParams] = useSearchParams();
	const paramsName = searchParams.get("q") || '';
  const paramsPage = Number(searchParams.get("page") || 1);
	const navigate = useNavigate();

	const [name, setName] = useState(paramsName);
	const [debouncedName] = useDebounce(name, 500);

	const [page] = useState(paramsPage);

	useEffect(() => {
		if (debouncedName || debouncedName.length == 0) {
			navigate(`/users?q=${debouncedName}&page=${page}`);
		}
	}, [debouncedName, navigate, page])

	const handleChangeName = (newVal: string) => {
		setName(newVal);
	};

	useEffect(() => {
		if (!loading) {
			dispatch(searchUsers({ name: paramsName, page: paramsPage }))
		}
	}, [dispatch, loading, paramsName, paramsPage]);

	return (
		<div>
			<SearchInput name={name} setName={handleChangeName} />
			{data?.data?.map((user, index) => <UserListItem user={user} key={index} />)}
			<Paginator page={page} pageCount={data.pageCount} baseUrl={`/users?q=${name}`} />
		</div>
	)
}

export default UserSearch
