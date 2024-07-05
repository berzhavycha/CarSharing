import { FaCheckCircle, FaExclamationCircle, FaExclamationTriangle } from 'react-icons/fa';
import styled, { css } from 'styled-components';

const iconStyles = css`
  font-size: 24px;
  margin-right: 10px;
`;

export const iconMap = {
  error: styled(FaExclamationCircle)`
    ${iconStyles}
    color: var(--red-status-text);
  `,
  confirm: styled(FaCheckCircle)`
    ${iconStyles}
    color: var(--green-status-text);
  `,
  warning: styled(FaExclamationTriangle)`
    ${iconStyles}
    color: var(--yellow-status-text);
  `,
};
