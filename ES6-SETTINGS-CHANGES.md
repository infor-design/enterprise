# Changes to Options/Settings during ES6 Conversions

Various changes are being made to the way Soho components internally handle settings during the ES6 conversion:

## Usage of the term 'settings' versus the term 'options'

We used to interchangeably use the terms `settings` and `options` throughout the code.  We've determined that we're going to normalize the usage `settings` throughout.  All component prototypes currently store a copy of settings internally as `this.settings`, so we've normalized this term as the correct usage.

### Soho Components' `updated()` method

In the `v4.3.x` versions of Soho, the preferred method of updating components with new settings would be to re-run the jQuery constructor with those new settings.  Settings were then handled by the jQuery constructor accordingly.

In our push to slowly decouple our project from a jQuery-specific environment, we've begun handling settings at the Vanilla-JS level.  Vanilla-JS constructors and their `updated()` methods have all been reworked to accept a settings argument, which will be applied on top of current component settings if provided.  This ensures that using either jQuery and Vanilla-JS will still propagate settings the same way.

## Always take into account settings defined at the HTML level

Finally, some components used to, internally, manage the propagation of settings that were defined on their base elements via a `data-options` property.  Many of our components did not do this internally, and would rely on an Application Developer to be using Soho's `initialize.js` to handle this task.

It's become apparent over time that it's not safe for us to count on teams implementing our initializer, for various reasons.  This means that these specific teams may never have had the capability to grab settings from HTML elements before.

There's now a function in `/components/utils/utils.js` called `mergeSettings()`, which replaces our usage of `$.extend()` for handling the building of settings objects.  This method can optionally take an HTMLElement or jQuery-wrapped collection of elements as a first argument.  If the argument's provided, the element will be checked for a `data-options` attribute, eventually parsed by `parseOptions()` if it's found.

## Conversion of Settings functions to Objects

Some components were previously handling the conversion of a `settings` function (not Object) into an Object before the settings were ever passed to the vanilla-JS constructor.  For the sake of consistency, we've removed this functionality in favor of using `utils.mergeSettings()`, which will handle settings functions while also taking into account the proper order of precedence of using settings:

```
Defaults < Incoming Javascript-based Settings < Incoming HTML-based Settings (data-options)
```

## Using text strings to call API functions on components

In Some components' jQuery wrappers (modal, slider, etc), it was previously possible to call an internal api method by calling the jQuery constructor.  For example:

```javascript
/**
 * @deprecated
 * close a Modal window by passing a string `close` to its constructor.
 */
$('#myModal').modal('close');
```

This was legacy functionality from the `v3.x.x` Soho components, and was sporadically implemented in the Soho Xi components.  For the purposes of cleaning up our APIs and making us less dependent on jQuery going forward, we've deprecated this functionality.  The best ways to call API methods on components are either directly calling the methods off of newly created components:

```javascript
// Invoke with a Vanilla-JS constructor
const modalElem = document.querySelector('#myModal');
const myModal = new Modal(modalElem, { ... });
// ...
// (eventually) close the modal
modalElem.close();
```

... OR to continue using `$.data`'s component storage on elements to call API methods:

```javascript
// close an existing instance of Modal previously invoked with a jQuery constructor
$('#myModal').data('modal').close();
```
