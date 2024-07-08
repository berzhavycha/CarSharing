import { BRACKET_CONTENT_REGEX } from "@/regex";

export const extractBracketContent = (str: string): string => {
  const match = str.match(BRACKET_CONTENT_REGEX);
  return match ? match[1] : str;
};
