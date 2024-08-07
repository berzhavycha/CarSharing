import { FC, PropsWithChildren } from 'react';
import styled from 'styled-components';

export const CSCommonContainer: FC<PropsWithChildren> = ({ children }) => {
  return <ContainerSection>{children}</ContainerSection>;
};

const ContainerSection = styled.div`
  max-width: 1340px;
  margin: 0 auto;
  padding: 0 30px;
`;
