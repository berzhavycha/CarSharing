import { ChangeEvent, FC } from 'react';
import styled from 'styled-components';

type Props = {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatValue?: (value: number) => string;
}

export const CSCommonRangeSlider: FC<Props> = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  formatValue = (v): string => v.toString(),
}) => {

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const newValue = Number(event.target.value);
    const [minValue, maxValue] = value;
    if (event.target.name === 'min') {
      onChange([Math.min(newValue, maxValue), maxValue]);
    } else {
      onChange([minValue, Math.max(newValue, minValue)]);
    }
  };

  return (
    <SliderContainer>
      <RangeSliderTrack>
        <RangeSliderRange
          style={{
            left: `${((value[0] - min) / (max - min)) * 100}%`,
            right: `${100 - ((value[1] - min) / (max - min)) * 100}%`
          }}
        />
      </RangeSliderTrack>
      <RangeSliderInput
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[0]}
        name="min"
        onChange={handleChange}
      />
      <RangeSliderInput
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[1]}
        name="max"
        onChange={handleChange}
      />
      <SliderValue>
        {formatValue(value[0])} - {formatValue(value[1])}
      </SliderValue>
    </SliderContainer>
  );
};

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  height: 50px;
  width: 100%;
`;

const RangeSliderTrack = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background-color: #ddd;
`;

const RangeSliderRange = styled.div`
  position: absolute;
  height: 5px;
  background-color: var(--main-blue);
`;

const RangeSliderInput = styled.input`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 5px;
  background: transparent;
  position: absolute;
  top: 0;
  pointer-events: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--main-blue);
    cursor: pointer;
    pointer-events: auto;
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--main-blue);
    cursor: pointer;
    pointer-events: auto;
  }
`;

const SliderValue = styled.div`
  margin-top: 20px;
  font-size: 14px;
  color: #333;
`;