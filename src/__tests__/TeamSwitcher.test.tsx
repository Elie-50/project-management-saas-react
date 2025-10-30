/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TeamSwitcher } from '@/components/team-switcher';
import * as reduxHooks from '@/redux/hooks';
import * as organizationSlice from '@/redux/organizations/organizationSlice';
import { OrganizationDialog } from '@/components/OrganizationDialog';
import type { RootState } from '@/redux/store';

jest.mock('@/components/OrganizationDialog', () => ({
  OrganizationDialog: jest.fn(() => <div data-testid="org-dialog">Org Dialog</div>),
}));

jest.mock('@/components/ui/sidebar', () => ({
  SidebarMenu: ({ children }: any) => <div>{children}</div>,
  SidebarMenuItem: ({ children }: any) => <div>{children}</div>,
  SidebarMenuButton: ({ children, ...rest }: any) => (
    <button {...rest}>{children}</button>
  ),
  useSidebar: () => ({ isMobile: false }),
}));

jest.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
  DropdownMenuTrigger: ({ children }: any) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div role='group'>{children}</div>,
  DropdownMenuItem: ({ children, onSelect, ...rest }: any) => (
    <div onClick={onSelect} role="menuitem" {...rest}>
      {children}
    </div>
  ),
  DropdownMenuLabel: ({ children }: any) => <div>{children}</div>,
  DropdownMenuSeparator: () => <hr />,
}));

describe('TeamSwitcher', () => {
  const mockDispatch = jest.fn();

  const mockOrganizations = [
    { id: '1', name: 'Org One' },
    { id: '2', name: 'Org Two' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(reduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
    jest.spyOn(reduxHooks, 'useAppSelector').mockImplementation((selector) =>
      selector({
        organization: {
          selected: mockOrganizations[0],
          organizations: mockOrganizations,
          error: null,
          loading: false,
        },
        membership: { memberships: [] },
      } as unknown as RootState)
    );
  });

  it('renders with selected organization name', () => {
    render(<TeamSwitcher />);
    expect(screen.getAllByText('Org One')[0]).toBeInTheDocument();
  });

  it('dispatches findAllOrganization on mount', () => {
    const spyFindAll = jest.spyOn(organizationSlice, 'findAllOrganization');
    render(<TeamSwitcher />);
    expect(mockDispatch).toHaveBeenCalled();
    expect(spyFindAll).toHaveBeenCalled();
  });

  it('renders list of organizations in dropdown', () => {
    render(<TeamSwitcher />);
    const items = screen.getAllByTestId('organization-list');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('Org One');
    expect(items[1]).toHaveTextContent('Org Two');
  });

  it('selects an organization when clicked', () => {
    const spySetSelected = jest.spyOn(organizationSlice, 'setSelectedOrganization');
    render(<TeamSwitcher />);

    const orgItem = screen.getAllByTestId('organization-list')[1];
    fireEvent.click(orgItem);

    expect(spySetSelected).toHaveBeenCalledWith(mockOrganizations[1]);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('opens edit dialog for an organization', async () => {
    render(<TeamSwitcher />);
    const editButtons = screen.getAllByRole('button', { name: /edit/i });

    fireEvent.click(editButtons[0]);
    await waitFor(() => {
      const call = (OrganizationDialog as jest.Mock).mock.calls[0][0];
			expect(call).toEqual(expect.objectContaining({ open: true, initialName: 'Org One' }));
      expect(screen.getByTestId('org-dialog')).toBeInTheDocument();
    });
  });

  it('opens dialog to add a new organization', async () => {
    render(<TeamSwitcher />);
    const addItem = screen.getByText(/add organization/i);
    fireEvent.click(addItem);

    await waitFor(() => {
      const call = (OrganizationDialog as jest.Mock).mock.calls[0][0];
			expect(call).toEqual(
				expect.objectContaining({
					open: true,
					initialName: undefined,
				})
			);
    });
  });

  it('returns null when selected is null and there is an error', () => {
    jest.spyOn(reduxHooks, 'useAppSelector').mockImplementation((selector) =>
      selector({
        organization: {
          selected: null,
          organizations: [],
          error: 'Something went wrong',
          loading: false,
        },
        membership: { memberships: [] },
      } as unknown as RootState)
    );

    const { container } = render(<TeamSwitcher />);
    expect(container.firstChild).toBeNull();
  });

  it('renders list of memberships in dropdown', () => {
    jest.spyOn(reduxHooks, 'useAppSelector').mockImplementation((selector) =>
      selector({
        organization: {
          selected: null,
          organizations: [],
          error: null,
          loading: false,
        },
        membership: { memberships: [ { id: '1', organization: { id: '2', name: 'Org-1' }}] },
      } as unknown as RootState)
    );

    render(<TeamSwitcher />);
    const items = screen.getAllByTestId('memberships-list');
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveTextContent('Org-1');
  });

	it('closes the dialog when onOpenChange(false) is called', async () => {
    render(<TeamSwitcher />);

    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByTestId('org-dialog')).toBeInTheDocument();
    });

    const dialogProps = (OrganizationDialog as jest.Mock).mock.calls[0][0];
    expect(typeof dialogProps.onOpenChange).toBe('function');

    dialogProps.onOpenChange(false);

    await waitFor(() => {
      expect(screen.queryByTestId('org-dialog')).not.toBeInTheDocument();
    });
  });
});
