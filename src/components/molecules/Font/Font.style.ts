import styled, { css } from '@mui/styled-engine';
import { FontStatus, FontType, FontWeight } from './Font';

interface FontProps {
    type: FontType;
    weight?: FontWeight;
    status?: FontStatus;
    family?: string;
}

const sizeStyle = css(
    `${
        ({ type }: FontProps) => {
            switch(type) {
                case 'label': { css(`font-size: 18px`); break;}
                case 'body': { css(`font-size: 18px`); break; }
            }
        }
    }
    `
);

const colorStyle = css(
    `${
        ({ status }: FontProps) => {
            switch(status) {
                case 'CRITICAL': { css(`color: red`); break; }
                case 'WARNING': { css(`color: #ff5722`); break; }
                case 'DISABLED': { css(`color: grey`); break; }
            }
            css(`color: #000000`)
        }
    }`
);

const fontStyle = css(
    `${
        ({ family }: FontProps) => {
            family
                ? css(`font-family: ${family}`)
                : css(`font-family: Roboto`)

        }
    }`
);

export const StyledFont = styled.span<FontProps>`
    ${sizeStyle}
    ${colorStyle}
    ${fontStyle}
`;