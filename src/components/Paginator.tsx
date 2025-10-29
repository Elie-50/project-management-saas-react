import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type Props = {
  baseUrl: string;
  page: number;
  pageCount: number;
}

export function Paginator({ baseUrl, page, pageCount }: Props) {
  return (
    <Pagination>
      <PaginationContent>
        {
          page > 1 &&
          <PaginationItem>
            <PaginationPrevious href={`${baseUrl}&page=${page - 1}`} />
          </PaginationItem>
        }
        {
          pageCount > 1 &&
          <PaginationItem>
            <PaginationLink href={`${baseUrl}&page=1`}>1</PaginationLink>
          </PaginationItem>
        }
        <PaginationItem>
          <PaginationLink href={`${baseUrl}&page=${page}`} isActive>
            {page}
          </PaginationLink>
        </PaginationItem>
        {
          pageCount > 1 &&
          <PaginationItem>
            <PaginationLink href={`${baseUrl}&page=${pageCount}`}>{pageCount}</PaginationLink>
          </PaginationItem>
        }
        {
          pageCount > 1 &&
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        }
        {
          pageCount > 1 &&
          <PaginationItem>
            <PaginationNext href={`${baseUrl}&page=${page + 1}`} />
          </PaginationItem>
        }
      </PaginationContent>
    </Pagination>
  )
}
