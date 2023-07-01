import { useEffect, useState } from 'react';
import { Box, SxProps } from "@mui/material";
import { FormErrorContext, MarkerFormError } from "../../../context/FormErrorContext";

interface FormWrapperProps {
    children: React.ReactNode;
    setHasInputError: React.Dispatch<React.SetStateAction<boolean>>;
}

const scrollableAreaStyle: SxProps = {
    '&::-webkit-scrollbar': {
        width: '10px',
        WebkitAppearance: 'none'
    },
    '&::-webkit-scrollbar-thumb': {
        borderRadius: 8,
        border: '1px solid',
        backgroundColor: 'rgba(0 0 0 / 0.05)',
    },
    'position': 'relative'
}

export const FormWrapper = ({ children, setHasInputError }: FormWrapperProps) => {
    const [formErrorArr, setFormErrorArr] = useState<MarkerFormError[]>([]);

    useEffect(() => {
        if (formErrorArr.some(each => each.error.level === 'CRITICAL')) {
            setHasInputError(true);
        }
        else {
            setHasInputError(false);
        }
    }, [formErrorArr]);

    return (
        <FormErrorContext.Provider value={{ formErrorArr, setFormErrorArr }}>
            <Box overflow={'scroll'} height={'655px'} paddingTop={'10px'} sx={scrollableAreaStyle}>
                { children }    
            </Box>
        </FormErrorContext.Provider>
    );
}