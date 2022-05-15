import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import {
  FC, useCallback, useEffect, useState,
} from 'react';
import { Station, StationMarker } from '@/components/FuelMap/StationMarker';
import { IconTarget } from '@/components/FuelMap/IconTarget';
import styles from './FuelMap.module.scss';

const containerStyle = {
  width: '100%',
  height: 'calc(100vh - 90px)',
};

const center = {
  lat: 50.4501,
  lng: 30.5234,
};

interface Props {
  stations: Station[];
}

export const FuelMap: FC<Props> = (props) => {
  const { stations } = props;

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const [
    userLocation,
    setUserLocation,
  ] = useState<{ lat: number, lng: number } | null>(null);

  const [
    openedStation,
    setOpenedStation,
  ] = useState<number>(-1);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const goToLocation = useCallback(() => {
    if (userLocation && map) {
      map.setCenter(userLocation);

      return;
    }

    if (navigator.geolocation && map) {
      navigator.geolocation.getCurrentPosition((position) => {
        const initialLocation = new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude,
        );

        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });

        map.setCenter(initialLocation);
      });
    }
  }, [map, userLocation]);

  useEffect(() => {
    goToLocation();
  }, [goToLocation]);

  useEffect(() => {
    setOpenedStation(-1);
  }, [stations]);

  return isLoaded
    ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <button
          type="button"
          className={styles.locationButton}
          onClick={goToLocation}
        >
          <IconTarget />
        </button>

        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              strokeColor: 'blue',
              scale: 5,
            }}
          />
        )}
        {stations.map((station, index) => (
          <StationMarker
            key={station.name}
            station={station}
            opened={openedStation === index}
            open={() => setOpenedStation(index)}
            close={() => setOpenedStation(-1)}
          />
        ))}
      </GoogleMap>
    )
    : null;
};
