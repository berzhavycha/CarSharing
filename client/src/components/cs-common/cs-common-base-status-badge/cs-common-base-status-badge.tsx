import { device } from "@/styles";
import styled from "styled-components";

export const CSCommonBaseStatusBadge = styled.div`
  width: 100%;
  display: inline-block;
  padding: 6px 10px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  text-transform: capitalize;

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