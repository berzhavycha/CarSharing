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
];

export const CarStatusSelect: Option[] = [
    { label: "Available", value: CarStatus.AVAILABLE },
    { label: "Booked", value: CarStatus.BOOKED },
    { label: "Maintained", value: CarStatus.MAINTAINED },
];

export enum CarFuelType {
    PETROL = 'Petrol',
    DIESEL = 'Diesel',
    ELECTRIC = 'Electric',
    LPG = 'LPG',
    HYBRID = 'Hybrid',
    NATURAL_GAS = 'Natural Gas',
}

export const CarFuelTypeSelect: Option[] = [
    { label: "Petrol", value: CarFuelType.PETROL },
    { label: "Diesel", value: CarFuelType.DIESEL },
    { label: "Electric", value: CarFuelType.ELECTRIC },
    { label: "LPG", value: CarFuelType.LPG },
    { label: "Hybrid", value: CarFuelType.HYBRID },
    { label: "Natural Gas", value: CarFuelType.NATURAL_GAS },
];

export enum CarSteeringType {
    RACK_PINION = 'Rack and Pinion',
    RECIRCULATING_BALL = 'Recirculating Ball',
    DIRECT_ADAPTIVE = 'Direct Adaptive',
    VARIABLE_RATIO = 'Variable Ratio',
    FOUR_WHEEL = 'Four-wheel Steering',
    ELECTRIC_POWER = 'Electric Power Steering (EPS)',
    SPEED_SENSITIVE = 'Speed-sensitive Steering',
    HYDRAULIC_POWER = 'Hydraulic Power Steering (HPS)',
    MANUAL = 'Manual Steering',
    DRIVE_BY_WIRE = 'Drive-by-wire Steering',
}

export const CarSteeringTypeSelect: Option[] = [
    { label: "Rack and Pinion", value: CarSteeringType.RACK_PINION },
    { label: "Recirculating Ball", value: CarSteeringType.RECIRCULATING_BALL },
    { label: "Direct Adaptive", value: CarSteeringType.DIRECT_ADAPTIVE },
    { label: "Variable Ratio", value: CarSteeringType.VARIABLE_RATIO },
    { label: "Four-wheel Steering", value: CarSteeringType.FOUR_WHEEL },
    { label: "Electric Power Steering (EPS)", value: CarSteeringType.ELECTRIC_POWER },
    { label: "Speed-sensitive Steering", value: CarSteeringType.SPEED_SENSITIVE },
    { label: "Hydraulic Power Steering (HPS)", value: CarSteeringType.HYDRAULIC_POWER },
    { label: "Manual Steering", value: CarSteeringType.MANUAL },
    { label: "Drive-by-wire Steering", value: CarSteeringType.DRIVE_BY_WIRE },
];

