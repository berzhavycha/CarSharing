import { FC } from 'react';

import { CarCard } from '@/components';

export const CSMainUserPage: FC = () => {
  return (
    <CarCard
      model="Koenigsegg"
      type="Sport"
      fuelCapacity={90}
      transmission="Manual"
      capacity={2}
      pricePerHour={19}
      imageUrl="../../../public/car.png"
    />
  );
};
