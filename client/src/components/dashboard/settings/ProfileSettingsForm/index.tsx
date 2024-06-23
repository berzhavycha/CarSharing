import { CustomForm } from "@/components/common";
import { updateUserSchema } from "@/helpers";
import { FieldErrorsState, UpdateUserDto } from "@/types";
import { FC, useState } from "react";
import styled from "styled-components";
import DefaultImage from '../../../../../public/avatar.webp';

export const ProfileSettingsForm: FC = () => {
    const [errors, setErrors] = useState<FieldErrorsState<UpdateUserDto>>({});


    const onSubmit = async (user: UpdateUserDto): Promise<void> => {
        console.log(user)
    };

    return (
        <CustomForm<UpdateUserDto>
            validationSchema={updateUserSchema}
            onSubmit={onSubmit}
        >
            <ProfileHeaderWrapper>
                <CustomForm.InputFile defaultImage={DefaultImage} name="picture" />
                <UserInfo>
                    <h2>Mason Wilson</h2>
                    <span>Admin</span>
                </UserInfo>
                <CustomForm.SubmitButton content='Save' />
            </ProfileHeaderWrapper>

            <Title>General Information</Title>
            <ProfileSection>
                <CustomForm.Input label="First Name" name="firstName" error={errors?.firstName} />
                <CustomForm.Input label="Last Name" name="lastName" error={errors?.lastName} />
                <CustomForm.Input label="Email" name="email" error={errors?.email} />
            </ProfileSection>

            <Title>Change Password</Title>
            <PasswordSection>
                <CustomForm.Input
                    label="Old Password"
                    name="oldPassword"
                    isSecured
                    error={errors?.oldPassword}
                />
                <CustomForm.Input
                    label="New Password"
                    name="newPassword"
                    isSecured
                    error={errors?.newPassword}
                />
            </PasswordSection>
        </CustomForm>
    );
};

const Title = styled.h3`
  margin-bottom: 30px;
`;

const ProfileSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 40px;
  margin-right: 10px;
`;

const PasswordSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 30px;
  margin-right: 10px;
`;

const ProfileHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 50px;
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
