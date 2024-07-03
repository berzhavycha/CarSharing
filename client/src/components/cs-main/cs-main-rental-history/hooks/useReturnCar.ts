import { useState } from 'react';
import { useStore } from '@/context';
import { returnCar as returnCarService } from '@/services';
import { UNEXPECTED_ERROR_MESSAGE } from '@/helpers';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

type ReturnCarHook = {
    refund: number | undefined;
    setRefund: React.Dispatch<React.SetStateAction<number | undefined>>;
    penalty: number | undefined;
    setPenalty: React.Dispatch<React.SetStateAction<number | undefined>>;
    isReturnedInTime: boolean
    setIsReturnedInTime: React.Dispatch<React.SetStateAction<boolean>>;
    errorMessage: string;
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
    carReturnHandler: (id: string) => Promise<void>;
};

export const useReturnCar = (): ReturnCarHook => {
    const { currentUserStore: { updateBalance, user } } = useStore();
    const [refund, setRefund] = useState<number>();
    const [penalty, setPenalty] = useState<number>();
    const [isReturnedInTime, setIsReturnedInTime] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const carReturnHandler = async (id: string): Promise<void> => {
        try {
            const { rental, refund, penalty, error } = await returnCarService(id);

            if (refund && user?.balance) {
                setRefund(refund);
                updateBalance(user.balance + refund);
            } else if (penalty && user?.balance) {
                setPenalty(penalty);
                updateBalance(user.balance - penalty);
            } else if (rental) {
                setIsReturnedInTime(true);
            }

            if (error) {
                setErrorMessage(error);
            }
        } catch (error) {
            setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
        } finally {
            navigate(`${pathname}?${searchParams}`)
        }
    };

    return {
        refund,
        setRefund,
        penalty,
        setPenalty,
        isReturnedInTime,
        setIsReturnedInTime,
        errorMessage,
        setErrorMessage,
        carReturnHandler
    };
};
