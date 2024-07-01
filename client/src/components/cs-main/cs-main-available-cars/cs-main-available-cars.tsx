import styled from 'styled-components';
import { CSMainAvailableCarsFilter } from './cs-main-available-cars-filter';
import { FC } from 'react';
import { CSMainAvailableCarsList } from './cs-main-available-cars-list';
import { useLoaderData } from 'react-router-dom';
import { AvailableCarsLoaderData } from './loader';


export const CSMainAvailableCars: FC = () => {
    const data = useLoaderData() as { data: AvailableCarsLoaderData }

    return (
        <AvailableCarsWrapper>
            <CSMainAvailableCarsFilter />
            <CSMainAvailableCarsList data={data} />
        </AvailableCarsWrapper>
    );
};

const AvailableCarsWrapper = styled.div`
  display: flex;
  gap: 40px;
`