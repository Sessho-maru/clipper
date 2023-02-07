import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { BaseArgs, Bookmark, ExtensionArgsMarker, PathLike, ApiStatus, Error, Maybe, Marker, PropsOf, MarkerWhich, MaskedTimeCode } from 'typedefs/types';
import { TypeDefault, TestData, TIMECODE } from '../../const/consts';
import { InputFilePad } from '../molecules/Input';
import { makeRealCopy } from '../../utils/Utilities';
import { FormMarkerWrapper } from '../organism/Form/FormMarkerWrapper';
import { GridContainer, GridItemMenu, GridItemMain } from '../organism/Grid';
import { FormBookmarkName, FormMarker, FormInnerWrapper, FormWrapper } from '../organism/Form';
import { SplitButton, SetSrcPathButton, SetOutputDirButton } from '../molecules/Button';
import { isPathLike } from '../../utils/Typeguards';

export default function Splitter() {
    const [status, setStatus] = useState<ApiStatus>('idle');
    const [srcPath, setSrcPath] = useState<PathLike>(TypeDefault.SRCPATH);
    const [outputDir, setOutputDir] = useState<PathLike>(TypeDefault.OUTPUTPATH);
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([TypeDefault.BOOKMARK]);
    const [maybeError, setMaybeError] = useState<Maybe<Error>>(null);

    const fulfillingHandler = (arg: ApiStatus | PathLike): void => {
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

    const rejectionHandler = (err: Error): void => {
        setStatus('failed');
        setMaybeError(err);
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
        const copy = makeRealCopy<Bookmark>(bookmarks[markerIndex]);

        const key: keyof PropsOf<Marker> = arg.key!;
        const which: MarkerWhich = arg.which!;

        if (key === 'markerName') {
            copy.marker[which].markerName = value;
            copy.bookmarkName = copy.marker.begin.markerName.concat(
                copy.marker.end.markerName === '' ? '' : ' >  '.concat(copy.marker.end.markerName)
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
                    disabled={srcPath.path === ''} 
                    onSuccess={fulfillingHandler} 
                    onFail={rejectionHandler}
                    onPending={pendingHandler}
                />
                <SetSrcPathButton 
                    arg={srcPath} 
                    label={'Choose Video'}
                    onSuccess={fulfillingHandler}
                    onFail={rejectionHandler}
                />
                <SetOutputDirButton 
                    arg={outputDir} 
                    label={'Output Dir ...'}
                    onSuccess={fulfillingHandler}
                    onFail={rejectionHandler}
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
                                    <FormMarker current={each.marker} which={'begin'} onChange={markerChangeHandler} markerIndex={index}/>
                                    <FormMarker current={each.marker} which={'end'} onChange={markerChangeHandler} markerIndex={index}/>
                                </FormMarkerWrapper>
                                <Typography variant={'caption'} height={'10px'}>{'this is Test'}</Typography>
                            </FormInnerWrapper>
                        ); 
                    })}
                </FormWrapper>
            </GridItemMain>
        </GridContainer>
    )
}
