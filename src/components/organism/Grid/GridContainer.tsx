import { Grid } from "@mui/material";

interface GridContainerProps {
    children: React.ReactNode;
}

export const GridContainer = ({ children }: GridContainerProps) => {
    return (
        <Grid
            container
            spacing={0}
            direction={'row'}
            alignItems={'start'}
        >
            { children }
        </Grid>
    );
}