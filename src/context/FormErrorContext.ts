import { createContext } from 'react';
import type { Error, Marker, Maybe, PropsOf } from 'typedefs/types';

export type MarkerFormError = {
    markerIndex: number;
    where: keyof PropsOf<Marker>;
    error: Error;
};

interface FormErrorContextProps {
    formErrorArr: MarkerFormError[];
    setFormErrorArr: React.Dispatch<React.SetStateAction<MarkerFormError[]>>;
}

export function getLastFormError(heystack: MarkerFormError[], markerIdx: number): Maybe<Error> {
    return (heystack.filter(each => each.markerIndex === markerIdx))
        .map((each) => { return each.error })
        .pop()
        ?? null;
}

export const FormErrorContext = createContext<FormErrorContextProps>({} as FormErrorContextProps);