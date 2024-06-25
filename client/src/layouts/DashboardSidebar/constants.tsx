import { FaBookOpen, FaClipboardList, FaCog, FaExchangeAlt, FaFileAlt } from 'react-icons/fa';

interface MenuItemType {
  icon: JSX.Element;
  label: string;
  path: string;
  type: 'general' | 'report';
}

export const menuItems: MenuItemType[] = [
  { icon: <FaBookOpen />, label: 'Bookings', path: 'bookings', type: 'general' },
  { icon: <FaCog />, label: 'Settings', path: 'settings', type: 'general' },
  { icon: <FaFileAlt />, label: 'Report', path: 'report', type: 'report' },
  { icon: <FaExchangeAlt />, label: 'Transactions', path: 'transactions', type: 'report' },
  { icon: <FaClipboardList />, label: 'Car Report', path: 'car-report', type: 'report' },
];
