import { FC } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import styled from 'styled-components';

type PaginationProps = {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export const Pagination: FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePrevClick = (): void => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = (): void => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <PaginationContainer>
      <IconButton onClick={handlePrevClick} disabled={currentPage === 1}>
        <FaChevronLeft />
      </IconButton>
      {pages.map((page) => (
        <PageButton key={page} $active={currentPage === page} onClick={() => onPageChange(page)}>
          {page}
        </PageButton>
      ))}
      <IconButton onClick={handleNextClick} disabled={currentPage === totalPages}>
        <FaChevronRight />
      </IconButton>
    </PaginationContainer>
  );
};

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  padding: 8px 16px;
  margin: 0 5px;
  border: none;
  border-radius: 4px;
  background-color: ${({ $active }): string => ($active ? '#007bff' : '#cadbf5')};
  color: ${({ $active }): string => ($active ? 'white' : 'black')};
  cursor: pointer;
  box-shadow: ${({ $active }): string =>
    $active ? '0 4px 8px rgba(0, 123, 255, 0.2)' : '0 2px 4px rgba(0, 0, 0, 0.1)'};
  transition:
    background-color 0.3s,
    box-shadow 0.3s,
    transform 0.3s;

  &:hover {
    background-color: ${({ $active }): string => ($active ? 'var(--main-blue)' : '#cadbf5')};
    box-shadow: ${({ $active }): string =>
      $active ? '0 6px 12px rgba(0, 123, 255, 0.3)' : '0 4px 8px rgba(0, 0, 0, 0.2)'};
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: #8ca3c7;
    color: white;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const IconButton = styled(PageButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
`;
