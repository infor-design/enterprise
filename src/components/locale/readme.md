---
title: Locale
description: Handles i18n use cases like dates, numbers, calendars, translation and right to left.
demo:
  pages:
  - name: Timezones in Timestamp Fields
    slug: test-timezones
  - name: Unicode Support
    slug: test-unicode-language
---

## Code Example - Initializing

The Locale component is used in many of the components to handle localization and i18n use cases. The locale api handles dates and number, translation, right to left, arabic calendar, and gregorian calendar.

The first and main step is to initialize the locale when your application starts. This can be done either by passing a locale to the global initializer or by making a call to `Soho.Locale.set`.

```javascript
$('body').initialize('es-ES');
// or....
Soho.Locale.set('es-ES');
```

## Code Example - Translation

We have a number of internal strings that are used within the components. These can be extended and used by applications. Keep in mind that the `Soho.Locale.set` function will fetch a locale js file from the server when called.

```javascript
Soho.Locale.set('es-ES').done(function() {
    Soho.Locale.translate('Cancel');
    // Returns Cancelar
});
```

By default, it will fetch the JS files on your server from the `cultures/` folder that is assumed to be in the same location as `sohoxi.js`. However, this can be adjusted by using SohoConfig:

```javascript
SohoConfig.culturesPath = 'myserver/path/cultures/';
```

## Code Example - Using minified files

IDS ships with a minified set of Culture files.  To configure the Locale system to pull in these files instead of the uncompressed ones, you can use SohoConfig:

```javascript
SohoConfig.minifyCultures = true;
```

## Code Example - Using a different Language and Locale

It is possible to use the translation strings in another language, independently of the locale settings for date and numbers ect. to do this just call the `setLanguage` api function. As with the `set` function if the locale with the strings is not loaded there may be a delay while the script is loaded in. So use the callback `done` function before initializing components or using the strings.

```javascript
Soho.Locale.set('en-US');
Soho.Locale.setLanguage('da').done(function() => {
    Locale.translate('Actions'); // Returns 'Handlinger'
});
```

## Code Example - Getting a translation from the non current language

It is possible to use the translation strings in another language, independently of the locale or language setting. To do this just call the `getLocale` api function to ensure the data is loaded. When it is you can call `translate` with a different language tag without changing the current language.

```javascript
Soho.Locale.set('en-US');
Soho.Locale.setLanguage('da').done(function() => {
    Locale.translate('Actions'); // Returns 'Handlinger'
});
Soho.Locale.getLocale('de-DE').done(function() => {
    Locale.translate('Actions', { language: 'de' }); // Returns 'Aktionen'
});
```

## Code Example - Extending a Locale/Language with your own strings

It is possible to add your own strings to an existing locale's language. To do this just set the locale or language to the desired language and then when the locale is loaded call `extendTranslations` with a new set of strings. A string is an object with minimum an id and value of the string.

```javascript
Locale.set('it-lT').done(() => {
    const myStrings = {
        Thanks: { id: 'Thanks', value: 'Grazie', comment: '' },
        YourWelcome: { id: 'YourWelcome', value: 'Prego', comment: '' }
    };

    Locale.extendTranslations(Locale.currentLanguage.name, myStrings);
    Locale.translate('Comments');    // Returns Commenti
    Locale.translate('Thanks');      // Returns Grazie
    Locale.translate('YourWelcome'); // Returns Prego
});
```

## Code Example - Adding an entirely new Locale

It is possible to add a new locale that is not supported by Infor (yet). To do this you need to make a new file like <a href="https://github.com/infor-design/enterprise/tree/master/src/components/locale/cultures" target="_blank">any of these locales</a> and place this file in your cultures folder on the server. You also need to add the new locale to the `defaultLocales` and `supportedLocales` sets. Then you can use it. If you do this consider making a Pull Request to get your new locale added to the core code for others.

```javascript
Locale.defaultLocales.push({ lang: 'la', default: 'la-IT' });
Locale.supportedLocales.push('la-IT');

Locale.set('la-lT').done(function() {
    Locale.translate('Comments');
});
```

## Code Example - Unicode Support

We have limited support for Chinese Financial Numbers (Traditional and Simplified), Chinese Simplified and Traditional (normal), Hindi (Devangari), Arabic as these are in the set of supported languages. ou can now type them in certain mask fields and do some conversion to and from. Support is initially limited and could use some native speaker testing in the wild to improve this feature. To convert to a language we use the browser `toLocaleString` which we have wrapped. This may not work in all browsers and means you may need to use special locales to work with this.

```javascript
Locale.toLocaleString(2019, 'ar-SA'); // ٢٬٠١٩
Locale.toLocaleString(2019, 'zh-Hans-CN-u-nu-hanidec'); // 二,〇一九
```

