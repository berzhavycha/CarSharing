import { Car, OriginalCar } from "@/entities";

export const mockLocalFile = {
  id: 'av-id',
  filename: 'test.jpg',
  path: 'some/path',
  mimetype: 'image/jpeg',
  car: new Car(),
  originalCar: new OriginalCar()
};
