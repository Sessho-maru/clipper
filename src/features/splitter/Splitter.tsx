import React, { useState, useRef, useEffect } from 'react';
import BookmarkForm from './BookmarkForm';
import { 
  IBookmark, Plasmid, SplitterStatus,
  LABEL_MARKER_END, LABEL_MARKER_START, LN_HhMmSs, LN_HhMmSsMs, DEFAULT_BOOKMARK, IChildResponse, IParsedRaw, IErrObj,
  MarkerTimeUtil, MarkerNameUtil, PathUtil,
} from './define';
import API from './SplitterAPI';
import { Box, Button, Grid, Paper, Stack, Tooltip, Typography } from '@mui/material';

function makeRealCopy<T>(arg: T): T {
  return JSON.parse(JSON.stringify(arg)) as T;
}

function ignoreDragEventDefault(event: React.DragEvent): void {
  event.preventDefault();
  event.stopPropagation();
}

function postProcess(each: IBookmark): IBookmark {
  const { range, validation } = each;

  range.from = MarkerTimeUtil.formatMarkerTime(range.from);
  range.to = MarkerTimeUtil.formatMarkerTime(range.to);
  each.name = MarkerNameUtil.sanitizeToBookmarkName(each.name);

  return { name: each.name, range, validation };
}

export default function Splitter(): JSX.Element {
  const [splitterStatus, setSplitterStatus] = useState<SplitterStatus>('idle');
  const [splitterBookmarks, setSplitterBookmarks] = useState<IBookmark[]>([ DEFAULT_BOOKMARK
    // {name: '덤벨위치는_팔꿈치보다_살짝_뒤에', range: {from: '000319634',to: '000328302'}, validation: { isValid: true, message: '', subject: null }},
    // {name: '내릴때는_덤벨안쪽이_어깨선_따라_내린다', range: {from: '000328738',to: '000336964'}, validation: { isValid: true, message: '', subject: null }},
    // {name: '어깨의_쪼개짐이_보이면_바로_다시_수축', range: {from: '000338257',to: '000434232'}, validation: { isValid: true, message: '', subject: null }},
    // {name: '레터럴레이즈', range: {from: '000941517',to: '001042787'}, validation: { isValid: true, message: '', subject: null }},
    // {name: '레터럴레이즈_그립', range: {from: '001158445',to: '001207677'}, validation: { isValid: true, message: '', subject: null }}
  ]);

  const [srcPath, setSrcPath] = useState<string | null>(null);
  const [outputPath, setOutputPath] = useState<string | null>(null);
  const [plasmid, setPlasmid] = useState<Plasmid>({ target: {key: 'name', value: '', index: -1}, lastModifiedTimeStamp: 0 });
  const [errArr, setErrArr] = useState<IErrObj[]>([]);

  const refNodeSetSrc = useRef<HTMLInputElement>(null);
  const refNodeSetOutputDir = useRef<HTMLInputElement>(null);

  async function asyncSetVideoSource(path: string): Promise<void> {
    const fullPath = await API.trySetPathOf('src', path);
    setSrcPath(fullPath);
  }
  async function asyncSetOutputPath(path: string): Promise<void> {
    const fullPath = await API.trySetPathOf('output', path);
    setOutputPath(fullPath);
  }
  async function asyncParseTextInjection(path: string): Promise<void> {
    setSplitterStatus('parsing');
    const resObj: IChildResponse = await API.tryParseTextInjection(path);

    if (!resObj.isSuccess) {
      setSplitterStatus('failed');
      const parsingFailed: IErrObj = { id: 'E002', level: 'critical', msg: resObj.message };
      setErrArr([parsingFailed]);
    }
    else {
      setSplitterStatus('idle');
      const parsed: IParsedRaw[] = JSON.parse(resObj.message);
      setSplitterBookmarks(parsed.map((each): IBookmark => {
        const bk: IBookmark = {} as IBookmark;
        bk.name = each.nameArr.join(' ~ ');
        bk.range = {
          from: MarkerTimeUtil.cvrtMsToUnformattedMarkerTime(each.msArr[0]),
          to: MarkerTimeUtil.cvrtMsToUnformattedMarkerTime(each.msArr[1])
        };
        bk.validation = DEFAULT_BOOKMARK.validation;
        return bk;
      }));
    }
  }
  async function asyncSplit(): Promise<void> {
    setSplitterStatus('splitting');
    const resArr: IChildResponse[] = await API.trySplit(splitterBookmarks.map(postProcess));
  
    if (resArr[resArr.length - 1].message !== 'fulfilled') {
      setSplitterStatus('failed');
      const ffCommandFailed: IErrObj = { id: 'E003', level: 'critical', msg: resArr[resArr.length - 1].message };
      setErrArr([ffCommandFailed]);
    }
    else {
      setSplitterStatus('idle');
    }
  }

  useEffect(() => {
    refNodeSetOutputDir.current.setAttribute('webkitdirectory', '');
  }, []);

  useEffect(() => {
    if (plasmid.target.index < 0) {
      return;
    }

    const { key, index, value } = plasmid.target;
    let isValid = true;
    const aimed: IBookmark = makeRealCopy<IBookmark>(splitterBookmarks[index]);
    
    switch(key) {
      case 'name': {
        aimed['name'] = value;
        break;
      }
      default: {
        if ((value.length < LN_HhMmSs) && aimed.range[key] === '') {
          return;
        }
        
        if (key === 'from') {
          isValid = (parseInt(value.padEnd(LN_HhMmSsMs, '0')) < parseInt(aimed.range.to)) || aimed.range.to === '';
          if (!isValid) {
            aimed.validation.subject = 'from';
            aimed.validation.message = `Must be before than ${LABEL_MARKER_END}`;
          }
        }
        else {
          isValid = (parseInt(value.padEnd(LN_HhMmSsMs, '0')) > parseInt(aimed.range.from)) || aimed.range.from === '';
          if (!isValid) {
            aimed.validation.subject = 'to';
            aimed.validation.message = `Must be after than ${LABEL_MARKER_START}`;
          }
        }
        aimed.range[key] = value.padEnd(LN_HhMmSsMs, '0');
      }
    }

    aimed.validation.isValid = isValid;
    if (isValid && key !== 'name') {
      aimed.validation.message = '';
      aimed.validation.subject = null;
    }
    setSplitterBookmarks([...splitterBookmarks.slice(0, index), aimed, ...splitterBookmarks.slice(index + 1, splitterBookmarks.length)]);
  }, [plasmid.lastModifiedTimeStamp]);

  return (
    <Grid 
      container
      spacing={0}
      direction={'row'}
      alignItems={'start'}
    >
      <Grid item sm={3} sx={{ mt: '10px' }}>
        <Button onClick={ () => { refNodeSetSrc.current.click(); } } size={'large'}>Choose Video</Button>
        <Button disabled={ splitterBookmarks.some(each => each.validation.isValid === false) || srcPath === null } onClick={ asyncSplit } size={'large'}>Execute Split</Button>
        <Paper
          sx={{ width: '80%', height: '140px', outline: 'dashed', outlineOffset: '-10px', backgroundColor: 'lightBlue', mt: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}
          onDragEnter={ (event: React.DragEvent) => { ignoreDragEventDefault(event) } }
          onDragLeave={ (event: React.DragEvent) => { ignoreDragEventDefault(event) } }
          onDragOver={ (event: React.DragEvent) => { ignoreDragEventDefault(event) } }
          onDrop={ (event: React.DragEvent) => {
            ignoreDragEventDefault(event);
            const ext = event.dataTransfer.files[0].path.split('.').pop();
            if (ext !== 'json' && ext !== 'pbf') {
              const unexpectedFile: IErrObj = { id: 'E001', level: 'critical', msg: `Unexpected file (.${ext}) provided.` };
              setErrArr([unexpectedFile]);
              return;
            }
            asyncParseTextInjection(event.dataTransfer.files[0].path); }
          }
        >
          <Stack sx={{ alignItems: 'center', color: 'grey' }}>
            <Typography sx={{ fontFamily: 'consolas', fontSize: '12px', ml: '2px', mr: '2px' }}>{'Drop here'}</Typography>
            <Typography sx={{ fontFamily: 'consolas', fontSize: '12px', ml: '2px', mr: '2px' }}>{'.pbf from DAUMPot'}</Typography>
            <Typography sx={{ fontFamily: 'consolas', fontSize: '12px', ml: '2px', mr: '2px' }}>{'or .json from VLC'}</Typography>
          </Stack>
        </Paper>
      </Grid>
      <Grid item sm={9}>
        <Box height={'115px'}>
          <Typography variant={'h3'} fontFamily={'consolas'} color={'grey'}>{ splitterStatus }</Typography>
          <Typography variant={'subtitle1'} color={'lightgrey'}>{ srcPath ? `source: ${srcPath}` : '' }</Typography>
          <Typography variant={'subtitle1'} color={'lightgrey'}>{ outputPath ? `output: ${outputPath}` : '' }</Typography>
        </Box>
        <label>{ errArr.map((each) => { return each.msg }) }</label>
        <Box overflow={'scroll'} height={'450px'} sx={{
          '& > div:hover': {
            border: '1px solid'
          },
          '&::-webkit-scrollbar': {
            width: '3px',
            WebkitAppearance: 'none'
          },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            border: '1px solid',
            backgroundColor: 'rgba(0 0 0 / 0.5)',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'red',
          }
        }}>
          { splitterBookmarks.map((each, index): JSX.Element => { return <BookmarkForm key={`form_${index}`} bkIdx={index} bkObj={each} plasmid={plasmid} setPlasmid={setPlasmid}/> }) }
        </Box>
        <Button disabled={ splitterBookmarks.some(each => each.validation.isValid === false) } onClick={ () => { setSplitterBookmarks([...splitterBookmarks, DEFAULT_BOOKMARK]) } } variant={'outlined'} size={'medium'}>Append Bookmark</Button>
        <Button onClick={ () => { refNodeSetOutputDir.current.click(); }} variant={'text'} size={'medium'} sx={{ color: 'black', ml: '10px' }}>Output Directory ...</Button>

        <input type={'file'} ref={refNodeSetSrc} accept={'video/*'} onChange={ (event: React.ChangeEvent<HTMLInputElement>) => { asyncSetVideoSource(event.currentTarget.files[0].path) } } hidden/>
        <input type={'file'} ref={refNodeSetOutputDir} onChange={ (event: React.ChangeEvent<HTMLInputElement>) => {
            const fullpath = event.currentTarget.files[0].path;
            const splitted = PathUtil.splitIntoDirectories(fullpath);
            splitted.pop();
            asyncSetOutputPath(PathUtil.combineAsPath(splitted));
          } 
        } hidden/>
      </Grid>
    </Grid>
  );
}