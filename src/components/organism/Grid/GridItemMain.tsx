import { Grid } from "@mui/material";

interface GridItemMainProps {
    children: React.ReactNode;
}

export const GridItemMain = ({ children }: GridItemMainProps) => {
    return (
        <Grid
            item
            sm={9}
        >
            { children }
        </Grid>
    )
}