import React, { useContext, useEffect, useRef, useState } from 'react';
import { TextField } from '@mui/material';
import useMakeMarkerMutable from '../../../hooks/useMakeMarkerMutable';
import { FormMutatingPropOf } from 'typedefs/interfaces';
import { makeRealCopy } from '../../../utils/Utilities';
import { FormErrorContext, MarkerFormError } from '../../../context/FormErrorContext';
import { ERROR_CODE } from '../../../const/consts';
import { isDirtyName } from '../../../utils/Validator';
import type { Error, Maybe } from 'typedefs/types';

interface FormBookmarkNameProps extends FormMutatingPropOf<'bookmarkName'> {
    current: string;
}

export const FormBookmarkName = ({ onChange, markerIndex, current }: FormBookmarkNameProps) => {
    const [bookmarkName, setBookmarkName] = useState<string>('');

    const inputRef = useRef<HTMLInputElement>(null);
    const isMutable = useMakeMarkerMutable(inputRef);

    const { formErrorArr, setFormErrorArr } = useContext(FormErrorContext);
    const errorIndex = formErrorArr.findIndex(each => (each.markerIndex === markerIndex && each.error.id === ERROR_CODE.dirtyBookmarkName));

    const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const value = event.target.value;

        const maybeError: Maybe<Error> = isDirtyName(value);
        if (maybeError) {
            const alreadyExist = formErrorArr.findIndex(each => each.markerIndex === markerIndex && each.error.id === maybeError.id);

            if (alreadyExist === -1) {
                setFormErrorArr([
                    ...formErrorArr, {
                        markerIndex,
                        where: 'markerName',
                        error: maybeError
                    }
                ]);
            }
        }
        else {
            if (errorIndex >= 0) {
                const copy = makeRealCopy<MarkerFormError[]>(formErrorArr);
                copy.splice(errorIndex, 1);
                setFormErrorArr(copy);
            }
        }

        setBookmarkName(value);
        onChange({value, markerIndex});
    };

    useEffect(() => {
        const pseudoEvent = { target: { value: current } } as React.ChangeEvent<HTMLInputElement>;
        inputChangeHandler(pseudoEvent);
    }, [current]);

    return (
        <TextField
            ref={inputRef}
            value={bookmarkName}
            variant={'outlined'}
            label={`Bookmark Name ${ !isMutable && (markerIndex === 0) ? '(double-click to edit)' : ''}`}
            disabled={!isMutable}
            onChange={inputChangeHandler}
            color={ errorIndex !== -1 ? 'warning' : undefined }
            size={'small'}
            sx={{
                ml: '10%',
                mb: '1%',
                width: '80%'
            }}
        />
    );
}