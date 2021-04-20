import React from 'react';
import { Paper, Typography } from '@material-ui/core';
import {
  MapContainer,
  TileLayer,
  LayerGroup,
  useMap,
  Circle,
  Popup,
} from 'react-leaflet';
import caseTypeMetadata from '../../utils/caseTypeMetadata';
import numeral from 'numeral';
import './Map.css';

const UpdateView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};
const Map = ({ center, zoom, mapData, activeMeasure }) => {
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
                color: caseTypeMetadata[activeMeasure].hex,
                fillColor: caseTypeMetadata[activeMeasure].hex,
              }}
              fillOpacity={0.4}
              radius={Math.sqrt(
                country[activeMeasure] *
                  caseTypeMetadata[activeMeasure].multiplier
              )}
            >
              <Popup>
                <div className='tooltipContainer'>
                  <div
                    style={{
                      backgroundImage: `url(${country.countryInfo.flag})`,
                    }}
                    className='tooltipFlag'
                  ></div>
                  <Typography variant='h6'>{country.country}</Typography>
                  <Typography variant='body1' className='tooltipDetail'>
                    {'Cases: '}
                    {numeral(country.cases).format('0,0')}
                  </Typography>
                  <Typography variant='body1' className='tooltipDetail'>
                    {'Recovered: '}
                    {numeral(country.recovered).format('0,0')}
                  </Typography>
                  <Typography variant='body1' className='tooltipDetail'>
                    {'Deaths: '}
                    {numeral(country.deaths).format('0,0')}
                  </Typography>
                </div>
              </Popup>
            </Circle>
          ))}
        </LayerGroup>
      </MapContainer>
    </Paper>
  );
};

export default Map;
