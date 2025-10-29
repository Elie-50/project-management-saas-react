import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { useAppSelector } from "@/redux/hooks"
import { Search } from "lucide-react"

type Props = {
	name: string;
	setName: (val: string) => void;
};

function SearchInput({ name, setName }: Props) {
	const { data } = useAppSelector((state) => state.usersSearch);
	return (
		<div className="p-4">
			<InputGroup className="rounded-full">
        <InputGroupInput
					placeholder="Search..."
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">{data.total} results</InputGroupAddon>
      </InputGroup>
		</div>
	)
}

export default SearchInput
