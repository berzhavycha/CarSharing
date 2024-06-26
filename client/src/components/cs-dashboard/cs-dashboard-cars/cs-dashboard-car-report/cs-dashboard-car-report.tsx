import { FC } from 'react';
import styled from 'styled-components';

import DefaultImage from '../../../../../public/Car.png';


const bookings = [
    {
        id: '#5D869F5L2',
        customerName: 'Mason Wilson',
        route: 'San Diego - Dallas',
        dateTime: '15 Sept, 8:30AM',
        status: 'Confirmed'
    },
    // ... other booking objects
];



export const CSDashboardCarReport: FC = () => {
    return (
        <CarsContainer>
            <ContentContainer>
                <Table>
                    <thead>
                        <tr>
                            <TableHeader>No.</TableHeader>
                            <TableHeader>Image</TableHeader>
                            <TableHeader>Customer Name</TableHeader>
                            <TableHeader>Pick-up & Drop-off</TableHeader>
                            <TableHeader>Date & Time</TableHeader>
                            <TableHeader>Status</TableHeader>
                            <TableHeader>Actions</TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking, index) => (
                            <TableRow key={booking.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell><img src={DefaultImage} /></TableCell>
                                <TableCell>{booking.customerName}</TableCell>
                                <TableCell>{booking.route}</TableCell>
                                <TableCell>{booking.dateTime}</TableCell>
                                <TableCell>
                                    <StatusBadge status={booking.status}>
                                        {booking.status}
                                    </StatusBadge>
                                </TableCell>
                                <TableCell>
                                    <Button>Details</Button>
                                    <Button>Assign</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </tbody>
                </Table>
            </ContentContainer>
        </CarsContainer>
    );
};


const CarsContainer = styled.div`
  width: 100%;
  max-height: 100vh;
`;

const ContentContainer = styled.div`
  padding: 30px;
  background-color: white;
  margin: 20px;
  border-radius: 10px;
  box-shadow: var(--default-box-shadow);
  height: 94%;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 12px;
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #dee2e6;

  img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  background-color: ${props =>
        props.status === 'Confirmed' ? '#6c757d' :
            props.status === 'Cancelled' ? '#dc3545' : '#007bff'};
`;

const Button = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  margin-right: 5px;

  &:hover {
    background-color: #0056b3;
  }
`;