import { device } from "@/styles";
import styled from "styled-components";

export const CSCommonTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: var(--dark);
  margin-bottom: 20px;

  @media ${device.md} {
    margin-bottom: 18px;
  }

  @media ${device.sm} {
    margin-bottom: 16px;
  }
`;