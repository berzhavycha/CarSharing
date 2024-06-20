import { ChangeEvent, FC } from "react";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";

type Props = {
  search: string;
  onSearchChange: (text: string) => void;
};

export const SearchBar: FC<Props> = ({ search, onSearchChange }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    onSearchChange(e.target.value);
  };

  return (
    <SearchContainer>
      <SearchIcon />
      <SearchInput
        type="text"
        value={search}
        onChange={handleChange}
        placeholder="Search something here"
      />
    </SearchContainer>
  );
};

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background: none; 
  padding: 5px 10px 5px 15px;
  border-radius: 35px;
  width: 500px;
  border: var(--default-border);
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: none;
  outline: none;
  padding: 5px 12px;
  font-size: 16px;
`;

const SearchIcon = styled(FaSearch)`
  color: #596780;
  font-weight: lighter;
`;


