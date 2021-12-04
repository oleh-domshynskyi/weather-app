export interface WeatherCardProps {
  isDay: boolean;
  isValid: boolean;
  onInputChange: any;
  location: string;
  onBtnClick: any;
  city: string;
  country: string;
  weatherIcon?: string;
  windSpeed: string;
  humidity: string;
  temp: string;
}
