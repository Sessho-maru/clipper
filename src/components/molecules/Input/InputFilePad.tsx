import { Paper, Stack, Typography } from "@mui/material"
import tryParsePBF from "../../../api/ParseDaumpotPBF";
import { ApiStatus, Error, PbfParsed } from "typedefs/types";

function ignoreDefault(event: React.DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
}

interface InputFilePadProps {
    onSuccess: (arg: PbfParsed[]) => void,
    onFail: (err: Error) => void,
    onPending: (arg: ApiStatus) => void,
}

export const InputFilePad = ({onSuccess, onFail, onPending}: InputFilePadProps) => {
    const dropHandler = async (event: React.DragEvent): Promise<void> => {
        ignoreDefault(event);

        const ext = event.dataTransfer.files[0].path.split('.').pop();
        if (ext !== 'json' && ext !== 'pbf') {
            return;
        }
        
        onPending('parsing');

        const response = await tryParsePBF(event.dataTransfer.files[0].path);
        if (response.error) {
            onFail(response.error);
        }
        else {
            const data: PbfParsed[] = JSON.parse(response.message);
            onSuccess(data.map((each): PbfParsed => {
                return {
                    __typename: 'PbfParsed',
                    ...each
                }
            }));
        }
    }

    return (
        <Paper
            onDragEnter={ignoreDefault}
            onDragLeave={ignoreDefault}
            onDragOver={ignoreDefault}
            onDrop={dropHandler}
            sx={{ 
                mt: '10px',
                width: '100%',
                height: '140px',
                color: 'white',
                outline: 'dashed',
                outlineOffset: '-10px',
                backgroundColor: 'lightBlue',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Stack sx={{ alignItems: 'center', color: 'grey' }}>
                <Typography sx={{ fontFamily: 'consolas', fontSize: '12px', ml: '2px', mr: '2px' }}>{'Drop here'}</Typography>
                <Typography sx={{ fontFamily: 'consolas', fontSize: '12px', ml: '2px', mr: '2px' }}>{'.pbf from DAUMPot'}</Typography>
                <Typography sx={{ fontFamily: 'consolas', fontSize: '12px', ml: '2px', mr: '2px' }}>{'or .json from VLC'}</Typography>
            </Stack>
        </Paper>
    )
}