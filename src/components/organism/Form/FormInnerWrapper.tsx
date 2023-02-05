import { Box } from "@mui/material"

interface FormInnerWrapperProps {
    children: React.ReactNode;
}

export const FormInnerWrapper = ({ children }: FormInnerWrapperProps) => {
    return (
        <Box padding={'10px'} sx={{':hover': {backgroundColor: 'rgba(0 0 0 / 0.05)', borderRadius: '10px'}}}>
            <Box
                width={'95%'}
                mt={1}
                mb={3}
            >
                { children }
            </Box>
        </Box>
    );
}