import { PrimaryButton } from '@/components/common';
import { User } from '@/types';
import { FC } from 'react';
import styled from 'styled-components';

type Props = {
  user: User
}

export const ProfileContent: FC<Props> = ({ user }) => {
  return (
    <ContentContainer>
      <ProfileHeader>
        <ProfilePicture>
          <img src="path_to_profile_pic" alt="Profile" />
          <UpdatePicture>Update Picture</UpdatePicture>
        </ProfilePicture>
        <UserInfo>
          <h2>Mason Wilson</h2>
          <span>Admin</span>
        </UserInfo>
        <PrimaryButton content='Save' />
      </ProfileHeader>

      <Title>General Information</Title>
      <ProfileForm>
        <InputGroup>
          <Label>First Name</Label>
          <Input type="text" value="Mason" />
        </InputGroup>
        <InputGroup>
          <Label>Last Name</Label>
          <Input type="text" value="Wilson" />
        </InputGroup>
        <InputGroup>
          <Label>Email Address</Label>
          <Input type="email" value="masonwilson123@gmail.com" />
        </InputGroup>
      </ProfileForm>

      <Title>Change Password</Title>
      <PasswordSection>
        <InputGroup>
          <Label>Old Password</Label>
          <Input type="password" />
        </InputGroup>
        <InputGroup>
          <Label>New Password</Label>
          <Input type="password" />
        </InputGroup>
      </PasswordSection>
    </ContentContainer>
  );
};

const ContentContainer = styled.div`
  flex: 1;
  padding: 30px;
  background-color: white;
  margin: 20px;
  border-radius: 10px;
  box-shadow: var(--default-box-shadow);
  height: 94%;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 80px;
`;

const ProfilePicture = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  margin-right: 20px;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const UpdatePicture = styled.a`
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #007bff;
  text-decoration: none;
`;

const UserInfo = styled.div`
  flex: 1;

  h2 {
    margin: 0;
    font-size: 24px;
  }

  span {
    font-size: 14px;
    color: #666;
  }
`;

const Title = styled.h3`
  margin: 30px 0;
`

const ProfileForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  font-size: 16px;
`;

const PasswordSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 30px;

  h3 {
    font-size: 18px;
    margin-bottom: 20px;
  }
`;


