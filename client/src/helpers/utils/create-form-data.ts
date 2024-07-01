export const createFormData = <T extends object>(data: T): FormData => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
        }
    });

    return formData;
};