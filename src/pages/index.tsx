import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import styles from '@/styles/Home.module.scss';
import debounce from 'lodash.debounce';
import WeatherCard from '@/components/weatherCard';

export default function Home() {
  const [weather, setWeather] = useState({
    name: ``,
    sys: { country: `` },
    main: { temp: ``, humidity: `` },
    wind: { speed: `` },
  });
  const [location, setLocation] = useState(`lviv`);
  const [weatherIcon, setWeatheIcon] = useState();
  const [isValid, setIsValid] = useState(true);
  const [isDay, setIsDay] = useState(Boolean);

  const getDate = (sunrise: number, sunset: number, timezone: number) => {
    const timezoneDif = timezone * 1000 - 7200000;
    const date = Date.now() + timezoneDif;
    const sunriseLocal = sunrise * 1000 + timezoneDif;
    const sunsetLocal = sunset * 1000 + timezoneDif;
    if (sunriseLocal > date) {
      setIsDay(false);
    } else if (date > sunriseLocal && date < sunsetLocal) {
      setIsDay(true);
    }
  };

  const getData = () => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather`, {
        params: {
          q: location,
          units: `metric`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setIsValid(true);
          return res.data;
        } else {
          throw new Error(`You have an error`);
        }
      })
      .then((object) => {
        setWeather(object);
        setWeatheIcon(object?.weather[0]?.icon);
        getDate(object?.sys?.sunrise, object?.sys?.sunset, object?.timezone);
      })
      .catch((error) => {
        console.log(error);
        if (error && !location) {
          setIsValid(true);
        } else setIsValid(false);
      });
  };
  const search = debounce(getData, 400);

  useEffect(() => {
    getData();
  }, []);

  const delayedInputChange = useCallback(debounce(search, 400), [location]);

  const onInputChange = (e: any) => {
    setLocation(e.target.value);
  };

  useEffect(() => {
    delayedInputChange();
    return delayedInputChange.cancel;
  }, [location, delayedInputChange]);

  return (
    <section className={styles.home}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-8">
            <WeatherCard
              isDay={isDay}
              isValid={isValid}
              onInputChange={onInputChange}
              location={location}
              onBtnClick={search}
              city={weather?.name}
              country={weather?.sys?.country}
              weatherIcon={weatherIcon}
              windSpeed={weather?.wind?.speed}
              humidity={weather?.main?.humidity}
              temp={weather?.main?.temp}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
