import React, { FC } from 'react';
import styled from 'styled-components';
import { FaSearch, FaHeart, FaBell, FaCog } from 'react-icons/fa';

const Nav = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #1e3a8a;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: #f3f4f6;
  padding: 5px 10px;
  border-radius: 5px;
  width: 400px;
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
  color: #9ca3af;
  margin-right: 10px;
`;

const FilterIcon = styled(FaCog)`
  color: #9ca3af;
`;

const IconGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const IconWrapper = styled.div`
  position: relative;
  font-size: 20px;
  color: #6b7280;

  &:hover {
    color: #1e3a8a;
  }
`;

const NotificationDot = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

export const Header: FC = () => {
  return (
    <Nav>
      <Logo>MORENT</Logo>
      <SearchBar>
        <SearchIcon />
        <SearchInput type="text" placeholder="Search something here" />
        <FilterIcon />
      </SearchBar>
      <IconGroup>
        <IconWrapper>
          <FaHeart />
        </IconWrapper>
        <IconWrapper>
          <FaBell />
          <NotificationDot />
        </IconWrapper>
        <UserAvatar src="https://via.placeholder.com/40" alt="User Avatar" />
      </IconGroup>
    </Nav>
  );
};

