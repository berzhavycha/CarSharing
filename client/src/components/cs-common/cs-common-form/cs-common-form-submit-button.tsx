import { FC } from 'react';

import { CSCommonPrimaryButton } from '@/components/cs-common';

interface Props extends React.InputHTMLAttributes<HTMLButtonElement> {
  buttonContent: string | JSX.Element;
  onClick?: () => Promise<void> | void;
}

export const CSCommonFormSubmitButton: FC<Props> = ({ buttonContent, onClick }) => {
  return <CSCommonPrimaryButton type="submit" content={buttonContent} onClick={onClick} />;
};
