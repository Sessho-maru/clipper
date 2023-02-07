export type Maybe<T> = T | null;
export type PropsOf<T> = Omit<T, '__typename'>;

type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
};

export type PlainTimeCode = Scalars['String'];
export type MaskedTimeCode = Scalars['String'];
export type TimeCode = MaskedTimeCode | PlainTimeCode;

export type Marker = {
  __typename?: 'Marker';
  markerName: Scalars['String'];
  markerTime: TimeCode;
};
export type Bookmark = {
  __typename?: 'Bookmark';
  bookmarkName: Scalars['String'];
  marker: {
    begin: Marker;
    end: Marker;
  };
};

export type PathLike = {
  __typename?: 'PathLike';
  path: string;
  kind: PathKind;
};

export type BaseArgs = {
  __typename?: 'BaseArgs';
  markerIndex: Readonly<number>;
  value: Readonly<string>;
};
export type ExtensionArgsMarker = {
  __typename?: 'ExtensionArgsMarker';
  key?: keyof PropsOf<Marker>;
  which?: MarkerWhich;
};

export type Error = {
  __typename?: 'Error',
  id: Readonly<Scalars['ID']>;
  level: Readonly<ErrorLevel>;
  message: Readonly<Scalars['String']>;
};

export type ChildResponse = {
  __typename?: 'ChildResponse';
  error: Readonly<Maybe<Error>>;
  message: Readonly<Scalars['String']>;
};

export type InjectionParsed = {
  __typename?: 'InjectionParsed';
  bkNames: Readonly<Array<Scalars['String']>>;
  microSecs: Readonly<Array<PlainTimeCode>>;
};

export type ApiPaths = 'split' | '';
export type ApiStatus = 'idle' | 'splitting' | 'parsing' | 'pending' | 'failed' | 'fulfilled';
export type PathKind = 'src' | 'output';
export type MarkerWhich = 'begin' | 'end';
export type ErrorLevel = 'warning' | 'critical';
export type UserMatable = 'bookmarkName' | 'markerName' | 'markerTime';
