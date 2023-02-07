import { createContext } from 'react';
import { Error, Maybe } from 'typedefs/types';

interface InputErrorContextProps {
    maybeInputError: Maybe<Error>;
    setMaybeInputError: React.Dispatch<React.SetStateAction<Maybe<Error>>>;
}

export const InputErrorContext = createContext<InputErrorContextProps>({} as InputErrorContextProps);