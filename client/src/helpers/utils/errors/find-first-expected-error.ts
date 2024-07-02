import { errorHandler } from "./error-handler";

export const findFirstExpectedError = <T extends object>(error: unknown, fieldMappings: Record<string, keyof T>): { error?: string } => {
    const errorMessages = errorHandler<T>(error, fieldMappings);
    const errorKeys = Object.keys(errorMessages);
    const firstErrorKey = errorKeys.find((key) => key !== 'unexpectedError');

    if (firstErrorKey) {
        return { error: errorMessages[firstErrorKey as keyof T] };
    }

    return { error: errorMessages['unexpectedError'] };
}