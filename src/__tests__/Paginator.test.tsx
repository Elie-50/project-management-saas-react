/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { Paginator } from '@/components/Paginator';

jest.mock('@/components/ui/pagination', () => ({
  Pagination: ({ children }: any) => <nav data-testid="pagination">{children}</nav>,
  PaginationContent: ({ children }: any) => <div data-testid="pagination-content">{children}</div>,
  PaginationEllipsis: () => <span data-testid="ellipsis">...</span>,
  PaginationItem: ({ children }: any) => <div data-testid="pagination-item">{children}</div>,
  PaginationLink: ({ children, href, isActive }: any) => (
    <a href={href} data-testid={isActive ? 'active-link' : 'link'}>
      {children}
    </a>
  ),
  PaginationNext: ({ href }: any) => <a href={href} data-testid="next">Next</a>,
  PaginationPrevious: ({ href }: any) => <a href={href} data-testid="prev">Prev</a>,
}));

describe('Paginator', () => {
	const baseUrl = '/users?filter=test';
  const mockAssign = jest.fn();

  beforeAll(() => {
    delete (window as any).location;
    (window as any).location = { assign: mockAssign };
  });

	beforeEach(() => {
		jest.clearAllMocks();
	});
	
	it('should render only one anchor tag if there is one page', () => {
		render(<Paginator page={1} pageCount={1} baseUrl={baseUrl} />);
		
		// Should render only one active link
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute('href', `${baseUrl}&page=1`);
    expect(screen.getByTestId('active-link')).toHaveTextContent('1');

    // Should not render next, prev, or ellipsis
    expect(screen.queryByTestId('next')).not.toBeInTheDocument();
    expect(screen.queryByTestId('prev')).not.toBeInTheDocument();
    expect(screen.queryByTestId('ellipsis')).not.toBeInTheDocument();
	});

	it('renders next and previous links when multiple pages exist', () => {
    render(<Paginator baseUrl={baseUrl} page={2} pageCount={5} />);

    // Check that prev and next links exist
    const prev = screen.getByTestId('prev');
    const next = screen.getByTestId('next');

    expect(prev).toHaveAttribute('href', `${baseUrl}&page=1`);
    expect(next).toHaveAttribute('href', `${baseUrl}&page=3`);
  });

	it('renders first and last page links when multiple pages exist', () => {
    render(<Paginator baseUrl={baseUrl} page={3} pageCount={5} />);

    const links = screen.getAllByRole('link');

    // It should have first (1), active (3), and last (5)
    expect(links.map(l => l.textContent)).toEqual(expect.arrayContaining(['1', '3', '5']));

    // Ellipsis and next should exist
    expect(screen.getByTestId('ellipsis')).toBeInTheDocument();
    expect(screen.getByTestId('next')).toBeInTheDocument();
  });

	it('does not render previous link if on first page', () => {
    render(<Paginator baseUrl={baseUrl} page={1} pageCount={5} />);
    expect(screen.queryByTestId('prev')).not.toBeInTheDocument();
  });

	it('does not render next link if on last page', () => {
    render(<Paginator baseUrl={baseUrl} page={5} pageCount={5} />);
    expect(screen.queryByTestId('next')).toBeInTheDocument();
    expect(screen.getByTestId('next')).toHaveAttribute('href', `${baseUrl}&page=6`); // Still generated, may not exist logically
  });

  it('navigates to previous page when Prev link is clicked', () => {
    render(<Paginator baseUrl={baseUrl} page={3} pageCount={5} />);

    const prev = screen.getByTestId('prev');
    fireEvent.click(prev);

    expect(prev).toHaveAttribute('href', `${baseUrl}&page=2`);
    expect(mockAssign).not.toHaveBeenCalled(); // Normal anchor click — no JS navigation
  });

  it('navigates to next page when Next link is clicked', () => {
    render(<Paginator baseUrl={baseUrl} page={2} pageCount={5} />);

    const next = screen.getByTestId('next');
    fireEvent.click(next);

    expect(next).toHaveAttribute('href', `${baseUrl}&page=3`);
    expect(mockAssign).not.toHaveBeenCalled();
  });

  it('allows clicking page number links directly', () => {
    render(<Paginator baseUrl={baseUrl} page={2} pageCount={4} />);

    const pageLink = screen.getByText('1');
    fireEvent.click(pageLink);

    expect(pageLink).toHaveAttribute('href', `${baseUrl}&page=1`);
  });
});
