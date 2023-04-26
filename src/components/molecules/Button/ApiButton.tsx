import { Button } from "@mui/material"
import { ipcRenderer } from 'electron';
import trySplit from "../../../api/Split"
import trySetPathOf from "../../../api/SetPathOf";
import { ApiStatus, Bookmark, Error, Maybe, PathLike } from "typedefs/types"
import { isPathLike, isBookmarks } from '../../../utils/Typeguards';
import { MarkerNameUtil, TimeCodeUtil } from "../../../utils/Utilities";

interface ApiButtonProps<T> {
    arg: T,
    label: string,
    disabled?: boolean,
    onSuccess: (arg: 'fulfilled' | PathLike) => void,
    onFail: (err: Error) => void,
    onPending: (arg: 'splitting' | 'pending') => void
}
export type TypedApiButton<ArgumentType> = React.FC<ApiButtonProps<ArgumentType>>;

export function ApiButton<T>({arg, label, disabled, onSuccess, onFail, onPending}: ApiButtonProps<T>) {
    const fileDialogPickHandler = async (picked: PathLike): Promise<void> => {
        const { path, kind } = picked;
        const response = await trySetPathOf(kind, path);
        onSuccess({ __typename: 'PathLike', path: response, kind: kind });
    };

    const postProcessBeforeSplit = (bookmark: Bookmark): Bookmark => {
        let { bookmarkName } = bookmark;
        const { begin, end } = bookmark.marker;

        begin.markerTime = TimeCodeUtil.mask(begin.markerTime);
        end.markerTime = TimeCodeUtil.mask(end.markerTime);        
        bookmarkName = MarkerNameUtil.sanitizeMarkerName(bookmarkName);

        return { bookmarkName, marker: { begin, end } };
    }
    
    const clickHandler = async (): Promise<void> => {
        if (isPathLike(arg)) {
            onPending('pending');

            const { kind } = arg;
            const maybePath: Maybe<string> = await ipcRenderer.invoke(kind === 'src' ? 'picksrc': 'pickdir');
            if (maybePath) {
                fileDialogPickHandler({ path: maybePath, kind: kind });
            }
        }
        else if ((Array.isArray(arg)) && isBookmarks(arg)) {
            onPending('splitting');

            const response = await trySplit(arg.map(postProcessBeforeSplit));
            if (response.error) {
                onFail(response.error);
            }
            else {
                onSuccess('fulfilled');
            }
        }
    };

    return (
        <>
            <Button 
                size={'large'}
                onClick={clickHandler}
                disabled={disabled}
                sx={{ position: 'relative', zIndex: 3010 }}
            >
                { label }
            </Button>
        </>
    )
}
