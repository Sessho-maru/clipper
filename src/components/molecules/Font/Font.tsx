import { StyledFont } from "./Font.style";
import Tooltip, { TooltipProps } from "@mui/material/Tooltip/Tooltip";

export type FontType = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'label';
export type FontWeight = 'bold' | 'italic';
export type FontStatus = "WARNING" | "CRITICAL" | 'NORMAL' | 'ACTIVATED' | 'DISABLED';

export interface FontProps {
    label: string;
    fontType: FontType;
    fontWeight?: FontWeight;
    fontStatus?: FontStatus;
    fontFamily?: string;
    tooltipAttach?: Omit<TooltipProps, 'children'>;
    style?: React.CSSProperties;
}

const Font = ({ label, fontType, fontWeight, fontStatus, fontFamily, tooltipAttach, style }: FontProps) => {
    return (
        tooltipAttach
            ? (
                <Tooltip title={tooltipAttach.title} placement={tooltipAttach.placement} arrow>
                    <StyledFont type={fontType} weight={fontWeight} status={fontStatus} family={fontFamily} style={style}>
                        { label }
                    </StyledFont>
                </Tooltip>
            )
            : (
                <StyledFont type={fontType} weight={fontWeight} status={fontStatus} family={fontFamily} style={style}>
                    { label }
                </StyledFont>
            )
    );
}

export default Font;