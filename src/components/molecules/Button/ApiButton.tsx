import { Button } from "@mui/material"
import trySplit from "../../../api/Split"
import { ApiStatus, Bookmark, ChildResponse, Error } from "typedefs/types"
import { isBookmarks, isOutputPathLike, isSrcPathLike } from '../../../utils/Typeguards';

interface ApiButtonProps<T> {
    arg: T,
    label: string,
    disabled: boolean,
    onClick: (apiStatus: ApiStatus) => void,
    onSuccess: () => any,
    onFail: (err: Error) => void,
}

export type TypedApiButton<ArgumentType> = React.FC<ApiButtonProps<ArgumentType>>;

export function ApiButton<T>({arg, label, onClick, onSuccess, onFail}: ApiButtonProps<T>) {
    const clickHandler = async (): Promise<void> => {
        if ((Array.isArray(arg)) && isBookmarks(arg)) {
            onClick('splitting');
            try {
                await trySplit(arg);
                onSuccess();
            }
            catch (err) {
                onFail((err as ChildResponse).error!);
            }
        }
        else {
            console.log('(((');
        }
    }

    return (
        <Button 
            size={'large'}
            onClick={clickHandler}
        >
            { label }
        </Button>
    )
}
