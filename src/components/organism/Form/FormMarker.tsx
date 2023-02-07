import React, { useEffect, useState } from 'react';
import { Stack, TextField, Typography } from '@mui/material';
import { Error, Marker, MarkerWhich, MaskedTimeCode, Maybe } from 'typedefs/types';
import { FormMutatingPropOf } from 'typedefs/interfaces';
import { InputTimeCode } from '../../molecules/Input';
import { TIMECODE } from '../../../const/consts';
import { isValidTimeCodeInput } from '../../../utils/Validator';

interface FormMarkerProps extends FormMutatingPropOf<'markerTime' | 'markerName'> {
    current: { begin: Marker, end: Marker },
    which: MarkerWhich;
}

export const FormMarker = ({ onChange, which, markerIndex, current }: FormMarkerProps) => {
    const [name, setName] = useState<string>('');
    const [timeCode, setTimeCode] = useState<MaskedTimeCode>('');
    const [maybeError, setMaybeError] = useState<Maybe<Error>>(null);

    const markerNameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const { id, value } = event.target;
        setName(value);
        onChange({key: id as 'markerName', value, markerIndex, which});
    };

    const markerTimeChangeHandler = (value: MaskedTimeCode): void => {
        setTimeCode(value);
        onChange({key: 'markerTime', value, markerIndex, which});
    }

    useEffect(() => {
        setName(current[which].markerName);
        setTimeCode(current[which].markerTime);

        const whichOpposite = (which === 'begin') ? 'end' : 'begin'

        const compare: { which: MarkerWhich, markerTime: MaskedTimeCode } = {
            which: whichOpposite,
            markerTime: current[whichOpposite].markerTime,
        };
        const input: { which: MarkerWhich, markerTime: MaskedTimeCode } = {
            which: which,
            markerTime: current[which].markerTime,
        };

        if (compare.markerTime.length >= TIMECODE.LENGTH.HHMMSS && input.markerTime.length >= TIMECODE.LENGTH.HHMMSS) {
            setMaybeError(isValidTimeCodeInput(input, compare));
        }
        else {
            setMaybeError(null);
        }
    }, [current[which]])

    return (
        <Stack spacing={1} width={'35%'}>
            <Typography variant={'caption'} fontFamily={'consolas'} height={'10px'}>{which}</Typography>
            <InputTimeCode
                id={'markerTime'}
                which={which}
                value={timeCode}
                mask={TIMECODE.MASK}
                onAccept={markerTimeChangeHandler}
                placeholder={'00:00:00.000'}
                error={!!maybeError}
                variant={'outlined'}
                size={'small'}
            />
            <TextField
                id={'markerName'}
                value={name}
                onChange={markerNameChangeHandler}
                placeholder={'Marker Name'}
                variant={'outlined'}
                size={'small'}
            />
        </Stack>
    );
}