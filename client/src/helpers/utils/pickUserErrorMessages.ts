import { UserDto } from "@/types";
import { FieldErrorsState } from "@/types/error";
import { UNEXPECTED_ERROR_MESSAGE } from "../constants";

export const pickUserErrorMessages = (inputErrorMessages: string[]): FieldErrorsState<UserDto> => {
    const fieldErrors = {
        email: '',
        firstName: '',
        lastName: '',
        role: '',
        password: '',
        unexpectedError: '',
    };

    console.log(inputErrorMessages)

    inputErrorMessages.forEach((error) => {
        if (error.toLocaleLowerCase().includes('email') && !fieldErrors.email) {
            fieldErrors.email = error;
        } else if (error.toLocaleLowerCase().includes('password') && !fieldErrors.password) {
            fieldErrors.password = error;
        } else if (error.toLocaleLowerCase().includes('role') && !fieldErrors.password) {
            fieldErrors.role = error;
        } else if (error.toLocaleLowerCase().includes('firstName') && !fieldErrors.password) {
            fieldErrors.role = error;
        } else if (error.toLocaleLowerCase().includes('lastName') && !fieldErrors.password) {
            fieldErrors.role = error;
        }
        else {
            fieldErrors.unexpectedError = UNEXPECTED_ERROR_MESSAGE;
        }
    });

    return fieldErrors;
};