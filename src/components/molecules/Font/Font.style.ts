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
                font-size: 44px;
                line-height: 56px;
            `}
            case 'h2': { return css`
                font-size: 23px;
                line-height: 30px;
            `}
            case 'h3': { return css`
                font-size: 20px;
                line-height: 26px;
            `}
            case 'h4': { return css`
                font-size: 17px;
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
                color: #EA3E4F;
            `}
            case 'ACTIVATED': { return css`
                color: #D98757;
            `}
            case 'DISABLED': { return css`
                color: #808080; 
                opacity: 0.5;
            `}
            default: { return css`
                color: #333333;
            `}
        }
    }}
`;

const fontStyle = css`
    ${({ family }: FontProps) => 
        family 
            ? css`font-family: ${family};` 
            : css`font-family: Calibri;`
    }
`;

export const StyledFont = styled.p<FontProps>`
    ${sizeStyle}
    ${colorStyle}
    ${fontStyle}
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;