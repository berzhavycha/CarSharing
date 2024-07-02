import { CSCommonRangeSlider } from "@/components/cs-common";
import { useDebounce } from "@/hooks";
import { FC, useEffect } from "react";
import styled from "styled-components";
import { useRangeSearchParams } from "./hooks";
import { DEBOUNCE_DELAY } from "@/helpers";

type Props = {
    title?: string;
    min?: number;
    max: number;
    roundingInterval: number;
    minParam: string;
    maxParam: string;
};

export const CSCommonRangeFilter: FC<Props> = ({ max, title, roundingInterval, maxParam, minParam, min = 0 }) => {
    const { valueRange, setValueRange, updateSearchParams, roundedMaxValue } = useRangeSearchParams(
        min,
        max,
        minParam,
        maxParam,
        roundingInterval
    );

    const debouncedUpdateSearchParams = useDebounce(updateSearchParams, DEBOUNCE_DELAY);

    useEffect(() => {
        debouncedUpdateSearchParams(valueRange);
    }, [valueRange, debouncedUpdateSearchParams]);

    const handleValueRangeChange = (newRange: [number, number]): void => setValueRange(newRange);

    return (
        <>
            {title && <SectionTitle>{title}</SectionTitle>}
            <CSCommonRangeSlider
                min={min}
                max={roundedMaxValue}
                value={valueRange}
                onChange={handleValueRangeChange}
                formatValue={(value) => `$${value.toFixed(2)}`}
            />
        </>
    );
};

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 300;
  margin-bottom: 15px;
  color: var(--gray);
`;