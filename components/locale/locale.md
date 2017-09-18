
# Locale  [Learn More](#)

## Configuration Options

1. Simple Number Example [View Example]( ../components/locale/test-locale)


{{api-details}}


## Code Example - Initializing

The Locale component is used in many of the components to handle localization  18n use cases. The current locale api handles: number conversion, translation, Right To Left, Arabic Calendar, and Gregorian Calendar.

The first and main step is to initialize the locale. This can be done via the initializer or manually with a locale call.

```javascript

$('body').initialize('en-US');
// or....
Locale.set('es-ES');


```

## Code Example - Translation

We have a number of internal strings that are used in the components. These can be extended and used by applications. Keep in mind that the set function must fetch the locale file from the server so it is asynchronous.

```javascript

Locale.set('es-ES').done(function () {
  Locale.translate('Cancel');
  // Returns Cancelar
});


```

## Code Example - Numbers

You can use the formatNumber to display a numeric type in a localized format. You can use parseNumber to convert that number back to the numeric type.

```javascript

Locale.formatNumber(20.1, {style: 'decimal', round: true, minimumFractionDigits: 2}));
// Returns 20.10


```

## Number Format Patterns

The formatNumber accepts a numberFormat object with formatting information. For example:

```javascript

numberFormat: {minimumFractionDigits: 3, maximumFractionDigits: 3}

```

The following options are supported:
- **style** - Can be `decimal` or `integer` or `currency`. Formats the number with the group, decimal or adds the current currency symbol in the right location.
- **maximumFractionDigits** - An integer representing the max number of decimal values before rounding / truncation
- **minimumFractionDigits** - An integer representing the min number of decimal values before adding zero's for padding.
- **round** - If true the number is rounded up / down rather than truncated


## Code Example - Dates

You can use the formatDate to display a date type in a localized format. You can use parseDate to convert that string back to the date type.


```javascript

Locale.formatDate(newDate());


```

## Date and Time Format Patterns

A date format can be constructed by adding the needed date and time parts. For example `yyyy-MM-DD HH:mm`. The following parts can be used.

- dd - Shows the date portion padded with zeros
- d - Shows the date portion un-padded
- yyyy - Shows the year in 4 digit format. This should always be used.
- yy - Shows the year in 2 digit format. If used this will be converted to 4 digit format
- hh - Shows the time hours in 12 hour format with padding.
- h - Shows the time hours in 12 hour format without padding.
- HH - Shows the time in 24 hour format with padding
- H - Shows the time in 24 hour format without padding
- a - Shows the am/pm part of the time.
- mm - Shows the minute portion of the time
- ss - Shows the seconds portion of the time
- SSS - Shows the milliseconds portion of the time
- MMMM - Shows the month in wide format (For example August)
- MMM - Shows the month in abbreviated format (For example Aug, Mar, Sept)
- MM - Shows the month in numeric format padded
- MM - Shows the month in numeric format unpadded
- EEEE - Shows the date of the week in wide format (Monday, Tuesday ect)


## Currently Supported Locales

There are 50 supported locales. [Components](http://git.infor.com/projects/SOHO/repos/controls/browse/components/locale/cultures)

## Upgrading from 3.X

-  Replaces Globalize utilities.
