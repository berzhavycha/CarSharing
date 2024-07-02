import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";

type HookReturn = {
    valueRange: [number, number];
    setValueRange: React.Dispatch<React.SetStateAction<[number, number]>>;
    updateSearchParams: (newValueRange: [number, number]) => void;
    roundedMaxValue: number;
}

export const useRangeSearchParams = (
    min: number,
    max: number,
    minParam: string,
    maxParam: string,
    roundingInterval: number
): HookReturn => {
    const [searchParams, setSearchParams] = useSearchParams();
    const roundedMaxValue = Math.ceil(max / roundingInterval) * roundingInterval;

    const initialMinValue = parseFloat(searchParams.get(minParam) ?? min.toString());
    const initialMaxValue = parseFloat(searchParams.get(maxParam) ?? roundedMaxValue.toString());

    const [valueRange, setValueRange] = useState<[number, number]>([initialMinValue, initialMaxValue]);

    const updateSearchParams = useCallback(
        (newValueRange: [number, number]) => {
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.set(minParam, newValueRange[0].toString());
            newSearchParams.set(maxParam, newValueRange[1].toString());
            setSearchParams(newSearchParams);
        },
        [searchParams, setSearchParams, minParam, maxParam]
    );

    return { valueRange, setValueRange, updateSearchParams, roundedMaxValue };
};
