import { Paper, Stack, Typography } from "@mui/material"
import tryParsePBF from "../../../api/ParseDaumpotPBF";
import { ApiStatus, Error, PbfParsed } from "typedefs/types";
import { useState } from "react";

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
    const [isFileBeingDragged, setIsFileBeingDragged] = useState<boolean>(false);

    const dropHandler = async (event: React.DragEvent): Promise<void> => {
        ignoreDefault(event);
        setIsFileBeingDragged(false);

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
        <>
            <Paper
                onDragEnter={(event: React.DragEvent) => { ignoreDefault(event); setIsFileBeingDragged(true); }}
                onDragLeave={(event: React.DragEvent) => { ignoreDefault(event); setIsFileBeingDragged(false); }}
                onDragOver={ignoreDefault}
                onDrop={dropHandler}
                sx={{ 
                    position: 'absolute',
                    zIndex: isFileBeingDragged ? 3009 : 0,
                    backgroundColor: isFileBeingDragged ? 'rgba(180, 180, 180, 0.5)' : 'rgba(0, 0, 0, 0)',
                    top: '0px',
                    left: '0px',
                    width: '100%',
                    height: '100%',
                }}
            />
            <Stack 
                spacing={2.5}
                sx={{
                    position: 'absolute',
                    color: 'rgba(0, 0, 0, 1)',
                    top: '36%',
                    left: '30%',
                    alignItems: 'center',
                }}
                display={ isFileBeingDragged ? undefined : 'none' }
            >
                <Typography sx={{ fontFamily: 'consolas', fontSize: '32px' }}>{'Drop here'}</Typography>
                <Typography sx={{ fontFamily: 'consolas', fontSize: '32px' }}>{'.pbf from DAUMPot'}</Typography>
                {/* <Typography sx={{ fontFamily: 'consolas', fontSize: '32px' }}>{'or .json from VLC'}</Typography> */}
            </Stack>
        </>
    )
}