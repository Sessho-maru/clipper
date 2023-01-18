import { Box, TextField } from "@mui/material";
import { Dispatch, Fragment, SetStateAction } from "react";
import { MarkerTimeInput } from "./MarkerTimeInput";
import { 
  IBookmark, Plasmid,
  LABEL_BOOKMARK_NAME, LABEL_MARKER_END, LABEL_MARKER_START,
  MarkerTimeUtil
} from "./define";

interface IFormProps {
  bkIdx: number,
  bkObj: IBookmark,
  plasmid: Plasmid,
  setPlasmid: Dispatch<SetStateAction<Plasmid>>,
}

function BookmarkForm(props: IFormProps): JSX.Element {
  const { bkIdx, bkObj, plasmid } = props;

  function onBookmarkModified(key: 'name' | 'from' | 'to', value: string): void {
    props.setPlasmid(
      { 
        target: { key, value: key === 'name' ? value : MarkerTimeUtil.unMask(value), index: bkIdx },
        lastModifiedTimeStamp: Date.now() 
      }
    );
  }

  return (
    <Box mr={2} ml={1} mt={bkIdx === 0 ? 1 : 5} mb={2}>
      <Box width={1}>
        <TextField
          id={`bk${bkIdx}.name`}
          label={ bkIdx === 0 ? LABEL_BOOKMARK_NAME : undefined }
          value={bkObj.name}
          onChange={ (event: React.ChangeEvent<{ value: string }>) => { onBookmarkModified('name', event.currentTarget.value) } }
          // helperText={`Any forbidden characters(whiteSpace, :, ...) will be replaced to underscore`}
          InputLabelProps={{ shrink: bkObj.name !== '' }}
          variant={'outlined'}
          fullWidth
        />
      </Box>
      <Box display={'flex'} mt={3}>
        <Box width={1} mr={1}>
          <MarkerTimeInput
            id={`bk${bkIdx}.from`}
            mask={'00{:}00{:}00{.}000'}
            value={ (plasmid.target.key === 'from' && plasmid.target.index === bkIdx) ? plasmid.target.value : bkObj.range.from }
            label={ bkIdx === 0 ? LABEL_MARKER_START : undefined }
            onAccept={ (value) => { onBookmarkModified('from', value) } }
            error={ !bkObj.validation.isValid && bkObj.validation.subject === 'from' }
            helperText={ !bkObj.validation.isValid && bkObj.validation.subject === 'from' ? bkObj.validation.message : 'hh:mm:ss +.ms' }
            variant={'standard'}
            InputLabelProps={{ shrink: bkObj.range.from !== '' }}
            fullWidth
        />
        </Box>
        <Box width={1} ml={1}>
          <MarkerTimeInput
            id={`bk${bkIdx}.to`}
            mask={'00{:}00{:}00{.}000'}
            value={ (plasmid.target.key === 'to' && plasmid.target.index === bkIdx) ? plasmid.target.value : bkObj.range.to }
            label={ bkIdx === 0 ? LABEL_MARKER_END : undefined }
            onAccept={ (value) => { onBookmarkModified('to', value) } }
            error={ !bkObj.validation.isValid && bkObj.validation.subject === 'to' }
            helperText={ !bkObj.validation.isValid && bkObj.validation.subject === 'to' ? bkObj.validation.message : 'hh:mm:ss +.ms' }
            variant={'standard'}
            InputLabelProps={{ shrink: bkObj.range.to !== '' }}
            fullWidth
          />
        </Box>
      </Box>
    </Box>
  );
}

export default BookmarkForm;