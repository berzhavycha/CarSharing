import { ChangeEvent, FC } from 'react';
import styled from 'styled-components';

import { CSCommonSelectField } from '@/components/cs-common';
import { sortingOptions } from '@/helpers';
import { useSearchParamsWithDefaults } from '@/hooks';

export const CSMainAvailableCarsSort: FC = () => {
  const { setParams } = useSearchParamsWithDefaults();

  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const selectedValue = event.target.value;
    const [sort, order] = selectedValue.split('_');
    const sortField = sort === 'price' ? 'pricePerHour' : sort;

    setParams({ sort: sortField, order: order.toUpperCase() });
  };

  return (
    <SortContainer>
      <SectionTitle>Sort By:</SectionTitle>
      <CSCommonSelectField options={sortingOptions} onChange={handleSortChange} />
    </SortContainer>
  );
};

const SortContainer = styled.div`
  margin-top: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 300;
  margin-bottom: 10px;
  color: var(--gray);
`;
