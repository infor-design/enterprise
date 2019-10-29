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
    event.startsHour = parseFloat(new Date(event.starts).getHours() +
      (new Date(event.starts).getMinutes() / 60));
  }
  if (event.ends) {
    const endsLocale = Locale.parseDate(event.ends, { pattern: 'yyyy-MM-ddTHH:mm:ss.SSS', locale: locale.name });
    event.endsLocale = Locale.formatDate(endsLocale, { locale: locale.name });
    event.endsHour = parseFloat(new Date(event.ends).getHours() +
      (new Date(event.ends).getMinutes() / 60));
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

export { calendarShared }; //eslint-disable-line
