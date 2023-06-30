import { Box, Typography } from "@mui/material"
import { useContext, useRef } from "react";
import Font, { FontStatus } from "../../molecules/Font/Font";
import { Error, Maybe } from "typedefs/types";
import { InputErrorContext } from "../../../context/InputErrorContext";

interface FormInnerWrapperProps {
    markerIndex: number,
    children: React.ReactNode;
}

type FormStatus = {
    runs: string;
    status: FontStatus;
}

export const FormInnerWrapper = ({ markerIndex, children }: FormInnerWrapperProps) => {
    const refFormError = useRef<Maybe<Error>>(null);
    const { inputErrorArr } = useContext(InputErrorContext);

    const result = inputErrorArr.filter(each => each.markerIndex === markerIndex);
    const errors = result.map((each) => { return each.error });

    refFormError.current = errors.pop() ?? null;
    const formStatus: FormStatus = refFormError.current
        ? { runs: refFormError.current.message, status: refFormError.current.level }
        : { runs: '', status: 'NORMAL' }

    return (
        <Box padding={'10px'} sx={{':hover': {backgroundColor: 'rgba(0 0 0 / 0.05)', borderRadius: '10px'}}}>
            <Box
                width={'95%'}
                mt={0.5}
                mb={1}
            >
                <Font label={(markerIndex + 1).toString()} fontType={'h3'} fontFamily={'consolas'}/> {/* TODO on/off toggle for each bookmark */}
                { children }
            </Box>
            <Box display={'flex'} justifyContent={'center'} width={1} height={'15px'}> {/* TODO Wrap this Box as `LabelErrorMessage` component */}
                <Font label={formStatus.runs} fontType={'h4'} fontStatus={formStatus.status}/>
            </Box>
        </Box>
    );
}