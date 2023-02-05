import { Bookmark, PathLike } from 'typedefs/types';
import { TypedApiButton, ApiButton } from './ApiButton';

export const SplitButton: TypedApiButton<Bookmark[]> = (props) => { return <ApiButton {...props}/> };
export const SetSrcPathButton: TypedApiButton<PathLike> = (props) => { return <ApiButton {...props}/> };
export const SetOutputDirButton: TypedApiButton<PathLike> = (props) => { return <ApiButton {...props}/> };