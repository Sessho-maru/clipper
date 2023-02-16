import React, { useContext, useEffect, useState } from 'react';
import { Stack, TextField, Typography } from '@mui/material';
import { Error, Marker, MarkerWhich, MaskedTimeCode, Maybe } from 'typedefs/types';
import { FormMutatingPropOf } from 'typedefs/interfaces';
import { InputTimeCode } from '../../molecules/Input';
import { ERROR_CODE, TIMECODE } from '../../../const/consts';
import { isInvalidBeginEndTimeCode } from '../../../utils/Validator';
import { InputErrorContext, MarkerFormInputError } from '../../../context/InputErrorContext';
import { makeRealCopy } from '../../../utils/Utilities';

interface FormMarkerProps extends FormMutatingPropOf<'markerTime' | 'markerName'> {
    current: { begin: Marker, end: Marker },
    which: MarkerWhich;
}

export const FormMarker = ({ onChange, which, markerIndex, current }: FormMarkerProps) => {
    const [markerName, setMarkerName] = useState<string>('');
    const [markerTimeCode, setMarkerTimeCode] = useState<MaskedTimeCode>('');

    const { inputErrorArr, setInputErrorArr } = useContext(InputErrorContext);
    const errorIndex = inputErrorArr.findIndex(each => (each.markerIndex === markerIndex && each.error.id === ERROR_CODE.invalidBeginEndTimeCode));

    const markerNameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const { id, value } = event.target;
        setMarkerName(value);
        onChange({key: id as 'markerName', value, markerIndex, which});
    };

    const markerTimeChangeHandler = (value: MaskedTimeCode): void => {
        setMarkerTimeCode(value);
        
        const whichOpposite: MarkerWhich = (which === 'begin') ? 'end' : 'begin'
        const compare = { which: whichOpposite, markerTime: current[whichOpposite].markerTime };
        const input = { which: which, markerTime: value };

        if (compare.markerTime.length < TIMECODE.LENGTH.HHMMSS || input.markerTime.length < TIMECODE.LENGTH.HHMMSS) {
            onChange({key: 'markerTime', value, markerIndex, which});
            return;
        }

        const maybeError: Maybe<Error> = isInvalidBeginEndTimeCode(input, compare);
        if (maybeError) {
            const alreadyExist = inputErrorArr.findIndex(each => each.markerIndex === markerIndex && each.error.id === ERROR_CODE.invalidBeginEndTimeCode);

            if (alreadyExist === -1) {
                setInputErrorArr([
                    ...inputErrorArr, {
                        markerIndex,
                        where: 'markerTime',
                        error: maybeError
                    }
                ]);
            }
        }
        else {
            if (errorIndex !== -1) {
                const copy = makeRealCopy<MarkerFormInputError[]>(inputErrorArr);
                copy.splice(errorIndex, 1);
                setInputErrorArr(copy);
            }
        }

        onChange({key: 'markerTime', value, markerIndex, which});
    }

    useEffect(() => {
        setMarkerName(current[which].markerName);
        setMarkerTimeCode(current[which].markerTime);
    }, [current[which]]);

    return (
        <Stack spacing={1} width={'35%'}>
            <Typography variant={'caption'} fontFamily={'consolas'} height={'10px'}>{which}</Typography>
            <InputTimeCode
                id={'markerTime'}
                which={which}
                value={markerTimeCode}
                mask={TIMECODE.MASK}
                onAccept={markerTimeChangeHandler}
                placeholder={'HH:MM:SS.Ms'}
                error={ (errorIndex !== -1) ? true : undefined }
                variant={'outlined'}
                size={'small'}
            />
            <TextField
                id={'markerName'}
                value={markerName}
                onChange={markerNameChangeHandler}
                placeholder={'Marker Name'}
                variant={'outlined'}
                size={'small'}
            />
        </Stack>
    );
}