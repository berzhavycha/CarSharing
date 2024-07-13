import { flow, getRoot, t } from 'mobx-state-tree';
import { UNEXPECTED_ERROR_MESSAGE } from '@/helpers';
import { returnCar } from '@/services';
import { RentalType } from '../models';
import { RootStoreType } from './root-store';


export const CarReturnStore = t
    .model('CarReturnStore', {
        rentalToReturnId: t.maybeNull(t.string),
        loading: t.optional(t.boolean, false),
        refund: t.optional(t.maybe(t.number), undefined),
        penalty: t.optional(t.maybe(t.number), undefined),
        isReturnedInTime: t.optional(t.boolean, false),
        errorMessage: t.optional(t.string, ''),
    })
    .views(self => ({
        get rentalToReturn(): RentalType | null | undefined {
            const rentalStore = getRoot<RootStoreType>(self).rentalStore;
            return self.rentalToReturnId
                ? rentalStore.rentalList.rentals.find(rental => rental.id === self.rentalToReturnId)
                : null;
        }
    }))
    .actions((self) => ({
        setRentalToReturnId(id: string | null): void {
            self.rentalToReturnId = id
        },
        setLoading(loading: boolean): void {
            self.loading = loading;
        },
        setRefund(refund: number | undefined): void {
            self.refund = refund;
        },
        setPenalty(penalty: number | undefined): void {
            self.penalty = penalty;
        },
        setIsReturnedInTime(inTime: boolean): void {
            self.isReturnedInTime = inTime;
        },
        setErrorMessage(error: string): void {
            self.errorMessage = error;
        },
    }))
    .actions(self => ({
        returnCar: flow(function* (id: string) {
            try {
                self.setLoading(true);
                const { rental, refund, penalty, error } = yield returnCar(id);
                const userStore = getRoot<RootStoreType>(self).currentUserStore;

                if (userStore.user?.balance) {
                    if (refund) {
                        self.setRefund(refund);
                        userStore.updateBalance(userStore.user.balance + refund);
                    } else if (penalty) {
                        self.setPenalty(penalty);
                        userStore.updateBalance(userStore.user.balance - penalty);
                    } else if (rental) {
                        self.setIsReturnedInTime(true);
                    }
                }

                if (error) {
                    self.setErrorMessage(error);
                }
            } catch (error) {
                self.setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
            } finally {
                self.setLoading(false);
                self.setRentalToReturnId(null);
            }
        }),
    }));