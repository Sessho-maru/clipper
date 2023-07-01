import { StyledFont } from "./Font.style";
import type { ErrorLevel } from "typedefs/types";
import Tooltip, { TooltipProps } from "@mui/material/Tooltip/Tooltip";

export type FontType = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'label';
export type FontWeight = 'bold' | 'italic';
export type FontStatus = ErrorLevel | 'NORMAL' | 'ACTIVATED' | 'DISABLED';

export interface FontProps {
    label: string,
    fontType: FontType,
    fontWeight?: FontWeight,
    fontStatus?: FontStatus,
    fontFamily?: string
    tooltipAttach?: Omit<TooltipProps, 'children'>
}

const Font = ({ label, fontType, fontWeight, fontStatus, fontFamily, tooltipAttach }: FontProps) => {
    return (
        tooltipAttach
            ? (
                <Tooltip title={tooltipAttach.title} placement={tooltipAttach.placement} arrow>
                    <StyledFont type={fontType} weight={fontWeight} status={fontStatus} family={fontFamily}>
                        { label }
                    </StyledFont>
                </Tooltip>
            )
            : (
                <StyledFont type={fontType} weight={fontWeight} status={fontStatus} family={fontFamily}>
                    { label }
                </StyledFont>
            )
    );
}

export default Font;