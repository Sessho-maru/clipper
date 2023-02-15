import { Box, Tooltip, Typography } from "@mui/material"
import { ApiStatus, Error, Maybe } from "typedefs/types";

interface StatusLabelProps {
    apiStatus: ApiStatus;
    sourcePath: string;
    outputPath: string;
    apiError: Maybe<Error>;
}

export const StatusLabel = ({ apiStatus, sourcePath, outputPath, apiError }: StatusLabelProps) => {
    return (
        <Box whiteSpace={'nowrap'} overflow={'hidden'}> {/* TODO: textOverflow is not working... */}
            {
                apiError 
                ? <Box>
                    <Typography variant={'h4'} fontFamily={'consolas'}>{apiStatus}</Typography>
                    <Tooltip title={apiError.message}>
                        <Typography color={'error'}>{apiError.message}</Typography>
                    </Tooltip>
                  </Box>
                : <Typography variant={'h3'} fontFamily={'consolas'}>{apiStatus}</Typography>
            }
            <Tooltip title={sourcePath}>
                <Typography variant={'subtitle1'} color={'#d98757'}>{ sourcePath !== '' ? `Video Source: ${sourcePath}` : 'Video source not yet selected' }</Typography>
            </Tooltip>
            <Tooltip title={outputPath}>
                <Typography variant={'subtitle1'} color={'#d98757'}>{ outputPath !== '' ? `Output Directory: ${outputPath}` : 'Output directory not yet specified' }</Typography>
            </Tooltip>
        </Box>
    )
}