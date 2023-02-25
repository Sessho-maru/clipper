import { useEffect, useState } from 'react';
import { Box, SxProps } from "@mui/material";
import { InputErrorContext, MarkerFormInputError } from "../../../context/InputErrorContext";

interface FormWrapperProps {
    children: React.ReactNode;
    setHasInputError: React.Dispatch<React.SetStateAction<boolean>>;
}

const scrollBarStyle: SxProps = {
    '&::-webkit-scrollbar': {
        width: '10px',
        WebkitAppearance: 'none'
    },
    '&::-webkit-scrollbar-thumb': {
        borderRadius: 8,
        border: '1px solid',
        backgroundColor: 'rgba(0 0 0 / 0.05)',
    },
}

export const FormWrapper = ({ children, setHasInputError }: FormWrapperProps) => {
    const [inputErrorArr, setInputErrorArr] = useState<MarkerFormInputError[]>([]);

    useEffect(() => {
        if (inputErrorArr.some(each => each.error.level === 'critical')) {
            setHasInputError(true);
        }
        else {
            setHasInputError(false);
        }
    }, )

    return (
        <InputErrorContext.Provider value={{ inputErrorArr, setInputErrorArr }}>
            <Box overflow={'scroll'} height={'655px'} paddingTop={'10px'} sx={scrollBarStyle}>
                { children }    
            </Box>
        </InputErrorContext.Provider>
    );
}