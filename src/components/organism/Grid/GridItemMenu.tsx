import { Grid } from "@mui/material";

interface GridItemMenuProps {
    children: React.ReactNode;
}

export const GridItemMenu = ({ children }: GridItemMenuProps) => {
    return (
        <Grid
            item
            sm={3} 
            sx={{ mt: '10px' }}
        >
            { children }
        </Grid>
    )
}