import { AppSidebar } from './app-sidebar'
import { Outlet } from 'react-router'
import { Toaster } from 'sonner'
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

function SidebarLayout() {
	return (
		<SidebarProvider className='h-full'>
			<AppSidebar />
			<SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
        </header>
				<main className='flex-1 h-full'>
				<Outlet />
				<Toaster />
			</main>
      </SidebarInset>
		</SidebarProvider>
	)
}

export default SidebarLayout
