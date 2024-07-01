import { CSCommonContainer } from '@/components';
import { FC } from 'react';
import styled from 'styled-components';

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


const Section = styled.div`
  padding: 30px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const FooterWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const Copyright = styled.span`
  color: #666;
`;

const Links = styled.div`
  a {
    color: #666;
    text-decoration: none;
    margin-left: 20px;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;
