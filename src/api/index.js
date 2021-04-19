import axios from 'axios';

const baseUrl = 'https://disease.sh/v3/covid-19';
const covidAPI = {
  getCountries: () => axios.get(`${baseUrl}/countries`),
  getCountryData: (country) => axios.get(`${baseUrl}/countries/${country}`),
  getWorldwideData: () => axios.get(`${baseUrl}/all`),
};

export default covidAPI;
