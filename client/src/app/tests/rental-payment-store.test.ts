import { RentalPaymentStore, RentalPaymentStoreType } from '../stores/rental-payment-store';

describe('RentalPaymentStore', () => {
  let store: RentalPaymentStoreType;

  beforeEach(() => {
    store = RentalPaymentStore.create();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('setPotentialRentalPrice', () => {
    it('should set the potential rental price', () => {
      store.setPotentialRentalPrice(150);
      expect(store.potentialRentalPrice).toBe(150);
    });
  });
});
