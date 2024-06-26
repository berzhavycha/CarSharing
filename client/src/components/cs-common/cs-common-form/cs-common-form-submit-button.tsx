import { FC } from 'react';

import { CSCommonPrimaryButton } from '@/components/cs-common';

type Props = {
    content: string;
    onClick?: () => Promise<void> | void;
};

export const CSCommonFormSubmitButton: FC<Props> = ({ content, onClick }) => {
    return <CSCommonPrimaryButton type="submit" content={content} onClick={onClick} />;
};
