import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1020px;
  margin: 0 auto;
  width: 100%;
`;

export const FormInner = styled.div`
  width: 400px;
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

export const FormBlock = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const Label = styled.label`
  margin-bottom: 5px;
`;

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #000;
`;

export const Input = styled.input`
  width: 100%;
  border: none;
  outline: none;
  padding: 10px;
  padding-right: 25px;
`;

export const ErrorMessage = styled.div`
  color: red;
  font-size: 12px;
  min-height: 18px; 
`;

export const Button = styled.button`
  background-color: rgb(40, 190, 40);
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  color: white;
  width: 100%;
  cursor: pointer;
`;

export const StyledLink = styled.a`
  color: blue;
  text-decoration: none;
`;

