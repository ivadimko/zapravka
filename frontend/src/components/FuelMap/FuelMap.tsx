import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import {
  FC, useCallback, useEffect, useMemo, useState,
} from 'react';
import { debounce } from '@/utils/debounce';
import { StationFragment } from '@/controllers/graphql/generated';
import { StationMarker } from './components/StationMarker';
import { IconTarget } from './components/IconTarget';
import styles from './FuelMap.module.scss';
import MapStyles from './FuelMap.style.json';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const DEFAULT_CENTER = {
  lat: 50.4501,
  lng: 30.5234,
};

const MAP_CENTER_KEY = 'map_center';

const DEFAULT_ZOOM = 12;
const MAP_ZOOM_KEY = 'map_zoom';

const USER_ALLOWED_GEOLOCATION_KEY = 'user_allowed_geolocation';

interface Props {
  stations: Array<StationFragment>;
  updatedAt: string;
}

export const FuelMap: FC<Props> = (props) => {
  const { stations, updatedAt } = props;

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

  const updateStoredMapCenter = useMemo(
    () => debounce(
      (coordinates: { lat: number, lng: number }) => {
        localStorage.setItem(MAP_CENTER_KEY, JSON.stringify(coordinates));
      },
    ),
    [],
  );

  const updateStoredMapZoom = useMemo(
    () => debounce(
      (zoom: number) => {
        localStorage.setItem(MAP_ZOOM_KEY, String(zoom));
      },
    ),
    [],
  );

  const goToLocation = useCallback(() => {
    if (userLocation && map) {
      map.setCenter(userLocation);

      return;
    }

    if (navigator.geolocation && map) {
      navigator.geolocation.getCurrentPosition((position) => {
        localStorage.setItem(USER_ALLOWED_GEOLOCATION_KEY, 'true');

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
    const savedMapPosition = localStorage.getItem(MAP_CENTER_KEY);
    const savedMapZoom = localStorage.getItem(MAP_ZOOM_KEY);

    if (savedMapPosition && map) {
      try {
        const center = JSON.parse(savedMapPosition);

        map.setCenter(center);
        map.setZoom(Number(savedMapZoom) || DEFAULT_ZOOM);
      } catch {
        // do nothing
      }
    }
  }, [map]);

  useEffect(() => {
    const isGeolocationAllowed = localStorage.getItem(
      USER_ALLOWED_GEOLOCATION_KEY,
    );

    if (isGeolocationAllowed === 'true' && map) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }, [map]);

  useEffect(() => {
    setOpenedStation(-1);
  }, [stations]);

  return isLoaded
    ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={DEFAULT_CENTER}
        zoom={12}
        onLoad={onLoad}
        onCenterChanged={() => {
          updateStoredMapCenter(map?.getCenter());
        }}
        onZoomChanged={() => {
          updateStoredMapZoom(map?.getZoom());
        }}
        onUnmount={onUnmount}
        options={{
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: true,
          streetViewControl: false,
          rotateControl: true,
          fullscreenControl: false,
          styles: MapStyles,
        }}
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
            updatedAt={updatedAt}
          />
        ))}
      </GoogleMap>
    )
    : null;
};
