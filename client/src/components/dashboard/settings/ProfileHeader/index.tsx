import { PrimaryButton } from "@/components/common";
import { FC } from "react";
import styled from "styled-components";

export const ProfileHeader: FC = () => {
    return (
        <ProfileHeaderWrapper>
            <ProfilePicture>
                <img src="path_to_profile_pic" alt="Profile" />
                <UpdatePicture>Update Picture</UpdatePicture>
            </ProfilePicture>
            <UserInfo>
                <h2>Mason Wilson</h2>
                <span>Admin</span>
            </UserInfo>
            <PrimaryButton content='Save' />
        </ProfileHeaderWrapper>
    )
}

const ProfileHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 50px;
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