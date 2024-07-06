import { device } from '@/styles';
import styled from 'styled-components';

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHeader = styled.th`
  text-align: left;
  padding: 12px;
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  cursor: pointer;

  @media ${device.lg} {
    font-size: 14px;
  }

  @media ${device.md} {
    font-size: 12px;
  }
`;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }
`;

export const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #dee2e6;

  img {
    width: 80px;
    height: 50px;
    object-fit: contain;
    border-radius: 50%;
  }

  @media ${device.lg} {
    font-size: 14px;
    img {
      width: 70px;
      height: 40px;
    }
  }

  @media ${device.md} {
    font-size: 12px;
    img {
      width: 60px;
      height: 30px;
    }
  }

  @media ${device.sm} {
    font-size: 10px;
    img {
      width: 40px;
      height: 20px;
    }
  }
`;


export const HiddenSMTableHeader = styled(TableHeader)`
  @media ${device.sm} {
    display: none;
  }
`;

export const HiddenXSTableHeader = styled(TableHeader)`
  @media ${device.xs} {
    display: none;
  }
`;

export const HiddenMDTableHeader = styled(TableHeader)`
  @media ${device.md} {
    display: none;
  }
`;

export const HiddenSMTableCell = styled(TableCell)`
  @media ${device.sm} {
    display: none;
  }
`;

export const HiddenXSTableCell = styled(TableCell)`
  @media ${device.xs} {
    display: none;
  }
`;

export const HiddenMDTableCell = styled(TableCell)`
  @media ${device.md} {
    display: none;
  }
`;
