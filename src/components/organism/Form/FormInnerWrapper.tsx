import { Box, Typography } from "@mui/material"
import { useContext, useState } from "react";
import { Error, Maybe } from "typedefs/types";
import { InputErrorContext } from "../../../context/InputErrorContext";

interface FormInnerWrapperProps {
    markerIndex: number,
    children: React.ReactNode;
}

export const FormInnerWrapper = ({ markerIndex, children }: FormInnerWrapperProps) => {
    const { inputErrorArr } = useContext(InputErrorContext);

    const result = inputErrorArr.find(each => each.markerIndex === markerIndex);
    const maybeError: Maybe<Error> = result ? result.error : null;

    let isCritical = undefined;
    let errorMessage = '';

    if (maybeError) {
        isCritical = (maybeError.level === 'critical');
        errorMessage = maybeError.message;
    }

    return (
        <Box padding={'10px'} sx={{':hover': {backgroundColor: 'rgba(0 0 0 / 0.05)', borderRadius: '10px'}}}>
            <Box
                width={'95%'}
                mt={1}
                mb={1}
            >
                { children }
            </Box>
            <Box display={'flex'} justifyContent={'center'} width={1} height={'15px'}>
                <Typography variant={'caption'} color={ (isCritical === true) ? 'red' : '#ff5722' }>{ errorMessage }</Typography>
            </Box>
        </Box>
    );
}