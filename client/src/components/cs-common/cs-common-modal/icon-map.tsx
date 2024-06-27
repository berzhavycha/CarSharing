import { FaCheckCircle, FaExclamationCircle, FaExclamationTriangle } from 'react-icons/fa';
import styled, { css } from 'styled-components';

const iconStyles = css`
  font-size: 24px;
  margin-right: 10px;
`;

export const iconMap = {
  error: styled(FaExclamationCircle)`
    ${iconStyles}
    color: var(--maintained-text);
  `,
  confirm: styled(FaCheckCircle)`
    ${iconStyles}
    color: var(--available-text);
  `,
  warning: styled(FaExclamationTriangle)`
    ${iconStyles}
    color: var(--booked-text);
  `,
};
