import { Environment as env } from '../../utils/environment';
import { Locale } from '../locale/locale';
import { dateUtils } from '../../utils/date';
import { utils } from '../../utils/utils';

const calendarShared = {};

/**
* Add calculated fields to an event object.
* @param {object} event The starting event object
* @param {object} locale The locale instance to use
* @param {object} language The language instance to use
* @param {array} eventTypes The event types to attach
* @returns {object} The event object with stuff added.
*/
calendarShared.addCalculatedFields = function addCalculatedFields(event, locale, language, eventTypes) { //eslint-disable-line
  const formatDate = (d, o) => Locale.formatDate(d, utils.extend(true, { locale: locale.name }, o));
  const parseDateOpts = { pattern: 'yyyy-MM-ddTHH:mm:ss.SSS', locale: locale.name };
  const parseDate = (dtStr) => {
    let retDate = Locale.parseDate(dtStr, parseDateOpts);
    if (Locale.isIslamic(locale.name)) {
      retDate = new Date(
        retDate[0],
        retDate[1],
        retDate[2],
        retDate[3],
        retDate[4],
        retDate[5],
        retDate[6]
      );
    }
    return retDate;
  };
  const translate = str => Locale.translate(str, { locale: locale.name, language });

  event.color = this.getEventTypeColor(event.type, eventTypes);
  event.duration = Math.abs(dateUtils.dateDiff(
    new Date(event.ends),
    new Date(event.starts),
    false
  ));

  // Get today's date and convert to UTC
  const today = new Date();
  const dateTodayUTC = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());

  // Get event start date and convert to UTC
  const eventStart = new Date(event.starts);
  const eventStartUTC = Date.UTC(
    eventStart.getUTCFullYear(),
    eventStart.getUTCMonth(), eventStart.getUTCDate()
  );

  const eventStartFormatted = `${eventStart.getDate()}-${eventStart.getMonth() + 1}-${eventStart.getFullYear()}`;
  const todayFormatted = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

  event.durationUnits = translate(event.duration > 1 ? 'Days' : 'Day');
  event.daysUntil = event.starts ? dateUtils.dateDiff(eventStartUTC, dateTodayUTC) : 0;
  const diff = (new Date(event.ends) - new Date(event.starts)) / (1000 * 60 * 60);
  event.durationHours = diff > 0 && diff < 0.5 ? 1 : Math.round(diff);
  event.isDays = true;

  // Condition to not display in the upcoming events section
  if (dateTodayUTC > eventStartUTC && eventStartFormatted !== todayFormatted) {
    event.daysUntil = 1;
  }

  if (event.isAllDay === undefined) {
    event.isAllDay = true;
  }

  if (event.durationHours < 24) {
    event.isDays = false;
    event.isAllDay = false;
    event.durationUnits = translate(event.durationHours > 1 ? 'Hours' : 'Hour');
  }
  if (event.isAllDay.toString() === 'true') {
    const dayDiff = (d1, d2) => Math.abs(Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
    event.duration = dayDiff(new Date(event.starts), new Date(event.ends)) || 1;
    event.durationUnits = translate(event.duration > 1 ? 'Days' : 'Day');
    event.isDays = true;
    delete event.durationHours;
  }
  if (event.starts) {
    const startsLocale = parseDate(event.starts);
    event.startsLocale = formatDate(startsLocale);
    if (Locale.isIslamic(locale.name)) {
      event.startsLocale = formatDate(Locale.gregorianToUmalqura(startsLocale));
    }
    event.startsHourLocale = formatDate(startsLocale, { date: 'hour' });

    if (Array.isArray(startsLocale)) {
      event.startsHour = parseFloat(startsLocale[3] +
        (startsLocale[4] / 60));
    } else {
      event.startsHour = parseFloat(startsLocale.getHours() +
        (startsLocale.getMinutes() / 60));
    }
  }
  if (event.ends) {
    const endsLocale = parseDate(event.ends);
    event.endsLocale = formatDate(endsLocale);
    if (Locale.isIslamic(locale.name)) {
      event.endsLocale = formatDate(Locale.gregorianToUmalqura(endsLocale));
    }
    event.endsHourLocale = formatDate(endsLocale, { date: 'hour' });

    if (Array.isArray(endsLocale)) {
      event.endsHour = parseFloat(endsLocale[3] +
        (endsLocale[4] / 60));
    } else {
      event.endsHour = parseFloat(endsLocale.getHours() +
        (endsLocale.getMinutes() / 60));
    }
  }
  event.eventTypes = eventTypes;
  event.isAllDay = event.isAllDay.toString();
  if (event.isAllDay.toString() === 'false') {
    delete event.isAllDay;
  }

  if (!event.isAllDay && event.durationHours >= 24) {
    event.isAllDay = false;
    event.durationUnits = translate('Hours');
    event.isDays = false;
    delete event.duration;
  }

  // Duration in time
  if (event.starts && event.ends) {
    const diffInSeconds = this.timeDiffInSeconds(parseDate(event.starts), parseDate(event.ends));
    event.durationInTime = this.timeBySeconds(diffInSeconds);
  } else if (event.durationInTime) {
    delete event.durationInTime;
  }

  return event;
};

