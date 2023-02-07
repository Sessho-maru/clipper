import { Box, Typography } from "@mui/material"
import { useContext, useState } from "react";
import { InputErrorContext } from "../../../context/InputErrorContext";

interface FormInnerWrapperProps {
    children: React.ReactNode;
}

export const FormInnerWrapper = ({ children }: FormInnerWrapperProps) => {
    const { maybeInputError } = useContext(InputErrorContext);
    const isCritical = maybeInputError ? (maybeInputError.level === 'critical') : false;

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
                <Typography variant={'caption'} color={isCritical ? 'red' : '#ff5722'}>{ maybeInputError ? maybeInputError.message : '' }</Typography>
            </Box>
        </Box>
    );
}