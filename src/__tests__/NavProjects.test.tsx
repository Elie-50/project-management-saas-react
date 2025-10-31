/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NavProjects } from '@/components/nav-projects';
import * as reduxHooks from '@/redux/hooks';
import { toast } from 'sonner';

jest.mock('sonner', () => {
  const mockToastFn = jest.fn() as unknown as typeof toast
  mockToastFn.success = jest.fn()
  mockToastFn.error = jest.fn()
  return { toast: mockToastFn }
});

jest.mock('@/components/ui/sidebar', () => ({
  SidebarGroup: ({ children }: any) => <div>{children}</div>,
  SidebarGroupLabel: ({ children }: any) => <div>{children}</div>,
  SidebarMenu: ({ children }: any) => <div>{children}</div>,
  SidebarMenuItem: ({ children }: any) => <div>{children}</div>,
  SidebarMenuButton: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  SidebarMenuAction: ({ children, ...props }: any) => (
		<button {...props} onClick={props.onClick}>{children}</button>
	),
  useSidebar: () => ({ isMobile: false }),
}));

jest.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: any) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onClick }: any) => (
    <div role="menuitem" onClick={onClick}>{children}</div>
  ),
  DropdownMenuSeparator: () => <hr />,
}));

jest.mock('@/components/ui/alert-dialog', () => ({
  AlertDialog: ({ children }: any) => <div>{children}</div>,
  AlertDialogTrigger: ({ children }: any) => <div>{children}</div>,
  AlertDialogContent: ({ children }: any) => <div>{children}</div>,
  AlertDialogHeader: ({ children }: any) => <div>{children}</div>,
  AlertDialogTitle: ({ children }: any) => <div>{children}</div>,
  AlertDialogDescription: ({ children }: any) => <div>{children}</div>,
  AlertDialogFooter: ({ children }: any) => <div>{children}</div>,
  AlertDialogCancel: ({ children }: any) => <button>{children}</button>,
  AlertDialogAction: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
}));

jest.mock('@/components/ui/input-group', () => ({
  InputGroup: ({ children }: any) => <div>{children}</div>,
  InputGroupInput: ({ value, onChange, placeholder }: any) => (
    <input data-testid="input-field" value={value} onChange={onChange} placeholder={placeholder} />
  ),
  InputGroupAddon: ({ children }: any) => <div>{children}</div>,
  InputGroupButton: ({ children, onClick }: any) => <button data-testid="save-button" onClick={onClick}>{children}</button>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
}));

describe('NavProjects', () => {
  const mockDispatch = jest.fn();

  const mockProjects = [
    { id: 'p1', name: 'Project One' },
    { id: 'p2', name: 'Project Two' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(reduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
    jest.spyOn(reduxHooks, 'useAppSelector').mockImplementation((selector: any) =>
      selector({
        projects: { projects: mockProjects, error: null },
        organization: { selected: { id: 'org-1' } },
      })
    )
  });

  it('renders projects', () => {
    render(<NavProjects />);
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Project One')).toBeInTheDocument();
    expect(screen.getByText('Project Two')).toBeInTheDocument();
  })

  it('opens input to create new project', () => {
    render(<NavProjects />);
    fireEvent.click(screen.getByText('Create new project'));
    expect(screen.getByPlaceholderText('Project name')).toBeInTheDocument();
    expect(screen.getByText('Create')).toBeInTheDocument();
  })

  it('dispatches createProject when creating a project', async () => {
    mockDispatch.mockResolvedValue({ meta: { requestStatus: 'fulfilled' } });
    render(<NavProjects />);
    fireEvent.click(screen.getByText('Create new project'));
    fireEvent.change(screen.getByPlaceholderText('Project name'), { target: { value: 'New Project' } });
    fireEvent.click(screen.getByText('Create'));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function));
    })
  })

  it('edits a project', async () => {
		mockDispatch.mockResolvedValue({ meta: { requestStatus: 'fulfilled' } });
		render(<NavProjects />);

		const moreButtons = screen.getAllByRole('button');
    fireEvent.click(moreButtons[0]);

		const editItems = screen.getAllByText((_, element) => element?.textContent?.includes("Edit Project's Name") ?? false);
		fireEvent.click(editItems[0]);

		const input = await screen.findByPlaceholderText('Project name');
		fireEvent.change(input, { target: { value: 'Updated Project' } });
		fireEvent.click(screen.getByTestId('save-button'));

		await waitFor(() => {
			expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function));
		})
	})

  it('deletes a project and shows toast', async () => {
    mockDispatch.mockResolvedValue({ meta: { requestStatus: 'fulfilled' } });
    render(<NavProjects />);

    const moreButtons = screen.getAllByRole('button');
    fireEvent.click(moreButtons[0]);

    const deleteItems = screen.getAllByText((_, element) => element?.textContent?.includes('Delete Project') ?? false);
    fireEvent.click(deleteItems[0]);

    fireEvent.click(screen.getAllByText('Continue')[0]);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function));
      expect(toast.success).toHaveBeenCalledWith('Project deleted successfully');
    });
  });

  it('shows toast error when error exists', () => {
    jest.spyOn(reduxHooks, 'useAppSelector').mockImplementation((selector: any) =>
      selector({
        projects: { projects: [], error: 'Something went wrong' },
        organization: { selected: { id: 'org-1' } },
      })
    );
    render(<NavProjects />);
    expect(toast.error).toHaveBeenCalledWith('Something went wrong');
  });
});
