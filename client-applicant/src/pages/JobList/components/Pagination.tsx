import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	onPageChange: (page: number) => void;
}

const Pagination = ({
	currentPage,
	totalPages,
	hasNextPage,
	hasPreviousPage,
	onPageChange,
}: PaginationProps) => {
	const getVisiblePages = () => {
		const pages: number[] = [];
		const maxVisiblePages = 5;

		if (totalPages <= maxVisiblePages) {
			// Show all pages if total is less than max
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// Show smart pagination
			if (currentPage <= 3) {
				// Show first 5 pages
				for (let i = 1; i <= 5; i++) {
					pages.push(i);
				}
			} else if (currentPage >= totalPages - 2) {
				// Show last 5 pages
				for (let i = totalPages - 4; i <= totalPages; i++) {
					pages.push(i);
				}
			} else {
				// Show current page with 2 pages on each side
				for (let i = currentPage - 2; i <= currentPage + 2; i++) {
					pages.push(i);
				}
			}
		}

		return pages;
	};

	const visiblePages = getVisiblePages();

	if (totalPages <= 1) return null;

	return (
		<div className='flex items-center justify-center space-x-2'>
			{/* Previous Button */}
			<Button
				variant='outline'
				size='sm'
				onClick={() => onPageChange(currentPage - 1)}
				disabled={!hasPreviousPage}
				className='flex items-center gap-1'
			>
				<ChevronLeft className='h-4 w-4' />
				Previous
			</Button>

			{/* Page Numbers */}
			<div className='flex items-center space-x-1'>
				{/* First page if not visible */}
				{visiblePages[0] > 1 && (
					<>
						<Button
							variant={1 === currentPage ? 'default' : 'outline'}
							size='sm'
							onClick={() => onPageChange(1)}
							className='w-8 h-8 p-0'
						>
							1
						</Button>
						{visiblePages[0] > 2 && (
							<span className='px-2 text-muted-foreground'>...</span>
						)}
					</>
				)}

				{/* Visible page numbers */}
				{visiblePages.map((page) => (
					<Button
						key={page}
						variant={page === currentPage ? 'default' : 'outline'}
						size='sm'
						onClick={() => onPageChange(page)}
						className='w-8 h-8 p-0'
					>
						{page}
					</Button>
				))}

				{/* Last page if not visible */}
				{visiblePages[visiblePages.length - 1] < totalPages && (
					<>
						{visiblePages[visiblePages.length - 1] < totalPages - 1 && (
							<span className='px-2 text-muted-foreground'>...</span>
						)}
						<Button
							variant={totalPages === currentPage ? 'default' : 'outline'}
							size='sm'
							onClick={() => onPageChange(totalPages)}
							className='w-8 h-8 p-0'
						>
							{totalPages}
						</Button>
					</>
				)}
			</div>

			{/* Next Button */}
			<Button
				variant='outline'
				size='sm'
				onClick={() => onPageChange(currentPage + 1)}
				disabled={!hasNextPage}
				className='flex items-center gap-1'
			>
				Next
				<ChevronRight className='h-4 w-4' />
			</Button>
		</div>
	);
};

export default Pagination;
