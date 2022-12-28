import { Box, TextField } from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { format, unformat } from "./Splitter";
import { LABEL_BOOKMARK_NAME, LABEL_MARKER_END, LABEL_MARKER_START } from "./types";
import { IBookmark, Plasmid } from "./types";

interface IFormProps {
  index: number,
  bookmark: IBookmark,
  plasmid: Plasmid,
  setPlasmid: Dispatch<SetStateAction<Plasmid>>,
}

function BookmarkForm(props: IFormProps): JSX.Element {
  function onBookmarkModified(key: 'name' | 'from' | 'to', value: string): void {
    props.setPlasmid({ key, value: unformat(value), index: props.index, lastModifiedTimeStamp: Date.now() });
  }

  return (
      <Box 
        key={`input_${props.index}`}
        component="form"
        sx={{
          '& > :not(style)': { ml: 0.8, mr: 0.8, mb: 0.3, mt: 1.9, width: '25ch'},
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id={ `${props.index}-bookmark.name` }
          value={ props.bookmark.name }
          label={ props.index === 0 ? LABEL_BOOKMARK_NAME : undefined }
          onChange={ (event: React.ChangeEvent<{ value: string }>) => { onBookmarkModified('name', event.currentTarget.value) } }
          variant={'outlined'}
        />
        <TextField
          id={ `${props.index}-markerTime.from` }
          value={ (props.plasmid.key === 'from' && props.plasmid.index === props.index) ? format(props.plasmid.value) : props.bookmark.range.from }
          label={ props.index === 0 ? LABEL_MARKER_START : undefined }
          onChange={ (event: React.ChangeEvent<{ value: string }>) => { onBookmarkModified('from', event.currentTarget.value); } }
          error={ !props.bookmark.validation.isValid && props.bookmark.validation.subject === 'from' }
          helperText={ !props.bookmark.validation.isValid && props.bookmark.validation.subject === 'from' ? props.bookmark.validation.message : 'hh:mm:ss +.ms' }
          variant={'standard'}
        />
        <TextField
          id={ `${props.index}-markerTime.to` }
          value={ (props.plasmid.key === 'to' && props.plasmid.index === props.index) ? format(props.plasmid.value) : props.bookmark.range.to }
          label={ props.index === 0 ? LABEL_MARKER_END : undefined }
          onChange={ (event: React.ChangeEvent<{ value: string }>) => { onBookmarkModified('to', event.currentTarget.value) } }
          error={ !props.bookmark.validation.isValid && props.bookmark.validation.subject === 'to' }
          helperText={ !props.bookmark.validation.isValid && props.bookmark.validation.subject === 'to' ? props.bookmark.validation.message : 'hh:mm:ss +.ms' }
          variant={'standard'}
        />
      </Box>
  )
}

export default BookmarkForm;