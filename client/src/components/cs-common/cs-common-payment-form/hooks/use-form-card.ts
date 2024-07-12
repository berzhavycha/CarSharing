import { useState, useEffect } from "react";
import { useCommonForm } from "../../cs-common-form";

type CardDetails = {
    cardNumber: string;
    cardHolder: string;
    expirationDate: string;
    cvc: string;
}

type HookReturn = {
    cardDetails: CardDetails;
    focused: string;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleInputFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export const useFormCard = (): HookReturn => {
    const { formHandle: { formState } } = useCommonForm()

    const [cardDetails, setCardDetails] = useState<CardDetails>({
        cardNumber: '',
        cardHolder: '',
        expirationDate: '',
        cvc: '',
    });
    const [focused, setFocused] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setCardDetails({
            ...cardDetails,
            [e.target.name]: e.target.value,
        });
    };

    const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>): void => {
        setFocused(e.target.name);
    };

    useEffect(() => {
        setCardDetails({
            cardNumber: '',
            cardHolder: '',
            expirationDate: '',
            cvc: '',
        })
        setFocused('')
    }, [formState.isSubmitted])

    return {
        cardDetails,
        focused,
        handleInputChange,
        handleInputFocus
    }
}