import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import { createRoot } from 'react-dom/client';
import Splitter from './features/splitter/Splitter';

const container = document.getElementById('App');
const root = createRoot(container);
root.render(
  <Box sx={{ flexGrow: 1 }}>
  <Grid 
    container
    spacing={0}
    direction="column"
    alignItems="center"
    justifyContent="center"
  >
    <Grid item xs={12}>
      <Splitter/>
    </Grid>
  </Grid>
  </Box>
);