import React, { useState, useEffect } from 'react';
import {
  FormControl,
  MenuItem,
  Select,
  Card,
  CardContent,
} from '@material-ui/core';
import './App.css';
import covidAPI from './api';
import SummaryBox from './components/summaryBox/SummaryBox';
import Map from './components/map/Map';

const App = () => {
  const [countryOptions, setCountryOptions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('worldwide');
  const [countryData, setCountryData] = useState(null);

  useEffect(() => {
    // Get worldwide data (default setting)
    const getWorldwideData = async () => {
      const { data } = await covidAPI.getWorldwideData();
      setCountryData(data);
    };
    getWorldwideData();
    // Obtain list of countries for Dropdown
    const getCountries = async () => {
      const { data } = await covidAPI.getCountries();
      const countryArray = data.map((country) => ({
        name: country.country,
        abbrev: country.countryInfo.iso2,
      }));
      setCountryOptions(countryArray);
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
    } else {
      res = await covidAPI.getCountryData(countryCode);
    }
    setCountryData(res.data);
  };
  return (
    <div className='app'>
      <div className='app__left'>
        <div className='app__header'>
          <h1>Covid 19 Statistics</h1>
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
            totalStat={countryData?.cases}
            todayStat={countryData?.todayCases}
          ></SummaryBox>
          <SummaryBox
            title='Recovered'
            totalStat={countryData?.recovered}
            todayStat={countryData?.todayRecovered}
          ></SummaryBox>
          <SummaryBox
            title='Deaths'
            totalStat={countryData?.deaths}
            todayStat={countryData?.todayDeaths}
          ></SummaryBox>
        </div>

        <Map />
      </div>
      <div className='app__right'>
        <Card>
          <CardContent>
            <h2>Live Cases by Country</h2>
            <h2>Worldwide New Cases</h2>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default App;
