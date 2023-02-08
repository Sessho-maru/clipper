import { createContext } from 'react';
import { Error, Marker, PropsOf } from 'typedefs/types';

export type MarkerFormInputError = {
    markerIndex: number;
    where: keyof PropsOf<Marker>;
    error: Error;
};

interface InputErrorContextProps {
    inputErrorArr: MarkerFormInputError[]; // 에러 발생한 폼을 구분하기 위해 key 값으로 'markerTime', 'markerName' 이 있어야함, 아니면 서로 덮어써버림
    setInputErrorArr: React.Dispatch<React.SetStateAction<MarkerFormInputError[]>>;
}

export const InputErrorContext = createContext<InputErrorContextProps>({} as InputErrorContextProps);