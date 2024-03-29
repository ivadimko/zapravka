import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Coordinates = {
  __typename?: 'Coordinates';
  lng: Scalars['Float'];
  lat: Scalars['Float'];
};

export type FuelStatusesMap = {
  __typename?: 'FuelStatusesMap';
  empty?: Maybe<Scalars['Boolean']>;
  only_critical_vehicles?: Maybe<Scalars['Boolean']>;
  available_cash?: Maybe<Scalars['Boolean']>;
  available_fuel_cards?: Maybe<Scalars['Boolean']>;
  price?: Maybe<Scalars['Float']>;
};

export enum GasStationDescriptionType {
  Raw = 'Raw',
  Html = 'HTML'
}

export type GasStationSchedule = {
  __typename?: 'GasStationSchedule';
  opensAt: Scalars['String'];
  closesAt: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  stations: Array<Station>;
  station?: Maybe<Station>;
};


export type QueryStationArgs = {
  provider: StationProvider;
  id: Scalars['String'];
};

export type Station = {
  __typename?: 'Station';
  schedule?: Maybe<GasStationSchedule>;
  id: Scalars['String'];
  provider: StationProvider;
  name: Scalars['String'];
  coordinates: Coordinates;
  workDescription: Scalars['String'];
  descriptionType: GasStationDescriptionType;
  status: StationFuelStatus;
  tel: Scalars['String'];
  scheduleString: Scalars['String'];
  icon: Scalars['String'];
  reference: StationReference;
};

export type StationFuelStatus = {
  __typename?: 'StationFuelStatus';
  petrol_92: FuelStatusesMap;
  petrol: FuelStatusesMap;
  diesel: FuelStatusesMap;
  gas: FuelStatusesMap;
  ad_blue: FuelStatusesMap;
};

export enum StationProvider {
  Okko = 'Okko',
  Wog = 'Wog',
  Socar = 'Socar',
  Upg = 'UPG',
  Avias = 'Avias',
  Brsm = 'BRSM',
  Motto = 'Motto',
  Amic = 'Amic'
}

export type StationReference = {
  __typename?: 'StationReference';
  title: Scalars['String'];
  link: Scalars['String'];
};

export type FuelStatusFragment = (
  { __typename?: 'FuelStatusesMap' }
  & Pick<FuelStatusesMap, 'available_cash' | 'available_fuel_cards' | 'only_critical_vehicles' | 'empty' | 'price'>
);

export type CoordinatesFragment = (
  { __typename?: 'Coordinates' }
  & Pick<Coordinates, 'lat' | 'lng'>
);

export type GasStationScheduleFragment = (
  { __typename?: 'GasStationSchedule' }
  & Pick<GasStationSchedule, 'opensAt' | 'closesAt'>
);

export type StationReferenceFragment = (
  { __typename?: 'StationReference' }
  & Pick<StationReference, 'link' | 'title'>
);

export type StationFragment = (
  { __typename?: 'Station' }
  & Pick<Station, 'id' | 'provider' | 'name' | 'tel' | 'descriptionType' | 'scheduleString' | 'icon'>
  & { coordinates: (
    { __typename?: 'Coordinates' }
    & CoordinatesFragment
  ), status: (
    { __typename?: 'StationFuelStatus' }
    & { diesel: (
      { __typename?: 'FuelStatusesMap' }
      & FuelStatusFragment
    ), gas: (
      { __typename?: 'FuelStatusesMap' }
      & FuelStatusFragment
    ), petrol: (
      { __typename?: 'FuelStatusesMap' }
      & FuelStatusFragment
    ), petrol_92: (
      { __typename?: 'FuelStatusesMap' }
      & FuelStatusFragment
    ) }
  ), schedule?: Maybe<(
    { __typename?: 'GasStationSchedule' }
    & GasStationScheduleFragment
  )>, reference: (
    { __typename?: 'StationReference' }
    & StationReferenceFragment
  ) }
);

export type StationsQueryVariables = Exact<{ [key: string]: never; }>;


