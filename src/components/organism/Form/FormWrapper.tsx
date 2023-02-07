import { Box, SxProps } from "@mui/material";

interface FormWrapperProps {
    children: React.ReactNode;
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

export const FormWrapper = ({ children }: FormWrapperProps) => {
    return (
        <Box overflow={'scroll'} height={'655px'} paddingTop={'10px'} sx={scrollBarStyle}>
            { children }    
        </Box>
    );
}