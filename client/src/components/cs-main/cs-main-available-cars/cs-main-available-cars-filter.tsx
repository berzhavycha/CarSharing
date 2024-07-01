import { FC, useState } from 'react';
import styled from 'styled-components';
import { AvailableCarsLoaderData } from './loader';
import { FilterOption } from '@/types';
import { useSearchParams } from 'react-router-dom';


type Props = {
  data: AvailableCarsLoaderData['filterOptions']
}

type CapacityOption = FilterOption<string | number> & { originalValue: string | number };

export const CSMainAvailableCarsFilter: FC<Props> = ({ data }) => {
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [searchParams, setSearchParams] = useSearchParams()

  const typeOptions = data.types
  const capacityOptions = data.capacities.map(item => ({
    ...item,
    label: `${item.label} People`,
    originalValue: item.label
  }));

  const onType = (label: string): void => {
    const currentTypes = searchParams.getAll('types[]');

    if (currentTypes.includes(label)) {
      searchParams.delete('types[]', label);
    } else {
      searchParams.append('types[]', label);
    }
    setSearchParams(searchParams);
  };

  const onCapacity = (label: string): void => {
    const currentCapacities = searchParams.getAll('capacities[]');
    if (currentCapacities.includes(label)) {
      searchParams.delete('capacities[]', label);
    } else {
      searchParams.append('capacities[]', label);
    }
    setSearchParams(searchParams);
  };

  const renderCheckboxes = (type: "types[]" | "capacities[]", options: FilterOption<string | number>[], onCheck: (label: string) => void): JSX.Element[] => {
    return options.map((option) => (
      <CheckboxLabel key={option.label} >
        <HiddenCheckbox type="checkbox" checked={searchParams.getAll(type).includes(`${(option as CapacityOption).originalValue || option.label}`)} />
        <CustomCheckbox
          onClick={() => onCheck(`${(option as CapacityOption).originalValue || option.label}`)}
        />
        {option.label}
        <Count>({option.count})</Count>
      </CheckboxLabel>
    ));
  };

  return (
    <SidebarContainer>
      <SectionTitle>TYPE</SectionTitle>
      <CheckBoxesWrapper>
        {renderCheckboxes("types[]", typeOptions, onType)}
      </CheckBoxesWrapper>

      <SectionTitle>CAPACITY</SectionTitle>
      <CheckBoxesWrapper>
        {renderCheckboxes("capacities[]", capacityOptions, onCapacity)}
      </CheckBoxesWrapper>

      <SectionTitle>PRICE</SectionTitle>
      <PriceSliderContainer>
        <PriceSlider
          type="range"
          min="0"
          max="100"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
        />
        <PriceValue>Max. ${maxPrice.toFixed(2)}</PriceValue>
      </PriceSliderContainer>
    </SidebarContainer>
  );
};

const SidebarContainer = styled.div`
  flex: 0 0 24%;
  padding: 35px;
  background-color: white;
  min-height: 100%;
  margin-top: 5px;
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 300;
  margin-bottom: 15px;
  color: var(--gray);
`;

const CheckBoxesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 30px;
`

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 8px;
  cursor: pointer;
`;

const HiddenCheckbox = styled.input`
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const CustomCheckbox = styled.span`
  width: 18px;
  height: 18px;
  background: #fff;
  border: 2px solid #ddd;
  border-radius: 4px;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 150ms;

  ${HiddenCheckbox}:checked + & {
    background: #3f81f8;
    border: 2px solid #3f81f8;
  }

  ${HiddenCheckbox}:checked + &::after {
    content: '✔';
    color: white;
    font-size: 12px;
  }
`;

const Count = styled.span`
  color: #6c757d;
  margin-left: 4px;
`;

const PriceSliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PriceSlider = styled.input`
  -webkit-appearance: none;
  width: 100%;
  height: 10px;
  border-radius: 5px;
  background: #ddd;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--main-blue);
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--gray);
    cursor: pointer;
  }
`;

const PriceValue = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: #333;
`;