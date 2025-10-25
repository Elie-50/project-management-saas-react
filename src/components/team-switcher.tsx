import { useEffect, useState } from "react"
import { ChevronsUpDown, Edit2Icon, GalleryVerticalEnd, Plus } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { OrganizationDialog } from "./OrganizationDialog"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { findAllOrganization, setSelectedOrganization } from "@/redux/organizations/organizationSlice"
import type { Organization } from "@/redux/organizations/organizationSlice"

export function TeamSwitcher() {
  const { isMobile } = useSidebar()
  const dispatch = useAppDispatch();
  const { organizations, selected, error, loading } = useAppSelector((state) => state.organization);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const [openDialogOrgId, setOpenDialogOrgId] = useState<string | 'add' | null>(null);

  const openDialogForOrg = (id: string | 'add') => {
    setOpenDialogOrgId(id);
    setDropdownOpen(false); // close dropdown if open
  };

  const closeDialog = () => {
    setOpenDialogOrgId(null);
  };

  const orgForDialog = organizations.find(org => org.id === openDialogOrgId);


  useEffect(() => {
    dispatch(findAllOrganization());
  }, [dispatch])

  const selectOrganization = (org: Organization) => {
    dispatch(setSelectedOrganization(org))
  }

  if (!selected && error && !loading) {
    return null;
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{selected?.name}</span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Organizations
              </DropdownMenuLabel>
              {organizations.map((org) => (
                <div key={org.id} className="relative">
                  <DropdownMenuItem
                    onClick={() => selectOrganization(org)}
                    className="gap-2 p-2 pr-10"
                    data-testid="organization-list"
                  >
                    <div className="flex size-6 items-center justify-center rounded-md border">
                      <GalleryVerticalEnd className="size-3.5 shrink-0" />
                    </div>
                    {org.name}
                  </DropdownMenuItem>

                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <button
                      type="button"
                      className="flex items-center justify-center rounded-full p-1 hover:bg-muted"
                      aria-label={`Edit ${org.name}`}
                      onClick={e => {
                        e.stopPropagation();
                        openDialogForOrg(org.id);
                      }}
                    >
                      <Edit2Icon className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 p-2"
                onSelect={e => {
                  e.preventDefault();
                  openDialogForOrg('add');
                }}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Plus className="size-4" />
                </div>
                <div className="text-muted-foreground font-medium">Add organization</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {openDialogOrgId !== null && (
        <OrganizationDialog
          open={true}
          onOpenChange={open => {
            if (!open) closeDialog();
          }}
          initialName={orgForDialog ? orgForDialog.name : undefined}
        />
      )}
    </>
  )
}
