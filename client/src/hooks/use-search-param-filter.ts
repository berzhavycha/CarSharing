import { useSearchParams } from "react-router-dom";

type HookReturn = {
    onFilter: (key: string, label: string) => void;
}

export const useSearchParamFilter = (): HookReturn => {
    const [searchParams, setSearchParams] = useSearchParams();

    const onFilter = (key: string, label: string): void => {
        const currentValues = searchParams.getAll(key);

        if (currentValues.includes(label)) {
            searchParams.delete(key, label);
        } else {
            searchParams.append(key, label);
        }
        setSearchParams(searchParams);
    };

    return { onFilter }
}