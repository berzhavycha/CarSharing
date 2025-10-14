import { axiosInstance } from '@/api';
import { Env } from '@/core';
import { QueryRentalsDto, Rental } from '@/types';

type ServiceReturn = {
  rentals: Rental[];
  total: number;
};

export const fetchRentalHistory = async (queryDto: QueryRentalsDto): Promise<ServiceReturn> => {
  const { data } = await axiosInstance.get(`${Env.RENTAL_API_BASE_URL}/rentals/history`, {
    params: queryDto,
  });

  console.log(
  data[0].map((r) => ({
    id: r.id,
    rentalStart: r.rentalStart,
    rentalEnd: r.rentalEnd ?? null,
    totalPrice: r.totalPrice,
    requestedHours: r.requestedHours,
    pickUpLocation: r.pickUpLocation,
    dropOffLocation: r.dropOffLocation,
    status: r.status,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    transactions: r.transactions?.map((t) => ({
      id: t.id,
      amount: t.amount,
      paymentMethod: t.paymentMethod,
      createdAt: t.createdAt,
      status: t.status,
    })) ?? [],
    car: {
      ...r.car
    },
    originalCar: {
      ...r.car
    },
  }))
);

  return { rentals: data[0], total: data[1] };
};
