import { Box, Typography } from "@mui/material"
import { useContext, useRef } from "react";
import { Error, Maybe } from "typedefs/types";
import { InputErrorContext } from "../../../context/InputErrorContext";

interface FormInnerWrapperProps {
    markerIndex: number,
    children: React.ReactNode;
}

export const FormInnerWrapper = ({ markerIndex, children }: FormInnerWrapperProps) => {
    const refFormError = useRef<Maybe<Error>>(null);
    const { inputErrorArr } = useContext(InputErrorContext);

    const resultArr = inputErrorArr.filter(each => each.markerIndex === markerIndex);
    const errors = resultArr.map((each) => { return each.error });

    refFormError.current = errors.pop() ?? null;

    return (
        <Box padding={'10px'} sx={{':hover': {backgroundColor: 'rgba(0 0 0 / 0.05)', borderRadius: '10px'}}}>
            <Box
                width={'95%'}
                mt={1}
                mb={1}
            >
                { children }
            </Box>
            <Box display={'flex'} justifyContent={'center'} width={1} height={'15px'}> {/* TODO Wrap this Box as `LabelErrorMessage` component */}
                <Typography 
                    variant={'caption'} 
                    color={ (refFormError.current) ? refFormError.current.level === 'critical' ? 'red' : '#ff5722' : undefined }
                >
                    { (refFormError.current) ? refFormError.current.message : '' }
                </Typography>
            </Box>
        </Box>
    );
}