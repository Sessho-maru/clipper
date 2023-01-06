export type SplitterStatus = 'idle' | 'splitting' | 'parsing' | 'failed';

export interface IChildResponse {
  isSuccess: boolean,
  message: string,
}
export interface IErrObj {
  id: string;
  level: 'warning' | 'critical';
  msg: string; 
}

export interface IMarker {
  from: string,
  to: string,
}
export interface IBookmark {
  name: string,
  range: IMarker,
  validation: {
    isValid: boolean,
    message: string,
    subject: 'from' | 'to' | null,
  }
}

interface INowTarget {
  index: number,
  key: 'name' | 'from' | 'to',
  value: string,
}
export interface Plasmid {
  target: INowTarget,
  lastModifiedTimeStamp: number,
}

export interface IParsedRaw {
  nameArr: string[],
  msArr: string[],
}

export const LN_HhMmSs = 6;
export const LN_HhMmSsMs = 9;
export const LABEL_MARKER_END = 'End Marker';
export const LABEL_MARKER_START = 'Start Marker';
export const LABEL_BOOKMARK_NAME = 'Bookmark Name';
export const DEFAULT_BOOKMARK: IBookmark = { name: '', range: { from: '',to: '' }, validation: { isValid: true, message: '', subject: null } };
export const PUNCS_FORBIDDEN = ['<', '>', '/', '\\', '|', '*', '?', ':', '"'];

function isNumeric(char: string) {
  return char.charCodeAt(0) > 47 && char.charCodeAt(0) < 58;
}
function unMask(arg: string) {
  return arg.split('').filter(isNumeric).join('');
}
function cvrtMsToUnformattedMarkerTime(str: string): string {
  const intMs = parseInt(str);

  const sec = Math.floor((intMs / 1000) % 60);
  const min = Math.floor((intMs / 60000) % 60);
  const hour = Math.floor((intMs / 3600000) % 60);

	return `${hour}`.padStart(2, '0') + `${min}`.padStart(2, '0') + `${sec}`.padStart(2, '0') + `${intMs % 1000}`.padStart(3, '0');
}
function formatMarkerTime(str: string): string {
  const hh = str.slice(0, 2);
  const mm = str.slice(2, 4);
  const ss = str.slice(4, 6);
  const ms = str.slice(6, LN_HhMmSsMs);

  return `${hh}:${mm}:${ss}.${ms}`;
}

function sanitizeBookmarkName(str: string): string {
  let out = '';
  for (const char of str) {
    out += (PUNCS_FORBIDDEN.includes(char))
            ? '_'
            : char;
  }

  return out;
}

export const MarkerTimeFns = { unMask, cvrtMsToUnformattedMarkerTime, formatMarkerTime };
export const BoomarkNameFns = { sanitizeBookmarkName };