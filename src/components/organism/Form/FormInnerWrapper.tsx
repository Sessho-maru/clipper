import { Box } from "@mui/material"
import { useContext } from "react";
import Font, { FontStatus } from "../../molecules/Font/Font";
import { FormErrorContext, getLastFormError } from "../../../context/FormErrorContext";

interface FormInnerWrapperProps {
    markerIndex: number,
    children: React.ReactNode;
}

type FormStatus = {
    runs: string;
    status: FontStatus;
}

export const FormInnerWrapper = ({ markerIndex, children }: FormInnerWrapperProps) => {
    const { formErrorArr } = useContext(FormErrorContext);

    const formError = getLastFormError(formErrorArr, markerIndex);
    const formStatus: FormStatus = formError
        ? { runs: formError.message, status: formError.level }
        : { runs: '', status: 'NORMAL' }

    return (
        <Box padding={'10px'} sx={{':hover': {backgroundColor: 'rgba(0 0 0 / 0.05)', borderRadius: '10px'}}}>
            <Box
                width={'95%'}
                mt={0.5}
                mb={1}
            >
                <Font label={(markerIndex + 1).toString()} fontType={'h4'} fontFamily={'consolas'} fontWeight={'italic'}/> {/* TODO on/off toggle for each bookmark */}
                { children }
            </Box>
            <Box display={'flex'} justifyContent={'center'} width={1} height={'19px'}> {/* TODO Wrap this Box as `LabelErrorMessage` component */}
                <Font label={formStatus.runs} fontType={'h4'} fontStatus={formStatus.status}/>
            </Box>
        </Box>
    );
}