import { FC, MouseEvent } from 'react';
import { FaTimes } from 'react-icons/fa';
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

export const CSCommonModal: FC<ModalProps> = ({
  type,
  title,
  message,
  onClose,
  onOk,
  onCancel,
}) => {
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
          <ModalTitle>
            {Icon && <Icon />} {title}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
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
  width: 500px;
  max-width: 90%;
  text-align: center;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const ModalTitle = styled.h2`
  display: flex;
  font-size: 20px;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: var(--light-dark);

  &:hover {
    color: var(--dark);
  }
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