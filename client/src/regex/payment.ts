/**
 * Regular expression to validate expiration date in MM/YY or MM/YYYY format.
 * - MM: Month should be between 01 and 12.
 * - YY or YYYY: Year can be in two or four digits.
 */
export const EXPIRATION_DATE_REGEX = /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/;
