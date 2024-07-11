import { FC } from 'react';

import { CSCommonPrimaryButton } from '@/components/cs-common';

interface Props extends React.InputHTMLAttributes<HTMLButtonElement> {
  content: string;
  onClick?: () => Promise<void> | void;
}

export const CSCommonFormSubmitButton: FC<Props> = ({ content, onClick }) => {
  return <CSCommonPrimaryButton type="submit" content={content} onClick={onClick} />;
};
