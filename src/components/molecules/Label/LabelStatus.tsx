import { Box, SxProps, Tooltip, Typography } from "@mui/material";
import { ApiStatus, Error, Maybe } from "typedefs/types";

interface StatusLabelProps {
    apiStatus: ApiStatus;
    sourcePath: string;
    outputPath: string;
    apiError: Maybe<Error>;
}

const typoGraphyEllipsis: SxProps = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
}

export const LabelStatus = ({ apiStatus, sourcePath, outputPath, apiError }: StatusLabelProps) => {
    return (
        <>
            {
                apiError 
                ? <Box>
                    <Typography variant={'h4'} fontFamily={'consolas'}>{apiStatus}</Typography>
                    <Tooltip title={apiError.message} arrow>
                        <Typography color={'error'} sx={typoGraphyEllipsis}>{apiError.message}</Typography>
                    </Tooltip>
                  </Box>
                : <Typography variant={'h3'} fontFamily={'consolas'}>{apiStatus}</Typography>
            }
            <Tooltip title={sourcePath} arrow>
                <Typography variant={'subtitle1'} color={'#d98757'} sx={typoGraphyEllipsis}>{ sourcePath !== '' ? `Video Source: ${sourcePath}` : 'Video source not yet selected' }</Typography>
            </Tooltip>
            <Tooltip title={outputPath} arrow>
                <Typography variant={'subtitle1'} color={'#d98757'} sx={typoGraphyEllipsis}>{ outputPath !== '' ? `Output Directory: ${outputPath}` : 'Output directory not yet specified' }</Typography>
            </Tooltip>
        </>
    )
}