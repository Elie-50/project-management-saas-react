/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import * as reduxHooks from '@/redux/hooks';
import * as membershipSlice from '@/redux/organizations/membershipSlice';
import UserListItem from '@/components/UserListItem';
import type { RootState } from '@/redux/store';

jest.mock('@/components/ui/avatar', () => ({
  Avatar: ({ children }: any) => <div data-testid="avatar">{children}</div>,
  AvatarFallback: ({ children }: any) => <div data-testid="avatar-fallback">{children}</div>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, variant }: any) => (
    <button data-testid={`button-${variant || 'default'}`} onClick={onClick}>
      {children}
    </button>
  ),
}));

jest.mock('lucide-react', () => ({
  Plus: () => <svg data-testid="icon-plus" />,
  Trash: () => <svg data-testid="icon-trash" />,
}));

describe('UserListItem', () => {
  const mockDispatch = jest.fn();
  const mockUser = {
    id: 'user-1',
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(reduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
  });

  it('renders user info correctly', () => {
    jest.spyOn(reduxHooks, 'useAppSelector').mockImplementation((selector) =>
      selector({
        organization: { selected: { id: 'org-1' } },
        membership: { membersIds: [] },
      } as unknown as RootState)
    );

    render(<UserListItem user={mockUser as any} />);

    expect(screen.getByText('@johndoe')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('JD');
    expect(screen.getByTestId('icon-plus')).toBeInTheDocument();
  });

  it('shows "Add to Organization" button when user is not a member', () => {
    jest.spyOn(reduxHooks, 'useAppSelector').mockImplementation((selector) =>
      selector({
        organization: { selected: { id: 'org-1' } },
        membership: { membersIds: [] },
      } as unknown as RootState)
    );

    render(<UserListItem user={mockUser as any} />);

    expect(screen.getByText('Add to Organization')).toBeInTheDocument();
    expect(screen.queryByText('Remove from Organization')).not.toBeInTheDocument();
  });

  it('shows "Remove from Organization" button when user is a member', () => {
    jest.spyOn(reduxHooks, 'useAppSelector').mockImplementation((selector) =>
      selector({
        organization: { selected: { id: 'org-1' } },
        membership: { membersIds: ['user-1'] },
      } as unknown as RootState)
    );

    render(<UserListItem user={mockUser as any} />);

    expect(screen.getByText('Remove from Organization')).toBeInTheDocument();
    expect(screen.queryByText('Add to Organization')).not.toBeInTheDocument();
    expect(screen.getByTestId('icon-trash')).toBeInTheDocument();
  });

  it('dispatches addMemberToOrganization when clicking "Add to Organization"', () => {
    const mockAdd = jest.spyOn(membershipSlice, 'addMemberToOrganization').mockReturnValue({
      payload: {},
    } as any);

    jest.spyOn(reduxHooks, 'useAppSelector').mockImplementation((selector) =>
      selector({
        organization: { selected: { id: 'org-1' } },
        membership: { membersIds: [] },
      } as unknown as RootState)
    );

    render(<UserListItem user={mockUser as any} />);

    fireEvent.click(screen.getByText('Add to Organization'));

    expect(mockAdd).toHaveBeenCalledWith({
      userId: 'user-1',
      orgId: 'org-1',
    });
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('dispatches removeFromOrganization when clicking "Remove from Organization"', () => {
    const mockRemove = jest.spyOn(membershipSlice, 'removeFromOrganization').mockReturnValue({
      payload: {},
    } as any);

    jest.spyOn(reduxHooks, 'useAppSelector').mockImplementation((selector) =>
      selector({
        organization: { selected: { id: 'org-1' } },
        membership: { membersIds: ['user-1'] },
      } as unknown as RootState)
    );

    render(<UserListItem user={mockUser as any} />);

    fireEvent.click(screen.getByText('Remove from Organization'));

    expect(mockRemove).toHaveBeenCalledWith({
      userId: 'user-1',
      orgId: 'org-1',
    });
    expect(mockDispatch).toHaveBeenCalled();
  });
});
