import { t } from "mobx-state-tree";

export const OriginalCar = t.model({
    id: t.identifier,
    existingImagesIds: t.maybe(t.array(t.string)),
    pictures: t.maybe(t.array(t.frozen<File>())),
    model: t.string,
    year: t.number,
    description: t.string,
    pricePerHour: t.number,
    type: t.string,
    capacity: t.number,
    fuelType: t.string,
    steering: t.string,
    fuelCapacity: t.number,
});