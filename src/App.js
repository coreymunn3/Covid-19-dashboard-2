import React, { useState, useEffect, Fragment } from 'react';
import {
  FormControl,
  MenuItem,
  Select,
  Paper,
  Typography,
} from '@material-ui/core';
import './App.css';
import 'leaflet/dist/leaflet.css';
import covidAPI from './api';
import SummaryBox from './components/summaryBox/SummaryBox';
import Map from './components/map/Map';
import DataTable from './components/dataTable/DataTable';
import LineGraph from './components/lineGraph/LineGraph';

const App = () => {
  const [countryOptions, setCountryOptions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('worldwide');
  const [selectedCountryData, setSelectedCountryData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const DEFAULT_CENTER = [34.807, -40.4796];
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(2);
  const [activeMeasure, setActiveMeasure] = useState('cases');

  useEffect(() => {
    // Get worldwide data (default setting)
    const getWorldwideData = async () => {
      const { data } = await covidAPI.getWorldwideData();
      setSelectedCountryData(data);
    };
    getWorldwideData();
    // Obtain list of countries for Dropdown
    const getCountries = async () => {
      const { data } = await covidAPI.getCountries();
      // console.log(sortCountriesByMeasure(data));
      const countryArray = data.map((country) => ({
        name: country.country,
        abbrev: country.countryInfo.iso2,
      }));
      setCountryOptions(countryArray);
      setTableData(data);
    };
    getCountries();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    setSelectedCountry(countryCode);
    // get data for selected country or worldwide
    let res;
    if (countryCode === 'worldwide') {
      res = await covidAPI.getWorldwideData();
      setMapCenter(DEFAULT_CENTER);
      setMapZoom(2);
    } else {
      res = await covidAPI.getCountryData(countryCode);
      setMapCenter([res.data.countryInfo.lat, res.data.countryInfo.long]);
      setMapZoom(4);
    }
    setSelectedCountryData(res.data);
  };

  return (
    <div className='app'>
      <div className='app__left'>
        <div className='app__header'>
          <Typography variant='h4'>
            <strong>Covid-19 Current Statistics</strong>
          </Typography>
          <div className='app__dropdown'>
            <FormControl>
              <Select
                value={selectedCountry}
                variant='outlined'
                style={{ backgroundColor: 'white' }}
                onChange={onCountryChange}
              >
                <MenuItem value='worldwide'>WorldWide</MenuItem>
                {countryOptions.map(({ name, abbrev }, idx) => (
                  <MenuItem key={idx} value={abbrev}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className='app__stats'>
          {selectedCountryData && (
            <Fragment>
              <SummaryBox
                isActive={activeMeasure === 'cases'}
                title='Cases'
                totalStat={selectedCountryData.cases}
                todayStat={selectedCountryData.todayCases}
                onClick={() => setActiveMeasure('cases')}
              ></SummaryBox>
              <SummaryBox
                isActive={activeMeasure === 'recovered'}
                title='Recovered'
                totalStat={selectedCountryData.recovered}
                todayStat={selectedCountryData.todayRecovered}
                onClick={() => setActiveMeasure('recovered')}
              ></SummaryBox>
              <SummaryBox
                isActive={activeMeasure === 'deaths'}
                title='Deaths'
                totalStat={selectedCountryData.deaths}
                todayStat={selectedCountryData.todayDeaths}
                onClick={() => setActiveMeasure('deaths')}
              ></SummaryBox>
            </Fragment>
          )}
        </div>

        <Map
          center={mapCenter}
          zoom={mapZoom}
          mapData={tableData}
          activeMeasure={activeMeasure}
        />
      </div>

      <div className='app__right'>
        <Paper
          className='app__right-content'
          style={{ padding: '1rem', flexGrow: 1 }}
        >
          <Typography variant='h5' align='center'>
            Cases By Country
          </Typography>
          <DataTable tableData={tableData} activeMeasure={activeMeasure} />
          <Typography
            variant='h5'
            align='center'
            style={{ marginTop: '1rem' }}
          >{`${
            selectedCountry.charAt(0).toUpperCase() + selectedCountry.slice(1)
          } New ${
            activeMeasure.charAt(0).toUpperCase() + activeMeasure.slice(1)
          }`}</Typography>
          <div className='app__graph'>
            <LineGraph
              activeMeasure={activeMeasure}
              selectedCountry={selectedCountry}
            />
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default App;
