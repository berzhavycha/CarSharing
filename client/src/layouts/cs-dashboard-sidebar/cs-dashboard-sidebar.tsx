import { FC, Fragment, useState } from 'react';
import { FaCar, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { NavLink, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { useClickOutside, useSignOut } from '@/hooks';
import { menuItems } from './constants';
import { device } from '@/styles';

export const CSDashboardSidebar: FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const firstReportIndex = menuItems.findIndex((item) => item.type === 'report');
  const { onSignOut } = useSignOut();

  const toggleSidebar = (): void => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const ref = useClickOutside(() => setIsSidebarOpen(false))

  return (
    <DashboardWrapper>
      <SidebarToggle $isSidebarOpen={isSidebarOpen} onClick={toggleSidebar}>
        <FaBars />
      </SidebarToggle>
      <Sidebar $isOpen={isSidebarOpen} ref={ref}>
        <CloseButton onClick={toggleSidebar}>
          <FaTimes />
        </CloseButton>
        <Logo>
          <FaCar /> CARRENT
        </Logo>
        {menuItems.map((item, index) => (
          <Fragment key={index}>
            {index === firstReportIndex && <Divider />}
            <MenuItemWrapper>
              <MenuItem
                to={item.path}
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={toggleSidebar}
              >
                <Icon className="icon">{item.icon}</Icon>
                {item.label}
              </MenuItem>
            </MenuItemWrapper>
          </Fragment>
        ))}
        <LogoutButton onClick={onSignOut}>
          <Icon>
            <FaSignOutAlt />
          </Icon>
          Sign Out
        </LogoutButton>
      </Sidebar>
      <OutletWrapper $isSidebarOpen={isSidebarOpen}>
        <Outlet />
      </OutletWrapper>
    </DashboardWrapper>
  );
};


const DashboardWrapper = styled.div`
  display: flex;
`;

const SidebarToggle = styled.button<{ $isSidebarOpen: boolean }>`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  background: var(--main-blue);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  transition: var(--default-transition);
  box-shadow: 0px 0 20px rgba(0, 0, 0, 0.6);

  &:hover {
    background: var(--dark-blue);
  }

  @media ${device.lg} {
    display: ${({ $isSidebarOpen }): string => ($isSidebarOpen ? 'none' : 'flex')};
  }

  @media ${device.md} {
    width: 30px;
    height: 30px;
    font-size: 16px;
  }

  @media ${device.sm} {
    top: 15px;
    left: 15px;
    width: 25px;
    height: 25px;
    font-size: 14px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  display: none;

  @media ${device.lg} {
    display: block;
  }

  @media ${device.sm} {
    font-size: 14px; 
  }
`;

const Sidebar = styled.div<{ $isOpen: boolean }>`
  width: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: fixed;
  z-index: 1000;
  background-color: var(--main-blue);
  color: white;
  height: 100vh;
  padding: 40px 0;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  box-shadow: 5px 0 15px rgba(0, 0, 0, 0.1);

  @media ${device.lg} {
    transform: ${({ $isOpen }): string => ($isOpen ? 'translateX(0)' : 'translateX(-100%)')};
    box-shadow: ${({ $isOpen }): string => ($isOpen ? '5px 0 20px rgba(0, 0, 0, 0.6)' : 'none')};
  }

  @media ${device.sm} {
    width: 200px;
  }
`;

const OutletWrapper = styled.div<{ $isSidebarOpen: boolean }>`
  margin-left: 250px;
  transition: margin-left 0.3s ease-in-out;
  width: 100%;

  @media ${device.lg} {
    margin-left: 0;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
  padding: 0 40px;

  @media ${device.lg} {
    font-size: 20px; 
  }

  @media ${device.sm} {
    font-size: 18px; 
  }
`;

const MenuItemWrapper = styled.div`
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

  @media ${device.lg} {
    font-size: 15px; 
  }

  @media ${device.sm} {
    font-size: 14px; 
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
  margin-top: auto;
  transition: var(--default-transition);

  &:hover {
    background-color: var(--dark-blue);
  }

  @media ${device.lg} {
    font-size: 15px; 
  }

  @media ${device.sm} {
    font-size: 14px; 
  }
`;
