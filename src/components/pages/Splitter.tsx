import { useState } from 'react';
import { Typography } from '@mui/material';
import { BaseArgs, Bookmark, ChildResponse, ExtensionArgsMarker, PathLike, ApiStatus, Error, Maybe, Marker, PropsOf } from 'typedefs/types';
import { TypeDefault, TestData } from '../../const/consts';
import { InputFilePad } from '../molecules/Input';
import { makeRealCopy } from '../../utils/Utilities';
import { FormMarkerWrapper } from '../organism/Form/FormMarkerWrapper';
import { GridContainer, GridItemMenu, GridItemMain } from '../organism/Grid';
import { FormBookmarkName, FormMarker, FormInnerWrapper, FormWrapper } from '../organism/Form';
import { SplitApiButton } from '../molecules/Button';

export default function Splitter() {
    const [error, setError] = useState<Maybe<Error>>(null);
    const [status, setStatus] = useState<ApiStatus>('idle');
    const [srcPath, setSrcPath] = useState<Maybe<PathLike>>(null);
    const [outputPath, setOutputPath] = useState<Maybe<PathLike>>(null);
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([
        TestData._Tbookmark
    ]);

    const changeStatus = (apiStatus: ApiStatus): void => {
        setStatus(apiStatus);
    }

    const onSplitFulfilled = (): void => {
        setStatus('idle');
    }
    const onSplitFailed = (err: Error): void => {
        setStatus('failed');
        setError(err);
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
        const which: 'begin' | 'end' = arg.which!;
        
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
                <SplitApiButton arg={bookmarks} label={'Split Video'} disabled={srcPath === null} onClick={changeStatus} onSuccess={onSplitFulfilled} onFail={onSplitFailed}/>
                <InputFilePad/>
            </GridItemMenu>
            <GridItemMain>
                <Typography>{status}</Typography>
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
