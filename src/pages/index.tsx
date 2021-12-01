import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import styles from '@/styles/Home.module.scss';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import LocationIcon from '@/public/images/location.svg';

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

  axios.interceptors.request.use(
    function (config) {
      config.params = {
        ...config.params,
        appid: `${process.env.NEXT_PUBLIC_API_KEY}`,
      };
      return config;
    },
    function (error) {
      return Promise.reject(error);
    },
  );

  const onSearchClick = () => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather`, {
        params: {
          q: location,
          units: `metric`,
        },
      })
      .then((res) => {
        console.log(res);
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
        setIsValid(false);
      });
  };

  useEffect(() => {
    onSearchClick();
  }, []);

  const getImgUrl = () => {
    if (weatherIcon) {
      return `http://openweathermap.org/img/w/${weatherIcon}.png`;
    }
    return ``;
  };

  const search = debounce(onSearchClick, 400);
  return (
    <section className={styles.home}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-8">
            <div
              className={classNames(styles.weatherCard, {
                [styles.night]: !isDay,
              })}
            >
              <div className={styles.searchWrap}>
                <div
                  className={classNames(styles.search, {
                    [styles.invalid]: !isValid,
                  })}
                >
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter location"
                    className={styles.searchInput}
                  />
                  <button className={styles.searchBtn} onClick={search}>
                    <Image
                      src="/images/search.png"
                      width={25}
                      height={25}
                      alt="search icon"
                    />
                  </button>
                  <h4 className={styles.invalidMsg}>Write correct city</h4>
                </div>
              </div>
              <div className={styles.cityWrap}>
                <LocationIcon className={styles.locationIcon} />
                <h1 className={styles.city}>
                  {weather?.name}, {weather?.sys?.country}
                </h1>
              </div>
              <div className={styles.infoWrap}>
                <div className={styles.tempWrap}>
                  <p className={styles.temp}>{weather?.main?.temp}° C</p>
                  <img
                    className={styles.weatherImg}
                    src={getImgUrl()}
                    alt="weather icon"
                  />
                </div>
                <div>
                  <div className={styles.windWrap}>
                    <Image
                      src="/images/wind.svg"
                      width={50}
                      height={60}
                      alt="wind icon"
                    />
                    <p className={styles.windSpeed}>
                      {weather?.wind?.speed} m/s
                    </p>
                  </div>
                  <div className={styles.humidityWrap}>
                    <Image
                      src="/images/humidity.svg"
                      width={50}
                      height={60}
                      alt="humidity icon"
                    />
                    <p className={styles.humidity}>
                      {weather?.main?.humidity} %
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
