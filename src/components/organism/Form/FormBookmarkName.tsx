import React, { useEffect, useRef, useState } from 'react';
import { TextField, Tooltip } from '@mui/material';
import useMarkerMutable from '../../../hooks/useMarkerMutable';
import { FormMutatingPropOf } from 'typedefs/interfaces';

interface FormBookmarkNameProps extends FormMutatingPropOf<'bookmarkName'> {
    current: string;
}

export const FormBookmarkName = ({ onChange, markerIndex, current }: FormBookmarkNameProps) => {
    const [value, setValue] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);
    const isMutable = useMarkerMutable(inputRef);

    const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const value = event.target.value;
        setValue(value);
        onChange({value, markerIndex});
    };

    useEffect(() => {
        setValue(current);
    }, [current])

    return (
        <TextField
            ref={inputRef}
            value={value}
            variant={'outlined'}
            label={'Bookmark Name'}
            disabled={!isMutable}
            onChange={inputChangeHandler}
            size={'small'}
            sx={{
                ml: '10%',
                mb: '1%',
                width: '80%'
            }}
        />
    );
}