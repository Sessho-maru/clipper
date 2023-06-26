import { useState } from 'react';
import { Button } from '@mui/material';
import { ChangeHandlerBaseArg, Bookmark, MarkerExt, PathLike, ApiStatus, Error, Maybe, Marker, PropsOf, MarkerWhich, MaskedTimeCode, PbfParsed } from 'typedefs/types';
import { TypeDefault } from '../../const/consts';
import { InputFilePad } from '../molecules/Input';
import { makeRealCopy, produceBookmarkFromPbf } from '../../utils/Utilities';
import { GridContainer, GridItemMenu, GridItemMain } from '../organism/Grid';
import { FormMarkerWrapper, FormBookmarkName, FormMarker, FormInnerWrapper, FormWrapper } from '../organism/Form';
import { SplitButton, SetSrcPathButton, SetOutputDirButton } from '../molecules/Button';
import { isPathLike, isPbfParsedArr } from '../../utils/Typeguards';
import { LabelStatus } from '../molecules/Label';

export default function Splitter() {
    const [status, setStatus] = useState<ApiStatus>('idle');
    const [srcPath, setSrcPath] = useState<PathLike>(TypeDefault.SRCPATH);
    const [outputDir, setOutputDir] = useState<PathLike>(TypeDefault.OUTPUTPATH);
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([TypeDefault.BOOKMARK]);
    const [maybeApiError, setMaybeApiError] = useState<Maybe<Error>>(null);
    const [hasInputError, setHasInputError] = useState<boolean>(false);

    const fulfillingHandler = (arg: 'fulfilled' | PathLike | PbfParsed[]): void => {
        if (maybeApiError) {
            setMaybeApiError(null);
        }

        if (isPathLike(arg)) {
            switch(arg.kind) {
                case 'src': {
                    setSrcPath(arg);
                    break;
                }
                case 'output': {
                    setOutputDir(arg);
                    break;
                }
            }
        }
        else if ((Array.isArray(arg)) && isPbfParsedArr(arg)) {
            setBookmarks(arg.map(produceBookmarkFromPbf));
            setStatus('idle');
        }
        else {
            setStatus(arg);
        }
    };

    const rejectionHandler = (err: Error): void => {
        setStatus('failed');
        err.message = err.message.split('\r\n').at(-2)!;

        if (err.message === 'operable program or batch file.') {
            err.message = `ffmpeg is not recognized as an internal or external command`;
        }
        setMaybeApiError(err);
    };

    const pendingHandler = (arg: ApiStatus): void => {
        setStatus(arg);
    };

    const appendBookmark = (): void => {
        setBookmarks([...bookmarks, TypeDefault.BOOKMARK]);
    };

    const bookmarkNameChangeHandler = (arg: ChangeHandlerBaseArg): void => {
        const { value, markerIndex } = arg;
        const copy = makeRealCopy<Bookmark>(bookmarks[markerIndex]);

        if (value === '') {
            return;
        }

        copy.bookmarkName = value;
        setBookmarks([...bookmarks.slice(0, markerIndex), copy, ...bookmarks.slice(markerIndex + 1)]);
    };

    const markerChangeHandler = (arg: ChangeHandlerBaseArg & MarkerExt): void => {
        const { value, markerIndex } = arg;
        const copy = makeRealCopy<Bookmark>(bookmarks[markerIndex]);

        const key: keyof PropsOf<Marker> = arg.key!;
        const which: MarkerWhich = arg.which!;

        if (key === 'markerName') {
            copy.marker[which].markerName = value;
            copy.bookmarkName = copy.marker.begin.markerName.concat(
                copy.marker.end.markerName === '' ? '' : '  >  '.concat(copy.marker.end.markerName)
            );
        }
        else {
            copy.marker[which][key] = (value as MaskedTimeCode);
        }

        setBookmarks([...bookmarks.slice(0, markerIndex), copy, ...bookmarks.slice(markerIndex + 1)]);
    };

    return (
        <GridContainer>
            <GridItemMenu>
                <SplitButton 
                    arg={bookmarks} 
                    label={'Split Video'} 
                    disabled={srcPath.path === '' || hasInputError}
                    onSuccess={fulfillingHandler}
                    onFail={rejectionHandler}
                    onPending={pendingHandler}
                />
                <SetSrcPathButton 
                    arg={srcPath} 
                    label={'Choose Video'}
                    onSuccess={fulfillingHandler}
                    onFail={rejectionHandler}
                    onPending={pendingHandler}
                />
                <SetOutputDirButton 
                    arg={outputDir} 
                    label={'Output Dir ...'}
                    onSuccess={fulfillingHandler}
                    onFail={rejectionHandler}
                    onPending={pendingHandler}
                />
                <InputFilePad onSuccess={fulfillingHandler} onFail={rejectionHandler} onPending={pendingHandler}/>
                <Button onClick={() => { appendBookmark() }} sx={{ mt: 1 }}>{'Add a Bookmark'}</Button>
            </GridItemMenu>
            <GridItemMain>
                <LabelStatus apiStatus={status} apiError={maybeApiError} sourcePath={srcPath.path} outputPath={outputDir.path}/>
                <FormWrapper setHasInputError={setHasInputError}>
                    {bookmarks.map((each, index) => {
                        return (
                            <FormInnerWrapper key={index} markerIndex={index}>
                                <FormBookmarkName current={each.bookmarkName} onChange={bookmarkNameChangeHandler} markerIndex={index}/>
                                <FormMarkerWrapper>
                                    <FormMarker current={each.marker} which={'begin'} onChange={markerChangeHandler} markerIndex={index}/>
                                    <FormMarker current={each.marker} which={'end'} onChange={markerChangeHandler} markerIndex={index}/>
                                </FormMarkerWrapper>
                            </FormInnerWrapper>
                        ); 
                    })}
                </FormWrapper>
            </GridItemMain>
        </GridContainer>
    )
}
