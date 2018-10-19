---
title: Locale
description: This page describes Locale.
---

## Code Example - Initializing

The Locale component is used in many of the components to handle localization and i18n use cases. The locale api handles number conversion, translation, right to left, arabic calendar, and gregorian calendar.

The first and main step is to initialize the locale when your application starts. This can be done either by passing a local to the global initializer or by making a locale call.

```javascript
$('body').initialize('es-ES');
// or....
Locale.set('es-ES');
```

## Code Example - Translation

We have a number of internal strings that are used within the components. These can be extended and used by applications. Keep in mind that the set function will fetch the locale file from the server when the locale is set.

```javascript
Locale.set('es-ES').done(function () {
  Locale.translate('Cancel');
  // Returns Cancelar
});
```

By default when setting the locale it will fetch the files on your server from the cultures folder that should be in the same location as the sohoxi.js script. But this can be adjusted by setting `SohoConfig.culturesPath = 'myserver/path/cultures/`

## Code Example - Numbers

You can use the formatNumber to display a numeric type in a localized format. You can use parseNumber to convert that number back to the numeric type. Note that by default the formatNumber function uses truncation (.129 becomes .12). To use rounding add the `round: true` option.

```javascript
Locale.formatNumber(20.1, {style: 'decimal', round: true, minimumFractionDigits: 2}));
// Returns 20.10
Locale.formatNumber(5.1, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
// Returns 5.10
Locale.formatNumber(12345.12, {
      style: 'currency',
      decimal: '.',
      group: ',',
      currencyFormat: '¤ #,##0.00',
      currencySign: '$'
    }));
// Returns $ 12,345.12
```

If you have a formatted number you can convert it back to a number object with the opposite function parseNumber. This function takes no additional arguments.

```javascript
Locale.parseNumber('$12,345.13')
// Returns 12345.13
Locale.parseNumber('1,234,567,890.12346')
// Returns 1234567890.12346
```

## Number Format Patterns

The formatNumber function accepts a numberFormat object with formatting information. For example:

```javascript
numberFormat: {minimumFractionDigits: 3, maximumFractionDigits: 3}
```

The following options are supported:

- `style` - Can be `decimal` or `integer` or `currency`. Formats the number with the group, decimal or adds the current currency symbol in the right location.
- `maximumFractionDigits` - An integer representing the max number of decimal values before rounding / truncation
- `minimumFractionDigits` - An integer representing the min number of decimal values before adding zero's for padding.
- `round` - If true the number is rounded up / down rather than truncated
- `currencySign` - You can specify a specific sign to use for currency, otherwise it uses the default one for the current locale.
- `decimal` - You can specify a specific character to use for the decimal point, otherwise it uses the default one for the current locale.
- `group` - You can specify a specific character to use for the number group (usually 1000s), otherwise it uses the default one for the current locale.
- `currencyFormat` - You can specify a specific currencyFormat to use, otherwise it uses the current one for the local. The ¤ is where the currencySign will go. # is used for the numbers, and the max decimals can be specified with 0's.

## Code Example - Dates

You can use the formatDate to display a date type in a localized format. You can use parseDate to convert that string back to the date type.

```javascript
Locale.formatDate(new Date());
// Returns 10/18/2018 for en-US
Locale.formatDate(new Date(), { pattern: 'd/M/yyyy h:mm:ss a' });
// Returns 18/10/2018 12:30:30 PM
Locale.formatDate(new Date(), { date: 'long' });
// Returns November 8, 2000
```

If you have a formatted date you can convert it back to a date object with the opposite function parseDate. This function needs to know the format being used or it will parse it to the current short date format

```javascript
Locale.parseDate('2014-12-11', 'yyyy-MM-dd')
// Returns date object
Locale.parseDate('10/28/2015 12:00:00 AM', 'M/d/yyyy h:mm:ss a')
// Returns date object
```

## Date format settings

The formatDate function accepts a dateFormat object with formatting information. For example:

```javascript
dateFormat: { pattern: 'yyyy/MM/dd', fromGregorian: true })
```

The following options are supported:

- `pattern` - You can specify a specific date pattern to use.
- `fromGregorian` - When using an arabic format, the date will first be converted to umalqura when specifying thie option.
- `date` - This can be 'short', 'medium', 'long' or 'timestamp' and will return the current locales format for the corresponding length of the date. [Other examples can be found here](https://github.com/infor-design/enterprise/blob/master/src/components/locale/cultures/en-US.js#L15)

## Date and Time Format Patterns

A date format can be constructed by adding the needed date and time parts. For example `yyyy-MM-DD HH:mm`. The following parts can be used.

- 'dd` - Shows the date portion padded with zeros
- 'd` - Shows the date portion un-padded
- 'yyyy` - Shows the year in 4 digit format. This should always be used.
- 'yy` - Shows the year in 2 digit format. If used this will be converted to 4 digit format
- 'hh` - Shows the time hours in 12 hour format with padding.
- 'h` - Shows the time hours in 12 hour format without padding.
- 'HH` - Shows the time in 24 hour format with padding
- 'H` - Shows the time in 24 hour format without padding
- 'a` - Shows the am/pm part of the time.
- 'mm` - Shows the minute portion of the time
- 'ss` - Shows the seconds portion of the time
- 'SSS` - Shows the milliseconds portion of the time
- 'MMMM` - Shows the month in wide format (For example August)
- 'MMM` - Shows the month in abbreviated format (For example Aug, Mar, Sept)
- 'MM` - Shows the month in numeric format padded
- 'MM` - Shows the month in numeric format unpadded
- 'EEEE` - Shows the date of the week in wide format (Monday, Tuesday ect)

## Currently Supported Locales

For a list of all the supported components see the [locale component source](https://github.com/infor-design/enterprise/tree/master/src/components/locale/cultures).

## Upgrading from 3.X

Replaces Globalize utilities.
