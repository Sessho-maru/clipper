import { ERROR_CODE, PUNCS_FORBIDDEN, TIMECODE } from "../const/consts";
import { Error, MarkerWhich, MaskedTimeCode, Maybe, PlainTimeCode } from "typedefs/types";
import { TimeCodeUtil } from "./Utilities";

type TimeCodeValidityTestArg = {
    input: { which: MarkerWhich; timeCode: MaskedTimeCode };
    compare: { which: MarkerWhich; timeCode: MaskedTimeCode };
}

export function isInvalidBeginEndTimeCode({ input, compare }: TimeCodeValidityTestArg): Maybe<Error> {
    const valueInput: PlainTimeCode = TimeCodeUtil.unmask(input.timeCode).padEnd(TIMECODE.LENGTH.HHMMSSMS, '0');
    const valueCompare: PlainTimeCode = TimeCodeUtil.unmask(compare.timeCode).padEnd(TIMECODE.LENGTH.HHMMSSMS, '0');

    let isValid: boolean;
    if (input.which === 'begin') {
        isValid = valueInput < valueCompare;
    }
    else {
        isValid = valueInput > valueCompare;
    }

    if (!isValid) {
        const preposition = (input.which === 'begin') ? 'before' : 'after';
        return {
            id: ERROR_CODE.invalidBeginEndTimeCode,
            level: 'CRITICAL',
            message: `${input.which} marker must be placed ${preposition} than ${compare.which} marker`,
        }
    }
    return null;
}

export function isDirtyName(markerName: string): Maybe<Error> {
    for (const char of markerName) {
        if (PUNCS_FORBIDDEN.includes(char)) {
            return {
                id: ERROR_CODE.dirtyBookmarkName,
                level: 'WARNING',
                message: `Any forbidden character '${PUNCS_FORBIDDEN.join(`','`)}' will be repalced into '_'`
            };
        }
    }
    return null;
}