/**
 * Get difference between two dates in seconds.
 * @private
 * @param {number} starts The starts date
 * @param {number} ends The ends date
 * @returns {number} The calculated difference in seconds.
 */
calendarShared.timeDiffInSeconds = function timeDiffInSeconds(starts, ends) {
  const diff = Math.abs(ends.getTime() - starts.getTime()); // in miliseconds
  return Math.ceil(diff / 1000); // in seconds
};

/**
 * Get time object, days, hours, minutes and seconds by given total seconds.
 * @private
 * @param {number} seconds The total seconds
 * @returns {object} The time with hours and minutes.
 */
calendarShared.timeBySeconds = function timeBySeconds(seconds) {
  seconds = Number(seconds);
  return {
    days: Math.floor(seconds / (3600 * 24)),
    hours: Math.floor(seconds % (3600 * 24) / 3600),
    minutes: Math.floor(seconds % 3600 / 60),
    seconds: Math.floor(seconds % 60)
  };
};

/**
 * Formate the time string for hours and minutes to given event data.
 * @private
 * @param {object} event The event data
 * @param {object} locale The locale instance to use
 * @param {object} language The language instance to use
 * @returns {void}
 */
calendarShared.formateTimeString = function formateTimeString(event, locale, language) {
  if (event.durationInTime) {
    const translate = str => Locale.translate(str, { locale: locale.name, language });
    const d = event.durationInTime;
    let text = '';
    if (d.days) {
      const label = translate(d.days > 1 ? 'Days' : 'Day');
      text += `${d.days} ${label}`;
    }
    if (d.hours) {
      const label = translate(d.hours > 1 ? 'Hours' : 'Hour');
      if (d.days) {
        text += `${d.minutes || d.seconds ? ', ' : ` ${translate('And')} `}`;
      }
      text += `${d.hours} ${label}`;
    }
    if (d.minutes) {
      const label = translate(d.minutes > 1 ? 'Minutes' : 'Minute');
      if (d.days || d.hours) {
        text += `${d.seconds ? ', ' : ` ${translate('And')} `}`;
      }
      text += `${d.minutes} ${label}`;
    }
    if (d.seconds) {
      const label = translate(d.seconds > 1 ? 'Seconds' : 'Second');
      text += `${d.days || d.hours || d.minutes ? ` ${translate('And')} ` : ''}`;
      text += `${d.seconds} ${label}`;
    }
    if (text !== '') {
      event.duration = '';
      event.durationUnits = '';
      event.durationHours = text;
    }
  }
};

/**
 * Find the matching type and get the color.
 * @param {object} id The eventType id to find.
 * @param {object} eventTypes The event types to use
 * @returns {object} The Calendar prototype, useful for chaining.
 */
calendarShared.getEventTypeColor = function getEventTypeColor(id, eventTypes) {
  let color = 'azure';
  if (!id) {
    return color;
  }

  const eventInfo = eventTypes.filter(eventType => eventType.id === id);
  if (eventInfo.length === 1) {
    color = eventInfo[0].color || 'azure';
  }
  return color;
};

