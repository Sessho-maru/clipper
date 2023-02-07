import { Bookmark, Marker, PathLike } from "../typedefs/types";

export const PUNCS_FORBIDDEN = ['<', '>', '/', '\\', '|', '*', '?', ':', '"'];
export const TIMECODE = {
    MASK: '00{:}00{:}00{.}000',
    LENGTH: {
        HHMMSS: 8,
        HHMMSSMS: 12,
    }
};
export const INPUT_LABEL = {
    BKNAME: 'Bookmark Name',
    MARKER_END: 'End Marker',
    MARKER_START: 'Start Marker',
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

const _Tbookmark: Bookmark = {
  __typename: 'Bookmark',
  bookmarkName: '덤벨위치는_팔꿈치보다_살짝_뒤에',
  marker: {
    begin: {
      markerName: '덤벨위치는_팔꿈치',
      markerTime: '000319634'
    },
    end: {
      markerName: '보다_살짝_뒤에',
      markerTime: '000328302',
    }
  }
};
const _TsrcPath: PathLike = {
  __typename: 'PathLike',
  path: 'C:\Users\gong_april\Documents\_Coding\videocut-dev-web\sources',
  kind: 'src',
}

export const TypeDefault = { BOOKMARK, MARKER, SRCPATH, OUTPUTPATH };
export const TestData = { _Tbookmark, _TsrcPath };
