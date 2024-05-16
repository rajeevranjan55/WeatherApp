import axios from 'axios';
import {apiKey} from '../constant/api';

const forecastEndPoint = params =>
  `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days=${params.days}&aqi=no&alerts=no`;

const locationEndPoint = params =>
  `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.cityName}`;

const apiCall = async endpoint => {
  try {
    const response = await axios.get(endpoint);
    return response.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const fetchWeatherForecast = params => {
  const forecastUrl = forecastEndPoint(params);

  return apiCall(forecastUrl);
};

export const fetchLocations = params => {
  const locationUrl = locationEndPoint(params);
  return apiCall(locationUrl);
};
