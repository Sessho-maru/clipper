import { Box } from "@mui/material"

interface FormInnerWrapperProps {
    children: React.ReactNode;
}

export const FormInnerWrapper = ({ children }: FormInnerWrapperProps) => {
    return (
        <Box
            width={'95%'}
            mb={6}
        >
            { children }
        </Box>
    );
}