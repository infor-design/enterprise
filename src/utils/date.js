const dateUtils = {};

/**
* Determine whether or not a date is todays date.
* @param {date} date The date to check.
* @returns {boolean} Returns true or false if the compared date is today.
*/
dateUtils.isToday = function splice(date) {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

/**
* Gets the first day of the week.
* @param {date} date The date to check.
* @param {number} startsOn Day of the week to start on. Sunday is 0, Monday is 1, and so on.
* @returns {boolean} Returns true or false if the compared date is today.
*/
dateUtils.firstDayOfWeek = function firstDayOfWeek(date, startsOn = 0) {
  const dayOfWeek = date.getDay();
  const firstDay = new Date(date);
  const diff = dayOfWeek >= startsOn ? dayOfWeek - startsOn : 6 - dayOfWeek;

  firstDay.setDate(date.getDate() - diff);
  firstDay.setHours(0, 0, 0, 0);

  return firstDay;
};

/**
* Gets the first day of the week.
* @param {date} date The date to check.
* @param {number} startsOn Day of the week to start on. Sunday is 0, Monday is 1, and so on.
* @returns {boolean} Returns true or false if the compared date is today.
*/
dateUtils.lastDayOfWeek = function lastDayOfWeek(date, startsOn = 0) {
  const lastDay = this.firstDayOfWeek(date, startsOn);
  lastDay.setDate(lastDay.getDate() + 6);
  lastDay.setHours(23, 59, 59, 999);
  return lastDay;
};

export { dateUtils }; //eslint-disable-line
