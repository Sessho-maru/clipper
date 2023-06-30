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

    const result = inputErrorArr.filter(each => each.markerIndex === markerIndex);
    const errors = result.map((each) => { return each.error });

    refFormError.current = errors.pop() ?? null;

    return (
        <Box padding={'10px'} sx={{':hover': {backgroundColor: 'rgba(0 0 0 / 0.05)', borderRadius: '10px'}}}>
            <Box
                width={'95%'}
                mt={0.5}
                mb={1}
            >
                <Typography fontFamily={'consolas'} fontSize={'19px'}>{ markerIndex + 1 }</Typography> {/* TODO on/off toggle for each bookmark */}
                {/* <Font label={markerIndex + 1} fontType={'h3'} fontStyle={'consolas'} /> */}
                { children }
            </Box>
            <Box display={'flex'} justifyContent={'center'} width={1} height={'15px'}> {/* TODO Wrap this Box as `LabelErrorMessage` component */}
                <Typography 
                    variant={'caption'} 
                    color={ (refFormError.current) ? refFormError.current.level === 'CRITICAL' ? 'red' : '#ff5722' : undefined }
                >
                    { (refFormError.current) ? refFormError.current.message : '' }
                </Typography>
                {/* <Font label={ (refFormError.current) ? refFormError.current.message : '' } fontType={'h3'} status={refFormError.current ?? undefined} /> */}
            </Box>
        </Box>
    );
}