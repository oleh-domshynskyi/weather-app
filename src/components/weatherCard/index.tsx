import React from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { WeatherCardProps } from './types';
import styles from './styles.module.scss';
import LocationIcon from '@/public/images/location.svg';

const WeatherCard = ({
  isDay,
  isValid,
  onInputChange,
  location,
  onBtnClick,
  city,
  country,
  weatherIcon,
  windSpeed,
  humidity,
  temp,
}: WeatherCardProps) => {
  const getImgUrl = () => {
    if (weatherIcon) {
      return `http://openweathermap.org/img/w/${weatherIcon}.png`;
    }
    return ``;
  };
  return (
    <div
      className={classNames(styles.weatherCard, {
        [styles.day]: isDay,
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
            onChange={onInputChange}
            placeholder="Enter location"
            className={styles.searchInput}
          />
          <button className={styles.searchBtn} onClick={onBtnClick}>
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
          {city}, {country}
        </h1>
      </div>
      <div className={styles.infoWrap}>
        <div className={styles.tempWrap}>
          <p className={styles.temp}>{temp}° C</p>
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
            <p className={styles.windSpeed}>{windSpeed} m/s</p>
          </div>
          <div className={styles.humidityWrap}>
            <Image
              src="/images/humidity.svg"
              width={50}
              height={60}
              alt="humidity icon"
            />
            <p className={styles.humidity}>{humidity} %</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