To convert from a Chinese/Arabic/Hindi number we added a function to convert the numbers to english numbers.

```javascript
Locale.convertNumberToEnglish('١٢٣٤٥٦٧٨٩٠');        // Arabic to 1234567890
Locale.convertNumberToEnglish('壹貳叄肆伍陸柒捌玖零'); // Chinese Financial to 1234567890
Locale.convertNumberToEnglish('一二三四五六七八九零'); // Chinese Simplified to 1234567890
Locale.convertNumberToEnglish('१२३४५६७८९०');         // Devangari to 1234567890
```

## Code Example - Numbers

You can use the formatNumber to display a numeric type in a localized format. You can use parseNumber to convert that number back to the numeric type. Note that by default the formatNumber function uses truncation (.129 becomes .12). To use rounding add the `round: true` option.

```javascript
Soho.Locale.formatNumber(20.1, {style: 'decimal', round: true, minimumFractionDigits: 2}));
// Returns 20.10
Soho.Locale.formatNumber(5.1, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
// Returns 5.10
Soho.Locale.formatNumber(12345.12, {
    style: 'currency',
    decimal: '.',
    group: ',',
    currencyFormat: '¤ ###',
    currencySign: '$'
}));
// Returns $ 12,345.12
```

If you have a formatted number you can convert it back to a number object with the opposite function parseNumber. This function takes no additional arguments but it may need to make assumptions based on locale settings in the current locale.

```javascript
Soho.Locale.parseNumber('$12,345.13')
// Returns 12345.13
Soho.Locale.parseNumber('1,234,567,890.12346')
// Returns 1234567890.12346
```

## Code Example - Number Group Sizes

You can control the use of group sizes on number formatting. By default the groups size should be correct for your current locale but you can set it to something other than the default.

```javascript
Locale.set('nl-NL'); // Usually groupSizes: [3, 3]
Locale.formatNumber(1234567.1234, { groupSizes: [3, 0] }); //1234.567,123
Locale.formatNumber(1234567.1234, { group: '' }); // No Group size shown resulting in 1234567,123
```

## Code Example - Parsing Numbers in a non current locale

It is possible to call `parseNumber` or `formatNumber` to handle numbers without changing the current locale. To do this just call the `getLocale` api function to ensure the data is loaded. When it is you can call `parseNumber` or `formatNumber` with a different locale tag without changing the current locale.

```javascript
Soho.Locale.set('en-US');
Locale.getLocale('nl-NL').done(function() {
    Locale.formatNumber(123456789.1234, { locale: 'en-US' }); // 123456,789.123
    Locale.formatNumber(123456789.1234, { locale: 'nl-NL' }); // 123456,789.123
});

Locale.getLocale('nl-NL').done(function() {
    Locale.parseNumber('1.123', { locale: 'nl-NL' });          // 1123
    Locale.parseNumber('€123456.789,12', { locale: 'nl-NL' }); // 123456789.12
});
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
- `currencyFormat` - You can specify a currencyFormat to use, otherwise it uses the current one for the locale. The ¤ is where the currencySign will go. ### is used for the number replacement.
- `groupSize` - You can specify where the thousands group separators will be placed. For example `[3, 0]` means that only the first group will have a separator: 1234,567. `[3, 2]` means the first group will have 3 digits and the other groups will all have 2, for example 12,34,567. The default for many locales is `[3, 3]`.

## Code Example - Dates

You can use the formatDate to display a date type in a localized format. You can use parseDate to convert that string back to the date type.

```javascript
Soho.Locale.formatDate(new Date());
// Returns 10/18/2018 for en-US
Soho.Locale.formatDate(new Date(), { pattern: 'd/M/yyyy h:mm:ss a' });
// Returns 18/10/2018 12:30:30 PM
Soho.Locale.formatDate(new Date(), { date: 'long' });
// Returns November 8, 2000
```

If you have a formatted date you can convert it back to a date object with the opposite function parseDate. This function needs to know the format being used or it will parse it to the current short date format

```javascript
Soho.Locale.parseDate('2014-12-11', 'yyyy-MM-dd')
// Returns date object
Soho.Locale.parseDate('10/28/2015 12:00:00 AM', 'M/d/yyyy h:mm:ss a')
// Returns date object
```

## Code Example - Parsing Dates in a non current locale

It is possible to call `parseDate` or `formatDate` to handle dates without changing the current locale. To do this just call the `getLocale` api function to ensure the data is loaded. When it is you can call `parseDate` or `formatDate` with a different locale tag without changing the current locale.

```javascript
Soho.Locale.set('en-US');
Soho.Locale.getLocale('nl-NL').done(function() {
    Locale.formatDate(new Date(2019, 5, 8), { date: 'short', locale: 'nl-NL' })); // 08-06-2019
});

