import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface Column {
  /** 열 ID (고유 식별자) */
  id: string;
  /** 열 헤더 텍스트 */
  header: string;
  /** 열 데이터에 접근하기 위한 키 또는 함수 */
  accessor: string | ((row: any) => React.ReactNode);
  /** 열 너비 스타일 */
  width?: string;
  /** 정렬 방식 */
  align?: 'left' | 'center' | 'right';
  /** 정렬 가능 여부 */
  sortable?: boolean;
}

interface A11yTableProps {
  /** 테이블 데이터 */
  data: any[];
  /** 열 정의 */
  columns: Column[];
  /** 테이블 캡션 (요약) */
  caption?: string;
  /** 테이블 요약 (스크린 리더용 상세 설명) */
  summary?: string;
  /** 빈 테이블 표시 텍스트 */
  emptyText?: string;
  /** 페이지네이션 사용 여부 */
  pagination?: boolean;
  /** 페이지당 행 수 */
  rowsPerPage?: number;
  /** 테이블 ID */
  id?: string;
  /** 정렬 기능 사용 여부 */
  sortable?: boolean;
  /** 필터링 기능 사용 여부 */
  filterable?: boolean;
  /** 행 선택 가능 여부 */
  selectable?: boolean;
  /** 고정 헤더 사용 여부 */
  stickyHeader?: boolean;
  /** 테이블 높이 제한 */
  maxHeight?: string;
  /** 행 클릭 핸들러 */
  onRowClick?: (row: any) => void;
  /** 행 선택 변경 핸들러 */
  onSelectionChange?: (selectedRows: any[]) => void;
  /** CSS 클래스 */
  className?: string;
}

/**
 * 접근성이 강화된 테이블 컴포넌트
 * 
 * 스크린 리더를 위한 적절한 마크업, ARIA 속성 및 키보드 접근성을 제공합니다.
 * 정렬, 페이지네이션, 필터링, 선택 등의 기능을 접근성있게 구현합니다.
 */
