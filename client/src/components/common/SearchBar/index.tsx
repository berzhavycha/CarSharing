import { ChangeEvent, FC } from "react";
import styled from "styled-components";
import { FaSearch, FaCog } from 'react-icons/fa';

type Props = {
    search: string;
    onSearchChange: (text: string) => void;
}

export const SearchBar: FC<Props> = ({ search, onSearchChange }) => {
    const onChange = (e: ChangeEvent<HTMLInputElement>): void => onSearchChange(e.target.value)

    return (
        <Bar>
            <SearchIcon />
            <SearchInput type="text" value={search} onChange={onChange} placeholder="Search something here" />
            <FilterIcon />
        </Bar>
    )
}

const Bar = styled.div`
  display: flex;
  align-items: center;
  background: none;
  padding: 5px 10px;
  border-radius: 35px;
  width: 500px;
  border: var(--default-border);
`;

const SearchInput = styled.input`
  border: none;
  background: none;
  outline: none;
  width: 100%;
  padding: 5px;
  font-size: 16px;
`;

const SearchIcon = styled(FaSearch)`
  color: #596780;
  margin-right: 10px;
  font-weight: light;
`;

const FilterIcon = styled(FaCog)`
  color: #596780;
`;

