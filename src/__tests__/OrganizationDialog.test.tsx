/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OrganizationDialog } from '@/components/OrganizationDialog';
import * as reduxHooks from '@/redux/hooks';
import * as organizationSlice from '@/redux/organizations/organizationSlice';
import { toast } from 'sonner';
import type { RootState } from '@/redux/store';

jest.mock('sonner', () => {
	const mockToastFn = jest.fn() as unknown as typeof toast;
	mockToastFn.success = jest.fn();
	mockToastFn.error = jest.fn();
	return {
		toast: mockToastFn
	}
});

describe('OrganizationDialog', () => {
  const mockDispatch = jest.fn((thunkFn) => thunkFn());

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(reduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
    jest.spyOn(reduxHooks, 'useAppSelector').mockImplementation((selector) =>
      selector({
        organization: {
          selected: null,
          organizations: [],
          error: null,
          loading: false,
        },
      } as unknown as RootState)
    );
  });

  it('renders the form with create button', () => {
    render(<OrganizationDialog open onOpenChange={() => {}} />);
    expect(screen.getByTestId('name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();
  });

  it('prefills the form and shows save button', () => {
    render(<OrganizationDialog open onOpenChange={() => {}} initialName="test-org" />);
    const input = screen.getByTestId('name') as HTMLInputElement;
    expect(input.value).toBe('test-org');
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('disables the button when loading', () => {
    jest.spyOn(reduxHooks, 'useAppSelector').mockImplementation((selector) =>
      selector({
        organization: {
          selected: null,
          organizations: [],
          error: null,
          loading: true,
        },
      } as unknown as RootState)
    );

    render(<OrganizationDialog open onOpenChange={() => {}} />);
    const button = screen.getByRole('button', { name: /create/i });
    expect(button).toBeDisabled();
  });

  it('calls toast on success', async () => {
    jest.spyOn(organizationSlice, 'createOrganization').mockImplementation(() => {
      return () =>
        Promise.resolve({
          meta: { requestStatus: 'fulfilled' },
        }) as any;
    });

    render(<OrganizationDialog open onOpenChange={() => {}} />);

    fireEvent.change(screen.getByTestId('name'), { target: { value: 'New Org' } });
    fireEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Organization has been created successfully');
    });
  });

  it('calls toast on delete success', async () => {
    jest.spyOn(organizationSlice, 'deleteOrganization').mockImplementation(() => {
      return () =>
        Promise.resolve({
          meta: { requestStatus: 'fulfilled' },
        }) as any;
    });

    render(<OrganizationDialog open onOpenChange={() => {}} initialName='Org' />);

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    const continueButton = screen.getByRole('button', { name: /continue/i });

    expect(continueButton).toBeInTheDocument();
    fireEvent.click(continueButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Organization has been deleted successfully');
    });
  });

  it('calls toast on error', async () => {
    jest.spyOn(organizationSlice, 'createOrganization').mockImplementation(() => {
      return () =>
        Promise.resolve({
          meta: { requestStatus: 'rejected' },
        }) as any;
    });

    jest.spyOn(reduxHooks, 'useAppSelector').mockImplementation((selector) =>
      selector({
        organization: {
          selected: null,
          organizations: [],
          error: 'Action Failed',
          loading: false,
        },
      } as unknown as RootState)
    );

    render(<OrganizationDialog open onOpenChange={() => {}} />);
    fireEvent.change(screen.getByTestId('name'), { target: { value: 'New Org' } });
    fireEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Action Failed');
    });
  });
});
