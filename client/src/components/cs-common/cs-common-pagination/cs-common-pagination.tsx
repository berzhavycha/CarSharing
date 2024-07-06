import { FC, useMemo } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import styled from 'styled-components';
import { BaseButton, CSCommonPaginationItem } from './cs-common-pagination-item';
import { DEFAULT_MAX_VISIBLE_PAGE_BTNS, generatePageNumbers } from '@/helpers';

type Props = {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

export const Pagination: FC<Props> = ({
  totalPages,
  currentPage,
  onPageChange,
  maxVisiblePages = DEFAULT_MAX_VISIBLE_PAGE_BTNS
}) => {
  const pageNumbers = useMemo(() =>
    generatePageNumbers(currentPage, totalPages, maxVisiblePages),
    [currentPage, totalPages, maxVisiblePages]
  );

  const handlePrevClick = (): void => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNextClick = (): void => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <PaginationContainer>
      <NavigationButton onClick={handlePrevClick} disabled={currentPage === 1}>
        <FaChevronLeft />
      </NavigationButton>
      {pageNumbers.map((page, index) => (
        <CSCommonPaginationItem
          key={`${page}-${index}`}
          page={page}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      ))}
      <NavigationButton onClick={handleNextClick} disabled={currentPage === totalPages}>
        <FaChevronRight />
      </NavigationButton>
    </PaginationContainer>
  );
};


const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const NavigationButton = styled(BaseButton)`
  background-color: transparent;
  color: var(--main-blue);

  &:hover:not(:disabled) {
    background-color: #f0f0f0;
  }
`;

