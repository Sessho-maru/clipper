import { MaskedTimeCode, PlainTimeCode } from "typedefs/types";
import { PUNCS_FORBIDDEN, TIMECODE } from "../const/consts";

function isNumeric(char: string) {
  return char.charCodeAt(0) > 47 && char.charCodeAt(0) < 58;
}
function unmask(timecode: MaskedTimeCode): PlainTimeCode {
  return timecode.split('').filter(isNumeric).join('');
}
function mask(timecode: PlainTimeCode): MaskedTimeCode {
  const hh = timecode.slice(0, 2);
  const mm = timecode.slice(2, 4);
  const ss = timecode.slice(4, 6);
  const ms = timecode.slice(6, TIMECODE.LENGTH.HHMMSSMS);

  return `${hh}:${mm}:${ss}.${ms}`;
}
function produceTimeCodeFromMs(milliSec: string): PlainTimeCode {
  const intMs = parseInt(milliSec);

  const sec = Math.floor((intMs / 1000) % 60);
  const min = Math.floor((intMs / 60000) % 60);
  const hour = Math.floor((intMs / 3600000) % 60);

  return `${hour}`.padStart(2, '0') + `${min}`.padStart(2, '0') + `${sec}`.padStart(2, '0') + `${intMs % 1000}`.padStart(3, '0');
}

function sanitizeMarerkName(arg: string): string {
  let out = '';
  for (const char of arg) {
    out += (PUNCS_FORBIDDEN.includes(char))
            ? '_'
            : char;
  }

  return out;
}

function splitPath(pathLike: string): string[] {
  return pathLike.split('\\');
}
function combineDirs(directories: string[]): string {
  return directories.join('\\');
}
function getFilename(pathLike: string): string | undefined {
  return pathLike.split('\\').pop();
}

export function makeRealCopy<T>(arg: T): T {
    return JSON.parse(JSON.stringify(arg)) as T;
}

export const PathUtil = { splitPath, combineDirs, getFilename }
export const TimeCodeUtil = { mask, unmask, produceTimeCodeFromMs };
export const MarkerNameUtil = { sanitizeMarerkName };
