import React from 'react';
import { Paper } from '@material-ui/core';
import {
  MapContainer,
  TileLayer,
  LayersControl,
  LayerGroup,
  useMap,
  Circle,
} from 'react-leaflet';
import caseTypeMetadata from './caseTypeMetadata';
import './Map.css';

const UpdateView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  console.log(map.getCenter());
  return null;
};
const Map = ({ center, zoom, mapData, measure = 'cases' }) => {
  return (
    <Paper className='map'>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={false}>
        <UpdateView center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <LayerGroup>
          {mapData.map((country) => (
            <Circle
              key={country.country}
              center={[country.countryInfo.lat, country.countryInfo.long]}
              pathOptions={{
                color: caseTypeMetadata[measure].hex,
                fillColor: caseTypeMetadata[measure].hex,
              }}
              fillOpacity={0.4}
              radius={Math.sqrt(
                country[measure] * caseTypeMetadata[measure].multiplier
              )}
            ></Circle>
          ))}
        </LayerGroup>
      </MapContainer>
    </Paper>
  );
};

export default Map;
