import { FC, MouseEvent } from 'react';
import styled from 'styled-components';
import { iconMap } from './icon-map';

type ModalProps = {
    type: 'error' | 'confirm' | 'warning';
    title: string;
    message: string;
    onClose: () => void;
    onOk?: () => void;
    onCancel?: () => void;
};

export const CSCommonModal: FC<ModalProps> = ({ type, title, message, onClose, onOk, onCancel }) => {
    const Icon = iconMap[type];

    const handleOverlayClick = (event: MouseEvent): void => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <ModalOverlay onClick={handleOverlayClick}>
            <ModalContainer>
                <ModalHeader>
                    {Icon && <Icon />}
                    <ModalTitle>{title}</ModalTitle>
                </ModalHeader>
                <ModalMessage>{message}</ModalMessage>
                <ModalActions>
                    {onCancel && <CancelButton onClick={onCancel}>Cancel</CancelButton>}
                    {onOk && <OkButton onClick={onOk}>Ok</OkButton>}
                </ModalActions>
            </ModalContainer>
        </ModalOverlay>
    );
};

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContainer = styled.div`
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: var(--default-box-shadow);
    width: 400px;
    max-width: 90%;
    text-align: center;
    position: relative;
`;

const ModalHeader = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 15px;
`;

const ModalTitle = styled.h2`
    font-size: 20px;
    margin: 0;
`;

const ModalMessage = styled.p`
    font-size: 16px;
    color: var(--light-dark);
`;

const ModalActions = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
`;

const Button = styled.button`
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: var(--default-transition);
    margin-left: 10px;
`;

const OkButton = styled(Button)`
    background: var(--main-blue);
    color: white;

    &:hover {
        background: var(--dark-blue);
    }
`;

const CancelButton = styled(Button)`
    background: var(--gray);
    color: white;

    &:hover {
        background: var(--dark);
    }
`;
