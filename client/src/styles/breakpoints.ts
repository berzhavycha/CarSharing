import styled from "styled-components"

interface Size {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    xxl: string
}

const size: Size = {
    xs: '400px',
    sm: '600px', 
    md: '900px', 
    lg: '1280px', 
    xl: '1440px',
    xxl: '1920px',
}

export const device = {
    xs: `(max-width: ${size.xs})`,
    sm: `(max-width: ${size.sm})`,
    md: `(max-width: ${size.md})`,
    lg: `(max-width: ${size.lg})`,
    xl: `(max-width: ${size.xl})`,
    xxl: `(max-width: ${size.xxl})`,
}


export const HideOnMDScreen = styled.div`
  display: contents;

  @media ${device.md} {
    display: none;
  }
`;


export const HideOnSMScreen = styled.div`
  display: contents;

  @media ${device.sm} {
    display: none;
  }
`;

export const HideOnXSScreen = styled.div`
  display: contents;

  @media ${device.xs} {
    display: none;
  }
`;
