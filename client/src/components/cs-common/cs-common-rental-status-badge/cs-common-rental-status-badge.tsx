import { RentalStatus } from "@/helpers";
import { device } from "@/styles";
import styled from "styled-components";

export const CSCommonRentalStatusBadge = styled.div<{ $status: RentalStatus }>`
  width: 100%;
  display: inline-block;
  padding: 6px 10px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  text-transform: capitalize;

   color: ${(props): string => {
        switch (props.$status) {
            case RentalStatus.ACTIVE:
                return 'var(--green-status-text)';
            case RentalStatus.CLOSED:
                return 'var(--yellow-status-text)';
            case RentalStatus.CANCELLED:
                return 'var(--red-status-text)';
            default:
                return 'var(--default-text)';
        }
    }};
  background-color: ${(props): string => {
        switch (props.$status) {
            case RentalStatus.ACTIVE:
                return 'var(--green-status-bg)';
            case RentalStatus.CLOSED:
                return 'var(--yellow-status-bg)';
            case RentalStatus.CANCELLED:
                return 'var(--red-status-bg)';
            default:
                return 'var(--default-bg)';
        }
    }};
  border: 2px solid
    ${(props): string => {
        switch (props.$status) {
            case RentalStatus.ACTIVE:
                return 'var(--green-status-border)';
            case RentalStatus.CLOSED:
                return 'var(--yellow-status-border)';
            case RentalStatus.CANCELLED:
                return 'var(--red-status-border)';
            default:
                return 'var(--default-border)';
        }
    }};


  @media ${device.lg} {
    font-size: 12px;
    padding: 5px 10px;
  }

  @media ${device.md} {
    font-size: 11px;
  }

  @media ${device.sm} {
    font-size: 10px;
    padding: 2px 6px;
  }

  @media ${device.xs} {
    font-size: 8px;
    padding: 2px 4px;
  }
`;