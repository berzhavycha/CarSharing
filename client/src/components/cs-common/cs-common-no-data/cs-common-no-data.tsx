import styled from 'styled-components';
import { FaRegSadCry } from 'react-icons/fa';
import { FC } from 'react';

type Props = {
    message?: string;
}

export const CSCommonNoData: FC<Props> = ({ message = 'No Data Available' }) => {
    return (
        <NoDataWrapper>
            <IconWrapper>
                <FaRegSadCry />
            </IconWrapper>
            <Message>{message}</Message>
        </NoDataWrapper>
    );
};

const NoDataWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  color: #666;
`;

const IconWrapper = styled.div`
  font-size: 48px;
  margin-bottom: 5px;
`;

const Message = styled.div`
  font-size: 18px;
  margin-top: 5px;
`;
