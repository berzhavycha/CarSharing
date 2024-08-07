import { FC } from 'react';
import styled from 'styled-components';

import { FilterOption } from '@/types';

type Props = {
  type: string;
  option: FilterOption<string | number>;
  checked: boolean;
  onCheck: (key: string, label: string) => void;
};

export const CSCommonCheckbox: FC<Props> = ({ type, option, checked, onCheck }) => {
  const onCheckboxClick = (): void => onCheck(type, `${option.originalValue || option.label}`);

  return (
    <CheckboxLabel key={option.label}>
      <HiddenCheckbox type="checkbox" readOnly checked={checked} />
      <CustomCheckbox onClick={onCheckboxClick} />
      {option.label}
      <Count>({option.count})</Count>
    </CheckboxLabel>
  );
};

const Count = styled.span`
  color: var(--gray);
  margin-left: 4px;
`;

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
    background: var(--main-blue);
    border: 2px solid var(--main-blue);
  }

  ${HiddenCheckbox}:checked + &::after {
    content: '✔';
    color: white;
    font-size: 12px;
  }
`;
