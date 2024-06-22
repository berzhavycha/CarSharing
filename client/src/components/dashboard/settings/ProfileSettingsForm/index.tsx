import { CustomForm } from "@/components/common";
import { AuthType, getUserSchema } from "@/helpers";
import { FieldErrorsState, UserDto } from "@/types";
import { FC } from "react";
import styled from "styled-components";

export const ProfileSettingsForm: FC = () => {
    const errors: FieldErrorsState<UserDto> = {}
    const onSubmit = (user: UserDto): Promise<void> => {

    }

    return (
        <CustomForm<UserDto>
            validationSchema={getUserSchema(AuthType.SIGN_UP, '')}
            onSubmit={onSubmit}
        >
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
                    name="password"
                    isSecured
                    error={errors?.password}
                />
                <CustomForm.Input
                    label="New Password"
                    name="password"
                    isSecured
                    error={errors?.password}
                />
            </PasswordSection>
        </CustomForm>
    )
}


const Title = styled.h3`
  margin-bottom: 30px;
`

const ProfileSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 20px;
  margin-top: 0px;
`;

const PasswordSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 30px;
`;


