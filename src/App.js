import React, { useState, useEffect } from 'react';
import {
  FormControl,
  MenuItem,
  Select,
  Card,
  CardContent,
  Typography,
} from '@material-ui/core';
import './App.css';
import 'leaflet/dist/leaflet.css';
import covidAPI from './api';
import SummaryBox from './components/summaryBox/SummaryBox';
import Map from './components/map/Map';
import DataTable from './components/dataTable/DataTable';
import LineGraph from './components/lineGraph/LineGraph';
// util fn
import { sortCountriesByCases } from './utils/sort';

const App = () => {
  const [countryOptions, setCountryOptions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('worldwide');
  const [selectedCountryData, setSelectedCountryData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const DEFAULT_CENTER = [34.807, -40.4796];
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(2);

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
      // console.log(sortCountriesByCases(data));
      const countryArray = data.map((country) => ({
        name: country.country,
        abbrev: country.countryInfo.iso2,
      }));
      setCountryOptions(countryArray);
      setTableData(sortCountriesByCases(data));
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
          <Typography variant='h5'>Covid-19 Current Statistics</Typography>
          <div className='app__dropdown'>
            <FormControl>
              <Select value={selectedCountry} onChange={onCountryChange}>
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
          <SummaryBox
            title='Covid Cases'
            totalStat={selectedCountryData?.cases}
            todayStat={selectedCountryData?.todayCases}
          ></SummaryBox>
          <SummaryBox
            title='Recovered'
            totalStat={selectedCountryData?.recovered}
            todayStat={selectedCountryData?.todayRecovered}
          ></SummaryBox>
          <SummaryBox
            title='Deaths'
            totalStat={selectedCountryData?.deaths}
            todayStat={selectedCountryData?.todayDeaths}
          ></SummaryBox>
        </div>

        <Map center={mapCenter} zoom={mapZoom} mapData={tableData} />
      </div>
      <div className='app__right'>
        <Card>
          <CardContent className='app__right-content'>
            <DataTable tableData={tableData} />
            <h2>Worldwide New Cases</h2>
            <LineGraph />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default App;
