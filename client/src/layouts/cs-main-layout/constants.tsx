import { FaDollarSign, FaHistory } from 'react-icons/fa';
import { FaGear } from 'react-icons/fa6';

interface MenuItemType {
  icon: JSX.Element;
  label: string;
  path: string;
}

export const menuItems: MenuItemType[] = [
  { icon: <FaGear />, label: 'Settings', path: "/profile-settings" },
  { icon: <FaDollarSign />, label: 'Top Up', path: "/top-up" },
  { icon: <FaHistory />, label: 'History', path: "/rental-history" },
];
