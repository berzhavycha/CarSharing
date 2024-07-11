import styled from 'styled-components';

export const CSCommonTooltip = styled.div`
  position: absolute;
  bottom: 105%;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--gray-blue);
  color: white;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 10px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;
`;
