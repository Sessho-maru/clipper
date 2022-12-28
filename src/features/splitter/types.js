"use strict";
exports.__esModule = true;
exports.testBookmarks = exports.defaultBookmark = exports.LABEL_BOOKMARK_NAME = exports.LABEL_MARKER_END = exports.LABEL_MARKER_START = void 0;
exports.LABEL_MARKER_START = 'Start Marker';
exports.LABEL_MARKER_END = 'End Marker';
exports.LABEL_BOOKMARK_NAME = 'Bookmark Name';
exports.defaultBookmark = { name: '', range: { from: '', to: '' }, validation: { isValid: true, message: '', subject: null } };
exports.testBookmarks = [
    { name: '덤벨위치는_팔꿈치보다_살짝_뒤에', range: { from: '00:03:19.634', to: '00:03:28.302' }, validation: { isValid: true, message: '', subject: null } },
    { name: '내릴때는_덤벨안쪽이_어깨선_따라_내린다', range: { from: '00:03:28.738', to: '00:03:36.964' }, validation: { isValid: true, message: '', subject: null } },
    { name: '어깨의_쪼개짐이_보이면_바로_다시_수축', range: { from: '00:03:38.257', to: '00:04:34.232' }, validation: { isValid: true, message: '', subject: null } },
    { name: '레터럴레이즈', range: { from: '00:09:41.517', to: '00:10:42.787' }, validation: { isValid: true, message: '', subject: null } },
    { name: '레터럴레이즈_그립', range: { from: '00:11:58.445', to: '00:12:07.677' }, validation: { isValid: true, message: '', subject: null } }
];
// {name: '덤벨위치는_팔꿈치보다_살짝_뒤에', range: {from: '00:03:19.634',to: '00:03:28.302'}},
// {name: '내릴때는_덤벨안쪽이_어깨선_따라_내린다', range: {from: '00:03:28.738',to: '00:03:36.964'}},
// {name: '어깨의_쪼개짐이_보이면_바로_다시_수축', range: {from: '00:03:38.257',to: '00:04:34.232'}},
// {name: '레터럴레이즈', range: {from: '00:09:41.517',to: '00:10:42.787'}},
// {name: '레터럴레이즈_그립', range: {from: '00:11:58.445',to: '00:12:07.677'}}
