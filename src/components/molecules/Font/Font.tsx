import { StyledFont } from "./Font.style";
import type { ErrorLevel } from "typedefs/types";

export type FontType = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'label';
export type FontWeight = 'bold' | 'italic';
export type FontStatus = ErrorLevel | 'NORMAL' | 'ACTIVATED' | 'DISABLED';

export interface FontProps {
    label: string,
    fontType: FontType,
    fontWeight?: FontWeight,
    fontStatus?: FontStatus,
    fontFamily?: string
}

const Font = ({ label, fontType, fontWeight, fontStatus, fontFamily }: FontProps) => {
    return (
        <StyledFont type={fontType} weight={fontWeight} status={fontStatus} family={fontFamily}>
            { label }
        </StyledFont>
    );
}

export default Font;