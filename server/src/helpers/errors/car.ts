export const carErrorMessages = {
  CAR_BY_ID_NOT_FOUND: (id: string): string => `Car with ID ${id} not found`,
  CAR_CANNOT_BE_DELETED: `Car is currently rented and cannot be removed`,
};
