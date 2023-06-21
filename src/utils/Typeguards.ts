import { Bookmark, PathLike, PbfParsed, PlainTimeCode, TimeCode } from "../typedefs/types";

function isPlainTimeCode(timecode: TimeCode): timecode is PlainTimeCode {
    return !timecode.split('').includes(':');
}

function isBookmark(arg: unknown): arg is Bookmark { 
    return (arg as Bookmark).__typename === 'Bookmark';
}
function isBookmarks(arg: unknown[]): arg is Bookmark[] {
    return (arg as Bookmark[]).some(each => isBookmark(each));
}

function isPbfParsed(arg: unknown): arg is PbfParsed {
    return (arg as PbfParsed).__typename === 'PbfParsed';
}
function isPbfParsedArr(arg: unknown[]): arg is PbfParsed[] {
    return (arg as PbfParsed[]).some(each => isPbfParsed(each));
}

function isPathLike(arg: unknown): arg is PathLike {
    return (arg as PathLike).__typename === 'PathLike';
}
function isSrcPath(arg: unknown): arg is PathLike {
    return (arg as PathLike).__typename === 'PathLike' && (arg as PathLike).kind === 'src';
}
function isOutputPath(arg: unknown): arg is PathLike {
    return (arg as PathLike).__typename === 'PathLike' && (arg as PathLike).kind === 'output';
}

export { 
    isPlainTimeCode,
    isBookmark, isBookmarks,
    isPbfParsed, isPbfParsedArr,
    isPathLike, isSrcPath, isOutputPath
};