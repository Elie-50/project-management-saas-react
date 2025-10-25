import { Building2 } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { OrganizationDialog } from './OrganizationDialog'

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
				<OrganizationDialog trigger={
					<Button variant="outline" size="sm">
						Create Organization
					</Button>
				} />
      </EmptyContent>
    </Empty>
  )
}
