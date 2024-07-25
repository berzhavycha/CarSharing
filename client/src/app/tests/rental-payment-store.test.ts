import { RentalPaymentStore, RentalPaymentStoreType } from '../stores/rental-payment-store';

describe('RentalPaymentStore', () => {
    let store: RentalPaymentStoreType;

    beforeEach(() => {
        store = RentalPaymentStore.create();
    });

    describe('setPotentialRentalPrice', () => {
        it('should set the potential rental price', () => {
            store.setPotentialRentalPrice(150);
            expect(store.potentialRentalPrice).toBe(150);
        });

        it('should update the potential rental price', () => {
            store.setPotentialRentalPrice(150);
            store.setPotentialRentalPrice(200);
            expect(store.potentialRentalPrice).toBe(200);
        });

        it('should handle zero as a valid price', () => {
            store.setPotentialRentalPrice(0);
            expect(store.potentialRentalPrice).toBe(0);
        });

        it('should handle floating point numbers', () => {
            store.setPotentialRentalPrice(99.99);
            expect(store.potentialRentalPrice).toBe(99.99);
        });
    });
});