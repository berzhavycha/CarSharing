import { Dispatch, SetStateAction, useState } from "react";
import { FaSortUp, FaSortDown, FaSort } from "react-icons/fa";

type SortState = {
    sort: string;
    direction: "asc" | "desc";
}

type HookReturn = {
    sortState: SortState;
    setSortState: Dispatch<SetStateAction<SortState>>;
    renderSortIcon: (column: string) => JSX.Element;
}

export const useSortColumn = (): HookReturn => {
    const [sortState, setSortState] = useState<SortState>({ sort: '', direction: 'asc' });

    const renderSortIcon = (column: string): JSX.Element => {
        if (sortState.sort === column) {
            return sortState.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
        }
        return <FaSort />;
    }

    return {
        sortState,
        setSortState,
        renderSortIcon
    }
}