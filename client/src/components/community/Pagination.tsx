import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = ''
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* 이전 페이지 버튼 */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        data-testid="prev-page-button"
      >
        <ChevronLeft className="h-4 w-4" />
        이전
      </Button>

      {/* 페이지 번호들 */}
      {visiblePages.map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="px-2 text-gray-500">...</span>
          ) : (
            <Button
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page as number)}
              data-testid={`page-${page}-button`}
            >
              {page}
            </Button>
          )}
        </React.Fragment>
      ))}

      {/* 다음 페이지 버튼 */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        data-testid="next-page-button"
      >
        다음
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Pagination;