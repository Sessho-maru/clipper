import { Fragment, useState, useRef, useEffect } from 'react';
import BookmarkForm from './BookmarkForm';
import { LABEL_MARKER_END, LABEL_MARKER_START, testBookmarks } from './types';
import { defaultBookmark, IBookmark, Plasmid, SplitterStatus } from './types';
import API from './SplitterAPI';

function makeRealCopy<T>(arg: T): T {
  return JSON.parse(JSON.stringify(arg)) as T;
}

function isNumeric(char: string) {
  return char.charCodeAt(0) > 47 && char.charCodeAt(0) < 58;
}
export function unformat(arg: string) {
  return arg.split('').filter(isNumeric).join('');
}

export function format(str: string): string {
  if (str.length < 6) {
      return str;
  }

  const hh = str.slice(0, 2);
  const mm = str.slice(2, 4);
  const ss = str.slice(4, 6);
  const ms = str.slice(6, str.length);

  if (str.length < 7) {
    return `${hh}:${mm}:${ss}`;
  }
  else {
    return `${hh}:${mm}:${ss}.${ms}`;
  }
}

export default function Splitter(): JSX.Element {
  const [splitterStatus, setSplitterStatus] = useState<SplitterStatus>('idle');
  const [splitterBookmarks, setSplitterBookmarks] = useState<IBookmark[]>([
    {name: '덤벨위치는_팔꿈치보다_살짝_뒤에', range: {from: '00:03:19.634',to: '00:03:28.302'}, validation: { isValid: true, message: '', subject: null }},
    {name: '내릴때는_덤벨안쪽이_어깨선_따라_내린다', range: {from: '00:03:28.738',to: '00:03:36.964'}, validation: { isValid: true, message: '', subject: null }},
    {name: '어깨의_쪼개짐이_보이면_바로_다시_수축', range: {from: '00:03:38.257',to: '00:04:34.232'}, validation: { isValid: true, message: '', subject: null }},
    {name: '레터럴레이즈', range: {from: '00:09:41.517',to: '00:10:42.787'}, validation: { isValid: true, message: '', subject: null }},
    {name: '레터럴레이즈_그립', range: {from: '00:11:58.445',to: '00:12:07.677'}, validation: { isValid: true, message: '', subject: null }}
  ]);

  const [srcPath, setSrcPath] = useState<string | null>(null);

  const [plasmid, setPlasmid] = useState<Plasmid>({ key: 'name', value: '', index: -1, lastModifiedTimeStamp: 0 });

  const refFileNode = useRef(null);

  async function asyncSplit(): Promise<void> {
    setSplitterStatus('loading');
    const strArr: string[] = await API.trySplit(splitterBookmarks);
  
    if (strArr[strArr.length - 1] !== 'fulfilled') {
      setSplitterStatus('failed');
    }
    else {
      setSplitterStatus('idle');
    }
  }

  async function asyncSetSrc(path: string): Promise<void> {
    const fullPath = await API.trySetSrc(path);
    setSrcPath(fullPath);
  }

  useEffect(() => {
    if (plasmid.index < 0) {
      return;
    }

    const { key, index, value } = plasmid;
    let target: IBookmark;
    let isValid = true;

    switch(key) {
      case 'name': {
        target = makeRealCopy(splitterBookmarks[index]);
        target['name'] = value;
        break;
      }
      default: {
        target = makeRealCopy(splitterBookmarks[index]);
        if (value.length < 6) {
          if (!target.validation.isValid) {
            target.validation.message = '';
            target.validation.subject = null;
            break;
          }
          return;
        }
        
        if (key === 'from') {
          isValid = (parseInt(value) < parseInt(unformat(target.range.to))) || target.range.to === '';
          if (!isValid) {
            target.validation.message = `${LABEL_MARKER_START} must be placed before ${LABEL_MARKER_END}`;
            target.validation.subject = 'from';
          }
          else {
            target.validation.message = '';
            target.validation.subject = null;
          }
          target.range[key] = format(value);
        }
        else {
          isValid = (parseInt(value) > parseInt(unformat(target.range.from))) || target.range.from === '';
          if (!isValid) {
            target.validation.message = `${LABEL_MARKER_END} must be placed after ${LABEL_MARKER_START}`;
            target.validation.subject = 'to';
          }
          else {
            target.validation.message = '';
            target.validation.subject = null;
          }
          target.range[key] = format(value);
        }
      }
    }

    target.validation.isValid = isValid;
    setSplitterBookmarks([...splitterBookmarks.slice(0, index), target, ...splitterBookmarks.slice(index + 1, splitterBookmarks.length)]);
  }, [plasmid.lastModifiedTimeStamp]);

  return (
    <Fragment>
      <label>{ splitterStatus }</label><br/>
      <label>{ srcPath }</label>
      { splitterBookmarks.map((each, index): JSX.Element => { return <BookmarkForm key={`form_${index}`} index={index} bookmark={each} plasmid={plasmid} setPlasmid={setPlasmid}/> }) }
      <button disabled={ splitterBookmarks.some(each => each.validation.isValid === false) || srcPath === null } onClick={ asyncSplit }>Execute Split</button>
      <button disabled={ splitterBookmarks.some(each => each.validation.isValid === false) } onClick={ () => { setSplitterBookmarks([...splitterBookmarks, defaultBookmark]) } }>Append Bookmark</button>
      <button onClick={ () => { refFileNode.current.click(); } }>Choose Video</button>
      <input type={'file'} ref={refFileNode} accept={'video/*'} onChange={ (event: React.ChangeEvent<{ files: FileList }>) => { asyncSetSrc(event.currentTarget.files[0].path) } } hidden/>
    </Fragment>
  );
}