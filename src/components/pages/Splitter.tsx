import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { BaseArgs, Bookmark, ExtensionArgsMarker, PathLike, ApiStatus, Error, Maybe, Marker, PropsOf, MarkerWhich } from 'typedefs/types';
import { TypeDefault, TestData } from '../../const/consts';
import { InputFilePad } from '../molecules/Input';
import { makeRealCopy } from '../../utils/Utilities';
import { FormMarkerWrapper } from '../organism/Form/FormMarkerWrapper';
import { GridContainer, GridItemMenu, GridItemMain } from '../organism/Grid';
import { FormBookmarkName, FormMarker, FormInnerWrapper, FormWrapper } from '../organism/Form';
import { SplitButton, SetSrcPathButton, SetOutputDirButton } from '../molecules/Button';
import { isPathLike } from '../../utils/Typeguards';

export default function Splitter() {
    const [error, setError] = useState<Maybe<Error>>(null);
    const [status, setStatus] = useState<ApiStatus>('idle');
    const [srcPath, setSrcPath] = useState<PathLike>(TypeDefault.SRCPATH);
    const [outputDir, setOutputDir] = useState<PathLike>(TypeDefault.OUTPUTPATH);
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([
        TestData._Tbookmark
    ]);

    const fulfilledHandler = (arg: ApiStatus | PathLike): void => {
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
        else {
            setStatus(arg);
        }
    }

    const rejectedHandler = (err: Error): void => {
        setError(err);
        setStatus('failed');
        console.log(err.message);
    }

    const pendingHandler = (arg: ApiStatus): void => {
        setStatus(arg);
    }

    const appendBookmark = (): void => {
        setBookmarks([...bookmarks, TypeDefault.BOOKMARK]);
    }

    const bookmarkNameChangeHandler = (arg: BaseArgs): void => {
        const { value, markerIndex } = arg;
        const copy = makeRealCopy<Bookmark>(bookmarks[markerIndex]);

        // TODO: validate whether value is dirty or not
        if (value === '') {
            return;
        }

        copy.bookmarkName = value;
        setBookmarks([...bookmarks.slice(0, markerIndex), copy, ...bookmarks.slice(markerIndex + 1)]);
    };

    const markerChangeHandler = (arg: BaseArgs & ExtensionArgsMarker): void => {
        const { value, markerIndex } = arg;
        const key: keyof PropsOf<Marker> = arg.key!;
        const which: MarkerWhich = arg.which!;
        
        const copy = makeRealCopy<Bookmark>(bookmarks[markerIndex]);

        if (which === 'begin') {
            copy.marker.begin[key] = value;
        }
        else {
            copy.marker.end[key] = value;
        }

        if (key === 'markerName') {
            copy.bookmarkName = copy.marker.begin.markerName.concat(
                copy.marker.end.markerName === '' ? '' : ' >  '.concat(copy.marker.end.markerName)
            );
        }

        setBookmarks([...bookmarks.slice(0, markerIndex), copy, ...bookmarks.slice(markerIndex + 1)]);
    };

    return (
        <GridContainer>
            <GridItemMenu>
                <SplitButton 
                    arg={bookmarks} 
                    label={'Split Video'} 
                    disabled={srcPath.path === ''} 
                    onSuccess={fulfilledHandler} 
                    onFail={rejectedHandler}
                    onPending={pendingHandler}
                />
                <SetSrcPathButton 
                    arg={srcPath} 
                    label={'Choose Video'}
                    onSuccess={fulfilledHandler}
                    onFail={rejectedHandler}
                />
                <SetOutputDirButton 
                    arg={outputDir} 
                    label={'Output Dir ...'}
                    onSuccess={fulfilledHandler}
                    onFail={rejectedHandler}
                />
                <InputFilePad/>
                <Button onClick={() => { appendBookmark() }} sx={{ mt: 1 }}>{'Add a Bookmark'}</Button>
            </GridItemMenu>
            <GridItemMain>
                <Typography variant={'h3'} fontFamily={'consolas'}>{status}</Typography>
                <Typography variant={'subtitle1'} color={'#d98757'}>{ srcPath.path !== '' ? `Video Source: ${srcPath.path}` : 'Video source not yet selected' }</Typography>
                <Typography variant={'subtitle1'} color={'#d98757'}>{ outputDir.path !== '' ? `Output Directory: ${outputDir.path}` : 'Output directory not yet specified' }</Typography>
                <FormWrapper>
                    {bookmarks.map((each, index) => {
                        return (
                            <FormInnerWrapper key={index}>
                                <FormBookmarkName current={each.bookmarkName} onChange={bookmarkNameChangeHandler} markerIndex={index}/>
                                <FormMarkerWrapper>
                                    <FormMarker current={each.marker.begin} onChange={markerChangeHandler} which={'begin'} markerIndex={index}/>
                                    <FormMarker current={each.marker.end} onChange={markerChangeHandler} which={'end'} markerIndex={index}/>
                                </FormMarkerWrapper>
                            </FormInnerWrapper>
                        ); 
                    })}
                </FormWrapper>
            </GridItemMain>
        </GridContainer>
    )
}
