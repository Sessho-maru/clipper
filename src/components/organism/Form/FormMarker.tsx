import React, { useContext, useEffect, useState } from 'react';
import Font from '../../molecules/Font/Font';
import { Stack } from '@mui/material';
import type { Error, Marker, MarkerWhich, MaskedTimeCode, Maybe } from 'typedefs/types';
import { FormMutatingPropOf } from 'typedefs/interfaces';
import { InputTimeCode } from '../../molecules/Input';
import { ERROR_CODE, TIMECODE } from '../../../const/consts';
import { isInvalidBeginEndTimeCode } from '../../../utils/Validator';
import { FormErrorContext, MarkerFormError } from '../../../context/FormErrorContext';
import { makeRealCopy } from '../../../utils/Utilities';

interface FormMarkerProps extends FormMutatingPropOf<'markerTime'> {
    current: { begin: Marker, end: Marker },
    which: MarkerWhich;
}

export const FormMarker = ({ onChange, which, markerIndex, current }: FormMarkerProps) => {
    const [, setMarkerName] = useState<string>('');
    const [markerTimeCode, setMarkerTimeCode] = useState<MaskedTimeCode>('');

    const { formErrorArr, setFormErrorArr } = useContext(FormErrorContext);
    const errorIndex = formErrorArr.findIndex(each => (each.markerIndex === markerIndex && each.error.id === ERROR_CODE.invalidBeginEndTimeCode));

    const markerTimeChangeHandler = (value: MaskedTimeCode): void => {
        setMarkerTimeCode(value);
        
        const whichOpposite: MarkerWhich = (which === 'begin') ? 'end' : 'begin'
        const compare = { which: whichOpposite, markerTime: current[whichOpposite].markerTime };
        const input = { which: which, markerTime: value };

        if (compare.markerTime.length < TIMECODE.LENGTH.HHMMSS || input.markerTime.length < TIMECODE.LENGTH.HHMMSS) {
            onChange({key: 'markerTime', value, markerIndex, which});
            return;
        } // skip checking timecode value validity for optimization's sake 

        const maybeError: Maybe<Error> = isInvalidBeginEndTimeCode(input, compare);
        if (maybeError) {
            const alreadyExist = formErrorArr.findIndex(each => each.markerIndex === markerIndex && each.error.id === ERROR_CODE.invalidBeginEndTimeCode);

            if (alreadyExist === -1) {
                setFormErrorArr([
                    ...formErrorArr, {
                        markerIndex,
                        where: 'markerTime',
                        error: maybeError
                    }
                ]);
            }
        }
        else {
            if (errorIndex !== -1) {
                const copy = makeRealCopy<MarkerFormError[]>(formErrorArr);
                copy.splice(errorIndex, 1);
                setFormErrorArr(copy);
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
            <Font label={which} fontType={'label'} fontFamily={'consolas'} fontWeight={'bold'} style={{ marginTop: '10px' }}/>
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
        </Stack>
    );
}