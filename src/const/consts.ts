import { Bookmark, Marker } from "../typedefs/types";

export const PUNCS_FORBIDDEN = ['<', '>', '/', '\\', '|', '*', '?', ':', '"'];
export const TIMECODE = {
    MASK: '00{:}00{:}00{.}000',
    LENGTH: {
        HHMMSS: 6,
        HHMMSSMS: 9,
    }
};
export const INPUT_LABEL = {
    BKNAME: 'Bookmark Name',
    MARKER_END: 'End Marker',
    MARKER_START: 'Start Marker',
};

const MARKER: Marker = {
  markerName: '',
  markerTime: '',
}
const BOOKMARK: Bookmark = {
  bookmarkName: '',
  marker: {
    begin: MARKER,
    end: MARKER,
  }
}
export const TypeDefault = { BOOKMARK, MARKER };