const A11yTable: React.FC<A11yTableProps> = ({
  data,
  columns,
  caption,
  summary,
  emptyText = '데이터가 없습니다.',
  pagination = false,
  rowsPerPage = 10,
  id = `table-${Math.random().toString(36).substring(2, 9)}`,
  sortable = false,
  filterable = false,
  selectable = false,
  stickyHeader = false,
  maxHeight,
  onRowClick,
  onSelectionChange,
  className = '',
}) => {
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  // 정렬 상태
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: 'asc' | 'desc' | null;
  }>({
    key: null,
    direction: null,
  });
  
  // 선택 상태
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  
  // 현재 표시할 데이터 계산
  const computeDisplayData = () => {
    // 검색 필터링
    let filteredData = [...data];
    if (filterable && searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filteredData = data.filter((row) => {
        return columns.some((column) => {
          if (typeof column.accessor === 'string') {
            const value = String(row[column.accessor] || '').toLowerCase();
            return value.includes(lowerSearchTerm);
          }
          return false;
        });
      });
    }
    
    // 정렬
    if (sortable && sortConfig.key && sortConfig.direction) {
      filteredData.sort((a, b) => {
        const column = columns.find((col) => col.id === sortConfig.key);
        if (!column) return 0;
        
        let valueA, valueB;
        if (typeof column.accessor === 'string') {
          valueA = a[column.accessor];
          valueB = b[column.accessor];
        } else {
          return 0; // 함수형 accessor는 정렬에 사용하지 않음
        }
        
        // null/undefined 처리
        if (valueA === null || valueA === undefined) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valueB === null || valueB === undefined) return sortConfig.direction === 'asc' ? 1 : -1;
        
        // 문자열 변환 및 비교
        valueA = String(valueA).toLowerCase();
        valueB = String(valueB).toLowerCase();
        
        if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    // 페이지네이션
    if (pagination) {
      const startIndex = (currentPage - 1) * rowsPerPage;
      return filteredData.slice(startIndex, startIndex + rowsPerPage);
    }
    
    return filteredData;
  };
  
  const displayData = computeDisplayData();
  const totalPages = pagination ? Math.ceil(data.length / rowsPerPage) : 1;
  
  // 정렬 핸들러
  const handleSort = (columnId: string) => {
    if (!sortable) return;
    
    let direction: 'asc' | 'desc' | null = 'asc';
    
    if (sortConfig.key === columnId) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null;
      }
    }
    
    setSortConfig({
      key: direction ? columnId : null,
      direction,
    });
  };
  
  // 행 선택 핸들러
  const handleRowSelect = (row: any, index: number) => {
    if (!selectable) return;
    
    const newSelectedRows = { ...selectedRows };
    const rowId = row.id || index;
    newSelectedRows[rowId] = !newSelectedRows[rowId];
    
    setSelectedRows(newSelectedRows);
    
    // 선택 변경 콜백
    if (onSelectionChange) {
      const selectedItems = data.filter((item, idx) => {
        const itemId = item.id || idx;
        return newSelectedRows[itemId];
      });
      onSelectionChange(selectedItems);
    }
  };
  
  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };
  
  // 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };
  
  // 접근성을 위한 키보드 핸들러
  const handleHeaderKeyDown = (e: React.KeyboardEvent, columnId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSort(columnId);
    }
  };
  
  // 행 클릭 핸들러
  const handleRowClick = (row: any) => {
    if (onRowClick) {
      onRowClick(row);
    }
  };
  
  // 테이블 스타일 계산
  const tableStyle: React.CSSProperties = {
    width: '100%',
    ...(maxHeight && stickyHeader ? { maxHeight, overflowY: 'auto' } : {}),
  };
  
  // 헤더 스타일 계산
  const headerStyle: React.CSSProperties = stickyHeader
    ? { position: 'sticky', top: 0, backgroundColor: 'var(--background)', zIndex: 1 }
    : {};
  
  // 접근성을 위한 ARIA 속성
  const getAriaSort = (columnId: string) => {
    if (!sortable || sortConfig.key !== columnId) return undefined;
    return sortConfig.direction === 'asc' ? 'ascending' : 'descending';
  };
  
  return (
    <div className={`w-full ${className}`}>
      {/* 검색 필터 */}
      {filterable && (
        <div className="mb-4">
          <Input
            type="search"
            placeholder="테이블 내용 검색..."
            value={searchTerm}
            onChange={handleSearchChange}
            aria-label="테이블 검색"
            aria-controls={id}
          />
        </div>
      )}
      
      {/* 테이블 컴포넌트 */}
      <div style={tableStyle}>
        <Table id={id}>
          {/* 캡션 - 테이블 제목 */}
          {caption && <TableCaption>{caption}</TableCaption>}
          
          {/* 스크린 리더를 위한 숨겨진 테이블 요약 */}
          {summary && (
            <caption className="sr-only">
              {summary}
            </caption>
          )}
          
          {/* 테이블 헤더 */}
          <TableHeader>
            <TableRow>
              {/* 선택 열 */}
              {selectable && (
                <TableHead className="w-[50px]">
                  <span className="sr-only">행 선택</span>
                </TableHead>
              )}
              
              {/* 데이터 열 */}
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  style={{ 
                    width: column.width, 
                    textAlign: column.align || 'left',
                    ...headerStyle 
                  }}
                  onClick={column.sortable !== false && sortable ? () => handleSort(column.id) : undefined}
                  onKeyDown={column.sortable !== false && sortable ? (e) => handleHeaderKeyDown(e, column.id) : undefined}
                  tabIndex={column.sortable !== false && sortable ? 0 : undefined}
                  role={column.sortable !== false && sortable ? 'button' : undefined}
                  aria-sort={getAriaSort(column.id)}
                  className={column.sortable !== false && sortable ? 'cursor-pointer select-none' : ''}
                >
                  {column.header}
                  {column.sortable !== false && sortable && sortConfig.key === column.id && (
                    <span className="ml-1" aria-hidden="true">
                      {sortConfig.direction === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          
          {/* 테이블 본문 */}
          <TableBody>
            {displayData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="text-center py-6 text-muted-foreground"
                >
                  {emptyText}
                </TableCell>
              </TableRow>
            ) : (
              displayData.map((row, rowIndex) => (
                <TableRow
                  key={row.id || rowIndex}
                  onClick={() => handleRowClick(row)}
                  className={`
                    ${onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
                    ${selectedRows[row.id || rowIndex] ? 'bg-primary/10' : ''}
                  `}
                  tabIndex={onRowClick ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handleRowClick(row);
                    }
                  }}
                  aria-selected={selectable ? selectedRows[row.id || rowIndex] : undefined}
                >
                  {/* 선택 체크박스 */}
                  {selectable && (
                    <TableCell className="w-[50px]">
                      <input
                        type="checkbox"
                        checked={!!selectedRows[row.id || rowIndex]}
                        onChange={() => handleRowSelect(row, rowIndex)}
                        aria-label={`${row.name || rowIndex + 1}번 행 선택`}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                  )}
                  
                  {/* 데이터 셀 */}
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      style={{ textAlign: column.align || 'left' }}
                    >
                      {typeof column.accessor === 'function'
                        ? column.accessor(row)
                        : row[column.accessor] !== undefined
                          ? row[column.accessor]
                          : ''}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
          
          {/* 테이블 푸터 - 페이지네이션 정보 표시 */}
          {pagination && (
            <TableFooter>
              <TableRow>
                <TableCell 
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="text-right"
                >
                  <div className="text-sm text-muted-foreground">
                    총 {data.length}개 중 {(currentPage - 1) * rowsPerPage + 1}-
                    {Math.min(currentPage * rowsPerPage, data.length)}개 표시
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>
      
      {/* 페이지네이션 컨트롤 */}
      {pagination && totalPages > 1 && (
        <div 
          className="flex items-center justify-between mt-4"
          role="navigation"
          aria-label="페이지네이션"
        >
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              aria-label="첫 페이지"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="이전 페이지"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <span className="text-sm">
              <span aria-live="polite" className="sr-only">
                {totalPages}페이지 중 {currentPage}페이지
              </span>
              <span aria-hidden="true">
                {currentPage} / {totalPages}
              </span>
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="다음 페이지"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              aria-label="마지막 페이지"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default A11yTable;