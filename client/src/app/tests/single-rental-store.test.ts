import { RentalListStore, RootStoreType, SingleRentalStore } from '../stores';
import { getRental } from '@/services';
import { makeRental, makeRootStore } from './utils';
import { castToSnapshot, getRoot } from 'mobx-state-tree';
import { findOrCreateRentalModel, UNEXPECTED_ERROR_MESSAGE } from '@/helpers';
import { RentalModel } from '../models';

jest.mock('mobx-state-tree', () => ({
    ...jest.requireActual('mobx-state-tree'),
    getRoot: jest.fn(),
}));

jest.mock('@/core', () => ({
    Env: {
        API_BASE_URL: 'http://test-api.example.com',
    },
}));

jest.mock('../../helpers/utils/store/find-or-create-rental-model.ts', () => ({
    findOrCreateRentalModel: jest.fn(),
}));

jest.mock('../../services/rentals/get-rental.ts', () => ({
    getRental: jest.fn(),
}));

describe('SingleRentalStore', () => {
    let rootStore: RootStoreType

    beforeEach(() => {
        rootStore = makeRootStore({
            singleRentalStore: castToSnapshot(SingleRentalStore.create({})),
            rentalListStore: RentalListStore.create({ rentals: [makeRental()] }),
        });

        (getRoot as jest.Mock).mockReturnValue(rootStore);
    });

    describe('setRental', () => {
        it('should set single rental correctly', () => {
            const { singleRentalStore } = rootStore

            const rental = RentalModel.create(makeRental());

            (findOrCreateRentalModel as jest.Mock).mockReturnValue(rental)

            singleRentalStore.setRental(rental);

            expect(singleRentalStore.rental).toEqual(rental);
        });

        it('should set null correctly', () => {
            const { singleRentalStore } = rootStore;

            singleRentalStore.setRental(null);

            expect(singleRentalStore.rental).toEqual(null);
        });
    })

    describe('fetchSingleRental', () => {
        it('should fetch rental successfully', async () => {
            const { singleRentalStore } = rootStore

            const rental = RentalModel.create(makeRental());
            (getRental as jest.Mock).mockResolvedValue(rental);

            await singleRentalStore.fetchSingleRental('1');

            expect(singleRentalStore.rental).toEqual(rental);
        });

        it('should handle fetch rental error', async () => {
            const { singleRentalStore } = rootStore;

            (getRental as jest.Mock).mockRejectedValue(new Error('API Error'));

            await singleRentalStore.fetchSingleRental('1');

            expect(singleRentalStore.rental).toBeNull();
            expect(singleRentalStore.errorMessage).toBe(UNEXPECTED_ERROR_MESSAGE);
        });

        it('should clear error message before fetching', async () => {
            const { singleRentalStore } = rootStore;

            singleRentalStore.setErrorMessage('Previous error');
            (getRental as jest.Mock).mockResolvedValue(RentalModel.create(makeRental()));

            await singleRentalStore.fetchSingleRental('1');

            expect(singleRentalStore.errorMessage).toBe('');
        });
    });
});