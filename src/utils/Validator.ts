import { ERROR_CODE, PUNCS_FORBIDDEN, TIMECODE } from "../const/consts";
import { Error, MarkerWhich, MaskedTimeCode, Maybe, PlainTimeCode } from "typedefs/types";
import { TimeCodeUtil } from "./Utilities";

export function isInvalidBeginEndTimeCode(input: { which: MarkerWhich, markerTime: MaskedTimeCode }, compare: { which: MarkerWhich, markerTime: MaskedTimeCode }): Maybe<Error> {
    const valueInput: PlainTimeCode = TimeCodeUtil.unmask(input.markerTime).padEnd(TIMECODE.LENGTH.HHMMSSMS, '0');
    const valueCompare: PlainTimeCode = TimeCodeUtil.unmask(compare.markerTime).padEnd(TIMECODE.LENGTH.HHMMSSMS, '0');

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

/*
export function isCurruptedTimeCode(h?: string, m?: string, s?: string): Maybe<Error> {
    const currupted = (arg: 'hour' | 'minute' | 'second', limit: number): Error => {
        return {
            id: ERROR_CODE.curruptedTimeCode,
            level: 'CRITICAL',
            message: `Invalid \`${arg}\` parameter bigger than ${limit}`
        }
    };

    if (h && parseInt(h) > 23) {
        return currupted('hour', 23);
    }
    if (m && parseInt(m) > 59) {
        return currupted('minute', 59);
    }
    if (s && parseInt(s) > 59) {
        return currupted('second', 59);
    }
    return null;
}
*/

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