import { Bookmark, PathLike } from "typedefs/types";

function isBookmark(arg: unknown): arg is Bookmark { 
    return (arg as Bookmark).__typename === 'Bookmark';
}
function isBookmarks(arg: unknown[]): arg is Bookmark[] {
    return (arg as Bookmark[]).some(each => isBookmark(each));
}
function isSrcPathLike(arg: unknown): arg is PathLike {
    return (arg as PathLike).__typename === 'PathLike' && (arg as PathLike).kind === 'src';
}
function isOutputPathLike(arg: unknown): arg is PathLike {
    return (arg as PathLike).__typename === 'PathLike' && (arg as PathLike).kind === 'output';
}

export { isBookmark, isBookmarks, isSrcPathLike, isOutputPathLike };