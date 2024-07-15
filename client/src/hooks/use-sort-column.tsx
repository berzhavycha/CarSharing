import { OrderOptions } from '@/helpers';
import { Dispatch, SetStateAction, useState } from 'react';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';

type SortState = {
  sort: string;
  direction: OrderOptions;
};

type HookReturn = {
  sortState: SortState;
  setSortState: Dispatch<SetStateAction<SortState>>;
  renderSortIcon: (column: string) => JSX.Element;
  handleSortChange: (sort: string) => void
};

export const useSortColumn = (onSortChange: (sort: string) => void): HookReturn => {
  const [sortState, setSortState] = useState<SortState>({ sort: '', direction: OrderOptions.ASC });

  const renderSortIcon = (column: string): JSX.Element => {
    if (sortState.sort === column) {
      return sortState.direction === OrderOptions.ASC ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort />;
  };

  const handleSortChange = (sort: string): void => {
    const direction = sortState.sort === sort && sortState.direction === OrderOptions.ASC ? OrderOptions.DESC : OrderOptions.ASC;
    setSortState({ sort, direction });
    onSortChange(sort);
  };

  return {
    sortState,
    setSortState,
    renderSortIcon,
    handleSortChange
  };
};
