import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Description, DialogPortal } from "@radix-ui/react-dialog"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { createOrganization, deleteOrganization, updateOrganization } from "@/redux/organizations/organizationSlice"
import ErrorMessage from "./ErrorMessage"
import { toast } from "sonner"

interface OrganizationDialogProps {
  initialName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrganizationDialog({ initialName, open, onOpenChange }: OrganizationDialogProps) {
  const [name, setName] = useState(initialName || '')
  const dispatch = useAppDispatch();
  const { selected, error, loading } = useAppSelector((state) => state.organization);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let res;
    let toastMessage: string;
    if (initialName) {
      res = await dispatch(updateOrganization({ id: selected?.id as string, name: name }))
      toastMessage = "Organization has been updated successfully"
    } else {
      res = await dispatch(createOrganization(name));
      toastMessage = "Organization has been created successfully"
    }

    if (res.meta.requestStatus == 'fulfilled') {
      setName("")
      toast.success(toastMessage);
		  onOpenChange(false)
    } else {
      toast.error(error);
    }
  }

  const handleDelete = async () => {
    const res = await dispatch(deleteOrganization(selected?.id as string));

    if (res.meta.requestStatus == 'fulfilled') {
      setName("")
      onOpenChange(false)
      toast.success("Organization has been deleted successfully");
    } else {
      toast.error(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogContent aria-describedby="Org-form" onClick={e => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>
              <Description>
                { initialName ? "Update Organization's name" : 'Add New Organization'}
              </Description>
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              data-testid="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Organization name"
              required
            />
            <ErrorMessage error={error} />
            <DialogFooter>
              {
                initialName && 
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        organization and remove its data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              }
              <Button disabled={loading} type="submit">{initialName ? 'Save' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
