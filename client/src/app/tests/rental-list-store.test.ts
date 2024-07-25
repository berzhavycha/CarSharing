import { RentalStatus, UNEXPECTED_ERROR_MESSAGE } from '@/helpers';
import { fetchRentalHistory } from '@/services';

import { RentalListStore, RentalListStoreType } from '../stores/rental-list-store';

import { makeRental } from './utils';
import { applySnapshot } from 'mobx-state-tree';

jest.mock('../../services/rentals/fetch-rental-history.ts', () => ({
  fetchRentalHistory: jest.fn(),
}));

jest.mock('@/core', () => ({
  Env: {
    API_BASE_URL: 'http://test-api.example.com',
  },
}));

jest.mock('mobx-state-tree', () => ({
  ...jest.requireActual('mobx-state-tree'),
  applySnapshot: jest.fn(),
}));

describe('RentalListStore', () => {
  let store: RentalListStoreType;

  beforeEach(() => {
    store = RentalListStore.create();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set rentals', () => {
    const rentals = [makeRental(), makeRental({ id: '2' })];

    store.setRentals(rentals);

    expect(store.rentals).toHaveLength(2);
    expect(store.rentals).toEqual(rentals);
  });

  it('should add a rental', () => {
    const rental = makeRental();
    store.addRental(rental);
    expect(store.rentals).toHaveLength(1);
    expect(store.rentals[0]).toEqual(rental);
  });

  it('should update a rental', () => {
    const rental = makeRental();
    store.addRental(rental);

    const updatedRental = makeRental({ id: rental.id, status: RentalStatus.CANCELLED });
    store.updateRental(rental.id, updatedRental);

    expect(applySnapshot).toHaveBeenCalledWith(
      expect.anything(),
      updatedRental
    );
  });


  it('should fetch rentals successfully', async () => {
    const rentals = [makeRental()];
    (fetchRentalHistory as jest.Mock).mockResolvedValue({ rentals });

    await store.fetchRentals({});

    expect(store.rentals).toHaveLength(1);
    expect(store.rentals).toEqual(rentals);
  });

  it('should handle fetch rentals error', async () => {
    (fetchRentalHistory as jest.Mock).mockRejectedValue(new Error('API Error'));

    await store.fetchRentals({});

    expect(store.errorMessage).toBe(UNEXPECTED_ERROR_MESSAGE);
  });
});
