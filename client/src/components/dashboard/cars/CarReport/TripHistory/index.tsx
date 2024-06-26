import React, { FC } from 'react';
import styled from 'styled-components';

const TripHistoryContainer = styled.div`
  padding: 20px;
`;

const TripTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TripHistory: FC = () => {
    const trips = [
        { id: '#5D869F5L2', details: 'San Diego - Dallas', status: 'Completed' },
        { id: '#8E969P5L4', details: 'Phoenix - San Jose', status: 'Cancelled' },
        { id: '#3H359K9L1', details: 'San Francisco - Austin', status: 'Completed' },
    ];

    return (
        <TripHistoryContainer>SDFDSF
            <h2>Trip History</h2>
            <TripTable>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Trip Details</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {trips.map((trip, index) => (
                        <tr key={index}>
                            <td>{trip.id}</td>
                            <td>{trip.details}</td>
                            <td>{trip.status}</td>
                        </tr>
                    ))}
                </tbody>
            </TripTable>
        </TripHistoryContainer>
    );
};