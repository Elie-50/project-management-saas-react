/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import * as reduxHooks from '@/redux/hooks';
import SearchInput from '@/components/SearchInput';
import type { RootState } from '@/redux/store';

jest.mock('@/components/ui/input-group', () => ({
  InputGroup: ({ children, className }: any) => <div data-testid="input-group" className={className}>{children}</div>,
  InputGroupAddon: ({ children, align }: any) => <span data-testid={`addon-${align || 'default'}`}>{children}</span>,
  InputGroupInput: ({ placeholder, value, onChange }: any) => (
    <input
      data-testid="search-input"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  ),
}));

jest.mock('lucide-react', () => ({
  Search: () => <svg data-testid="search-icon" />,
}));

describe('SearchInput', () => {
	const mockSetName = jest.fn();

	beforeEach(() => {
    jest.clearAllMocks();
  });

	it('renders with initial value and placeholder', () => {
    jest.spyOn(reduxHooks, 'useAppSelector').mockImplementation((selector) =>
      selector({
        usersSearch: { data: { total: 10 } },
      } as RootState)
    );

    render(<SearchInput name="john" setName={mockSetName} />);

    const input = screen.getByTestId('search-input');
    expect(input).toHaveValue('john');
    expect(input).toHaveAttribute('placeholder', 'Search...');

    // Shows correct number of results
    expect(screen.getByText('10 results')).toBeInTheDocument();

    // Icon and layout present
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
    expect(screen.getByTestId('input-group')).toHaveClass('rounded-full');
  });

	it('calls setName when input value changes', () => {
    jest.spyOn(reduxHooks, 'useAppSelector').mockImplementation((selector) =>
      selector({
        usersSearch: { data: { total: 3 } },
      } as RootState)
    );

    render(<SearchInput name="" setName={mockSetName} />);

    const input = screen.getByTestId('search-input');

    fireEvent.change(input, { target: { value: 'Alice' } });

    expect(mockSetName).toHaveBeenCalledTimes(1);
    expect(mockSetName).toHaveBeenCalledWith('Alice');
  });

	it('displays 0 results when data.total is undefined', () => {
    jest.spyOn(reduxHooks, 'useAppSelector').mockImplementation((selector) =>
      selector({
        usersSearch: { data: {} },
      } as RootState)
    );

    render(<SearchInput name="" setName={mockSetName} />);

    expect(screen.getByText(/results/i)).toHaveTextContent('0 results');
  });
})
