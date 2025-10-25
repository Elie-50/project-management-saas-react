/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import * as reduxHooks from '@/redux/hooks';
import { NavUser } from '@/components/nav-user';
import { logout } from '@/redux/auth/authSlice';
import { getMe } from '@/redux/users/meSlice';
import type { RootState } from '@/redux/store';

jest.mock('@/redux/auth/authSlice', () => ({
  logout: jest.fn(() => ({ type: 'auth/logout' })),
}));

jest.mock('@/redux/users/meSlice', () => ({
  getMe: jest.fn(() => ({ type: 'me/get' })),
}));

jest.mock('@/components/ui/sidebar', () => ({
  SidebarMenu: ({ children }: any) => <div>{children}</div>,
  SidebarMenuItem: ({ children }: any) => <div>{children}</div>,
  SidebarMenuButton: ({ children, ...rest }: any) => <button {...rest}>{children}</button>,
  useSidebar: () => ({ isMobile: false }),
}));

jest.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: any) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div role="group">{children}</div>,
  DropdownMenuItem: ({ children, onClick, ...rest }: any) => (
    <div onClick={onClick} role="menuitem" {...rest}>{children}</div>
  ),
  DropdownMenuLabel: ({ children }: any) => <div>{children}</div>,
  DropdownMenuSeparator: () => <hr />,
  DropdownMenuGroup: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('@/components/ui/avatar', () => ({
  Avatar: ({ children }: any) => <div>{children}</div>,
  AvatarFallback: ({ children }: any) => <div>{children}</div>,
}));

describe('NavUser', () => {
  const mockDispatch = jest.fn();
  const mockUser = {
    id: '1',
    username: 'johndoe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(reduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
    jest.spyOn(reduxHooks, 'useAppSelector').mockImplementation((selector) =>
      selector({
        me: {
          user: mockUser,
          loading: false,
          error: null,
        },
      } as RootState)
    );
  });

  it('renders user info in the menu button and dropdown', () => {
    render(<NavUser />);
    expect(screen.getAllByText('johndoe')[0]).toBeInTheDocument();
    expect(screen.getAllByText('john@example.com')[0]).toBeInTheDocument();
    expect(screen.getAllByText('John Doe')[0]).toBeInTheDocument();
    expect(screen.getAllByText('@johndoe')[0]).toBeInTheDocument();
  });

  it('dispatches logout when logout item is clicked', () => {
    render(<NavUser />);
    const logoutItem = screen.getByText('Log out');
    fireEvent.click(logoutItem);

    expect(mockDispatch).toHaveBeenCalledWith(logout());
  });

  it('dispatches getMe if no user is loaded', () => {
    jest.spyOn(reduxHooks, 'useAppSelector').mockImplementation((selector) =>
      selector({
        me: { user: null, loading: false, error: null },
      } as any)
    );

    render(<NavUser />);
    expect(mockDispatch).toHaveBeenCalledWith(getMe());
  });

  it('renders nothing if there is an error', () => {
    jest.spyOn(reduxHooks, 'useAppSelector').mockImplementation((selector) =>
      selector({
        me: { user: null, loading: false, error: 'Some error' },
      } as RootState)
    );

    const { container } = render(<NavUser />);
    expect(container.firstChild).toBeNull();
  });
});
