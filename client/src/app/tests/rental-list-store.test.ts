import { fetchRentalHistory } from '@/services';
import { UNEXPECTED_ERROR_MESSAGE } from '@/helpers';
import { RentalListStore, RentalListStoreType } from '../stores/rental-list-store';
import { makeRental } from './utils';

jest.mock('../../services/rentals/fetch-rental-history.ts', () => ({
    fetchRentalHistory: jest.fn(),
}));

jest.mock('@/core', () => ({
    Env: {
        API_BASE_URL: 'http://test-api.example.com',
    },
}));


describe('RentalListStore', () => {
    let store: RentalListStoreType;

    beforeEach(() => {
        store = RentalListStore.create();
    });

    it('should set rentals', () => {
        const rentals = [
            makeRental(),
            makeRental({ id: '2' })
        ];

        store.setRentals(rentals);

        expect(store.rentals).toHaveLength(2);
        expect(store.rentals).toEqual(rentals);
    });

    it('should add a rental', () => {
        const rental = makeRental()
        store.addRental(rental);
        expect(store.rentals).toHaveLength(1);
        expect(store.rentals[0]).toEqual(rental);
    });

    it('should update a rental', () => {
        const rental = makeRental()
        store.addRental(rental);

        const updatedRental = makeRental()
        store.updateRental('1', updatedRental);

        expect(store.rentals[0]).toEqual(updatedRental);
    });

    it('should set error message', () => {
        store.setErrorMessage('Test error');
        expect(store.errorMessage).toBe('Test error');
    });

    it('should fetch rentals successfully', async () => {
        const rentals = [makeRental()];
        (fetchRentalHistory as jest.Mock).mockResolvedValue({ rentals });

        await store.fetchRentals({});

        expect(store.rentals).toHaveLength(1);
        expect(store.rentals).toEqual(rentals);
        expect(store.errorMessage).toBe('');
    });

    it('should handle fetch rentals error', async () => {
        (fetchRentalHistory as jest.Mock).mockRejectedValue(new Error('API Error'));

        await store.fetchRentals({});

        expect(store.rentals).toHaveLength(0);
        expect(store.errorMessage).toBe(UNEXPECTED_ERROR_MESSAGE);
    });
});