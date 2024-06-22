export type FieldErrorsState<T> = {
  [key in keyof T]?: string;
} & {
  unexpectedError?: string;
};
