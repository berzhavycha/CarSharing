import { FC } from 'react';
import { FaGear } from 'react-icons/fa6';
import styled from 'styled-components';

export const CSHeaderLayoutOptions: FC = () => {
  return (
    <IconGroup>
      <IconWrapper>
        <FaGear />
      </IconWrapper>
      <UserAvatar src="https://via.placeholder.com/40" alt="User Avatar" />
    </IconGroup>
  );
};

const IconGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  font-size: 18px;
  color: #6b7280;
  cursor: pointer;
  border: var(--default-border);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: var(--default-transition);

  &:hover {
    color: #1e3a8a;
    border-color: #1e3a8a;
  }
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;
