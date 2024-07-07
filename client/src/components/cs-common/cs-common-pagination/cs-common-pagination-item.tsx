import { ELLIPSIS } from "@/helpers";
import { device } from "@/styles";
import { FC } from "react";
import styled from "styled-components";

type Props = {
  page: number | typeof ELLIPSIS;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const CSCommonPaginationItem: FC<Props> = ({ page, currentPage, onPageChange }) => {
  return (
    <>
      {page === ELLIPSIS ? (
        <Ellipsis>{ELLIPSIS}</Ellipsis>
      ) : (
        <PageButton
          $active={currentPage === page}
          onClick={() => onPageChange(page)}
        >
          {page}
        </PageButton >
      )}
    </>
  );
};

const Ellipsis = styled.span`
  margin: 0 5px;
  color: var(--text-secondary);
`;

export const BaseButton = styled.button`
  padding: 8px 16px;
  margin: 0 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  @media ${device.md} {
    padding: 6px 14px;
    font-size: 14px;
  }

  @media ${device.sm} {
    padding: 4px 10px;
    font-size: 12px;
  }
`;

const PageButton = styled(BaseButton) <{ $active?: boolean }>`
  background-color: ${({ $active }): string => ($active ? 'var(--main-blue)' : '#cadbf5')};
  color: ${({ $active }): string => ($active ? 'white' : 'black')};
  box-shadow: ${({ $active }): string =>
    $active ? '0 4px 8px rgba(0, 123, 255, 0.2)' : '0 2px 4px rgba(0, 0, 0, 0.1)'};

  &:hover:not(:disabled) {
    color: ${({ $active }): string => ($active ? 'black' : 'white')};
    background-color: ${({ $active }): string => ($active ? 'var(--main-blue-dark)' : '#b8c9e2')};
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 123, 255, 0.3);
  }
`;
