import { createContext } from 'react';
import type { Error, Marker, PropsOf } from 'typedefs/types';

export type MarkerFormInputError = {
    markerIndex: number;
    where: keyof PropsOf<Marker>;
    error: Error;
};

interface InputErrorContextProps {
    inputErrorArr: MarkerFormInputError[];
    setInputErrorArr: React.Dispatch<React.SetStateAction<MarkerFormInputError[]>>;
}

export const InputErrorContext = createContext<InputErrorContextProps>({} as InputErrorContextProps);