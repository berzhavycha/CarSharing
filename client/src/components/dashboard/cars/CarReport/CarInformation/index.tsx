import React, { FC } from 'react';
import styled from 'styled-components';

const CarInfoContainer = styled.div`
  padding: 20px;
`;

const CarInfoTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const CarInformation: FC = () => {
    return (
        <CarInfoContainer>
            <h2>Car Information</h2>
            <CarInfoTable>
                <tbody>
                    <tr>
                        <td>Driver</td>
                        <td>Total Trips</td>
                        <td>Status</td>
                        <td>Last Maintenance</td>
                        <td>Number Plate</td>
                    </tr>
                    <tr>
                        <td>Alex Noman</td>
                        <td>253</td>
                        <td>Available</td>
                        <td>11 Sept, 2023</td>
                        <td>XYZ-5678</td>
                    </tr>
                </tbody>
            </CarInfoTable>
        </CarInfoContainer>
    );
};