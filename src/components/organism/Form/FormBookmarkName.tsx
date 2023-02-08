import React, { useContext, useEffect, useRef, useState } from 'react';
import { TextField } from '@mui/material';
import useMarkerMutable from '../../../hooks/useMarkerMutable'; // TODO rename to useMakeMarkerMutable
import { FormMutatingPropOf } from 'typedefs/interfaces';
import { MarkerNameUtil } from '../../../utils/Utilities';
import { InputErrorContext } from '../../../context/InputErrorContext';
import { PUNCS_FORBIDDEN_FRONTAL } from '../../../const/consts';

interface FormBookmarkNameProps extends FormMutatingPropOf<'bookmarkName'> {
    current: string;
}

export const FormBookmarkName = ({ onChange, markerIndex, current }: FormBookmarkNameProps) => {
    const [value, setValue] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);
    const isMutable = useMarkerMutable(inputRef);

    const { inputErrorArr, setInputErrorArr } = useContext(InputErrorContext);
    const errorIndex = inputErrorArr.findIndex(each => (each.markerIndex === markerIndex && each.where === 'markerName'));

    const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const value = event.target.value;

        const isDirty = MarkerNameUtil.isNameDirty(value);
        if (isDirty) {
            setInputErrorArr([
                ...inputErrorArr,{
                    markerIndex,
                    where: 'markerName',
                    error: {
                        id: 'W000',
                        level: 'warning',
                        message: `Any forbidden character '${PUNCS_FORBIDDEN_FRONTAL.join(`','`)}' will be repalced into '_'`
                    }
                }
            ]);
        }
        else {
            setInputErrorArr(inputErrorArr.filter(each => (each.markerIndex !== markerIndex && each.where !== 'markerName')));
        }

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