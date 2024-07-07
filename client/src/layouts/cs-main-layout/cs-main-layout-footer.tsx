import { FC } from 'react';
import styled from 'styled-components';

import { CSCommonContainer } from '@/components';
import { device } from '@/styles';

export const CSMainLayoutFooter: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Section>
      <CSCommonContainer>
        <FooterWrapper>
          <Copyright>© {currentYear} CARRENT. All rights reserved</Copyright>
          <Links>
            <a href="#">Privacy & Policy</a>
            <a href="#">Terms & Conditions</a>
          </Links>
        </FooterWrapper>
      </CSCommonContainer>
    </Section>
  );
};

const Section = styled.footer`
  padding: 30px;
  background-color: #fff;
  box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.1);
`;

const FooterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media ${device.sm} {
    flex-direction: column;
    justify-content: center;
  }
`;

const Copyright = styled.span`
  color: #666;

  @media ${device.md} {
    font-size: 12px;
  }
`;

const Links = styled.div`
  a {
    color: #666;
    text-decoration: none;
    margin-left: 20px;
    &:hover {
      text-decoration: underline;
    }

    @media ${device.md} {
      font-size: 12px;
    }

    @media ${device.sm} {
      margin-left: 0px;
      &:last-child {
        margin-left: 10px;
      }
    }
  }
`;