Soho.Locale.getLocale('es-ES').done(function() {
    Soho.Locale.parseDate('Noviembre de 2019', { date: 'year', locale: 'es-ES' }); // 2019-11-01 as a Date
});
```

## Date format settings

The formatDate function accepts a dateFormat object with formatting information. For example:

```javascript
dateFormat: { pattern: 'yyyy/MM/dd', fromGregorian: true })
```

The following options are supported:

- `pattern` - You can specify a specific date pattern to use.
- `fromGregorian` - When using an arabic format, the date will first be converted to umalqura when specifying this option.
- `date` - This can be 'short', 'medium', 'long' or 'timestamp' and will return the current locales format for the corresponding length of the date. <a href="https://github.com/infor-design/enterprise/blob/master/src/components/locale/cultures/en-US.js#L15" target="_blank">Other examples can be found here</a>

## Date and Time Format Patterns

A date format can be constructed by adding the needed date and time parts. For example `yyyy-MM-DD HH:mm`. In formatting dates and numbers we use a variation on the CLDR formats http://cldr.unicode.org/translation/date-time-1/date-time The following parts can be used:

- `dd` - Shows the date portion padded with zeros
- `d` - Shows the date portion un-padded
- `yyyy` - Shows the year in 4 digit format. This should always be used.
- `yy` - Shows the year in 2 digit format. If used this will be converted to 4 digit format
- `hh` - Shows the time hours in 12 hour format with padding.
- `h` - Shows the time hours in 12 hour format without padding.
- `HH` - Shows the time in 24 hour format with padding
- `H` - Shows the time in 24 hour format without padding
- `a` - Shows the am/pm part of the time.
- `mm` - Shows the minute portion of the time
- `ss` - Shows the seconds portion of the time
- `SSS` - Shows the milliseconds portion of the time
- `zz` - Shows the short time zone name for example EST  in the current locale`s language.
- `zzzz` - Shows the long time zone name for example Eastern Standard Time in the current locale`s language.
- `MMMM` - Shows the month in wide format (For example August)
- `MMM` - Shows the month in abbreviated format (For example Aug, Mar, Sept)
- `MM` - Shows the month in numeric format padded
- `M` - Shows the month in numeric format unpadded
- `EEEE` - Shows the date of the week in wide format (Monday, Tuesday ect)

## Timezones

The formatDate function also supports displaying timezones in the current language. This feature uses browser based timezone functions and is not supported in IE11, this will fall back to the current browser timezone. It will work in all other modern browsers. You can either use the timezone pattern with a date pattern or use the built in patterns for each locale in long or short form `timezone` and `timezoneLong`. If using a custom pattern be sure to include the time pattern as well or it wont make much sense.

```javascript
Soho.Locale.formatDate(new Date(), {pattern: 'dd-MM-yyyy HH:mm zz'});
// 26-02-2019 14:08 EST
Soho.Locale.formatDate(new Date(), {pattern: 'dd-MM-yyyy HH:mm zzzz'});
// 26-02-2019 14:08 Eastern Standard Time
Soho.Locale.formatDate(new Date(2018, 2, 22, 20, 11, 12), { date: 'timezone' });
// 22-03-2000 20:11 EST
Soho.Locale.formatDate(new Date(2018, 2, 22, 20, 11, 12), { date: 'timezoneLong' });
// 22-03-2000 20:11 Eastern Standard Time
```

`Soho.Locale.parseDate` can also accept a string date and convert it to a date object. This function needs to use the current locale to do this so it will only work if the timezone names are on the current locale.

You can also show readonly timezones in the datagrid with the `dateFormat` column option. It is not possible to edit timezones. For example:

```javascript
columns.push({ id: 'orderDate', name: 'Raw Format', field: 'orderDate'});
columns.push({ id: 'orderDate', name: 'Short Timezone (Locale)', field: 'orderDate', formatter: Soho.Formatters.Date, dateFormat: { date: 'timezone' }});
columns.push({ id: 'orderDate', name: 'Long Timezone (Locale)', field: 'orderDate', formatter: Soho.Formatters.Date, dateFormat: { date: 'timezoneLong' }});
columns.push({ id: 'orderDate', name: 'Short Timezone (Custom)', field: 'orderDate', formatter: Soho.Formatters.Date, dateFormat: 'dd-MM-yyyy HH:mm zz'});
columns.push({ id: 'orderDate', name: 'Long Timezone (Custom)', field: 'orderDate', formatter: Soho.Formatters.Date, dateFormat: 'dd-MM-yyyy HH:mm zz'});
```

## Currently Supported Locales

For a list of all the supported components see the <a href="https://github.com/infor-design/enterprise/tree/master/src/components/locale/cultures" target="_blank">local component source</a>.

## Upgrading from 3.X

Replaces Globalize utilities.
