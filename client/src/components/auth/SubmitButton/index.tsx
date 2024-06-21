import { FC } from 'react';

import { PrimaryButton } from '@/components/common';

type Props = {
  content: string;
  onClick?: () => Promise<void> | void;
};

export const SubmitButton: FC<Props> = ({ content, onClick }) => {
  return <PrimaryButton type="submit" content={content} onClick={onClick} />;
};
