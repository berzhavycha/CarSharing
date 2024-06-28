export const stringToNumber = (value: unknown): unknown => {
    if (typeof value === 'string') {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? value : parsed;
    }
    return value;
};
