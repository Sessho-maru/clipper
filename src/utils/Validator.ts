import { TIMECODE } from "../const/consts";
import { Error, MarkerWhich, MaskedTimeCode, Maybe } from "typedefs/types";
import { TimeCodeUtil } from "./Utilities";

export function isValidTimeCodeInput(input: { which: MarkerWhich, markerTime: MaskedTimeCode }, compare: { which: MarkerWhich, markerTime: MaskedTimeCode }): Maybe<Error> {
    const intInput = TimeCodeUtil.unmask(input.markerTime).padEnd(TIMECODE.LENGTH.HHMMSSMS, '0');
    const intCompare = TimeCodeUtil.unmask(compare.markerTime).padEnd(TIMECODE.LENGTH.HHMMSSMS, '0');

    let isValid:boolean;
    if (input.which === 'begin') {
        isValid = intInput < intCompare;
    }
    else {
        isValid = intInput > intCompare;
    }

    if (!isValid) {
        const preposition = (input.which === 'begin') ? 'before' : 'after';
        return {
            id: 'E001',
            level: 'critical',
            message: `${input.which} marker must be placed ${preposition} than ${compare.which} marker`,
        }
    }
    return null;
}