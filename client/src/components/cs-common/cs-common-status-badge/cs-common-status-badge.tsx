import styled from 'styled-components';

type StatusBadgeProps = {
  status: string;
};

export const StatusBadge = styled.div<StatusBadgeProps>`
  display: inline-block;
  width: 100%;
  padding: 6px 10px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  color: ${(props): string => (props.status === 'available' ? '#28a745' : '#dc3545')};
  background-color: ${(props): string => (props.status === 'available' ? '#d4edda' : '#f8d7da')};
  border: 2px solid ${(props): string => (props.status === 'available' ? '#c3e6cb' : '#f5c6cb')};
`;
