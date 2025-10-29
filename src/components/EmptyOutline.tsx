import { Building2 } from 'lucide-react'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function EmptyOutline() {
  return (
    <Empty className="">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Building2 />
        </EmptyMedia>
        <EmptyTitle>No Organizations Found</EmptyTitle>
        <EmptyDescription>
          Create organization to your account to access your projects from anywhere.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
				
      </EmptyContent>
    </Empty>
  )
}