/**
 * Fix missing / incomlete event data
 * @param {object} event The event object with common event properties.
 * @param {boolean} addPlaceholder If true placeholder text will be added for some empty fields.
 * @param {date} currentDate Active date in the calendar.
 * @param {object} locale The locale to use.
 * @param {string} language The language to use.
 * @param {array} events The events array.
 * @param {array} eventTypes The event types array.
 * @private
 */
calendarShared.cleanEventData = function cleanEventData(
  event,
  addPlaceholder,
  currentDate,
  locale,
  language,
  events,
  eventTypes,
) {
  const formatDateOptions = { pattern: 'yyyy-MM-ddTHH:mm:ss.SSS', locale: locale.name };
  const formatDate = d => Locale.formatDate(d, formatDateOptions);
  const parseDate = (d, o) => Locale.parseDate(d, utils.extend(true, { locale: locale.name }, o));
  const isAllDay = event.isAllDay === 'on' || event.isAllDay === 'true' || event.isAllDay;
  let startDate = currentDate;
  let endDate = currentDate;

  if (event.startsLocale && event.endsLocale) {
    startDate = new Date(parseDate(event.startsLocale));
    endDate = new Date(parseDate(event.endsLocale));
  }

  if (typeof event.starts === 'string' && !event.startsLocale) {
    startDate = new Date(event.starts);
  }

  if (typeof event.ends === 'string' && !event.endsLocale) {
    endDate = new Date(event.ends);
  }

  if (!Locale.isValidDate(startDate)) {
    startDate = currentDate;
  }
  if (!Locale.isValidDate(endDate)) {
    endDate = currentDate;
  }

  if (isAllDay) {
    startDate.setHours(0, 0, 0, 0);
    event.starts = formatDate(new Date(startDate));
    endDate.setHours(23, 59, 59, 999);
    event.ends = formatDate(new Date(endDate));
    event.duration = event.starts === event.ends ? 1 : null;
    event.isAllDay = true;
  } else {
    if (startDate === endDate) {
      endDate.setHours(endDate.getHours() + parseInt(event.durationHours, 10));
      event.ends = formatDate(env.browser.name === 'safari' ? endDate : endDate.toISOString());
      event.duration = null;
    } else if (event.endsHourLocale && event.startsHourLocale) {
      const startsHours = parseDate(event.startsHourLocale, { date: 'hour' });
      const endsHours = parseDate(event.endsHourLocale, { date: 'hour' });
      startDate.setHours(
        startsHours.getHours(),
        startsHours.getMinutes(),
        startsHours.getSeconds(),
        startsHours.getMilliseconds()
      );
      endDate.setHours(
        endsHours.getHours(),
        endsHours.getMinutes(),
        endsHours.getSeconds(),
        endsHours.getMilliseconds()
      );
      if (env.browser.name === 'safari') {
        event.starts = formatDate(startDate);
        event.ends = formatDate(endDate);
      } else {
        event.starts = formatDate(startDate.toISOString());
        event.ends = formatDate(endDate.toISOString());
      }
      event.duration = dateUtils.dateDiff(new Date(event.starts), new Date(event.ends));
    } else {
      event.ends = formatDate(new Date(endDate));
    }
    event.starts = formatDate(new Date(startDate));
    event.isAllDay = false;
  }

  if (event.comments === undefined && addPlaceholder) {
    event.comments = Locale.translate('NoCommentsEntered', { locale: locale.name, language });
    event.noComments = true;
  }

  if (!event.subject && addPlaceholder) {
    event.subject = Locale.translate('NoTitle', { locale: locale.name, language });
  }

  if (!event.type) {
    // Default to the first one
    event.type = eventTypes[0].id;
  }

  if (event.id === undefined && addPlaceholder) {
    const lastId = events.length === 0 ? 0 : parseInt(events[events.length - 1].id, 10);
    event.id = (lastId + 1).toString();
  }

  if (event.title === 'NewEvent') {
    event.title = Locale.translate('NewEvent', { locale: locale.name, language });
  }
};

export { calendarShared }; //eslint-disable-line
