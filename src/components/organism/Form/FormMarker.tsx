import React, { useEffect, useState } from 'react';
import { Stack, TextField } from '@mui/material';
import { Marker, MaskedTimeCode } from 'typedefs/types';
import { FormMutatingPropOf } from 'typedefs/interfaces';
import { InputTimeCode } from '../../molecules/Input';
import { TIMECODE } from '../../../const/consts';

interface FormMarkerProps extends FormMutatingPropOf<'markerTime' | 'markerName'> {
    current: Marker,
    which: 'begin' | 'end';
}

export const FormMarker = ({ onChange, which, markerIndex, current }: FormMarkerProps) => {
    const [timeCode, setTimeCode] = useState<MaskedTimeCode>('');
    const [markerName, setMarkerName] = useState<string>('');

    const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const { id, value } = event.target;
        switch(id) {
            case 'markerTime': {
                setTimeCode(value);
                onChange({key: id, value, markerIndex, which});
                break;
            }
            case 'markerName': {
                setMarkerName(value);
                onChange({key: id, value, markerIndex, which});
                break;
            }
        }
    };

    useEffect(() => {
        setTimeCode(current.markerTime);
        setMarkerName(current.markerName);
    }, [current])

    return (
        <Stack spacing={1} width={'35%'}>
            <InputTimeCode
                id={'markerTime'}
                which={which}
                value={timeCode}
                mask={TIMECODE.MASK}
                onChange={inputChangeHandler}
                placeholder={'00:00:00.000'}
                variant={'outlined'}
            />
            <TextField
                id={'markerName'}
                value={markerName}
                onChange={inputChangeHandler}
                placeholder={'Marker Name'}
                variant={'outlined'}
            />
        </Stack>
    );
}