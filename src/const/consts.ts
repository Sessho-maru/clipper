import type { Bookmark, Marker, PathLike } from "../typedefs/types";

export const PUNCS_FORBIDDEN = ['<', '>', '/', '\\', '|', '*', '?', ':', '"'];

export const TIMECODE = {
    MASK: '00{:}00{:}00{.}000',
    LENGTH: {
        HHMMSS: 8,
        HHMMSSMS: 12,
    }
};

const MARKER: Marker = {
  __typename: 'Marker',
  markerName: '',
  markerTime: '',
};
const BOOKMARK: Bookmark = {
  __typename: 'Bookmark',
  bookmarkName: '',
  marker: {
    begin: MARKER,
    end: MARKER,
  }
};

const SRCPATH: PathLike = {
  __typename: 'PathLike',
  path: '',
  kind: 'src',
};
const OUTPUTPATH: PathLike = {
  __typename: 'PathLike',
  path: '',
  kind: 'output',
};

export const ERROR_CODE = {
    ffmpegCommandRejected: 'E000',
    invalidBeginEndTimeCode: 'E001',
    failedToOpenFile: 'E002',
    dirtyBookmarkName: 'W000'
}

export const TypeDefault = { BOOKMARK, MARKER, SRCPATH, OUTPUTPATH };
// export const TestData = { _Tbookmark, _TsrcPath };
