import { Bookmark, PathLike } from 'typedefs/types';
import { TypedApiButton, ApiButton } from './ApiButton';

export const SplitApiButton: TypedApiButton<Bookmark[]> = (props) => { return <ApiButton {...props}/> };