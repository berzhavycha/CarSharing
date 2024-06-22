import { InputField } from "@/components/common";
import { AuthType, getUserSchema } from "@/helpers";
import { UserDto } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";

export const ProfileSettingsForm: FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<UserDto>({
        mode: 'onSubmit',
        resolver: zodResolver(getUserSchema(AuthType.SIGN_IN, 'none')),
    });


    return (
        <form>
            <Title>General Information</Title>
            <ProfileSection>
                <InputField
                    {...register('firstName')}
                    label="First Name"
                />
                <InputField
                    {...register('lastName')}
                    label="Last Name"
                />
                <InputField
                    {...register('email')}
                    type="email"
                    label="Email"
                />
            </ProfileSection>

            <Title>Change Password</Title>
            <PasswordSection>
                <InputField
                    {...register('password')}
                    label="Old Password"
                    isSecured
                />
                <InputField
                    {...register('password')}
                    label="New Password"
                    isSecured
                />
            </PasswordSection>
        </form>
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

  h3 {
    font-size: 18px;
    margin-bottom: 20px;
  }
`;


