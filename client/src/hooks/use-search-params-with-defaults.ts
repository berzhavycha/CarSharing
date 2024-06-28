import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';

type HookReturn = {
  searchParams: URLSearchParams;
  setParams: (params: Record<string, string>) => void;
  redirectToDefaultParams: () => void;
};

export const useSearchParamsWithDefaults = (defaultParams?: Record<string, string>): HookReturn => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const setParams = (params: Record<string, string>): void => {
    const newParams = { ...Object.fromEntries(searchParams.entries()), ...params };
    setSearchParams(newParams);
  };

  const redirectToDefaultParams = (): void => {
    if (defaultParams) {
      const newSearchParams = createSearchParams(defaultParams);
      navigate(`?${newSearchParams}`);
    }
  };

  return { searchParams, setParams, redirectToDefaultParams };
};
