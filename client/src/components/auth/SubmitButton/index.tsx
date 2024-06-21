import { PrimaryButton } from "@/components/common";
import { FC } from "react";

type Props = {
    content: string;
    onClick?: () => Promise<void> | void
}

export const SubmitButton: FC<Props> = ({ content, onClick }) => {
    return (
        <PrimaryButton type="submit" content={content} onClick={onClick} />
    )
}