import { AppSidebar } from './app-sidebar'
import { Outlet, useNavigate } from 'react-router'
import { Toaster } from 'sonner'
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useEffect } from 'react'
import { getMe } from "@/redux/users/meSlice"
import { useAppDispatch, useAppSelector } from '@/redux/hooks'

function SidebarLayout() {
  const { accessToken } = useAppSelector((state) => state.auth);
  const { error } = useAppSelector((state) => state.me);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if(accessToken || localStorage.getItem('accessToken')) {
      dispatch(getMe());
    }
  }, [dispatch, accessToken]);

  useEffect(() => {
    if(error) {
      navigate('/login');
    }
  }, [error, navigate])

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
