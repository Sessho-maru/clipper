import { Box } from "@mui/material";

interface FormWrapperProps {
    children: React.ReactNode;
}

const wrapperStyle = {
    '& > div:hover': {
        // border: '2px solid'
    },
    '&::-webkit-scrollbar': {
        width: '3px',
        WebkitAppearance: 'none'
    },
    '&::-webkit-scrollbar-thumb': {
        borderRadius: 8,
        border: '1px solid',
        backgroundColor: 'rgba(0 0 0 / 0.5)',
    },
    '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: 'red',
    }
}

export const FormWrapper = ({ children }: FormWrapperProps) => {
    return (
        <Box overflow={'scroll'} height={'450px'} sx={wrapperStyle}>
            { children }    
        </Box>
    );
}