
# Locale  [Learn More](#)

{{api-details}}

## Configuration Options

1. Simple Number Example [View Example]( ../components/rating/example-index)

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

We have a number of internal strings that are used in the components. These can be extended and used by applications. Keep in mind that the set function must fetch the locale file from the server so it is asynchronous.

```javascript

Locale.formatNumber(20.1, {style: 'decimal', round: true, minimumFractionDigits: 2}));
// Returns 20.10


```

## Currently Supported Locales

There are 50 supported locales. [Components](http://git.infor.com/projects/SOHO/repos/controls/browse/components/locale/cultures)

## Upgrading from 3.X

-  Replaces Globalize utilities.
