import { FC } from 'react';
import styled from 'styled-components';

type PaginationProps = {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export const Pagination: FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <PaginationContainer>
      {pages.map((page) => (
        <PageButton key={page} active={currentPage === page} onClick={() => onPageChange(page)}>
          {page}
        </PageButton>
      ))}
    </PaginationContainer>
  );
};

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PageButton = styled.button<{ active: boolean }>`
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background-color: ${({ active }): string => (active ? '#007bff' : '#e0e0e0')};
  color: ${({ active }): string => (active ? 'white' : 'black')};
  cursor: pointer;
  margin: 0 5px;

  &:hover {
    background-color: #0056b3;
    color: white;
  }
`;
