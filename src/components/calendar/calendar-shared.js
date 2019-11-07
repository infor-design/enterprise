import { Locale } from '../locale/locale';
import { dateUtils } from '../../utils/date';

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
  event.color = this.getEventTypeColor(event.type, eventTypes);
  event.duration = Math.abs(dateUtils.dateDiff(
    new Date(event.ends),
    new Date(event.starts),
    false,
    event.isFullDay
  ));
  event.durationUnits = event.duration > 1 ? Locale.translate('Days', { locale: locale.name, language }) : Locale.translate('Day', { locale: locale.name, language });
  event.daysUntil = event.starts ? dateUtils.dateDiff(new Date(event.starts), new Date()) : 0;
  event.durationHours = dateUtils.dateDiff(new Date(event.starts), new Date(event.ends), true);
  event.isDays = true;
  if (event.isAllDay === undefined) {
    event.isAllDay = true;
  }

  if (event.durationHours < 24) {
    event.isDays = false;
    event.isAllDay = false;
    delete event.duration;
    event.durationUnits = event.durationHours > 1 ? Locale.translate('Hours', { locale: locale.name, language }) : Locale.translate('Hour', { locale: locale.name, language });
  }
  if (event.isAllDay.toString() === 'true') {
    event.isDays = true;
    delete event.durationHours;
    event.durationUnits = event.duration > 1 ? Locale.translate('Days', { locale: locale.name, language }) : Locale.translate('Day', { locale: locale.name, language });
    event.duration = dateUtils.dateDiff(new Date(event.starts), new Date(event.ends));
  }
  if (event.duration === 0 && event.isAllDay.toString() === 'true') {
    event.isDays = true;
    event.duration = 1;
    event.durationUnits = Locale.translate('Day', { locale: locale.name, language });
  }
  if (event.starts) {
    const startsLocale = Locale.parseDate(event.starts, { pattern: 'yyyy-MM-ddTHH:mm:ss.SSS', locale: locale.name });
    event.startsLocale = Locale.formatDate(startsLocale, { locale: locale.name });
    event.startsHourLocale = Locale.formatDate(startsLocale, { date: 'hour', locale: locale.name });

    if (Array.isArray(startsLocale)) {
      event.startsHour = parseFloat(startsLocale[3] +
        (startsLocale[4] / 60));
    } else {
      event.startsHour = parseFloat(startsLocale.getHours() +
        (startsLocale.getMinutes() / 60));
    }
  }
  if (event.ends) {
    const endsLocale = Locale.parseDate(event.ends, { pattern: 'yyyy-MM-ddTHH:mm:ss.SSS', locale: locale.name });
    event.endsLocale = Locale.formatDate(endsLocale, { locale: locale.name });
    event.endsHourLocale = Locale.formatDate(endsLocale, { date: 'hour', locale: locale.name });

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
  return event;
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
 * @param {string} language The langauge to use.
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
  const isAllDay = event.isAllDay === 'on' || event.isAllDay === 'true' || event.isAllDay;
  let startDate = new Date(Locale.parseDate(event.startsLocale, { locale: locale.name }));
  let endDate = new Date(Locale.parseDate(event.endsLocale, { locale: locale.name }));

  if (!Locale.isValidDate(startDate)) {
    startDate = currentDate;
  }
  if (!Locale.isValidDate(endDate)) {
    endDate = currentDate;
  }

  if (isAllDay) {
    startDate.setHours(0, 0, 0, 0);
    event.starts = Locale.formatDate(new Date(startDate), { pattern: 'yyyy-MM-ddTHH:mm:ss.SSS', locale: locale.name });
    endDate.setHours(23, 59, 59, 999);
    event.ends = Locale.formatDate(new Date(endDate), { pattern: 'yyyy-MM-ddTHH:mm:ss.SSS', locale: locale.name });
    event.duration = event.starts === event.ends ? 1 : null;
    event.isAllDay = true;
  } else {
    if (startDate === endDate) {
      endDate.setHours(endDate.getHours() + parseInt(event.durationHours, 10));
      event.ends = Locale.formatDate(endDate.toISOString(), { pattern: 'yyyy-MM-ddTHH:mm:ss.SSS', locale: locale.name });
      event.duration = null;
    } else if (event.endsHourLocale && event.startsHourLocale) {
      const startsHours = Locale.parseDate(event.startsHourLocale, { date: 'hour', locale: locale.name });
      const endsHours = Locale.parseDate(event.endsHourLocale, { date: 'hour', locale: locale.name });
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
      event.starts = Locale.formatDate(startDate.toISOString(), { pattern: 'yyyy-MM-ddTHH:mm:ss.SSS', locale: locale.name });
      event.ends = Locale.formatDate(endDate.toISOString(), { pattern: 'yyyy-MM-ddTHH:mm:ss.SSS', locale: locale.name });
      event.duration = dateUtils.dateDiff(new Date(event.starts), new Date(event.ends));
    } else {
      event.ends = Locale.formatDate(new Date(endDate), { pattern: 'yyyy-MM-ddTHH:mm:ss.SSS', locale: locale.name });
    }
    event.starts = Locale.formatDate(new Date(startDate), { pattern: 'yyyy-MM-ddTHH:mm:ss.SSS', locale: locale.name });
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
    const lastId = this.settings.events.length === 0
      ? 0
      : parseInt(this.settings.events[this.settings.events.length - 1].id, 10);
    event.id = (lastId + 1).toString();
  }

  if (event.title === 'NewEvent') {
    event.title = Locale.translate('NewEvent', { locale: locale.name, language });
  }
};

export { calendarShared }; //eslint-disable-line
