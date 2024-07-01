export type SearchParams = { [key: string]: string | string[] | number | undefined };

export type FilterOption<T> = {
  label: T;
  count: number;
};
