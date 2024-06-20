import { FC } from 'react';
import { useForm } from 'react-hook-form';
import {
    Container,
    FormInner,
    Title,
    Span,
    FormBlocks,
    Button,
    StyledLink,
} from './styles';
import { UserDto } from 'src/types/auth';
import { userSchema } from './validation';
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthType } from '@/helpers';
import { TextInput } from '@/components/common/TextInput';

export const SignUpPage: FC = () => {
    const { register, handleSubmit, formState: { isSubmitted, errors } } = useForm<UserDto>({
        mode: 'onSubmit',
        resolver: zodResolver(userSchema(AuthType.SIGN_UP)),
    });

    const onSubmit = (data: UserDto): void => {
        console.log('Form submitted:', data);
    };

    return (
        <Container>
            <FormInner>
                <form name="register" className="register" onSubmit={handleSubmit(onSubmit)}>
                    <Title>Register</Title>
                    <Span>
                        Already have an account?
                        <StyledLink href="#"> Login here</StyledLink> instead
                    </Span>
                    <FormBlocks>
                        <TextInput
                            {...register('firstName')}
                            label="First Name"
                            error={errors.firstName?.message ?? ''}
                            formSubmitted={isSubmitted}
                            autoComplete="off"
                        />
                        <TextInput
                            {...register('lastName')}
                            label="Last Name"
                            error={errors.lastName?.message ?? ''}
                            formSubmitted={isSubmitted}
                            autoComplete="off"
                        />
                        <TextInput
                            {...register('email')}
                            label="Email"
                            error={errors.email?.message ?? ''}
                            formSubmitted={isSubmitted}
                            autoComplete="off"
                        />
                        <TextInput
                            {...register('password')}
                            label="Password"
                            error={errors.password?.message ?? ''}
                            formSubmitted={isSubmitted}
                            autoComplete="off"
                            isSecured
                        />
                        <TextInput
                            {...register('confirmPassword')}
                            label="Confirm Password"
                            error={errors.password?.message ?? ''}
                            formSubmitted={isSubmitted}
                            autoComplete="off"
                            isSecured
                        />
                    </FormBlocks>
                    <Button>Register</Button>
                </form>
            </FormInner>
        </Container>
    );
};