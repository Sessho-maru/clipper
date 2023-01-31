import { Paper, Stack, Typography } from "@mui/material"

export const InputFilePad = () => {
    return (
        <Paper
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