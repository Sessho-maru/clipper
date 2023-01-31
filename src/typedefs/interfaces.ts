import { UserMatable } from 'typedefs/types';

export interface FormMutatingPropOf<K extends UserMatable> {
    markerIndex: number;
    onChange: (key: Extract<UserMatable, K>, value: string, markerIndex: number, which?: 'begin' | 'end') => void;
}
