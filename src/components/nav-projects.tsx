import {
  Edit,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { useEffect, useState } from "react"
import { findAllOrganization } from "@/redux/organizations/organizationSlice"
import { createProject, deleteProject, findAllProjects, setSelectedProject, updateProject, type Project } from "@/redux/projects/projectSlice"
import { toast } from "sonner"
import { Button } from "./ui/button"

export function NavProjects() {
  const { isMobile } = useSidebar()
  const dispatch = useAppDispatch();
  const { projects, error } = useAppSelector((state) => state.projects);
  const { selected: selectedOrganization } = useAppSelector((state) => state.organization);

  const [inputVisible, toggleInputVisibility] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [editingId, setEditingId] = useState<string>('');

  const handleSave = async () => {
    if (selectedOrganization) {
      if (editingId) {
        const res = await dispatch(updateProject({ id: editingId, name }));
        if (res.meta.requestStatus == 'fulfilled') {
          setName('');
          toggleInputVisibility(false);
          setEditingId('');
        }
      }
      else {
        await dispatch(createProject({ organizationId: selectedOrganization?.id as string, name }));
        setName('');
        toggleInputVisibility(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    const res = await dispatch(deleteProject(id));

    if (res.meta.requestStatus == 'fulfilled') {
      toast.success('Project deleted successfully');
    }
  }

  const handleEditProject = async (item: Project) => {
    dispatch(setSelectedProject(item));

    setEditingId(item.id);
    setName(item.name);
    toggleInputVisibility(true);
  };

  useEffect(() => {
    if (!selectedOrganization) {
      dispatch(findAllOrganization());
    }
  }, [selectedOrganization, dispatch]);

  useEffect(() => {
    if (selectedOrganization) {
      dispatch(findAllProjects(selectedOrganization.id));
    }
  }, [dispatch, selectedOrganization]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error])

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          item.id !== editingId &&
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton asChild>
              <a href={`/projects/${item.id}`}>
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem
                  onClick={() => handleEditProject(item)}
                  data-testid={`edit-project-${item.id}`}
                >
                  <Edit className="text-muted-foreground" />
                  <span>Edit Project's Name</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Trash2 className="text-muted-foreground" />
                      <span>Delete Project</span>
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        project and remove its data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(item.id)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          {
            <div className={`${!inputVisible && 'hidden' }`}>
            <InputGroup>
              <InputGroupInput
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Project name" 
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  variant="default"
                  onClick={handleSave}
                >
                  { editingId ? 'Save' : 'Create' }
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            <Button
              data-testid="cancel-button"
              variant='ghost'
              className="mt-2 w-full hover:cursor-pointer"
              onClick={() => {
                setEditingId('');
                setName('');
                toggleInputVisibility(false);
              }}
            >
              Cancel
            </Button>
            </div>
          }
          {
            <div className={`${inputVisible && 'hidden'}`}>
              <SidebarMenuButton
                onClick={() => toggleInputVisibility(true)}
                className="text-sidebar-foreground/70"
              >
                <Plus />
                <span>Create new project</span>
              </SidebarMenuButton>
            </div>
          }    
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
