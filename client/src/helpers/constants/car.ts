import { Option } from "@/components";

export enum CarStatus {
    AVAILABLE = 'available',
    BOOKED = 'booked',
    MAINTAINED = 'maintained',
}

export const CarTypeSelect: Option[] = [
    { label: "MVP", value: "MVP" },
    { label: "SUV", value: "SUV" },
    { label: "Sport", value: "Sport" },
    { label: "Hatchback", value: "Hatchback" },
    { label: "Sedan", value: "Sedan" },
    { label: "Coupe", value: "Coupe" },
    { label: "Crossover", value: "Crossover" },
    { label: "Pickup", value: "Pickup" },
    { label: "Minivan", value: "Minivan" },
]

export const CarStatusSelect: Option[] = [
    { label: "Available", value: "available" },
    { label: "Booked", value: "booked" },
    { label: "Maintained", value: "maintained" },
]

export const CarFuelTypeSelect: Option[] = [
    { label: "Petrol", value: "Petrol" },
    { label: "Diesel", value: "Diesel" },
    { label: "Electric", value: "Electric" },
    { label: "LPG", value: "LPG" },
    { label: "Hybrid", value: "Hybrid" },
    { label: "Natural Gas", value: "NaturalGas" },
]