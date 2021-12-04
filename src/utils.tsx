export const getDate = (sunrise: number, sunset: number, timezone: number) => {
  const timezoneDif = timezone * 1000 - 7200000;
  const date = Date.now() + timezoneDif;
  const sunriseLocal = sunrise * 1000 + timezoneDif;
  const sunsetLocal = sunset * 1000 + timezoneDif;
  if (sunriseLocal > date) {
    return false;
  } else if (date > sunriseLocal && date < sunsetLocal) {
    return true;
  }
  return true;
};
