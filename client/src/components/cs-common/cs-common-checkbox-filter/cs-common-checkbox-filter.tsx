import { FC } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import { CSCommonCheckbox } from '@/components/cs-common';
import { useSearchParamFilter } from '@/hooks';
import { FilterOption } from '@/types';

type Props = {
  title?: string;
  type: string;
  options: FilterOption<string | number>[];
};

export const CSCommonCheckboxFilter: FC<Props> = ({ title, type, options }) => {
  const [searchParams] = useSearchParams();
  const { onFilter } = useSearchParamFilter();

  return (
    <>
      {title && <SectionTitle>{title}</SectionTitle>}
      <CheckBoxesWrapper>
        {options.map((option) => {
          const label = `${option.originalValue || option.label}`;

          return (
            <CSCommonCheckbox
              key={option.label}
              type={type}
              option={option}
              checked={searchParams.getAll(type).includes(label)}
              onCheck={() => onFilter(type, label)}
            />
          );
        })}
      </CheckBoxesWrapper>
    </>
  );
};

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
`;