export type StationsQuery = (
  { __typename?: 'Query' }
  & { stations: Array<(
    { __typename?: 'Station' }
    & StationFragment
  )> }
);

export type StationQueryVariables = Exact<{
  provider: StationProvider;
  id: Scalars['String'];
}>;


export type StationQuery = (
  { __typename?: 'Query' }
  & { station?: Maybe<(
    { __typename?: 'Station' }
    & Pick<Station, 'id' | 'workDescription'>
  )> }
);

export const CoordinatesFragmentDoc = /*#__PURE__*/ gql`
    fragment Coordinates on Coordinates {
  lat
  lng
}
    `;
export const FuelStatusFragmentDoc = /*#__PURE__*/ gql`
    fragment FuelStatus on FuelStatusesMap {
  available_cash
  available_fuel_cards
  only_critical_vehicles
  empty
  price
}
    `;
export const GasStationScheduleFragmentDoc = /*#__PURE__*/ gql`
    fragment GasStationSchedule on GasStationSchedule {
  opensAt
  closesAt
}
    `;
export const StationReferenceFragmentDoc = /*#__PURE__*/ gql`
    fragment StationReference on StationReference {
  link
  title
}
    `;
export const StationFragmentDoc = /*#__PURE__*/ gql`
    fragment Station on Station {
  id
  provider
  name
  tel
  coordinates {
    ...Coordinates
  }
  descriptionType
  status {
    diesel {
      ...FuelStatus
    }
    gas {
      ...FuelStatus
    }
    petrol {
      ...FuelStatus
    }
    petrol_92 {
      ...FuelStatus
    }
  }
  schedule {
    ...GasStationSchedule
  }
  scheduleString
  icon
  reference {
    ...StationReference
  }
}
    ${CoordinatesFragmentDoc}
${FuelStatusFragmentDoc}
${GasStationScheduleFragmentDoc}
${StationReferenceFragmentDoc}`;
export const StationsDocument = /*#__PURE__*/ gql`
    query stations {
  stations {
    ...Station
  }
}
    ${StationFragmentDoc}`;

/**
 * __useStationsQuery__
 *
 * To run a query within a React component, call `useStationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useStationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useStationsQuery(baseOptions?: Apollo.QueryHookOptions<StationsQuery, StationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StationsQuery, StationsQueryVariables>(StationsDocument, options);
      }
export function useStationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StationsQuery, StationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StationsQuery, StationsQueryVariables>(StationsDocument, options);
        }
export type StationsQueryHookResult = ReturnType<typeof useStationsQuery>;
export type StationsLazyQueryHookResult = ReturnType<typeof useStationsLazyQuery>;
export type StationsQueryResult = Apollo.QueryResult<StationsQuery, StationsQueryVariables>;
export const StationDocument = /*#__PURE__*/ gql`
    query station($provider: StationProvider!, $id: String!) {
  station(provider: $provider, id: $id) {
    id
    workDescription
  }
}
    `;

/**
 * __useStationQuery__
 *
 * To run a query within a React component, call `useStationQuery` and pass it any options that fit your needs.
 * When your component renders, `useStationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStationQuery({
 *   variables: {
 *      provider: // value for 'provider'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useStationQuery(baseOptions: Apollo.QueryHookOptions<StationQuery, StationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StationQuery, StationQueryVariables>(StationDocument, options);
      }
export function useStationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StationQuery, StationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StationQuery, StationQueryVariables>(StationDocument, options);
        }
export type StationQueryHookResult = ReturnType<typeof useStationQuery>;
export type StationLazyQueryHookResult = ReturnType<typeof useStationLazyQuery>;
export type StationQueryResult = Apollo.QueryResult<StationQuery, StationQueryVariables>;
export const namedOperations = {
  Query: {
    stations: 'stations',
    station: 'station'
  },
  Fragment: {
    FuelStatus: 'FuelStatus',
    Coordinates: 'Coordinates',
    GasStationSchedule: 'GasStationSchedule',
    StationReference: 'StationReference',
    Station: 'Station'
  }
}