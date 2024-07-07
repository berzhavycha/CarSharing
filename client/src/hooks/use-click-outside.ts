import { RefObject, useEffect, useRef } from 'react';

export const useClickOutside = (handler: () => void, ignoreRef?: RefObject<HTMLElement>): RefObject<HTMLDivElement> => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent): void => {
            if (
                ref.current &&
                !ref.current.contains(event.target as Node) &&
                (!ignoreRef || !ignoreRef.current || !ignoreRef.current.contains(event.target as Node))
            ) {
                handler();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return (): void => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [handler, ignoreRef]);

    return ref;
};