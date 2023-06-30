import styled, { css } from 'styled-components';
import { FontStatus, FontType, FontWeight } from './Font';

interface FontProps {
    type: FontType;
    weight?: FontWeight;
    status?: FontStatus;
    family?: string;
}

const sizeStyle = css`
    ${({ type }: FontProps) => {
        switch(type) {
            case 'h1': { return css`
                font-size: 42px;
            `}
            case 'body': { return css`
                font-size: 20px;
            `}
            case 'label': { return css`
                font-size: 18px;
            `}
            default: return false;
        }
    }}
`;

const colorStyle = css`
    ${({ status }: FontProps) => {
        switch(status) {
            case 'CRITICAL': { return css`
                color: #FF0000;
            `}
            case 'WARNING': { return css`
                color: #FF5722;
            `}
            case 'DISABLED': { return css`
                color: #808080; 
                opacity: 0.5;
            `}
            default: return false;
        }
    }}
`;

const fontStyle = css`
    ${({ family }: FontProps) => 
        family 
            ? css`font-family: ${family};` 
            : css`font-family: Roboto;`
    }
`;

export const StyledFont = styled.span<FontProps>`
    ${sizeStyle}
    ${colorStyle}
    ${fontStyle}
`;