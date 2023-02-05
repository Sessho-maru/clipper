import { MarkerWhich, UserMatable } from 'typedefs/types';

export interface FormMutatingPropOf<K extends UserMatable> {
    markerIndex: number;
    onChange: (arg: {value: string, markerIndex: number, key?: Extract<UserMatable, K>, which?: MarkerWhich}) => void;
}
