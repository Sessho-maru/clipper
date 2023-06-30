export type Maybe<T> = T | null;
export type PropsOf<T> = Omit<T, '__typename'>;

type Scalars = {
  ID: string;
  Index: number;
  String: string;
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
  path: Readonly<Scalars['String']>;
  kind: Readonly<PathKind>;
};

export type ChangeHandlerBaseArg = {
  __typename?: 'ChangeHandlerBaseArg';
  markerIndex: Readonly<Scalars['Index']>;
  value: Readonly<Scalars['String']>;
};
export type MarkerExt = {
  __typename?: 'MarkerExt';
  key?: Readonly<keyof PropsOf<Marker>>;
  which?: Readonly<MarkerWhich>;
};

export type PbfParsed = {
  __typename?: 'PbfParsed';
  bookmarkNames: Readonly<Array<Scalars['String']>>;
  milliSecs: Readonly<Array<Scalars['String']>>;
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

export type ApiStatus = 'idle' | 'splitting' | 'parsing' | 'pending' | 'failed' | 'fulfilled';
export type PathKind = 'src' | 'output';
export type MarkerWhich = 'begin' | 'end';
export type ErrorLevel = 'WARNING' | 'CRITICAL';
export type UserMatable = 'bookmarkName' | 'markerName' | 'markerTime';
