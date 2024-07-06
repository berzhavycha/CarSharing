import { ELLIPSIS } from "@/helpers/constants";
import { range } from "./range";

export const generatePageNumbers = (
    currentPage: number,
    totalPages: number,
    maxVisiblePages: number
): (number | typeof ELLIPSIS)[] => {
    const pageNumbers: (number | typeof ELLIPSIS)[] = [];
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    if (totalPages <= maxVisiblePages) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= halfVisiblePages) {
        pageNumbers.push(...range(1, maxVisiblePages - 1), ELLIPSIS, totalPages);
    } else if (currentPage > totalPages - halfVisiblePages) {
        pageNumbers.push(1, ELLIPSIS, ...range(totalPages - maxVisiblePages + 2, totalPages));
    } else {
        pageNumbers.push(1, ELLIPSIS, ...range(currentPage - 1, currentPage + 1), ELLIPSIS, totalPages);
    }

    return pageNumbers;
};