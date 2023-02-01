import React, { useState } from 'react';
import { Stack, TextField } from '@mui/material';
import { MaskedTimeCode } from 'typedefs/types';
import { FormMutatingPropOf } from 'typedefs/interfaces';
import { InputTimeCode } from '../../molecules/Input';
import { TIMECODE } from '../../../const/consts';

interface FormMarkerProps extends FormMutatingPropOf<'markerTime' | 'markerName'> {
    which: 'begin' | 'end';
}

export const FormMarker = ({ onChange, which, markerIndex }: FormMarkerProps) => {
    const [timeCode, setTimeCode] = useState<MaskedTimeCode>('');
    const [markerName, setMarkerName] = useState<string>('');

    const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const { id, value } = event.target;
        switch(id) {
            case 'markerTime': {
                setTimeCode(value);
                onChange({value, markerIndex, key: 'markerTime', which});
                break;
            }
            case 'markerName': {
                setMarkerName(value);
                onChange({value, markerIndex, key: 'markerName', which});
                break;
            }
        }
    };

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