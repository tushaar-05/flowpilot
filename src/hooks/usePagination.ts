import { useState, useMemo, useEffect } from 'react';

export function usePagination<T>(items: T[], itemsPerPage: number) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = Math.max(1, itemsPerPage);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  const resetPage = () => setCurrentPage(1);

  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    resetPage,
    setCurrentPage,
  };
}