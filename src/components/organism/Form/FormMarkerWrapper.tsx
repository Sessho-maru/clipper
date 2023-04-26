import { Box } from "@mui/material";

interface FormMarkerWrapperProps {
    children: React.ReactNode;
}

export const FormMarkerWrapper = ({ children }: FormMarkerWrapperProps) => {
    return (
        <Box
            width={'100%'}
            display={'flex'}
            justifyContent={'space-evenly'}
        >
            { children } {/* TODO Adding `>` symbol between two <FormMarker/> component */}
        </Box>
    )
}