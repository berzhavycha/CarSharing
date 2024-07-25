import { castToSnapshot, getRoot } from 'mobx-state-tree';

import { findOrCreateRentalModel, UNEXPECTED_ERROR_MESSAGE } from '@/helpers';
import { returnCar } from '@/services';

import { RentalModel } from '../models';
import { CarReturnStore, RentalListStore, RootStoreType } from '../stores';

import { makeRental, makeRootStore, makeUser, makeUserError } from './utils';

jest.mock('../../services/rentals/return-car.ts', () => ({
  returnCar: jest.fn(),
}));

jest.mock('@/core', () => ({
  Env: {
    API_BASE_URL: 'http://test-api.example.com',
  },
}));

jest.mock('mobx-state-tree', () => ({
  ...jest.requireActual('mobx-state-tree'),
  getRoot: jest.fn(),
}));

jest.mock('../../helpers/utils/store/find-or-create-rental-model.ts', () => ({
  findOrCreateRentalModel: jest.fn(),
}));

describe('CarReturnStore', () => {
  let rootStore: RootStoreType;

  beforeEach(() => {
    rootStore = makeRootStore({
      currentUserStore: {
        user: makeUser(),
        errors: makeUserError(),
      },
      carReturnStore: castToSnapshot(CarReturnStore.create({})),
      rentalListStore: RentalListStore.create({ rentals: [makeRental()] }),
    });

    rootStore.currentUserStore.updateBalance = jest.fn();
    (getRoot as jest.Mock).mockReturnValue(rootStore);
  });

  describe('setRentalToReturn', () => {
    it('should set rental correctly', () => {
      const { singleRentalStore } = rootStore;

      const rental = RentalModel.create(makeRental());

      (findOrCreateRentalModel as jest.Mock).mockReturnValue(rental);

      singleRentalStore.setRental(rental);

      expect(singleRentalStore.rental).toEqual(rental);
    });

    it('should set null correctly', () => {
      const { singleRentalStore } = rootStore;

      singleRentalStore.setRental(null);

      expect(singleRentalStore.rental).toEqual(null);
    });
  });

  describe('returnCar', () => {
    it('should handle successful return with refund', async () => {
      const { carReturnStore } = rootStore;

      jest.spyOn(rootStore.currentUserStore, 'updateBalance').mockReturnValue(undefined);
      (returnCar as jest.Mock).mockResolvedValue({ rental: { id: '1' }, refund: 50 });

      await carReturnStore.returnCar('1');

      expect(carReturnStore.refund).toBe(50);
      expect(carReturnStore.loading).toBe(false);
      expect(carReturnStore.rentalToReturn).toBeNull();
    });

    it('should handle successful return with penalty', async () => {
      const { carReturnStore } = rootStore;

      jest.spyOn(rootStore.currentUserStore, 'updateBalance').mockReturnValue(undefined);
      (returnCar as jest.Mock).mockResolvedValue({ rental: { id: '1' }, penalty: 30 });

      await carReturnStore.returnCar('1');

      expect(carReturnStore.penalty).toBe(30);
      expect(carReturnStore.loading).toBe(false);
      expect(carReturnStore.rentalToReturn).toBeNull();
    });

    it('should handle successful return in time', async () => {
      const { carReturnStore } = rootStore;

      (returnCar as jest.Mock).mockResolvedValue({ rental: { id: '1' } });

      await carReturnStore.returnCar('1');

      expect(carReturnStore.isReturnedInTime).toBe(true);
      expect(carReturnStore.loading).toBe(false);
      expect(carReturnStore.rentalToReturn).toBeNull();
    });

    it('should handle error from API', async () => {
      const { carReturnStore } = rootStore;

      (returnCar as jest.Mock).mockResolvedValue({ error: 'API Error' });

      await carReturnStore.returnCar('1');

      expect(carReturnStore.errorMessage).toBe('API Error');
      expect(carReturnStore.loading).toBe(false);
      expect(carReturnStore.rentalToReturn).toBeNull();
    });

    it('should handle unexpected error', async () => {
      const { carReturnStore } = rootStore;

      (returnCar as jest.Mock).mockRejectedValue(new Error('Unexpected error'));

      await carReturnStore.returnCar('1');

      expect(carReturnStore.errorMessage).toBe(UNEXPECTED_ERROR_MESSAGE);
      expect(carReturnStore.loading).toBe(false);
      expect(carReturnStore.rentalToReturn).toBeNull();
    });
  });
});
