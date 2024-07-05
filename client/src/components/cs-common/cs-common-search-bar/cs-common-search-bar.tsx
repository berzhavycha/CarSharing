import { device } from '@/styles';
import { ChangeEvent, FC, InputHTMLAttributes } from 'react';
import { FaSearch } from 'react-icons/fa';
import styled from 'styled-components';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  search: string;
  onSearchChange: (text: string) => void;
}

export const CSCommonSearchBar: FC<Props> = ({ search, onSearchChange, ...props }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    onSearchChange(e.target.value);
  };

  return (
    <SearchContainer>
      <SearchIcon />
      <SearchInput type="text" value={search} onChange={handleChange} {...props} />
    </SearchContainer>
  );
};

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background: none;
  padding: 5px 10px 5px 15px;
  border-radius: 35px;
  width: 400px;
  border: var(--default-border);

  @media ${device.md} {
    width: 300px;
  }

  @media ${device.sm} {
    width: 200px;
    padding: 2px 5px 2px 10px;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: none;
  outline: none;
  padding: 5px 12px;
  font-size: 16px;

  @media ${device.lg} {
    font-size: 14px;
  }

  @media ${device.md} {
    font-size: 12px;
  }

  @media ${device.sm} {
    font-size: 11px;
  }
`;

const SearchIcon = styled(FaSearch)`
  color: var(--light-dark);
  font-weight: lighter;

  @media ${device.md} {
    font-size: 12px;
  }

  @media ${device.sm} {
    font-size: 11px;
  }
`;
