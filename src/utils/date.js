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

export { dateUtils }; //eslint-disable-line
