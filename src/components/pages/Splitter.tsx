import { useState } from 'react';
import { Button } from '@mui/material';
import { BaseArgs, Bookmark, ExtensionArgsMarker } from 'typedefs/types';
import { TypeDefault } from '../../const/consts';
import { InputFilePad } from '../molecules/Input';
import { makeRealCopy } from '../../utils/Utilities';
import { FormMarkerWrapper } from '../organism/Form/FormMarkerWrapper';
import { GridContainer, GridItemMenu, GridItemMain } from '../organism/Grid';
import { FormBookmarkName, FormMarker, FormInnerWrapper, FormWrapper } from '../organism/Form';

export default function Splitter() {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([
        TypeDefault.BOOKMARK,
        TypeDefault.BOOKMARK,
        TypeDefault.BOOKMARK,
        TypeDefault.BOOKMARK,
        TypeDefault.BOOKMARK,
        TypeDefault.BOOKMARK
    ]);

    const bookmarkNameChangeHandler = (arg: BaseArgs): void => {
        const { value, markerIndex } = arg;
        const copy = makeRealCopy<Bookmark>(bookmarks[markerIndex]);

        // TODO: validate whether value is dirty or not

        copy.bookmarkName = value;
        setBookmarks([...bookmarks.slice(0, markerIndex), copy, ...bookmarks.slice(markerIndex + 1)]);
    };

    const markerChangeHandler = (arg: BaseArgs & ExtensionArgsMarker): void => {
        const { value, markerIndex, key, which } = arg;
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
                <Button size={'large'}>Choose Video</Button>
                <Button size={'large'}>Execute Split</Button>
                <InputFilePad/>
            </GridItemMenu>
            <GridItemMain>
                <FormWrapper>
                    {bookmarks.map((each, index) => {
                        return (
                            <FormInnerWrapper key={index}>
                                <FormBookmarkName currentName={each.bookmarkName} onChange={bookmarkNameChangeHandler} markerIndex={index}/>
                                <FormMarkerWrapper>
                                    <FormMarker onChange={markerChangeHandler} which={'begin'} markerIndex={index}/>
                                    <FormMarker onChange={markerChangeHandler} which={'end'} markerIndex={index}/>
                                </FormMarkerWrapper>
                            </FormInnerWrapper>
                        ); 
                    })}
                </FormWrapper>
            </GridItemMain>
        </GridContainer>        
    )
}
