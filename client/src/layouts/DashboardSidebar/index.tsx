import { FC, Fragment } from 'react';
import { FaCar, FaSignOutAlt } from 'react-icons/fa';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { menuItems } from './constants';
import { useStore } from '@/context';

export const DashboardSidebar: FC = () => {
  const firstReportIndex = menuItems.findIndex((item) => item.type === 'report');

  const { currentUserStore: { signOut } } = useStore()

  const navigate = useNavigate()

  const onLogout = async (): Promise<void> => {
    await signOut()
    navigate('/')
  }

  return (
    <DashboardWrapper>
      <Sidebar>
        <Logo>
          <FaCar /> CARRENT
        </Logo>
        {menuItems.map((item, index) => (
          <Fragment key={index}>
            {index === firstReportIndex && <Divider />}
            <MenuItemWrapper>
              <MenuItem to={item.path} className={({ isActive }) => (isActive ? 'active' : '')}>
                <Icon className="icon">{item.icon}</Icon>
                {item.label}
              </MenuItem>
            </MenuItemWrapper>
          </Fragment>
        ))}
        <LogoutButton onClick={onLogout}>
          <Icon>
            <FaSignOutAlt />
          </Icon>
          Logout
        </LogoutButton>
      </Sidebar>
      <OutletWrapper>
        <Outlet />
      </OutletWrapper>
    </DashboardWrapper>
  );
};

const DashboardWrapper = styled.div`
  display: flex;
`;

const Sidebar = styled.div`
  min-width: 20%;
  position: fixed;
  background-color: var(--main-blue);
  color: white;
  height: 100vh;
  padding: 40px 0;
`;

const OutletWrapper = styled.div`
  padding-left: 20%;
  width: 100%;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
  padding: 0 40px;
`;

const MenuItemWrapper = styled.div`
  width: 96%;
  margin: 5px;
  margin-bottom: 10px;
  border-radius: 10px;
  transition: var(--default-transition);

  &:hover {
    background-color: var(--dark-blue);
  }
`;

const MenuItem = styled(NavLink)`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 40px;
  color: white;
  text-decoration: none;

  .icon {
    margin-right: 10px;
  }

  &.active {
    border-radius: 10px;
    background-color: var(--dark-blue);
  }
`;

const Divider = styled.hr`
  width: 90%;
  margin: 10px auto;
  border: 0;
  border-top: 2px solid rgba(255, 255, 255, 0.6);
`;

const Icon = styled.span`
  margin-right: 10px;
`;

const LogoutButton = styled.button`
  width: 70%;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--light-blue);
  border: none;
  color: white;
  cursor: pointer;
  font-size: 16px;
  padding: 10px 0;
  margin: 0 auto;
  margin-top: 100%;
  transition: var(--default-transition);

  &:hover {
    background-color: var(--dark-blue);
  }
`;
