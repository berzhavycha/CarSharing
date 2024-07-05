import { FaClipboardList, FaCog, FaExchangeAlt } from 'react-icons/fa';

interface MenuItemType {
  icon: JSX.Element;
  label: string;
  path: string;
  type: 'general' | 'report';
}

export const menuItems: MenuItemType[] = [
  { icon: <FaCog />, label: 'Settings', path: 'profile-settings', type: 'general' },
  { icon: <FaExchangeAlt />, label: 'Transactions', path: 'transactions', type: 'report' },
  { icon: <FaClipboardList />, label: 'Car Report', path: 'car-report', type: 'report' },
];
