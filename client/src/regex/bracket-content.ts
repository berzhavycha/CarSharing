/**
 * Regular expression to match the content inside the first pair of parentheses in a given string.
 * - \(: Matches the opening parenthesis.
 * - ([^)]*): Captures any characters except closing parenthesis, non-greedily.
 * - \): Matches the closing parenthesis.
 */
export const BRACKET_CONTENT_REGEX = /\(([^)]+)\)/;