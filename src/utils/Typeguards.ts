import { Bookmark, PathLike } from "typedefs/types";

function isBookmark(arg: unknown): arg is Bookmark { 
    return (arg as Bookmark).__typename === 'Bookmark';
}
function isBookmarks(arg: unknown[]): arg is Bookmark[] {
    return (arg as Bookmark[]).some(each => isBookmark(each));
}
function isPathLike(arg: unknown): arg is PathLike {
    return (arg as PathLike).__typename == 'PathLike';
}
function isSrcPath(arg: unknown): arg is PathLike {
    return (arg as PathLike).__typename === 'PathLike' && (arg as PathLike).kind === 'src';
}
function isOutputPath(arg: unknown): arg is PathLike {
    return (arg as PathLike).__typename === 'PathLike' && (arg as PathLike).kind === 'output';
}

export { isBookmark, isBookmarks, isPathLike, isSrcPath, isOutputPath };