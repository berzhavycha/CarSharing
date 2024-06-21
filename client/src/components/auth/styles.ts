import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1020px;
  margin: 0 auto;
  width: 100%;
`;

export const FormInner = styled.div`
  width: 900px;
  padding: 40px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
`;

export const Title = styled.span`
  font-size: 24px;
  display: block;
  margin-bottom: 10px;
`;

export const Span = styled.span`
  font-size: 18px;
`;

export const FormBlocks = styled.div`
  margin-top: 20px;
`;

export const Button = styled.button`
  background-color: var(--main-blue);
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  color: white;
  width: 100%;
  cursor: pointer;
  transition: var(--default-transition);
  &:hover {
    background-color: var(--dark-blue);
  }
`;

export const StyledLink = styled.a`
  color: blue;
  text-decoration: none;
`;
