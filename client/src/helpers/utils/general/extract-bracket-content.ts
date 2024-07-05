export const extractBracketContent = (str: string): string => {
  const match = str.match(/\(([^)]+)\)/);
  return match ? match[1] : str;
};
